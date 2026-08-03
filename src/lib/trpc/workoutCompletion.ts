import { hasContiguousExerciseTemplateOrder } from '$lib/utils/workoutUtils';
import type { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { createId } from '@paralleldrive/cuid2';

type ManualDeloadMetadata = { sourceTemplateId: string | null; originalSetCount: number } | null;

export async function syncWorkoutExerciseTemplates({
	tx,
	userId,
	mesocycleId,
	splitDayIndex,
	workoutExercises,
	workoutExerciseSets,
	manualDeloadMetadata
}: {
	tx: Prisma.TransactionClient;
	userId: string;
	mesocycleId: string;
	splitDayIndex: number;
	workoutExercises: Prisma.WorkoutExerciseUncheckedCreateInput[];
	workoutExerciseSets: readonly (readonly unknown[])[];
	manualDeloadMetadata?: readonly ManualDeloadMetadata[];
}) {
	const mesocycle = await tx.mesocycle.findFirst({
		where: { id: mesocycleId, userId },
		select: {
			repRangeMode: true,
			mesocycleExerciseSplitDays: {
				where: { dayIndex: splitDayIndex },
				select: { id: true, mesocycleSplitDayExercises: true }
			}
		}
	});
	if (!mesocycle) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Mesocycle not found' });

	const splitDay = mesocycle.mesocycleExerciseSplitDays[0];
	if (!splitDay) {
		throw new TRPCError({ code: 'BAD_REQUEST', message: 'Related mesocycle exercise split day not found' });
	}

	const finalTemplateIdentities: { name: string; exerciseIndex: number }[] = [];
	const finalTemplateIds: string[] = [];
	const templateCreates: Prisma.MesocycleExerciseTemplateUncheckedCreateInput[] = [];
	const templateUpdates: { id: string; data: Prisma.MesocycleExerciseTemplateUncheckedUpdateManyInput }[] = [];

	workoutExercises.forEach((exercise, exerciseIdx) => {
		const sourceTemplate = exercise.mesocycleExerciseTemplateId
			? splitDay.mesocycleSplitDayExercises.find(({ id }) => id === exercise.mesocycleExerciseTemplateId)
			: splitDay.mesocycleSplitDayExercises.find(({ name }) => name === exercise.name);
		if (exercise.isDeload) {
			const metadata = manualDeloadMetadata?.[exerciseIdx];
			const metadataTemplate = metadata?.sourceTemplateId
				? splitDay.mesocycleSplitDayExercises.find(({ id }) => id === metadata.sourceTemplateId)
				: undefined;
			const legacyTemplate = !metadata
				? splitDay.mesocycleSplitDayExercises.find(({ name }) => name === exercise.name)
				: undefined;
			const templateToPreserve = sourceTemplate ?? metadataTemplate ?? legacyTemplate;

			if (templateToPreserve) {
				exercise.mesocycleExerciseTemplateId = templateToPreserve.id;
				finalTemplateIds.push(templateToPreserve.id);
				finalTemplateIdentities.push({ name: templateToPreserve.name, exerciseIndex: exercise.exerciseIndex });
				templateUpdates.push({ id: templateToPreserve.id, data: { exerciseIndex: exercise.exerciseIndex } });
				return;
			}

			if (!metadata) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: `Unable to restore the pre-deload template for ${exercise.name}`
				});
			}
			if (metadata.sourceTemplateId) {
				throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid deload source template' });
			}

			const {
				id: _workoutExerciseId,
				workoutId: _workoutId,
				isDeload: _isDeload,
				mesocycleExerciseTemplateId: _mesocycleExerciseTemplateId,
				...template
			} = exercise;
			const templateId = createId();
			exercise.mesocycleExerciseTemplateId = templateId;
			const templateData = {
				...template,
				id: templateId,
				mesocycleExerciseSplitDayId: splitDay.id,
				sets: metadata.originalSetCount
			};
			finalTemplateIds.push(templateId);
			finalTemplateIdentities.push(templateData);
			templateCreates.push(templateData);
			return;
		}

		if (exercise.mesocycleExerciseTemplateId && !sourceTemplate) {
			throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid exercise source template' });
		}

		const {
			id: _workoutExerciseId,
			workoutId: _workoutId,
			isDeload: _isDeload,
			mesocycleExerciseTemplateId: _mesocycleExerciseTemplateId,
			...template
		} = exercise;
		const adaptive = (exercise.repRangeMode ?? mesocycle.repRangeMode) === 'Adaptive';
		const templateData = {
			...template,
			...(adaptive && sourceTemplate
				? {
						repRangeStart: sourceTemplate.repRangeStart,
						repRangeEnd: sourceTemplate.repRangeEnd,
						topRepRangeStart: sourceTemplate.topRepRangeStart,
						topRepRangeEnd: sourceTemplate.topRepRangeEnd
					}
				: {}),
			sets: workoutExerciseSets[exerciseIdx].length
		};
		finalTemplateIdentities.push(templateData);
		if (sourceTemplate) {
			finalTemplateIds.push(sourceTemplate.id);
			templateUpdates.push({ id: sourceTemplate.id, data: templateData });
		} else {
			const templateId = createId();
			exercise.mesocycleExerciseTemplateId = templateId;
			finalTemplateIds.push(templateId);
			templateCreates.push({ ...templateData, id: templateId, mesocycleExerciseSplitDayId: splitDay.id });
		}
	});

	const hasDuplicateTemplateIds = new Set(finalTemplateIds).size !== finalTemplateIds.length;
	if (hasDuplicateTemplateIds && workoutExercises.every(({ isDeload }) => isDeload)) {
		throw new TRPCError({
			code: 'BAD_REQUEST',
			message: 'A deload source template can only be restored once'
		});
	}
	const finalTemplateNames = finalTemplateIdentities.map(({ name }) => name);
	if (new Set(finalTemplateNames).size !== finalTemplateNames.length) {
		throw new TRPCError({
			code: 'BAD_REQUEST',
			message: 'Duplicate exercise names are not allowed in the next mesocycle workout'
		});
	}
	if (hasDuplicateTemplateIds) {
		throw new TRPCError({
			code: 'BAD_REQUEST',
			message: 'A deload source template can only be restored once'
		});
	}
	if (!hasContiguousExerciseTemplateOrder(finalTemplateIdentities)) {
		throw new TRPCError({
			code: 'BAD_REQUEST',
			message: 'Exercise template order must use contiguous indices matching the workout order'
		});
	}

	for (const { id, data } of templateUpdates) {
		const updated = await tx.mesocycleExerciseTemplate.updateMany({
			where: {
				id,
				mesocycleExerciseSplitDay: { dayIndex: splitDayIndex, mesocycle: { id: mesocycleId, userId } }
			},
			data
		});
		if (updated.count !== 1) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid exercise source template' });
	}

	const templateIdsToDelete = splitDay.mesocycleSplitDayExercises
		.map(({ id }) => id)
		.filter((id) => !finalTemplateIds.includes(id));
	if (templateIdsToDelete.length) {
		await tx.mesocycleExerciseTemplate.deleteMany({
			where: {
				id: { in: templateIdsToDelete },
				mesocycleExerciseSplitDay: { dayIndex: splitDayIndex, mesocycle: { id: mesocycleId, userId } }
			}
		});
	}
	if (templateCreates.length) await tx.mesocycleExerciseTemplate.createMany({ data: templateCreates });
}

export async function createWorkoutGraph({
	tx,
	workout,
	workoutExercises,
	workoutExerciseSets,
	workoutExerciseMiniSets,
	workoutOfMesocycle
}: {
	tx: Prisma.TransactionClient;
	workout: Prisma.WorkoutUncheckedCreateInput;
	workoutExercises: Prisma.WorkoutExerciseUncheckedCreateInput[];
	workoutExerciseSets: Prisma.WorkoutExerciseSetUncheckedCreateInput[];
	workoutExerciseMiniSets: Prisma.WorkoutExerciseMiniSetUncheckedCreateInput[];
	workoutOfMesocycle?: Prisma.WorkoutOfMesocycleUncheckedCreateInput;
}) {
	await tx.workout.create({ data: workout });
	if (workoutOfMesocycle) await tx.workoutOfMesocycle.create({ data: workoutOfMesocycle });
	if (workoutExercises.length) await tx.workoutExercise.createMany({ data: workoutExercises });
	if (workoutExerciseSets.length) await tx.workoutExerciseSet.createMany({ data: workoutExerciseSets });
	if (workoutExerciseMiniSets.length) await tx.workoutExerciseMiniSet.createMany({ data: workoutExerciseMiniSets });
}

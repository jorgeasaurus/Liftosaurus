import { prisma } from '$lib/prisma';
import { z } from 'zod';
import { t } from '$lib/trpc/t';
import { runSerializableTransaction } from '$lib/trpc/transaction';
import {
	ExerciseSplitDayCreateWithoutExerciseSplitInputSchema,
	ExerciseSplitSchema,
	MesocycleCyclicSetChangeCreateWithoutMesocycleInputSchema,
	MesocycleExerciseSplitDayCreateWithoutMesocycleInputSchema,
	MesocycleExerciseTemplateCreateWithoutMesocycleExerciseSplitDayInputSchema,
	MesocycleUncheckedCreateWithoutUserInputSchema,
	MesocycleUpdateInputSchema
} from '$lib/zodSchemas';
import { Prisma } from '@prisma/client';
import { createId } from '@paralleldrive/cuid2';
import { TRPCError } from '@trpc/server';

const clearedAdaptiveRepRangeState = {
	adaptiveRepRangeStart: null,
	adaptiveRepRangeEnd: null,
	adaptiveTopRepRangeStart: null,
	adaptiveTopRepRangeEnd: null,
	adaptiveRepRangeSourceId: null,
	adaptiveTopRepRangeSourceId: null,
	adaptiveRepRangeResetAt: null
} as const;

const zodMesocycleCreateInput = z.strictObject({
	mesocycle: MesocycleUncheckedCreateWithoutUserInputSchema,
	mesocycleCyclicSetChanges: z.array(MesocycleCyclicSetChangeCreateWithoutMesocycleInputSchema),
	mesocycleExerciseTemplates: z.array(
		z.array(MesocycleExerciseTemplateCreateWithoutMesocycleExerciseSplitDayInputSchema)
	),
	exerciseSplit: ExerciseSplitSchema.extend({
		exerciseSplitDays: z.array(ExerciseSplitDayCreateWithoutExerciseSplitInputSchema)
	}),
	startImmediately: z.boolean()
}).superRefine((input, ctx) => {
	if (input.exerciseSplit.exerciseSplitDays.length !== input.mesocycleExerciseTemplates.length) {
		ctx.addIssue({ code: 'custom', message: 'Every split day must have an exercise template list' });
	}
});

const zodMesocycleEditInput = z.strictObject({
	mesocycle: MesocycleUpdateInputSchema,
	mesocycleCyclicSetChanges: z.array(MesocycleCyclicSetChangeCreateWithoutMesocycleInputSchema)
});

const zodUpdateExerciseSplitInput = z
	.strictObject({
		mesocycleExerciseSplitDays: z.array(MesocycleExerciseSplitDayCreateWithoutMesocycleInputSchema),
		mesocycleExerciseTemplates: z.array(
			z.array(MesocycleExerciseTemplateCreateWithoutMesocycleExerciseSplitDayInputSchema)
		),
		mesocycleId: z.string().cuid2()
	})
	.superRefine((input, ctx) => {
		if (input.mesocycleExerciseSplitDays.length !== input.mesocycleExerciseTemplates.length) {
			ctx.addIssue({ code: 'custom', message: 'Every split day must have an exercise template list' });
		}
	});

const getActiveMesocycle = async (userId: string) => {
	return await prisma.mesocycle.findFirst({
		where: { userId, startDate: { not: null }, endDate: null },
		select: { name: true, id: true }
	});
};

export const mesocycles = t.router({
	findById: t.procedure.input(z.string().cuid2()).query(
		async ({ input, ctx }) =>
			await prisma.mesocycle.findUnique({
				where: { id: input, userId: ctx.userId },
				include: {
					exerciseSplit: true,
					mesocycleExerciseSplitDays: {
						include: { mesocycleSplitDayExercises: { orderBy: { exerciseIndex: 'asc' } } },
						orderBy: { dayIndex: 'asc' }
					},
					mesocycleCyclicSetChanges: true,
					workoutsOfMesocycle: {
						include: {
							workout: {
								include: {
									workoutExercises: { include: { sets: { include: { miniSets: true } } } }
								}
							}
						},
						orderBy: { workout: { startedAt: 'asc' } }
					}
				}
			})
	),

	findActiveMesocycle: t.procedure.query(async ({ ctx }) => {
		return await getActiveMesocycle(ctx.userId);
	}),

	load: t.procedure
		.input(z.object({ cursorId: z.string().cuid2().optional(), searchString: z.string().optional() }))
		.query(async ({ input, ctx }) => {
			return prisma.mesocycle.findMany({
				where: { userId: ctx.userId, name: { contains: input.searchString, mode: 'insensitive' } },
				orderBy: { id: 'desc' },
				cursor: input.cursorId !== undefined ? { id: input.cursorId } : undefined,
				skip: input.cursorId !== undefined ? 1 : 0,
				take: 10
			});
		}),

	create: t.procedure.input(zodMesocycleCreateInput).mutation(async ({ input, ctx }) => {
		const mesocycle: Prisma.MesocycleUncheckedCreateInput = {
			id: createId(),
			userId: ctx.userId,
			...input.mesocycle
		};

		if (input.startImmediately) mesocycle.startDate = new Date();

		const mesocycleCyclicSetChanges: Prisma.MesocycleCyclicSetChangeUncheckedCreateInput[] =
			input.mesocycleCyclicSetChanges.map((setChange) => ({
				...setChange,
				mesocycleId: mesocycle.id as string
			}));

		const mesocycleExerciseSplitDays: Prisma.MesocycleExerciseSplitDayUncheckedCreateInput[] =
			input.exerciseSplit.exerciseSplitDays.map((splitDay) => ({
				...splitDay,
				mesocycleId: mesocycle.id as string,
				id: createId()
			}));

		const mesocycleExerciseTemplates: Prisma.MesocycleExerciseTemplateUncheckedCreateInput[] =
			input.mesocycleExerciseTemplates.flatMap((dayExercises, dayNumber) =>
				dayExercises.map((exercise) => ({
					...exercise,
					...clearedAdaptiveRepRangeState,
					mesocycleExerciseSplitDayId: mesocycleExerciseSplitDays[dayNumber].id as string
				}))
			);

		try {
			await runSerializableTransaction(async (tx) => {
				if (input.startImmediately) {
					const activeMesocycle = await tx.mesocycle.findFirst({
						where: { userId: ctx.userId, startDate: { not: null }, endDate: null },
						select: { id: true }
					});
					if (activeMesocycle) {
						throw new TRPCError({ code: 'BAD_REQUEST', message: 'A mesocycle is already active' });
					}
				}
				await tx.mesocycle.create({ data: mesocycle });
				await tx.mesocycleCyclicSetChange.createMany({ data: mesocycleCyclicSetChanges });
				await tx.mesocycleExerciseSplitDay.createMany({ data: mesocycleExerciseSplitDays });
				await tx.mesocycleExerciseTemplate.createMany({ data: mesocycleExerciseTemplates });
			});
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
				throw new TRPCError({ code: 'BAD_REQUEST', message: 'A mesocycle is already active' });
			}
			throw error;
		}
		return { message: 'Mesocycle created successfully' };
	}),

	editById: t.procedure
		.input(z.strictObject({ id: z.string().cuid2(), mesocycleData: zodMesocycleEditInput }))
		.mutation(async ({ input, ctx }) => {
			await prisma.$transaction(async () => {
				const mesocycle = await prisma.mesocycle.update({
					where: { id: input.id, userId: ctx.userId },
					data: { ...input.mesocycleData.mesocycle },
					select: { id: true }
				});
				await prisma.mesocycleCyclicSetChange.deleteMany({ where: { mesocycleId: mesocycle.id } });
				await prisma.mesocycleCyclicSetChange.createMany({
					data: input.mesocycleData.mesocycleCyclicSetChanges.map((setChange) => ({
						mesocycleId: mesocycle.id,
						...setChange
					}))
				});
			});
			return { message: 'Mesocycle edited successfully' };
		}),

	resetAdaptiveRepRanges: t.procedure
		.input(z.strictObject({ mesocycleId: z.string().cuid2(), templateId: z.string().cuid2() }))
		.mutation(async ({ input, ctx }) => {
			const resetAt = new Date();
			const updated = await prisma.$transaction(async (tx) =>
				tx.mesocycleExerciseTemplate.updateMany({
					where: {
						id: input.templateId,
						mesocycleExerciseSplitDay: { mesocycle: { id: input.mesocycleId, userId: ctx.userId } }
					},
					data: {
						adaptiveRepRangeStart: null,
						adaptiveRepRangeEnd: null,
						adaptiveTopRepRangeStart: null,
						adaptiveTopRepRangeEnd: null,
						adaptiveRepRangeSourceId: null,
						adaptiveTopRepRangeSourceId: null,
						adaptiveRepRangeResetAt: resetAt
					}
				})
			);
			if (updated.count !== 1) throw new TRPCError({ code: 'NOT_FOUND', message: 'Exercise template not found' });
			return { message: 'Adaptive rep range reset', resetAt };
		}),

	deleteById: t.procedure.input(z.string().cuid2()).mutation(async ({ input, ctx }) => {
		await prisma.mesocycle.delete({ where: { userId: ctx.userId, id: input } });
		return { message: 'Mesocycle deleted successfully' };
	}),

	progressToNextStage: t.procedure
		.input(z.strictObject({ id: z.string().cuid2() }))
		.mutation(async ({ input, ctx }) => {
			try {
				return await runSerializableTransaction(async (tx) => {
					const mesocycle = await tx.mesocycle.findUnique({
						where: { id: input.id, userId: ctx.userId },
						select: { startDate: true, endDate: true }
					});
					if (!mesocycle) throw new TRPCError({ code: 'NOT_FOUND', message: 'Mesocycle not found' });
					if (mesocycle.endDate) {
						throw new TRPCError({ code: 'BAD_REQUEST', message: 'Mesocycle already completed' });
					}

					const isStarting = !mesocycle.startDate;
					if (isStarting) {
						const activeMesocycle = await tx.mesocycle.findFirst({
							where: { userId: ctx.userId, startDate: { not: null }, endDate: null },
							select: { id: true }
						});
						if (activeMesocycle) {
							throw new TRPCError({ code: 'BAD_REQUEST', message: 'A mesocycle is already active' });
						}
					}

					const updatedMesocycle = await tx.mesocycle.update({
						where: { id: input.id, userId: ctx.userId },
						data: isStarting ? { startDate: new Date() } : { endDate: new Date() }
					});
					return {
						message: `Mesocycle ${isStarting ? 'started' : 'stopped'} successfully`,
						startDate: updatedMesocycle.startDate,
						endDate: updatedMesocycle.endDate
					};
				});
			} catch (error) {
				if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
					throw new TRPCError({ code: 'BAD_REQUEST', message: 'A mesocycle is already active' });
				}
				throw error;
			}
		}),

	updateExerciseSplit: t.procedure.input(zodUpdateExerciseSplitInput).mutation(async ({ input, ctx }) => {
		await runSerializableTransaction(async (tx) => {
			const mesocycle = await tx.mesocycle.findUnique({
				where: { id: input.mesocycleId, userId: ctx.userId },
				select: {
					id: true,
					mesocycleExerciseSplitDays: {
						select: { id: true, mesocycleSplitDayExercises: { select: { id: true } } }
					}
				}
			});
			if (!mesocycle) throw new TRPCError({ code: 'NOT_FOUND', message: 'Mesocycle not found' });

			const existingDayIds = new Set(mesocycle.mesocycleExerciseSplitDays.map(({ id }) => id));
			const existingTemplateIds = new Set(
				mesocycle.mesocycleExerciseSplitDays.flatMap(({ mesocycleSplitDayExercises }) =>
					mesocycleSplitDayExercises.map(({ id }) => id)
				)
			);
			const dayIds = input.mesocycleExerciseSplitDays.map(({ id }) => id ?? createId());
			const templateIdsByDay = input.mesocycleExerciseTemplates.map((dayExercises) =>
				dayExercises.map(({ id }) => id ?? createId())
			);
			const templateIds = templateIdsByDay.flat();

			if (
				new Set(dayIds).size !== dayIds.length ||
				new Set(templateIds).size !== templateIds.length ||
				input.mesocycleExerciseSplitDays.some(({ id }) => id && !existingDayIds.has(id)) ||
				input.mesocycleExerciseTemplates.some((day) => day.some(({ id }) => id && !existingTemplateIds.has(id)))
			) {
				throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid exercise split identity' });
			}

			for (const [dayIndex, splitDay] of input.mesocycleExerciseSplitDays.entries()) {
				const { id, ...dayData } = splitDay;
				const dayId = dayIds[dayIndex];
				if (id) {
					const updated = await tx.mesocycleExerciseSplitDay.updateMany({
						where: { id, mesocycleId: mesocycle.id },
						data: dayData
					});
					if (updated.count !== 1) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid split day' });
				} else {
					await tx.mesocycleExerciseSplitDay.create({
						data: { ...dayData, id: dayId, mesocycleId: mesocycle.id }
					});
				}
			}

			for (const [dayIndex] of input.mesocycleExerciseSplitDays.entries()) {
				const dayId = dayIds[dayIndex];
				for (const [exerciseIndex, exercise] of input.mesocycleExerciseTemplates[dayIndex].entries()) {
					const {
						id: exerciseId,
						adaptiveRepRangeStart: _adaptiveRepRangeStart,
						adaptiveRepRangeEnd: _adaptiveRepRangeEnd,
						adaptiveTopRepRangeStart: _adaptiveTopRepRangeStart,
						adaptiveTopRepRangeEnd: _adaptiveTopRepRangeEnd,
						adaptiveRepRangeSourceId: _adaptiveRepRangeSourceId,
						adaptiveTopRepRangeSourceId: _adaptiveTopRepRangeSourceId,
						adaptiveRepRangeResetAt: _adaptiveRepRangeResetAt,
						...exerciseData
					} = exercise;
					const templateId = templateIdsByDay[dayIndex][exerciseIndex];
					if (exerciseId) {
						const updated = await tx.mesocycleExerciseTemplate.updateMany({
							where: {
								id: exerciseId,
								mesocycleExerciseSplitDay: { mesocycleId: mesocycle.id }
							},
							data: { ...exerciseData, mesocycleExerciseSplitDayId: dayId }
						});
						if (updated.count !== 1) {
							throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid exercise split identity' });
						}
					} else {
						await tx.mesocycleExerciseTemplate.create({
							data: {
								...exerciseData,
								...clearedAdaptiveRepRangeState,
								id: templateId,
								mesocycleExerciseSplitDayId: dayId
							}
						});
					}
				}
			}

			await tx.mesocycleExerciseTemplate.deleteMany({
				where: {
					id: { notIn: templateIds },
					mesocycleExerciseSplitDay: { mesocycleId: mesocycle.id }
				}
			});
			await tx.mesocycleExerciseSplitDay.deleteMany({
				where: { id: { notIn: dayIds }, mesocycleId: mesocycle.id }
			});
		});
		return { message: 'Mesocycle exercise split edited successfully' };
	}),

	getWorkouts: t.procedure.input(z.enum(['nextSplitDay', 'allSplitDays'])).query(async ({ ctx, input }) => {
		const includeClause = Prisma.validator<Prisma.WorkoutInclude>()({
			workoutExercises: { include: { sets: { include: { miniSets: true } } } }
		});

		if (input === 'allSplitDays') {
			return await prisma.workout.findMany({ where: { userId: ctx.userId }, include: includeClause });
		}

		const activeMesocycle = await prisma.mesocycle.findFirst({
			where: { userId: ctx.userId, startDate: { not: null }, endDate: null },
			select: {
				id: true,
				_count: { select: { mesocycleExerciseSplitDays: true, workoutsOfMesocycle: true } }
			}
		});
		if (!activeMesocycle) return [];

		const totalWorkouts = activeMesocycle._count.workoutsOfMesocycle;
		const splitLength = activeMesocycle._count.mesocycleExerciseSplitDays;
		const splitDayIndex = totalWorkouts % splitLength;

		return await prisma.workout.findMany({
			where: { workoutOfMesocycle: { mesocycleId: activeMesocycle.id, splitDayIndex }, userId: ctx.userId },
			include: includeClause,
			orderBy: { startedAt: 'asc' }
		});
	})
});

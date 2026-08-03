import { createId } from '@paralleldrive/cuid2';
import { prisma } from '../src/lib/prisma';
import { createCaller } from '../src/lib/trpc/router';
import { expect, test } from './fixtures';

function exerciseConfiguration(setType: 'Straight' | 'TopBackoff' = 'TopBackoff') {
	return {
		name: setType === 'TopBackoff' ? 'Bodyweight row' : 'Push-up',
		exerciseIndex: 0,
		targetMuscleGroup: 'Lats' as const,
		customMuscleGroup: null,
		bodyweightFraction: 1,
		setType,
		changeType: null,
		changeAmount: null,
		repRangeStart: 8,
		repRangeEnd: 12,
		note: null,
		overloadPercentage: null,
		lastSetToFailure: null,
		forceRIRMatching: null,
		minimumWeightChange: 5,
		preferredProgressionVariable: 'Reps' as const,
		repRangeMode: null,
		topRepRangeStart: setType === 'TopBackoff' ? 5 : null,
		topRepRangeEnd: setType === 'TopBackoff' ? 8 : null
	};
}

function exercise(templateId: string, setType: 'Straight' | 'TopBackoff' = 'TopBackoff') {
	return {
		...exerciseConfiguration(setType),
		mesocycleExerciseTemplateId: templateId,
		isDeload: false
	};
}

function workoutInput({
	userId,
	mesocycleId,
	templateId,
	sets,
	confirm = false,
	setType = 'TopBackoff'
}: {
	userId: string;
	mesocycleId: string;
	templateId: string;
	sets: { setIndex: number; reps: number; load: number; RIR: number; skipped: boolean }[];
	confirm?: boolean;
	setType?: 'Straight' | 'TopBackoff';
}) {
	return {
		draftOwnerUserId: userId,
		workoutData: {
			startedAt: new Date(),
			userBodyweight: 190,
			workoutOfMesocycle: { mesocycle: { id: mesocycleId }, splitDayIndex: 0, workoutStatus: null }
		},
		workoutExercises: [exercise(templateId, setType)],
		workoutExercisesSets: [sets],
		workoutExercisesMiniSets: [
			sets.map((set) => (set.setIndex === 1 ? [{ miniSetIndex: 0, reps: 40, load: 0, RIR: 3 }] : []))
		],
		manualDeloadMetadata: [null],
		confirmAdaptiveRepRangeOutliers: confirm
	};
}

async function createAdaptiveMesocycle(userId: string, setType: 'Straight' | 'TopBackoff' = 'TopBackoff') {
	return prisma.mesocycle.create({
		data: {
			name: `Adaptive ${setType}`,
			userId,
			RIRProgression: [10],
			startDate: new Date('2026-08-01T00:00:00Z'),
			startOverloadPercentage: 2.5,
			lastSetToFailure: false,
			forceRIRMatching: false,
			repRangeMode: 'Adaptive',
			mesocycleExerciseSplitDays: {
				create: {
					name: 'Pull',
					dayIndex: 0,
					isRestDay: false,
					mesocycleSplitDayExercises: {
						create: {
							...exerciseConfiguration(setType),
							sets: 2
						}
					}
				}
			}
		},
		include: { mesocycleExerciseSplitDays: { include: { mesocycleSplitDayExercises: true } } }
	});
}

test('TopBackoff learning is independent, stable, reconciled, resettable, and tenant scoped', async ({ userData }) => {
	const caller = createCaller({ userId: userData.userId, event: null as never });
	const mesocycle = await createAdaptiveMesocycle(userData.userId);
	const splitDay = mesocycle.mesocycleExerciseSplitDays[0];
	const template = splitDay.mesocycleSplitDayExercises[0];

	await caller.workouts.create(
		workoutInput({
			userId: userData.userId,
			mesocycleId: mesocycle.id,
			templateId: template.id,
			sets: [
				{ setIndex: 0, reps: 0, load: 0, RIR: 0, skipped: true },
				{ setIndex: 1, reps: 14, load: 0, RIR: 2, skipped: false }
			]
		})
	);
	let learned = await prisma.mesocycleExerciseTemplate.findUniqueOrThrow({ where: { id: template.id } });
	expect(learned).toMatchObject({
		adaptiveRepRangeStart: 11,
		adaptiveRepRangeEnd: 15,
		adaptiveTopRepRangeStart: null,
		adaptiveTopRepRangeEnd: null
	});
	const firstSource = learned.adaptiveRepRangeSourceId;

	await caller.workouts.create(
		workoutInput({
			userId: userData.userId,
			mesocycleId: mesocycle.id,
			templateId: template.id,
			sets: [
				{ setIndex: 0, reps: 8, load: 0, RIR: 2, skipped: false },
				{ setIndex: 1, reps: 30, load: 0, RIR: 3, skipped: false }
			]
		})
	);
	learned = await prisma.mesocycleExerciseTemplate.findUniqueOrThrow({ where: { id: template.id } });
	expect(learned).toMatchObject({
		adaptiveRepRangeStart: 11,
		adaptiveRepRangeEnd: 15,
		adaptiveTopRepRangeStart: 5,
		adaptiveTopRepRangeEnd: 9
	});
	expect(learned.adaptiveRepRangeSourceId).toBe(firstSource);
	expect(learned.adaptiveTopRepRangeSourceId).not.toBe(firstSource);

	const nextWorkout = await caller.workouts.getWorkoutExercisesWithPreviousData({
		userBodyweight: 190,
		splitDayIndex: 0
	});
	expect(nextWorkout.todaysWorkoutExercises[0]).toMatchObject({
		mesocycleExerciseTemplateId: template.id,
		repRangeStart: 11,
		repRangeEnd: 15,
		topRepRangeStart: 5,
		topRepRangeEnd: 9
	});

	const workouts = await prisma.workout.findMany({
		where: { workoutOfMesocycle: { mesocycleId: mesocycle.id } },
		include: { workoutExercises: true },
		orderBy: { startedAt: 'asc' }
	});
	await caller.workouts.editById({
		id: workouts[0].id,
		endedAt: workouts[0].endedAt,
		data: workoutInput({
			userId: userData.userId,
			mesocycleId: mesocycle.id,
			templateId: template.id,
			sets: [
				{ setIndex: 0, reps: 0, load: 0, RIR: 0, skipped: true },
				{ setIndex: 1, reps: 16, load: 0, RIR: 3, skipped: false }
			]
		})
	});
	learned = await prisma.mesocycleExerciseTemplate.findUniqueOrThrow({ where: { id: template.id } });
	expect(learned).toMatchObject({ adaptiveRepRangeStart: 14, adaptiveRepRangeEnd: 18 });
	expect(learned.adaptiveRepRangeSourceId).not.toBe(firstSource);
	const { mesocycleExerciseSplitDayId, ...templateInput } = learned;

	await caller.mesocycles.updateExerciseSplit({
		mesocycleId: mesocycle.id,
		mesocycleExerciseSplitDays: [{ id: splitDay.id, name: 'Pull renamed', dayIndex: 0, isRestDay: false }],
		mesocycleExerciseTemplates: [
			[
				{
					...templateInput,
					name: 'Bodyweight row renamed'
				}
			]
		]
	});
	expect(await prisma.mesocycleExerciseTemplate.findUnique({ where: { id: template.id } })).toMatchObject({
		name: 'Bodyweight row renamed',
		adaptiveRepRangeStart: 14,
		adaptiveRepRangeEnd: 18
	});

	await prisma.mesocycle.update({ where: { id: mesocycle.id }, data: { endDate: new Date() } });
	await caller.workouts.deleteById(workouts[0].id);
	learned = await prisma.mesocycleExerciseTemplate.findUniqueOrThrow({ where: { id: template.id } });
	expect(learned).toMatchObject({
		adaptiveRepRangeStart: 28,
		adaptiveRepRangeEnd: 30,
		adaptiveTopRepRangeStart: 5,
		adaptiveTopRepRangeEnd: 9
	});

	const attackerId = createId();
	await prisma.user.create({ data: { id: attackerId, email: `adaptive-${attackerId}@example.com` } });
	const attacker = createCaller({ userId: attackerId, event: null as never });
	await expect(
		attacker.mesocycles.resetAdaptiveRepRanges({ mesocycleId: mesocycle.id, templateId: template.id })
	).rejects.toThrow('Exercise template not found');
	await caller.mesocycles.resetAdaptiveRepRanges({ mesocycleId: mesocycle.id, templateId: template.id });
	learned = await prisma.mesocycleExerciseTemplate.findUniqueOrThrow({ where: { id: template.id } });
	expect(learned).toMatchObject({
		adaptiveRepRangeStart: null,
		adaptiveRepRangeEnd: null,
		adaptiveTopRepRangeStart: null,
		adaptiveTopRepRangeEnd: null
	});
	expect(learned.adaptiveRepRangeResetAt).toBeInstanceOf(Date);
});

test('pending adaptive outliers require explicit confirmation and keep a rejected save atomic', async ({
	userData
}) => {
	const caller = createCaller({ userId: userData.userId, event: null as never });
	const mesocycle = await createAdaptiveMesocycle(userData.userId, 'Straight');
	const template = mesocycle.mesocycleExerciseSplitDays[0].mesocycleSplitDayExercises[0];
	const input = workoutInput({
		userId: userData.userId,
		mesocycleId: mesocycle.id,
		templateId: template.id,
		setType: 'Straight',
		sets: [{ setIndex: 0, reps: 31, load: 0, RIR: 3, skipped: false }]
	});

	await expect(caller.workouts.create(input)).rejects.toThrow('Confirm adaptive working sets outside');
	expect(await prisma.workoutOfMesocycle.count({ where: { mesocycleId: mesocycle.id } })).toBe(0);
	expect(await prisma.mesocycleExerciseTemplate.findUniqueOrThrow({ where: { id: template.id } })).toMatchObject({
		adaptiveRepRangeStart: null,
		adaptiveRepRangeEnd: null
	});

	await caller.workouts.create({ ...input, confirmAdaptiveRepRangeOutliers: true });
	expect(await prisma.mesocycleExerciseTemplate.findUniqueOrThrow({ where: { id: template.id } })).toMatchObject({
		adaptiveRepRangeStart: 28,
		adaptiveRepRangeEnd: 30
	});
});

test('switching a fixed template to adaptive learns from the workout in the same save', async ({ userData }) => {
	const caller = createCaller({ userId: userData.userId, event: null as never });
	const mesocycle = await createAdaptiveMesocycle(userData.userId, 'Straight');
	const template = mesocycle.mesocycleExerciseSplitDays[0].mesocycleSplitDayExercises[0];
	await prisma.mesocycle.update({ where: { id: mesocycle.id }, data: { repRangeMode: 'Fixed' } });
	await prisma.mesocycleExerciseTemplate.update({ where: { id: template.id }, data: { repRangeMode: 'Fixed' } });

	const input = workoutInput({
		userId: userData.userId,
		mesocycleId: mesocycle.id,
		templateId: template.id,
		setType: 'Straight',
		sets: [{ setIndex: 0, reps: 10, load: 0, RIR: 3, skipped: false }]
	});
	await caller.workouts.create({
		...input,
		workoutExercises: input.workoutExercises.map((workoutExercise) => ({
			...workoutExercise,
			repRangeMode: 'Adaptive' as const
		}))
	});

	expect(await prisma.mesocycleExerciseTemplate.findUniqueOrThrow({ where: { id: template.id } })).toMatchObject({
		repRangeMode: 'Adaptive',
		adaptiveRepRangeStart: 8,
		adaptiveRepRangeEnd: 12
	});
});

test('a newly adaptive template requires confirmation before learning from an existing historical outlier', async ({
	userData
}) => {
	const caller = createCaller({ userId: userData.userId, event: null as never });
	const mesocycle = await createAdaptiveMesocycle(userData.userId, 'Straight');
	const template = mesocycle.mesocycleExerciseSplitDays[0].mesocycleSplitDayExercises[0];
	await prisma.workout.create({
		data: {
			userId: userData.userId,
			userBodyweight: 190,
			startedAt: new Date('2026-08-01T01:00:00Z'),
			endedAt: new Date('2026-08-01T02:00:00Z'),
			workoutOfMesocycle: { create: { mesocycleId: mesocycle.id, splitDayIndex: 0, workoutStatus: null } },
			workoutExercises: {
				create: {
					...exerciseConfiguration('Straight'),
					mesocycleExerciseTemplateId: template.id,
					isDeload: false,
					sets: { create: { setIndex: 0, reps: 31, load: 0, RIR: 3, skipped: false } }
				}
			}
		}
	});
	const input = workoutInput({
		userId: userData.userId,
		mesocycleId: mesocycle.id,
		templateId: template.id,
		setType: 'Straight',
		sets: [{ setIndex: 0, reps: 10, load: 0, RIR: 3, skipped: false }]
	});

	await expect(caller.workouts.create(input)).rejects.toThrow('Confirm adaptive working sets outside');
	expect(await prisma.workoutOfMesocycle.count({ where: { mesocycleId: mesocycle.id } })).toBe(1);
	expect(await prisma.mesocycleExerciseTemplate.findUniqueOrThrow({ where: { id: template.id } })).toMatchObject({
		adaptiveRepRangeStart: null,
		adaptiveRepRangeEnd: null
	});

	await caller.workouts.create({ ...input, confirmAdaptiveRepRangeOutliers: true });
	expect(await prisma.mesocycleExerciseTemplate.findUniqueOrThrow({ where: { id: template.id } })).toMatchObject({
		adaptiveRepRangeStart: 28,
		adaptiveRepRangeEnd: 30
	});
});

test('deleting a later workout rolls back before establishing a historical outlier without confirmation', async ({
	userData
}) => {
	const caller = createCaller({ userId: userData.userId, event: null as never });
	const mesocycle = await createAdaptiveMesocycle(userData.userId, 'Straight');
	const template = mesocycle.mesocycleExerciseSplitDays[0].mesocycleSplitDayExercises[0];
	const workoutIds: string[] = [];
	for (const [reps, endedAt] of [
		[31, new Date('2026-08-01T02:00:00Z')],
		[10, new Date('2026-08-02T02:00:00Z')]
	] as const) {
		const workout = await prisma.workout.create({
			data: {
				userId: userData.userId,
				userBodyweight: 190,
				startedAt: endedAt,
				endedAt,
				workoutOfMesocycle: { create: { mesocycleId: mesocycle.id, splitDayIndex: 0, workoutStatus: null } },
				workoutExercises: {
					create: {
						...exerciseConfiguration('Straight'),
						mesocycleExerciseTemplateId: template.id,
						isDeload: false,
						sets: { create: { setIndex: 0, reps, load: 0, RIR: 3, skipped: false } }
					}
				}
			}
		});
		workoutIds.push(workout.id);
	}

	await expect(caller.workouts.deleteById(workoutIds[1])).rejects.toThrow('Confirm adaptive working sets outside');
	expect(await prisma.workout.count({ where: { id: { in: workoutIds } } })).toBe(2);
	expect(await prisma.mesocycleExerciseTemplate.findUniqueOrThrow({ where: { id: template.id } })).toMatchObject({
		adaptiveRepRangeStart: null,
		adaptiveRepRangeEnd: null
	});

	await caller.workouts.deleteById({ id: workoutIds[1], confirmAdaptiveRepRangeOutliers: true });
	expect(await prisma.workout.count({ where: { id: { in: workoutIds } } })).toBe(1);
	expect(await prisma.mesocycleExerciseTemplate.findUniqueOrThrow({ where: { id: template.id } })).toMatchObject({
		adaptiveRepRangeStart: 28,
		adaptiveRepRangeEnd: 30
	});
});

test('moving a retained template off a removed split day does not cascade-delete it', async ({ userData }) => {
	const caller = createCaller({ userId: userData.userId, event: null as never });
	const mesocycle = await createAdaptiveMesocycle(userData.userId, 'Straight');
	const sourceDay = mesocycle.mesocycleExerciseSplitDays[0];
	const template = sourceDay.mesocycleSplitDayExercises[0];
	const targetDay = await prisma.mesocycleExerciseSplitDay.create({
		data: { mesocycleId: mesocycle.id, name: 'Target', dayIndex: 1, isRestDay: false }
	});
	const { mesocycleExerciseSplitDayId: _sourceDayId, ...templateInput } = template;

	await caller.mesocycles.updateExerciseSplit({
		mesocycleId: mesocycle.id,
		mesocycleExerciseSplitDays: [
			{ id: targetDay.id, name: targetDay.name, dayIndex: 0, isRestDay: targetDay.isRestDay }
		],
		mesocycleExerciseTemplates: [[templateInput]]
	});

	expect(await prisma.mesocycleExerciseSplitDay.findUnique({ where: { id: sourceDay.id } })).toBeNull();
	expect(await prisma.mesocycleExerciseTemplate.findUniqueOrThrow({ where: { id: template.id } })).toMatchObject({
		id: template.id,
		mesocycleExerciseSplitDayId: targetDay.id
	});
});

test('legacy name-only history is reconciled only within its original split day', async ({ userData }) => {
	const caller = createCaller({ userId: userData.userId, event: null as never });
	const mesocycle = await createAdaptiveMesocycle(userData.userId, 'Straight');
	const firstDay = mesocycle.mesocycleExerciseSplitDays[0];
	const firstTemplate = firstDay.mesocycleSplitDayExercises[0];
	const secondDay = await prisma.mesocycleExerciseSplitDay.create({
		data: {
			mesocycleId: mesocycle.id,
			name: 'Second',
			dayIndex: 1,
			isRestDay: false,
			mesocycleSplitDayExercises: { create: { ...exerciseConfiguration('Straight'), sets: 1 } }
		},
		include: { mesocycleSplitDayExercises: true }
	});
	const secondTemplate = secondDay.mesocycleSplitDayExercises[0];

	for (const [splitDayIndex, reps, endedAt] of [
		[0, 10, new Date('2026-08-01T01:00:00Z')],
		[1, 20, new Date('2026-08-02T01:00:00Z')]
	] as const) {
		await prisma.workout.create({
			data: {
				userId: userData.userId,
				userBodyweight: 190,
				startedAt: endedAt,
				endedAt,
				workoutOfMesocycle: {
					create: { mesocycleId: mesocycle.id, splitDayIndex, workoutStatus: null }
				},
				workoutExercises: {
					create: {
						...exerciseConfiguration('Straight'),
						mesocycleExerciseTemplateId: null,
						isDeload: false,
						sets: { create: { setIndex: 0, reps, load: 0, RIR: 3, skipped: false } }
					}
				}
			}
		});
	}

	await caller.workouts.create(
		workoutInput({
			userId: userData.userId,
			mesocycleId: mesocycle.id,
			templateId: firstTemplate.id,
			setType: 'Straight',
			sets: [{ setIndex: 0, reps: 15, load: 0, RIR: 3, skipped: false }]
		})
	);

	expect(await prisma.mesocycleExerciseTemplate.findUniqueOrThrow({ where: { id: firstTemplate.id } })).toMatchObject({
		adaptiveRepRangeStart: 8,
		adaptiveRepRangeEnd: 12
	});
	expect(await prisma.mesocycleExerciseTemplate.findUniqueOrThrow({ where: { id: secondTemplate.id } })).toMatchObject({
		adaptiveRepRangeStart: 18,
		adaptiveRepRangeEnd: 22
	});
});

import { createId } from '@paralleldrive/cuid2';
import { prisma } from '../src/lib/prisma';
import { createCaller } from '../src/lib/trpc/router';
import { expect, test } from './fixtures';

test('database defaults, nullable overrides, workout persistence, and tenant isolation', async ({ userData }) => {
	const mesocycle = await prisma.mesocycle.create({
		data: {
			name: 'Progression persistence',
			userId: userData.userId,
			RIRProgression: [4],
			startOverloadPercentage: 2.5,
			lastSetToFailure: false,
			forceRIRMatching: false,
			mesocycleExerciseSplitDays: {
				create: {
					name: 'Push',
					dayIndex: 0,
					isRestDay: false,
					mesocycleSplitDayExercises: {
						create: {
							name: 'Bench press',
							exerciseIndex: 0,
							targetMuscleGroup: 'Chest',
							bodyweightFraction: null,
							sets: 1,
							setType: 'Straight',
							repRangeStart: 5,
							repRangeEnd: 12
						}
					}
				}
			}
		},
		include: { mesocycleExerciseSplitDays: { include: { mesocycleSplitDayExercises: true } } }
	});

	expect(mesocycle.preferredProgressionVariable).toBe('Reps');
	expect(mesocycle.mesocycleExerciseSplitDays[0].mesocycleSplitDayExercises[0].preferredProgressionVariable).toBeNull();

	const workout = await prisma.workout.create({
		data: {
			userId: userData.userId,
			userBodyweight: 190,
			startedAt: new Date('2026-08-01T12:00:00Z'),
			endedAt: new Date('2026-08-01T13:00:00Z'),
			workoutExercises: {
				create: {
					name: 'Bench press',
					exerciseIndex: 0,
					targetMuscleGroup: 'Chest',
					bodyweightFraction: null,
					setType: 'Straight',
					repRangeStart: 5,
					repRangeEnd: 12,
					preferredProgressionVariable: 'Load'
				}
			}
		},
		include: { workoutExercises: true }
	});
	expect(workout.workoutExercises[0].preferredProgressionVariable).toBe('Load');

	const attackerId = createId();
	await prisma.user.create({ data: { id: attackerId, email: `test-user-${attackerId}@Liftosaurus.com` } });
	const attacker = createCaller({ userId: attackerId, event: null as never });

	await expect(
		attacker.mesocycles.editById({
			id: mesocycle.id,
			mesocycleData: {
				mesocycle: { preferredProgressionVariable: 'Load' },
				mesocycleCyclicSetChanges: []
			}
		})
	).rejects.toThrow();
	expect((await prisma.mesocycle.findUniqueOrThrow({ where: { id: mesocycle.id } })).preferredProgressionVariable).toBe(
		'Reps'
	);
});

test('mesocycle creation cannot attach another user exercise split', async ({ userData }) => {
	const victimUserId = createId();
	const victimSplit = await prisma.exerciseSplit.create({
		data: {
			name: 'Victim split',
			user: { create: { id: victimUserId, email: `victim-split-${victimUserId}@Liftosaurus.com` } }
		}
	});
	const caller = createCaller({ userId: userData.userId, event: null as never });

	await expect(
		caller.mesocycles.create({
			mesocycle: {
				name: 'Attacker mesocycle',
				exerciseSplitId: victimSplit.id,
				RIRProgression: [1],
				startDate: null,
				endDate: null,
				startOverloadPercentage: 2.5,
				preferredProgressionVariable: 'Reps',
				repRangeMode: 'Fixed',
				lastSetToFailure: false,
				forceRIRMatching: false
			},
			mesocycleCyclicSetChanges: [],
			mesocycleExerciseTemplates: [],
			exerciseSplit: { exerciseSplitDays: [] },
			startImmediately: false
		})
	).rejects.toThrow('Exercise split not found');

	expect(await prisma.mesocycle.count({ where: { userId: userData.userId, exerciseSplitId: victimSplit.id } })).toBe(0);
	await prisma.user.delete({ where: { id: victimUserId } });
});

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

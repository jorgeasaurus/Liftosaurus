import assert from 'node:assert/strict';
import { createId } from '@paralleldrive/cuid2';
import { prisma } from '../src/lib/prisma';
import { createCaller } from '../src/lib/trpc/router';
import { test } from './fixtures';

let victimUserId: string | undefined;

test.afterEach(async () => {
	if (victimUserId) await prisma.user.deleteMany({ where: { id: victimUserId } });
	victimUserId = undefined;
});

test('editing cannot overwrite, transfer, or delete another user workout', async ({ userData }) => {
	victimUserId = createId();
	const victimWorkout = await prisma.workout.create({
		data: {
			user: {
				create: {
					id: victimUserId,
					email: `test-user-workout-edit-victim-${victimUserId}@Liftosaurus.com`
				}
			},
			userBodyweight: 185,
			startedAt: new Date('2026-07-01T12:00:00Z'),
			endedAt: new Date('2026-07-01T13:00:00Z'),
			note: 'victim workout'
		}
	});

	const caller = createCaller({ userId: userData.userId, event: {} as never });
	await assert.rejects(
		caller.workouts.create({
			draftOwnerUserId: victimUserId,
			workoutData: { userBodyweight: 999, note: 'stale other-user draft' },
			workoutExercises: [],
			workoutExercisesSets: [],
			workoutExercisesMiniSets: []
		}),
		(error: unknown) => typeof error === 'object' && error !== null && 'code' in error && error.code === 'FORBIDDEN'
	);
	assert.equal(await prisma.workout.count({ where: { userId: userData.userId, userBodyweight: 999 } }), 0);

	await assert.rejects(
		caller.workouts.editById({
			id: victimWorkout.id,
			endedAt: new Date('2026-07-01T14:00:00Z'),
			data: {
				draftOwnerUserId: userData.userId,
				workoutData: {
					startedAt: new Date('2026-07-01T12:00:00Z'),
					userBodyweight: 999,
					note: 'attacker overwrite'
				},
				workoutExercises: [],
				workoutExercisesSets: [],
				workoutExercisesMiniSets: []
			}
		}),
		(error: unknown) => typeof error === 'object' && error !== null && 'code' in error && error.code === 'NOT_FOUND'
	);

	const preservedWorkout = await prisma.workout.findUnique({ where: { id: victimWorkout.id } });
	assert.equal(preservedWorkout?.userId, victimUserId);
	assert.equal(preservedWorkout?.userBodyweight, 185);
	assert.equal(preservedWorkout?.note, 'victim workout');
	assert.equal(await prisma.workout.count({ where: { id: victimWorkout.id } }), 1);
	assert.equal(await prisma.workout.count({ where: { id: victimWorkout.id, userId: userData.userId } }), 0);
});

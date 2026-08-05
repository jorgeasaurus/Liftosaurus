import assert from 'node:assert/strict';
import { createId } from '@paralleldrive/cuid2';
import { prisma } from '../src/lib/prisma';
import { createCaller } from '../src/lib/trpc/router';
import { test } from './fixtures';

function mesocycleData(userId: string, dates: { startDate?: Date; endDate?: Date } = {}) {
	return {
		id: createId(),
		userId,
		name: 'Lifecycle test',
		RIRProgression: [3],
		startOverloadPercentage: 1.25,
		lastSetToFailure: false,
		forceRIRMatching: false,
		...dates
	};
}

test('mesocycle lifecycle only permits one concurrent active mesocycle and uses persisted state', async ({
	userData
}) => {
	const first = await prisma.mesocycle.create({ data: mesocycleData(userData.userId) });
	const second = await prisma.mesocycle.create({ data: mesocycleData(userData.userId) });
	const caller = createCaller({ userId: userData.userId, event: {} as never });

	const transitions = await Promise.allSettled([
		caller.mesocycles.progressToNextStage({ id: first.id }),
		caller.mesocycles.progressToNextStage({ id: second.id })
	]);
	assert.equal(transitions.filter(({ status }) => status === 'fulfilled').length, 1);
	assert.equal(
		await prisma.mesocycle.count({
			where: { userId: userData.userId, startDate: { not: null }, endDate: null }
		}),
		1
	);

	const active = (await prisma.mesocycle.findFirstOrThrow({
		where: { userId: userData.userId, startDate: { not: null }, endDate: null }
	}))!;
	await caller.mesocycles.progressToNextStage({ id: active.id });
	await assert.rejects(
		caller.mesocycles.progressToNextStage({ id: active.id }),
		(error: unknown) => typeof error === 'object' && error !== null && 'code' in error && error.code === 'BAD_REQUEST'
	);
});

test('mesocycle creation rejects mismatched split-day and template arrays', async ({ userData }) => {
	const caller = createCaller({ userId: userData.userId, event: {} as never });
	const { userId: _userId, ...mesocycle } = mesocycleData(userData.userId);
	const baseInput = {
		mesocycle,
		mesocycleCyclicSetChanges: [],
		exerciseSplit: {
			id: createId(),
			name: 'Split',
			userId: userData.userId,
			exerciseSplitDays: [{ name: 'Day 1', dayIndex: 0, isRestDay: false }]
		},
		startImmediately: false
	};

	await assert.rejects(caller.mesocycles.create({ ...baseInput, mesocycleExerciseTemplates: [] }), /Every split day/);
	await assert.rejects(
		caller.mesocycles.create({ ...baseInput, mesocycleExerciseTemplates: [[], []] }),
		/Every split day/
	);
});

test('workout creation and skipped-workout lookup reject inactive mesocycles and invalid split days', async ({
	userData
}) => {
	const caller = createCaller({ userId: userData.userId, event: {} as never });
	const inactive = await prisma.mesocycle.create({
		data: mesocycleData(userData.userId, { startDate: new Date(), endDate: new Date() })
	});

	await assert.rejects(
		caller.workouts.create({
			draftOwnerUserId: userData.userId,
			workoutData: {
				userBodyweight: 180,
				workoutOfMesocycle: { mesocycle: { id: inactive.id }, splitDayIndex: 0, workoutStatus: null }
			},
			workoutExercises: [],
			workoutExercisesSets: [],
			workoutExercisesMiniSets: []
		}),
		/Mesocycle is not active/
	);

	await assert.rejects(caller.workouts.getSkippedWorkoutData(-1));
	const active = await prisma.mesocycle.create({ data: mesocycleData(userData.userId, { startDate: new Date() }) });
	await assert.rejects(caller.workouts.getSkippedWorkoutData(0), /Invalid skipped workout day/);
	await prisma.mesocycle.update({ where: { id: active.id }, data: { endDate: new Date() } });
});

import assert from 'node:assert/strict';
import test from 'node:test';
import { buildRpImportPlan, startOfDateInLosAngeles, type RpBootstrap } from '../../scripts/lib/rp-import-plan.js';

const bootstrap: RpBootstrap = {
	exercises: [
		{ id: 1, name: 'Chest Press', muscleGroupId: 1, exerciseType: 'machine' },
		{ id: 2, name: 'Pull-up', muscleGroupId: 2, exerciseType: 'bodyweight-only' },
		{ id: 3, name: 'Weighted Dip', muscleGroupId: 3, exerciseType: 'bodyweight-loadable' }
	],
	currentMesocycle: {
		id: 99,
		key: 'target',
		name: 'Five Weeks',
		microRirs: 321,
		unit: 'lb',
		weeks: [
			{
				days: [
					{
						id: 10,
						week: 0,
						position: 0,
						label: 'Monday',
						status: 'complete',
						finishedAt: '2026-06-28T07:00:00.000Z',
						bodyweight: 190,
						exercises: [
							{
								id: 100,
								exerciseId: 1,
								position: 0,
								sets: [
									{ id: 1, position: 0, reps: 10, weight: 100, status: 'complete', finishedAt: '2026-06-28T06:55:00Z' },
									{ id: 2, position: 1, reps: 8, weight: 100, status: 'complete', finishedAt: '2026-06-28T06:59:00Z' }
								]
							}
						]
					},
					{
						id: 11,
						week: 0,
						position: 1,
						label: 'Tuesday',
						status: 'partial',
						finishedAt: '2026-06-29T18:00:00.000Z',
						exercises: [
							{
								id: 101,
								exerciseId: 2,
								position: 0,
								sets: [
									{ id: 3, position: 0, reps: 6, weight: 190, status: 'complete', finishedAt: '2026-06-29T17:58:00Z' }
								]
							},
							{
								id: 102,
								exerciseId: 3,
								position: 1,
								sets: [
									{ id: 4, position: 0, reps: 8, weight: 215, status: 'complete', finishedAt: '2026-06-29T17:59:00Z' }
								]
							}
						]
					}
				]
			},
			{
				days: [
					{
						id: 12,
						week: 1,
						position: 0,
						finishedAt: '2026-07-07T18:00:00Z',
						bodyweight: 191,
						exercises: [
							{
								id: 103,
								exerciseId: 1,
								position: 0,
								sets: [
									{ id: 5, position: 0, reps: 9, weight: 105, status: 'complete', finishedAt: '2026-07-07T17:59:00Z' }
								]
							}
						]
					},
					{
						id: 14,
						week: 1,
						position: 1,
						label: 'Updated Tuesday',
						status: 'ready',
						finishedAt: null,
						exercises: [
							{
								id: 105,
								exerciseId: 1,
								position: 0,
								sets: [{ id: 7, position: 0, repsTarget: 12, weight: 110, status: 'ready' }]
							}
						]
					}
				]
			},
			{
				days: [
					{
						id: 13,
						week: 2,
						position: 0,
						finishedAt: '2026-08-03T07:00:00Z',
						bodyweight: 192,
						exercises: [
							{
								id: 104,
								exerciseId: 1,
								position: 0,
								sets: [
									{ id: 6, position: 0, reps: 8, weight: 110, status: 'complete', finishedAt: '2026-08-03T06:59:00Z' }
								]
							}
						]
					}
				]
			}
		]
	}
};

test('builds only workouts inside the inclusive Los Angeles date range', () => {
	const plan = buildRpImportPlan(bootstrap, {
		mesocycleKey: 'target',
		from: '2026-06-28',
		through: '2026-08-02'
	});

	assert.equal(plan.counts.workouts, 3);
	assert.equal(plan.counts.exercises, 4);
	assert.equal(plan.counts.sets, 5);
	assert.equal(plan.endDate, null);
	assert.deepEqual(plan.RIRProgression, [0, 1, 1, 1]);
	assert.equal(plan.splitDays.length, 2);
	assert.equal(plan.splitDays[1].name, 'Updated Tuesday');
	assert.equal(plan.splitDays[1].exercises[0].name, 'Chest Press');
	assert.equal(plan.splitDays[1].exercises[0].sets, 1);
	assert.deepEqual(
		[plan.splitDays[1].exercises[0].repRangeStart, plan.splitDays[1].exercises[0].repRangeEnd],
		[12, 12]
	);
	assert.equal(plan.workouts[1].status, 'partial');
	assert.equal(plan.workouts[1].userBodyweight, 190);
	assert.equal(plan.workouts[1].exercises[0].sets[0].load, 0);
	assert.equal(plan.workouts[1].exercises[1].sets[0].load, 25);
	assert.equal(plan.workouts[1].exercises[1].bodyweightFraction, 1);
});

test('converts kilogram sources to canonical pounds', () => {
	const kilogramBootstrap = structuredClone(bootstrap);
	kilogramBootstrap.currentMesocycle!.unit = 'kg';
	const plan = buildRpImportPlan(kilogramBootstrap, {
		mesocycleKey: 'target',
		from: '2026-06-28',
		through: '2026-08-02'
	});

	assert.ok(Math.abs(plan.workouts[1].userBodyweight - 190 * 2.2046226218487757) < 1e-10);
	assert.ok(Math.abs(plan.workouts[1].exercises[1].sets[0].load - 25 * 2.2046226218487757) < 1e-10);
});

test('preserves all active source weeks and safely maps the final RP deload marker', () => {
	const eightWeekBootstrap = structuredClone(bootstrap);
	const mesocycle = eightWeekBootstrap.currentMesocycle!;
	mesocycle.microRirs = 33221108;
	while (mesocycle.weeks!.length < 8) mesocycle.weeks!.push({ days: [] });

	const plan = buildRpImportPlan(eightWeekBootstrap, {
		mesocycleKey: 'target',
		from: '2026-06-28',
		through: '2026-08-02'
	});

	assert.deepEqual(plan.RIRProgression, [2, 2, 2, 2]);
	assert.equal(
		plan.RIRProgression.reduce((sum, weeks) => sum + weeks, 0),
		8
	);
});

test('uses the correct Los Angeles offset in summer and winter', () => {
	assert.equal(startOfDateInLosAngeles('2026-06-28').toISOString(), '2026-06-28T07:00:00.000Z');
	assert.equal(startOfDateInLosAngeles('2026-01-15').toISOString(), '2026-01-15T08:00:00.000Z');
});

test('is dry-plan safe by rejecting the wrong mesocycle key', () => {
	assert.throws(
		() => buildRpImportPlan(bootstrap, { mesocycleKey: 'wrong', from: '2026-06-28', through: '2026-08-02' }),
		/was not found/
	);
});

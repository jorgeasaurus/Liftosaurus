import assert from 'node:assert/strict';
import test from 'node:test';
import {
	buildExerciseChartDatasets,
	getExerciseChartSetCount,
	hasExerciseBodyweightLoad,
	resolveExerciseChartType,
	type ExerciseChartPerformance
} from '../../src/lib/utils/exerciseStatsChart.js';
import {
	createExerciseChartHistoryResource,
	createUserPreservingDefaultSelection,
	loadExerciseChartHistoryPages,
	type ExerciseChartHistoryResourceState
} from '../../src/lib/utils/exerciseChartHistory.js';
import { dateToLocalCalendarDate } from '../../src/lib/utils.js';
import { solveBergerFormula } from '../../src/lib/utils/workoutUtils.js';

function performance(
	day: number,
	sets: { setIndex: number; load: number; skipped?: boolean }[]
): ExerciseChartPerformance {
	return {
		bodyweightFraction: null,
		workout: { startedAt: new Date(2026, 0, day), userBodyweight: 190 },
		sets: sets.map(({ setIndex, load, skipped = false }) => ({
			setIndex,
			load,
			reps: 10,
			RIR: 2,
			skipped,
			miniSets: []
		}))
	};
}

test('maps a workout instant to the calendar day displayed in the user timezone', () => {
	const workoutStartedAt = new Date('2026-08-03T03:30:00.000Z');

	assert.equal(dateToLocalCalendarDate(workoutStartedAt, 'America/Los_Angeles').toString(), '2026-08-02');
});

test('builds chart data from every performance instead of a ten-card page', () => {
	const performances = Array.from({ length: 12 }, (_, index) =>
		performance(index + 1, [{ setIndex: 0, load: 100 + index }])
	);

	const [dataset] = buildExerciseChartDatasets(performances, 'absolute-load', [0]);

	assert.equal(dataset.data.length, 12);
	assert.deepEqual(
		dataset.data,
		Array.from({ length: 12 }, (_, index) => 100 + index)
	);
});

test('starts each relative-overload series at its first completed set without false zero points', () => {
	const performances = [
		performance(1, [{ setIndex: 0, load: 100 }]),
		performance(2, [
			{ setIndex: 0, load: 105 },
			{ setIndex: 1, load: 80 }
		]),
		performance(3, [
			{ setIndex: 0, load: 110 },
			{ setIndex: 1, load: 85, skipped: true }
		]),
		performance(4, [
			{ setIndex: 0, load: 115 },
			{ setIndex: 1, load: 90 }
		])
	];

	const [, secondSet] = buildExerciseChartDatasets(performances, 'relative-overload', [0, 1]);

	assert.equal(getExerciseChartSetCount(performances), 2);
	assert.equal(secondSet.data[0], null);
	assert.equal(secondSet.data[1], 0);
	assert.equal(secondSet.data[2], null);
	assert.ok((secondSet.data[3] ?? 0) > 0);
});

test('uses each performance bodyweight for load-and-bodyweight data and preserves missing-set gaps', () => {
	const performances = [
		{ ...performance(1, [{ setIndex: 0, load: 20 }]), bodyweightFraction: 0.5 },
		{ ...performance(2, []), bodyweightFraction: 0.5 },
		{
			...performance(3, [{ setIndex: 0, load: 25 }]),
			bodyweightFraction: 0.5,
			workout: { startedAt: new Date(2026, 0, 3), userBodyweight: 200 }
		}
	];

	const [dataset] = buildExerciseChartDatasets(performances, 'load-and-bodyweight', [0]);

	assert.deepEqual(dataset.data, [115, null, 125]);
});

test('offers load-and-bodyweight when any historical performance has a bodyweight fraction', () => {
	const performances = [
		performance(1, [{ setIndex: 0, load: 100 }]),
		{ ...performance(2, [{ setIndex: 0, load: 105 }]), bodyweightFraction: 0.5 }
	];

	assert.equal(hasExerciseBodyweightLoad(performances), true);
	assert.equal(hasExerciseBodyweightLoad(performances.slice(0, 1)), false);
});

test('preserves load-and-bodyweight while history loads, then falls back only when loaded history cannot support it', () => {
	let chartType = resolveExerciseChartType('load-and-bodyweight', undefined);
	assert.equal(chartType, 'load-and-bodyweight');

	chartType = resolveExerciseChartType(chartType, [performance(1, [{ setIndex: 0, load: 100 }])]);
	assert.equal(chartType, 'absolute-load');
});

test('treats equal effective loads as zero overload when bodyweight fractions change, including mini-sets', () => {
	const overload = solveBergerFormula({
		variableToSolve: 'OverloadPercentage',
		knownValues: {
			oldBodyweightFraction: 0.5,
			newBodyweightFraction: 0.25,
			oldUserBodyweight: 200,
			newUserBodyweight: 200,
			oldSet: {
				reps: 10,
				load: 0,
				RIR: 2,
				miniSets: [{ reps: 5, load: 0, RIR: 1 }]
			},
			newSet: {
				reps: 10,
				load: 50,
				RIR: 2,
				miniSets: [{ reps: 5, load: 50, RIR: 1 }]
			}
		}
	});

	assert.ok(Math.abs(overload) < 0.001);
});

test('accumulates bounded chart pages in stable cursor order', async () => {
	const cursors: (string | undefined)[] = [];
	const items = await loadExerciseChartHistoryPages({
		exerciseName: 'Press',
		isCurrent: () => true,
		query: async ({ cursor }) => {
			cursors.push(cursor?.id);
			if (!cursor) {
				return {
					items: [1, 2],
					nextCursor: { id: 'cursor-2', startedAt: new Date('2026-01-02T00:00:00Z') }
				};
			}
			return { items: [3] };
		}
	});

	assert.deepEqual(items, { items: [3, 2, 1], truncated: false });
	assert.deepEqual(cursors, [undefined, 'cursor-2']);
});

test('rejects a chart page whose cursor does not advance', async () => {
	let queryCount = 0;
	await assert.rejects(
		loadExerciseChartHistoryPages({
			exerciseName: 'Press',
			isCurrent: () => true,
			query: async () => {
				queryCount += 1;
				return {
					items: [queryCount],
					nextCursor: { id: 'same-cursor', startedAt: new Date('2026-01-01T00:00:00Z') }
				};
			}
		})
	);
	assert.equal(queryCount, 2);
});

test('caps chart history and surfaces that more performances exist', async () => {
	let queryCount = 0;
	const result = await loadExerciseChartHistoryPages({
		exerciseName: 'Press',
		maxItems: 3,
		isCurrent: () => true,
		query: async () => {
			queryCount += 1;
			if (queryCount === 1) {
				return {
					items: [1, 2],
					nextCursor: { id: 'cursor-2', startedAt: new Date('2026-01-04T00:00:00Z') }
				};
			}
			return {
				items: [3, 4],
				nextCursor: { id: 'cursor-4', startedAt: new Date('2026-01-02T00:00:00Z') }
			};
		}
	});

	assert.deepEqual(result, { items: [3, 2, 1], truncated: true });
	assert.equal(queryCount, 2);
});

test('preserves an explicit date selection when full chart bounds arrive', () => {
	const selection = createUserPreservingDefaultSelection(
		{ start: 'today', end: 'today' },
		{ cardHistory: 0, completeChartHistory: 1 }
	);
	assert.deepEqual(selection.applyDefault('cardHistory', { start: 'card-oldest', end: 'card-newest' }), {
		start: 'card-oldest',
		end: 'card-newest'
	});

	selection.select({ start: 'user-start', end: 'user-end' });
	assert.deepEqual(selection.applyDefault('completeChartHistory', { start: 'chart-oldest', end: 'chart-newest' }), {
		start: 'user-start',
		end: 'user-end'
	});
});

test('keeps complete chart bounds authoritative over card history defaults until reset', () => {
	const selection = createUserPreservingDefaultSelection(
		{ start: 'today', end: 'today' },
		{ cardHistory: 0, completeChartHistory: 1 }
	);
	const chartRange = { start: 'chart-oldest', end: 'chart-newest' };

	assert.deepEqual(selection.applyDefault('completeChartHistory', chartRange), chartRange);
	assert.deepEqual(selection.applyDefault('cardHistory', { start: 'card-oldest', end: 'card-newest' }), chartRange);

	selection.reset();
	assert.deepEqual(selection.applyDefault('cardHistory', { start: 'new-card-oldest', end: 'new-card-newest' }), {
		start: 'new-card-oldest',
		end: 'new-card-newest'
	});
});

test('stops chart pagination when a newer exercise selection makes the request stale', async () => {
	let current = true;
	let queryCount = 0;
	const items = await loadExerciseChartHistoryPages({
		exerciseName: 'Press',
		isCurrent: () => current,
		query: async () => {
			queryCount += 1;
			current = false;
			return {
				items: [1],
				nextCursor: { id: 'cursor-1', startedAt: new Date('2026-01-01T00:00:00Z') }
			};
		}
	});

	assert.equal(items, undefined);
	assert.equal(queryCount, 1);
});

test('allows an independent chart retry after a page request fails', async () => {
	let shouldFail = true;
	const load = () =>
		loadExerciseChartHistoryPages({
			exerciseName: 'Press',
			isCurrent: () => true,
			query: async () => {
				if (shouldFail) throw new Error('chart unavailable');
				return { items: [1] };
			}
		});

	await assert.rejects(load, /chart unavailable/);
	shouldFail = false;
	assert.deepEqual(await load(), { items: [1], truncated: false });
});

test('keeps chart resource errors stable until an explicit retry', async () => {
	let queryCount = 0;
	let state: ExerciseChartHistoryResourceState<number> = { status: 'idle' };
	const resource = createExerciseChartHistoryResource<number>({
		onStateChange: (nextState) => (state = nextState),
		query: async () => {
			queryCount += 1;
			if (queryCount === 1) throw new Error('temporarily unavailable');
			return { items: [1, 2] };
		}
	});

	await resource.load('Press');
	assert.deepEqual(state, { status: 'error' });
	await resource.load('Press');
	assert.equal(queryCount, 1);

	await resource.retry('Press');
	assert.equal(queryCount, 2);
	assert.deepEqual(state, { status: 'loaded', data: [2, 1], truncated: false });
});

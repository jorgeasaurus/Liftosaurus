import assert from 'node:assert/strict';
import test from 'node:test';
import {
	buildBodyFatSeries,
	buildBodyweightSeries,
	buildRelativePerformanceSeries,
	buildSevenDayAverageSeries,
	buildWorkVolumeSeries,
	type DashboardWorkout
} from '../../src/lib/utils/dashboardMetrics.js';

function workout(startedAt: string, load: number): DashboardWorkout {
	return {
		startedAt: new Date(startedAt),
		userBodyweight: 190,
		workoutExercises: [
			{
				exerciseIndex: 0,
				name: 'Bench press',
				bodyweightFraction: null,
				sets: [
					{
						setIndex: 0,
						reps: 10,
						load,
						RIR: 2,
						skipped: false,
						miniSets: []
					}
				]
			}
		]
	};
}

test('relative performance reports average set progress from the first matching session', () => {
	const series = buildRelativePerformanceSeries([
		workout('2026-07-01T12:00:00Z', 100),
		workout('2026-07-08T12:00:00Z', 110)
	]);

	assert.deepEqual(series[0], {
		timestamp: new Date('2026-07-01T12:00:00Z').getTime(),
		value: 0
	});
	assert.equal(series.length, 2);
	assert.ok(series[1].value > 9 && series[1].value < 11);
});

test('bodyweight keeps canonical pounds and sorts measurements chronologically', () => {
	const series = buildBodyweightSeries([
		{ startedAt: new Date('2026-07-03T12:00:00Z'), userBodyweight: 191.5 },
		{ startedAt: new Date('2026-07-01T12:00:00Z'), userBodyweight: 190 }
	]);

	assert.deepEqual(series, [
		{ timestamp: new Date('2026-07-01T12:00:00Z').getTime(), value: 190 },
		{ timestamp: new Date('2026-07-03T12:00:00Z').getTime(), value: 191.5 }
	]);
});

test('body fat keeps percentages, omits missing measurements, and sorts chronologically', () => {
	const series = buildBodyFatSeries([
		{ startedAt: new Date('2026-07-03T12:00:00Z'), userBodyFat: 18.5 },
		{ startedAt: new Date('2026-07-02T12:00:00Z'), userBodyFat: null },
		{ startedAt: new Date('2026-07-01T12:00:00Z'), userBodyFat: 19 }
	]);

	assert.deepEqual(series, [
		{ timestamp: new Date('2026-07-01T12:00:00Z').getTime(), value: 19 },
		{ timestamp: new Date('2026-07-03T12:00:00Z').getTime(), value: 18.5 }
	]);
});

test('seven-day bodyweight average uses available measurements in the trailing calendar window', () => {
	const series = buildSevenDayAverageSeries([
		{ timestamp: new Date('2026-07-01T12:00:00Z').getTime(), value: 180 },
		{ timestamp: new Date('2026-07-02T12:00:00Z').getTime(), value: 182 },
		{ timestamp: new Date('2026-07-08T12:00:00Z').getTime(), value: 194 }
	]);

	assert.deepEqual(
		series.map((point) => point.value),
		[180, 181, 188]
	);
});

test('work volume counts performed reps rather than reps in reserve', () => {
	const series = buildWorkVolumeSeries([workout('2026-07-01T12:00:00Z', 100)]);

	assert.deepEqual(series, [{ timestamp: new Date('2026-07-01T12:00:00Z').getTime(), value: 1000 }]);
});

test('work volume applies bodyweight to every main and mini-set rep while excluding skipped sets', () => {
	const bodyweightWorkout = workout('2026-07-01T12:00:00Z', 0);
	bodyweightWorkout.workoutExercises[0].bodyweightFraction = 1;
	bodyweightWorkout.workoutExercises[0].sets[0].miniSets = [{ reps: 5, load: 0, RIR: 1 }];
	bodyweightWorkout.workoutExercises[0].sets.push({
		setIndex: 1,
		reps: 10,
		load: 100,
		RIR: 0,
		skipped: true,
		miniSets: []
	});

	const series = buildWorkVolumeSeries([bodyweightWorkout]);

	assert.equal(series[0].value, 15 * 190);
});

test('relative performance includes pounds bodyweight for bodyweight exercises', () => {
	const first = workout('2026-07-01T12:00:00Z', 0);
	first.userBodyweight = 180;
	first.workoutExercises[0].name = 'Pull-up';
	first.workoutExercises[0].bodyweightFraction = 1;
	const second = structuredClone(first);
	second.startedAt = new Date('2026-07-08T12:00:00Z');
	second.userBodyweight = 190;

	const series = buildRelativePerformanceSeries([first, second]);

	assert.equal(series.length, 2);
	assert.ok(series[1].value > 5 && series[1].value < 6);
});

test('relative performance compares each session with its own bodyweight fraction', () => {
	const first = workout('2026-07-01T12:00:00Z', 0);
	first.userBodyweight = 200;
	first.workoutExercises[0].name = 'Assisted pull-up';
	first.workoutExercises[0].bodyweightFraction = 1;

	const second = structuredClone(first);
	second.startedAt = new Date('2026-07-08T12:00:00Z');
	second.workoutExercises[0].bodyweightFraction = 0.5;
	second.workoutExercises[0].sets[0].load = 100;

	const series = buildRelativePerformanceSeries([first, second]);

	assert.ok(Math.abs(series[1].value) < 0.001);
});

test('relative performance keeps repeated exercise slots independent', () => {
	const first = workout('2026-07-01T12:00:00Z', 100);
	const repeatedExercise = structuredClone(first.workoutExercises[0]);
	repeatedExercise.exerciseIndex = 1;
	repeatedExercise.sets[0].load = 200;
	first.workoutExercises.push(repeatedExercise);

	const second = structuredClone(first);
	second.startedAt = new Date('2026-07-08T12:00:00Z');
	second.workoutExercises[0].sets[0].load = 110;

	const series = buildRelativePerformanceSeries([first, second]);

	assert.equal(series.length, 2);
	assert.ok(series[1].value > 4 && series[1].value < 6);
});

test('relative performance matches exercises after their display order changes', () => {
	const first = workout('2026-07-01T12:00:00Z', 100);
	const row = structuredClone(first.workoutExercises[0]);
	row.exerciseIndex = 1;
	row.name = 'Barbell row';
	row.sets[0].load = 200;
	first.workoutExercises.push(row);

	const second = structuredClone(first);
	second.startedAt = new Date('2026-07-08T12:00:00Z');
	second.workoutExercises.reverse();
	second.workoutExercises[0].exerciseIndex = 0;
	second.workoutExercises[0].sets[0].load = 220;
	second.workoutExercises[1].exerciseIndex = 1;
	second.workoutExercises[1].sets[0].load = 110;

	const series = buildRelativePerformanceSeries([first, second]);

	assert.equal(series.length, 2);
	assert.ok(series[1].value > 9 && series[1].value < 11);
});

test('relative performance gives later set slots their own first-seen baseline', () => {
	const first = workout('2026-07-01T12:00:00Z', 100);
	const second = workout('2026-07-08T12:00:00Z', 110);
	second.workoutExercises[0].sets.push({
		setIndex: 1,
		reps: 10,
		load: 200,
		RIR: 2,
		skipped: false,
		miniSets: []
	});
	const third = structuredClone(second);
	third.startedAt = new Date('2026-07-15T12:00:00Z');
	third.workoutExercises[0].sets[0].load = 120;
	third.workoutExercises[0].sets[1].load = 220;

	const series = buildRelativePerformanceSeries([first, second, third]);

	assert.equal(series.length, 3);
	assert.ok(series[1].value > 4 && series[1].value < 6);
	assert.ok(series[2].value > 14 && series[2].value < 16);
});

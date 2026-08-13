import assert from 'node:assert/strict';
import test from 'node:test';
import { buildWorkoutComparison } from '../../src/lib/utils/workoutComparison.js';
import type {
	WorkoutExerciseInProgress,
	WorkoutExerciseWithPreviousBodyweight
} from '../../src/lib/utils/workoutUtils.js';

function currentExercise(): WorkoutExerciseInProgress {
	return {
		name: 'Bench press',
		bodyweightFraction: null,
		isDeload: false,
		sets: [
			{ reps: 12, load: 100, RIR: 0, skipped: false, completed: true, miniSets: [] },
			{ reps: 99, load: 100, RIR: 0, skipped: true, completed: false, miniSets: [] },
			{
				reps: 10,
				load: 100,
				RIR: 0,
				skipped: false,
				completed: false,
				miniSets: [{ reps: 50, load: 100, RIR: 0, completed: false }]
			}
		]
	} as WorkoutExerciseInProgress;
}

function previousExercise(load = 100): WorkoutExerciseWithPreviousBodyweight {
	return {
		name: 'Bench press',
		workoutId: 'previous-workout',
		userBodyweight: 190,
		bodyweightFraction: null,
		isDeload: false,
		sets: [
			{ reps: 10, load, RIR: 0, skipped: false, miniSets: [] },
			{ reps: 50, load, RIR: 0, skipped: true, miniSets: [] }
		]
	} as unknown as WorkoutExerciseWithPreviousBodyweight;
}

test('comparison volume excludes skipped and incomplete work', () => {
	const comparison = buildWorkoutComparison([currentExercise()], [previousExercise()], 190);

	assert.deepEqual(comparison.rows, [{ name: 'Bench press', previousVolume: 1000, currentVolume: 1200, change: 20 }]);
	assert.equal(comparison.previousVolume, 1000);
	assert.equal(comparison.currentVolume, 1200);
});

test('comparison reports zero and unavailable percentage changes without false values', () => {
	const unchanged = currentExercise();
	unchanged.sets = [{ reps: 10, load: 100, RIR: 0, skipped: false, completed: true, miniSets: [] }];
	assert.equal(buildWorkoutComparison([unchanged], [previousExercise()], 190).rows[0].change, 0);

	const zeroBaseline = previousExercise(0);
	assert.equal(buildWorkoutComparison([unchanged], [zeroBaseline], 190).rows[0].change, null);
});

test('comparison excludes unmatched and deload exercises', () => {
	const deload = currentExercise();
	deload.isDeload = true;
	assert.deepEqual(buildWorkoutComparison([deload], [previousExercise()], 190).rows, []);
});

test('comparison uses each workout bodyweight and exposes chart aggregates', () => {
	const current = currentExercise();
	current.bodyweightFraction = 1;
	current.sets = [{ reps: 10, load: 0, RIR: 0, skipped: false, completed: true, miniSets: [] }];
	const previous = previousExercise(0);
	previous.bodyweightFraction = 1;
	previous.userBodyweight = 180;
	previous.sets = [{ ...previous.sets[0], load: 0, skipped: false }];

	const comparison = buildWorkoutComparison([current], [previous], 190);
	assert.deepEqual(comparison.rows, [
		{
			name: 'Bench press',
			previousVolume: 180,
			currentVolume: 190,
			change: (10 / 180) * 100
		}
	]);
	assert.deepEqual([...comparison.baselineWorkoutIds], ['previous-workout']);
	assert.equal(comparison.previousSetCount, 1);
	assert.equal(comparison.currentSetCount, 1);
});

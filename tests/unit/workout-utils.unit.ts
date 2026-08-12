import assert from 'node:assert/strict';
import test from 'node:test';
import {
	deriveWorkoutProgress,
	getPreviousBodyweightFraction,
	type WorkoutExerciseInProgress
} from '../../src/lib/utils/workoutUtils.js';

function exercise(sets: WorkoutExerciseInProgress['sets']): WorkoutExerciseInProgress {
	return {
		name: 'Bench press',
		targetMuscleGroup: 'Chest',
		customMuscleGroup: null,
		bodyweightFraction: null,
		setType: 'Straight',
		changeType: null,
		changeAmount: null,
		repRangeStart: 5,
		repRangeEnd: 10,
		note: null,
		overloadPercentage: null,
		lastSetToFailure: null,
		forceRIRMatching: null,
		minimumWeightChange: null,
		topRepRangeStart: null,
		topRepRangeEnd: null,
		isDeload: false,
		sets
	};
}

test('previous bodyweight fraction preserves an explicit non-bodyweight exercise', () => {
	const fraction = getPreviousBodyweightFraction([{ name: 'Pull-up', bodyweightFraction: null }], 'Pull-up', 1);

	assert.equal(fraction, null);
});

test('previous bodyweight fraction falls back to the current exercise when no history matches', () => {
	const fraction = getPreviousBodyweightFraction([{ name: 'Dip', bodyweightFraction: 0.85 }], 'Pull-up', 1);

	assert.equal(fraction, 1);
});

test('workout progress advances from a parent set to its first incomplete mini set', () => {
	const progress = deriveWorkoutProgress([
		exercise([
			{
				reps: 10,
				load: 135,
				RIR: 2,
				skipped: false,
				completed: true,
				miniSets: [
					{ reps: 5, load: 120, RIR: 1, completed: true },
					{ reps: 4, load: 110, RIR: 1, completed: false }
				]
			}
		])
	]);

	assert.deepEqual(progress, {
		total: 3,
		completed: 2,
		allComplete: false,
		next: { kind: 'miniSet', exerciseIndex: 0, setIndex: 0, miniSetIndex: 1, exerciseName: 'Bench press' }
	});
});

test('workout progress excludes skipped sets and selects the next parent set', () => {
	const progress = deriveWorkoutProgress([
		exercise([
			{ reps: undefined, load: undefined, RIR: undefined, skipped: true, completed: false, miniSets: [] },
			{ reps: 8, load: 145, RIR: 2, skipped: false, completed: false, miniSets: [] }
		])
	]);

	assert.equal(progress.total, 1);
	assert.equal(progress.completed, 0);
	assert.deepEqual(progress.next, { kind: 'set', exerciseIndex: 0, setIndex: 1, exerciseName: 'Bench press' });
});

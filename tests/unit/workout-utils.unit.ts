import assert from 'node:assert/strict';
import test from 'node:test';
import {
	deriveWorkoutProgress,
	getPreviousBodyweightFraction,
	solveBergerFormula,
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

test('estimated reps never return a non-positive value', () => {
	const reps = solveBergerFormula({
		variableToSolve: 'NewReps',
		knownValues: {
			oldSet: { reps: 2, load: 140, RIR: 1, miniSets: [] },
			newSet: { load: 200, RIR: 1, miniSets: [] },
			oldBodyweightFraction: null,
			newBodyweightFraction: null,
			overloadPercentage: 0
		}
	});

	assert.ok(reps >= 1);
});

test('estimated reps change when the new set load changes', () => {
	const estimate = (load: number) =>
		solveBergerFormula({
			variableToSolve: 'NewReps',
			knownValues: {
				oldSet: { reps: 10, load: 100, RIR: 1, miniSets: [] },
				newSet: { load, RIR: 1, miniSets: [] },
				oldBodyweightFraction: null,
				newBodyweightFraction: null,
				overloadPercentage: 0
			}
		});

	assert.notEqual(estimate(105), estimate(120));
});

test('estimated reps support zero external load for bodyweight exercises', () => {
	const estimate = (load: number) =>
		solveBergerFormula({
			variableToSolve: 'NewReps',
			knownValues: {
				oldSet: { reps: 10, load: 0, RIR: 1, miniSets: [] },
				newSet: { load, RIR: 1, miniSets: [] },
				oldBodyweightFraction: 1,
				newBodyweightFraction: 1,
				oldUserBodyweight: 180,
				newUserBodyweight: 180,
				overloadPercentage: 0
			}
		});

	assert.notEqual(estimate(0), estimate(20));
});

test('persisted negative reps are normalized to one rep', async () => {
	const { normalizePersistedWorkoutExercises } = await import('../../src/lib/utils/workoutUtils.js');
	const [exercise] = normalizePersistedWorkoutExercises([
		{
			name: 'Chest press',
			sets: [{ reps: -5, plannedReps: -6, miniSets: [] }]
		} as never
	]);

	assert.equal(exercise.sets[0].reps, 1);
	assert.equal(exercise.sets[0].plannedReps, 1);

	const [missingPlannedReps] = normalizePersistedWorkoutExercises([
		{
			name: 'Chest press',
			sets: [{ reps: -5, miniSets: [] }]
		} as never
	]);
	assert.equal(missingPlannedReps.sets[0].plannedReps, 1);

	const [nonFiniteReps] = normalizePersistedWorkoutExercises([
		{
			name: 'Chest press',
			sets: [{ reps: Number.NaN, plannedReps: Number.POSITIVE_INFINITY, miniSets: [] }]
		} as never
	]);
	assert.equal(nonFiniteReps.sets[0].reps, 1);
	assert.equal(nonFiniteReps.sets[0].plannedReps, 1);
});

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

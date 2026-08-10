import assert from 'node:assert/strict';
import test from 'node:test';
import { getPreviousBodyweightFraction, solveBergerFormula } from '../../src/lib/utils/workoutUtils.js';

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

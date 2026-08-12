import assert from 'node:assert/strict';
import test from 'node:test';
import { buildExerciseCatalog } from '../../src/lib/utils/exerciseCatalog.js';

test('exercise catalog deduplicates performed built-ins', () => {
	const catalog = buildExerciseCatalog([
		{ name: '  Barbell bench press ', targetMuscleGroup: 'Chest', customMuscleGroup: null }
	]);
	const matching = catalog
		.flatMap((group) => group.exercises)
		.filter((exercise) => exercise.name === 'Barbell bench press');

	assert.equal(matching.length, 1);
	assert.equal(matching[0].type, 'builtIn');
});

test('exercise catalog preserves sparse custom history exercises as personal summaries', () => {
	const catalog = buildExerciseCatalog([
		{ name: 'Cable sweep', targetMuscleGroup: 'Custom', customMuscleGroup: 'Upper chest' }
	]);
	const group = catalog.find((entry) => entry.muscleGroup === 'Upper chest');

	assert.deepEqual(group?.exercises, [
		{
			name: 'Cable sweep',
			targetMuscleGroup: 'Custom',
			customMuscleGroup: 'Upper chest',
			type: 'personal'
		}
	]);
});

test('exercise catalog deduplicates personal summaries by normalized name', () => {
	const catalog = buildExerciseCatalog([
		{ name: 'Cable sweep', targetMuscleGroup: 'Custom', customMuscleGroup: 'Upper chest' },
		{ name: ' cable SWEEP ', targetMuscleGroup: 'Custom', customMuscleGroup: 'Upper chest' }
	]);

	assert.equal(
		catalog.flatMap((group) => group.exercises).filter((exercise) => exercise.type === 'personal').length,
		1
	);
});

test('exercise catalog casing identity is deterministic for names beginning with I', () => {
	const catalog = buildExerciseCatalog([
		{ name: 'INCLINE DUMBBELL PRESS', targetMuscleGroup: 'Chest', customMuscleGroup: null }
	]);

	assert.equal(
		catalog
			.flatMap((group) => group.exercises)
			.filter((exercise) => exercise.name.toLowerCase() === 'incline dumbbell press').length,
		1
	);
});

import assert from 'node:assert/strict';
import test from 'node:test';
import {
	buildExerciseCatalog,
	isBuiltInExerciseName,
	mergePickableUserExercises
} from '../../src/lib/utils/exerciseCatalog.js';

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

test('built-in catalog names stay shared and are not treated as personal', () => {
	assert.equal(isBuiltInExerciseName('Barbell bench press'), true);
	assert.equal(isBuiltInExerciseName('  barbell BENCH press '), true);
	assert.equal(isBuiltInExerciseName("Jorge's cable sweep"), false);
});

test('pickable user exercises keep each account’s custom names and skip the other account’s', () => {
	const ownerCustoms = [
		{
			name: "Jorge's cable sweep",
			targetMuscleGroup: 'Chest' as const,
			customMuscleGroup: null,
			customExerciseId: 'owner-custom'
		}
	];
	const otherUserCustoms = [
		{
			name: 'Other-user jefferson curl',
			targetMuscleGroup: 'Hamstrings' as const,
			customMuscleGroup: null,
			customExerciseId: 'other-custom'
		}
	];

	const ownerPickable = mergePickableUserExercises(ownerCustoms, []);
	const otherPickable = mergePickableUserExercises(otherUserCustoms, []);

	assert.deepEqual(
		ownerPickable.map((exercise) => exercise.name),
		["Jorge's cable sweep"]
	);
	assert.equal(
		otherPickable.some((exercise) => exercise.name === "Jorge's cable sweep"),
		false
	);
	assert.equal(
		ownerPickable.some((exercise) => exercise.name === 'Other-user jefferson curl'),
		false
	);
});

test('owned custom exercises take precedence over the same user’s workout history', () => {
	const merged = mergePickableUserExercises(
		[
			{
				name: 'Cable sweep',
				targetMuscleGroup: 'Chest',
				customMuscleGroup: null,
				customExerciseId: 'custom-1',
				note: 'Catalog cue'
			}
		],
		[{ name: 'cable sweep', targetMuscleGroup: 'Custom', customMuscleGroup: 'Upper chest' }]
	);

	assert.deepEqual(merged, [
		{
			name: 'Cable sweep',
			targetMuscleGroup: 'Chest',
			customMuscleGroup: null,
			customExerciseId: 'custom-1',
			note: 'Catalog cue'
		}
	]);
});

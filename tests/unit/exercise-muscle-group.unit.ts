import assert from 'node:assert/strict';
import test from 'node:test';
import { historicalExerciseMuscleGroupUpdateSchema } from '../../src/lib/utils/exerciseMuscleGroup.js';

test('preserves exact exercise names in strict built-in historical muscle-group input', () => {
	assert.deepEqual(
		historicalExerciseMuscleGroupUpdateSchema.parse({
			exerciseName: '  Bench Press  ',
			targetMuscleGroup: 'Chest',
			customMuscleGroup: null
		}),
		{ exerciseName: '  Bench Press  ', targetMuscleGroup: 'Chest', customMuscleGroup: null }
	);
	assert.equal(
		historicalExerciseMuscleGroupUpdateSchema.safeParse({
			exerciseName: 'Bench Press',
			targetMuscleGroup: 'Chest',
			customMuscleGroup: 'Pressing'
		}).success,
		false
	);
	assert.equal(
		historicalExerciseMuscleGroupUpdateSchema.safeParse({
			exerciseName: '   ',
			targetMuscleGroup: 'Chest',
			customMuscleGroup: null
		}).success,
		false
	);
});

test('requires and trims custom historical muscle groups', () => {
	assert.deepEqual(
		historicalExerciseMuscleGroupUpdateSchema.parse({
			exerciseName: 'Bench Press',
			targetMuscleGroup: 'Custom',
			customMuscleGroup: '  Pressing  '
		}),
		{ exerciseName: 'Bench Press', targetMuscleGroup: 'Custom', customMuscleGroup: 'Pressing' }
	);
	for (const customMuscleGroup of [null, '', '   ']) {
		assert.equal(
			historicalExerciseMuscleGroupUpdateSchema.safeParse({
				exerciseName: 'Bench Press',
				targetMuscleGroup: 'Custom',
				customMuscleGroup
			}).success,
			false
		);
	}
});

test('rejects unknown historical muscle-group input fields', () => {
	assert.equal(
		historicalExerciseMuscleGroupUpdateSchema.safeParse({
			exerciseName: 'Bench Press',
			targetMuscleGroup: 'Chest',
			customMuscleGroup: null,
			updateTemplates: true
		}).success,
		false
	);
});

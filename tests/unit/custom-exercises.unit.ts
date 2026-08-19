import assert from 'node:assert/strict';
import test from 'node:test';
import { customExerciseWriteSchema, toCustomExerciseWriteData } from '../../src/lib/server/customExercises.js';
import { isBuiltInExerciseName } from '../../src/lib/utils/exerciseCatalog.js';

test('custom exercise writes normalize the owner-scoped name', () => {
	const parsed = customExerciseWriteSchema.parse({
		name: '  Jorge cable sweep  ',
		targetMuscleGroup: 'Chest',
		customMuscleGroup: null,
		setType: 'Straight',
		repRangeStart: 10,
		repRangeEnd: 15
	});

	assert.deepEqual(toCustomExerciseWriteData(parsed), {
		name: 'Jorge cable sweep',
		nameNormalized: 'jorge cable sweep',
		targetMuscleGroup: 'Chest',
		customMuscleGroup: null,
		bodyweightFraction: null,
		setType: 'Straight',
		repRangeStart: 10,
		repRangeEnd: 15,
		changeType: null,
		changeAmount: null,
		note: null
	});
});

test('custom exercise writes reject a custom target without a muscle group label', () => {
	const parsed = customExerciseWriteSchema.safeParse({
		name: 'Machine X',
		targetMuscleGroup: 'Custom'
	});

	assert.equal(parsed.success, false);
});

test('built-in names cannot become per-account custom catalog rows', () => {
	assert.equal(
		isBuiltInExerciseName(
			toCustomExerciseWriteData({
				name: 'Hammer pendulum squats',
				targetMuscleGroup: 'Quads'
			}).name
		),
		true
	);
});

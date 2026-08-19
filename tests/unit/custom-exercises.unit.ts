import assert from 'node:assert/strict';
import test from 'node:test';
import {
	customExerciseWriteSchema,
	persistCustomExercises,
	toCustomExerciseWriteData
} from '../../src/lib/server/customExercises.js';
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

test('persistCustomExercises writes only the owning user and skips built-ins', async () => {
	const upserts: Array<{ userId: string; name: string }> = [];
	const db = {
		customExercise: {
			upsert: async (args: {
				where: { userId_nameNormalized: { userId: string } };
				create: { userId: string; name: string };
			}) => {
				upserts.push({ userId: args.create.userId, name: args.create.name });
				return args.create;
			}
		}
	};

	await persistCustomExercises(
		'user-a',
		[
			{
				name: 'Barbell bench press',
				targetMuscleGroup: 'Chest',
				setType: 'Straight',
				repRangeStart: 5,
				repRangeEnd: 10
			},
			{
				name: "Jorge's cable sweep",
				targetMuscleGroup: 'Chest',
				setType: 'Straight',
				repRangeStart: 10,
				repRangeEnd: 15
			}
		],
		db as never
	);
	await persistCustomExercises(
		'user-b',
		[
			{
				name: 'Other-user jefferson curl',
				targetMuscleGroup: 'Hamstrings',
				setType: 'Straight',
				repRangeStart: 6,
				repRangeEnd: 10
			}
		],
		db as never
	);

	assert.deepEqual(upserts, [
		{ userId: 'user-a', name: "Jorge's cable sweep" },
		{ userId: 'user-b', name: 'Other-user jefferson curl' }
	]);
});

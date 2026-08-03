import assert from 'node:assert/strict';
import test from 'node:test';
import type { ActiveMesocycleWithProgressionData } from '../../src/lib/trpc/routes/workouts.js';
import {
	applyManualDeload,
	applyManualDeloadToWorkout,
	canApplyManualDeloadToWorkout,
	getComparableWorkoutExercisePairs,
	getEditedManualDeloadMetadata,
	getPreviousWorkoutExercisePerformances,
	hasAlignedManualDeloadMetadata,
	hasContiguousExerciseTemplateOrder,
	markWorkoutExerciseStarted,
	normalizePersistedWorkoutExercises,
	progressiveOverloadMagic,
	type WorkoutExerciseInProgress,
	type WorkoutExerciseWithPreviousBodyweight
} from '../../src/lib/utils/workoutUtils.js';

test('manual deload metadata must align with the submitted exercises when provided', () => {
	assert.equal(hasAlignedManualDeloadMetadata([{}, {}], undefined), true);
	assert.equal(hasAlignedManualDeloadMetadata([{}, {}], [null, null]), true);
	assert.equal(hasAlignedManualDeloadMetadata([{}, {}], [null]), false);
});

test('editing a normal exercise preserves its stable source template identity', () => {
	assert.deepEqual(
		getEditedManualDeloadMetadata(false, { sourceTemplateId: 'template-bench', originalSetCount: 3 }, 4),
		{ sourceTemplateId: 'template-bench', originalSetCount: 4 }
	);
	assert.deepEqual(getEditedManualDeloadMetadata(false, undefined, 4), {
		sourceTemplateId: null,
		originalSetCount: 4
	});
	assert.deepEqual(
		getEditedManualDeloadMetadata(true, { sourceTemplateId: 'template-bench', originalSetCount: 3 }, 4),
		{ sourceTemplateId: 'template-bench', originalSetCount: 3 }
	);
});

test('requires final exercise templates to have unique contiguous indices in workout order', () => {
	assert.equal(
		hasContiguousExerciseTemplateOrder([{ exerciseIndex: 0 }, { exerciseIndex: 1 }, { exerciseIndex: 2 }]),
		true
	);
	assert.equal(hasContiguousExerciseTemplateOrder([{ exerciseIndex: 0 }, { exerciseIndex: 0 }]), false);
	assert.equal(hasContiguousExerciseTemplateOrder([{ exerciseIndex: 0 }, { exerciseIndex: 2 }]), false);
	assert.equal(hasContiguousExerciseTemplateOrder([{ exerciseIndex: 1 }, { exerciseIndex: 0 }]), false);
});

function progressionFixture(includeDeload: boolean): ActiveMesocycleWithProgressionData {
	const exerciseTemplate = {
		id: 'template-bench',
		name: 'Bench press',
		exerciseIndex: 0,
		targetMuscleGroup: 'Chest' as const,
		customMuscleGroup: null,
		bodyweightFraction: null,
		sets: 2,
		setType: 'Straight' as const,
		repRangeStart: 5,
		repRangeEnd: 12,
		changeType: null,
		changeAmount: null,
		note: null,
		mesocycleExerciseSplitDayId: 'split-day',
		overloadPercentage: null,
		lastSetToFailure: null,
		forceRIRMatching: null,
		minimumWeightChange: 5,
		preferredProgressionVariable: null,
		topRepRangeStart: null,
		topRepRangeEnd: null
	};
	const normalExercise = {
		...exerciseTemplate,
		id: 'normal-bench',
		workoutId: 'normal-workout',
		sets: [
			{
				id: 'normal-set-1',
				workoutExerciseId: 'normal-bench',
				setIndex: 0,
				reps: 10,
				load: 100,
				RIR: 2,
				skipped: false,
				miniSets: []
			},
			{
				id: 'normal-set-2',
				workoutExerciseId: 'normal-bench',
				setIndex: 1,
				reps: 9,
				load: 100,
				RIR: 2,
				skipped: false,
				miniSets: []
			}
		]
	};
	const workouts: unknown[] = [
		{
			id: 'normal-membership',
			workoutId: 'normal-workout',
			mesocycleId: 'mesocycle',
			splitDayIndex: 0,
			workoutStatus: null,
			workout: {
				id: 'normal-workout',
				userId: 'user',
				userBodyweight: 190,
				startedAt: new Date('2026-07-01T12:00:00Z'),
				endedAt: new Date('2026-07-01T13:00:00Z'),
				note: null,
				workoutExercises: [normalExercise]
			}
		}
	];

	if (includeDeload) {
		workouts.push({
			id: 'deload-membership',
			workoutId: 'deload-workout',
			mesocycleId: 'mesocycle',
			splitDayIndex: 0,
			workoutStatus: null,
			workout: {
				id: 'deload-workout',
				userId: 'user',
				userBodyweight: 190,
				startedAt: new Date('2026-07-08T12:00:00Z'),
				endedAt: new Date('2026-07-08T13:00:00Z'),
				note: null,
				workoutExercises: [
					{
						...normalExercise,
						id: 'deload-bench',
						workoutId: 'deload-workout',
						isDeload: true,
						sets: [
							{
								id: 'deload-set-1',
								workoutExerciseId: 'deload-bench',
								setIndex: 0,
								reps: 5,
								load: 50,
								RIR: 2,
								skipped: false,
								miniSets: [
									{
										id: 'deload-mini-set',
										workoutExerciseSetId: 'deload-set-1',
										miniSetIndex: 0,
										reps: 3,
										load: 25,
										RIR: 2
									}
								]
							},
							{
								id: 'deload-set-2',
								workoutExerciseId: 'deload-bench',
								setIndex: 1,
								reps: 0,
								load: 0,
								RIR: 0,
								skipped: true,
								miniSets: []
							}
						]
					}
				]
			}
		});
	}

	return {
		id: 'mesocycle',
		name: 'Manual deload test',
		userId: 'user',
		exerciseSplitId: null,
		RIRProgression: [4],
		startDate: new Date('2026-07-01T00:00:00Z'),
		endDate: null,
		startOverloadPercentage: 2,
		lastSetToFailure: false,
		forceRIRMatching: false,
		mesocycleExerciseSplitDays: [
			{
				id: 'split-day',
				name: 'Push',
				dayIndex: 0,
				isRestDay: false,
				mesocycleId: 'mesocycle',
				mesocycleSplitDayExercises: [exerciseTemplate]
			}
		],
		mesocycleCyclicSetChanges: [
			{
				id: 'chest-volume',
				mesocycleId: 'mesocycle',
				muscleGroup: 'Chest',
				customMuscleGroup: null,
				regardlessOfProgress: false,
				setIncreaseAmount: 1,
				maxVolume: 10
			}
		],
		workoutsOfMesocycle: workouts
	} as unknown as ActiveMesocycleWithProgressionData;
}

function manualDeloadExercise(
	name: string,
	targetMuscleGroup: 'Chest' | 'Biceps' | 'Custom',
	options: { customMuscleGroup?: string; completed?: boolean; load?: number } = {}
): WorkoutExerciseInProgress {
	return {
		name,
		targetMuscleGroup,
		customMuscleGroup: options.customMuscleGroup ?? null,
		bodyweightFraction: null,
		setType: 'Straight',
		repRangeStart: 5,
		repRangeEnd: 12,
		changeType: null,
		changeAmount: null,
		note: null,
		overloadPercentage: null,
		lastSetToFailure: null,
		forceRIRMatching: null,
		minimumWeightChange: 5,
		preferredProgressionVariable: null,
		topRepRangeStart: null,
		topRepRangeEnd: null,
		sets: [
			{
				reps: 10,
				load: options.load ?? 100,
				RIR: 2,
				completed: options.completed ?? false,
				skipped: false,
				miniSets: []
			},
			{ reps: 9, load: options.load ?? 100, RIR: 2, completed: false, skipped: false, miniSets: [] }
		]
	};
}

function previousWorkoutExercise(name: string): WorkoutExerciseWithPreviousBodyweight {
	return {
		id: `previous-${name}`,
		workoutId: 'previous-workout',
		exerciseIndex: 0,
		name,
		targetMuscleGroup: 'Chest',
		customMuscleGroup: null,
		bodyweightFraction: null,
		setType: 'Straight',
		repRangeStart: 5,
		repRangeEnd: 12,
		changeType: null,
		changeAmount: null,
		note: null,
		overloadPercentage: null,
		lastSetToFailure: null,
		forceRIRMatching: null,
		minimumWeightChange: 5,
		preferredProgressionVariable: null,
		topRepRangeStart: null,
		topRepRangeEnd: null,
		isDeload: false,
		userBodyweight: 190,
		sets: []
	};
}

test('manual deload performance does not change the next workout targets', () => {
	const withoutDeload = progressiveOverloadMagic(progressionFixture(false), 2, 190, 0);
	const afterDeload = progressiveOverloadMagic(progressionFixture(true), 2, 190, 0);

	assert.deepEqual(afterDeload, withoutDeload);
});

test("mixed deload workouts use each exercise's latest normal performance and bodyweight", () => {
	const fixture = progressionFixture(true);
	const [normalWorkout, mixedDeloadWorkout] = fixture.workoutsOfMesocycle;
	normalWorkout.workout.userBodyweight = 180;
	mixedDeloadWorkout.workout.userBodyweight = 195;
	const normalBench = normalWorkout.workout.workoutExercises[0];
	normalWorkout.workout.workoutExercises.push({
		...normalBench,
		id: 'normal-cable-fly',
		name: 'Cable fly',
		workoutId: normalWorkout.workout.id
	});
	mixedDeloadWorkout.workout.workoutExercises.push({
		...normalBench,
		id: 'mixed-cable-fly',
		name: 'Cable fly',
		workoutId: mixedDeloadWorkout.workout.id,
		isDeload: false
	});

	const performances = getPreviousWorkoutExercisePerformances(
		[{ name: 'Bench press' }, { name: 'Cable fly' }],
		fixture.workoutsOfMesocycle
	);

	assert.deepEqual(
		performances.map(({ name, userBodyweight }) => ({ name, userBodyweight })),
		[
			{ name: 'Bench press', userBodyweight: 180 },
			{ name: 'Cable fly', userBodyweight: 195 }
		]
	);
});

test('manual deload halves parent and mini-set targets once using pound increments', () => {
	const exercise: WorkoutExerciseInProgress = {
		name: 'Bench press',
		targetMuscleGroup: 'Chest',
		customMuscleGroup: null,
		bodyweightFraction: null,
		setType: 'Drop',
		repRangeStart: 5,
		repRangeEnd: 12,
		changeType: 'Percentage',
		changeAmount: 20,
		note: null,
		overloadPercentage: null,
		lastSetToFailure: null,
		forceRIRMatching: null,
		minimumWeightChange: 5,
		preferredProgressionVariable: null,
		topRepRangeStart: null,
		topRepRangeEnd: null,
		sets: [
			{
				reps: 11,
				load: 101.25,
				RIR: 3,
				completed: false,
				skipped: false,
				miniSets: [
					{ reps: 5, load: 50.75, RIR: 2, completed: false },
					{ reps: 4, load: 40.5, RIR: 2, completed: false },
					{ reps: 3, load: 30.25, RIR: 2, completed: false }
				]
			},
			{
				reps: 10,
				load: 100.75,
				RIR: 2,
				completed: false,
				skipped: true,
				miniSets: []
			},
			{
				reps: 9,
				load: 100.25,
				RIR: 1,
				completed: false,
				skipped: false,
				miniSets: []
			}
		]
	};
	const original = structuredClone(exercise);

	const deload = applyManualDeload(exercise);

	assert.equal(deload.isDeload, true);
	assert.equal(deload.sets.length, 2);
	assert.deepEqual(
		deload.sets.map(({ reps, load, RIR, skipped }) => ({ reps, load, RIR, skipped })),
		[
			{ reps: 6, load: 50.5, RIR: 3, skipped: false },
			{ reps: 5, load: 50.25, RIR: 2, skipped: true }
		]
	);
	assert.deepEqual(
		deload.sets[0].miniSets.map(({ reps, load, RIR }) => ({ reps, load, RIR })),
		[
			{ reps: 3, load: 25.25, RIR: 2 },
			{ reps: 2, load: 20.25, RIR: 2 }
		]
	);
	assert.deepEqual(applyManualDeload(deload), deload);
	assert.deepEqual(exercise, original);
});

test('manual deload preserves zero loads and clamps positive loads to the minimum pound increment', () => {
	const zeroLoad = applyManualDeload(manualDeloadExercise('Bodyweight movement', 'Chest', { load: 0 }));
	const minimumPositiveLoad = applyManualDeload(manualDeloadExercise('Light cable', 'Chest', { load: 0.25 }));

	assert.equal(zeroLoad.sets[0].load, 0);
	assert.equal(minimumPositiveLoad.sets[0].load, 0.25);
});

test('manual deload targets one exercise or every exercise in a muscle group', () => {
	const workout = [
		manualDeloadExercise('Bench press', 'Chest'),
		manualDeloadExercise('Cable fly', 'Chest'),
		manualDeloadExercise('Curl', 'Biceps'),
		manualDeloadExercise('Scaption', 'Custom', { customMuscleGroup: 'Shoulder health' })
	];

	const exerciseDeload = applyManualDeloadToWorkout(workout, { exerciseName: 'Bench press' });
	const groupDeload = applyManualDeloadToWorkout(workout, { muscleGroup: 'Chest' });
	const customGroupDeload = applyManualDeloadToWorkout(workout, { muscleGroup: 'Shoulder health' });

	assert.deepEqual(
		exerciseDeload.filter((item) => item.isDeload).map((item) => item.name),
		['Bench press']
	);
	assert.deepEqual(
		groupDeload.filter((item) => item.isDeload).map((item) => item.name),
		['Bench press', 'Cable fly']
	);
	assert.deepEqual(
		customGroupDeload.filter((item) => item.isDeload).map((item) => item.name),
		['Scaption']
	);
});

test('muscle-group deload is atomic once any targeted set has started', () => {
	const workout = applyManualDeloadToWorkout(
		[
			manualDeloadExercise('Bench press', 'Chest', { completed: true }),
			manualDeloadExercise('Cable fly', 'Chest', { load: 50 })
		],
		{ muscleGroup: 'Chest' }
	);

	assert.equal(canApplyManualDeloadToWorkout(workout, { muscleGroup: 'Chest' }), false);
	assert.equal(
		workout.some((exercise) => exercise.isDeload),
		false
	);
});

test('reopening completed main or mini sets cannot reset deload eligibility', () => {
	const mainSetExercise = manualDeloadExercise('Bench press', 'Chest');
	markWorkoutExerciseStarted(mainSetExercise);
	mainSetExercise.sets[0].completed = true;
	mainSetExercise.sets[0].completed = false;

	const miniSetExercise = manualDeloadExercise('Cable fly', 'Chest');
	miniSetExercise.sets[0].miniSets.push({ reps: 5, load: 25, RIR: 2, completed: false });
	markWorkoutExerciseStarted(miniSetExercise);
	miniSetExercise.sets[0].miniSets[0].completed = true;
	miniSetExercise.sets[0].miniSets[0].completed = false;

	assert.equal(canApplyManualDeloadToWorkout([mainSetExercise], { exerciseName: 'Bench press' }), false);
	assert.equal(canApplyManualDeloadToWorkout([miniSetExercise], { exerciseName: 'Cable fly' }), false);
});

test('legacy persisted completed sets restore the monotonic started guard', () => {
	const mainSetExercise = manualDeloadExercise('Bench press', 'Chest', { completed: true });
	const miniSetExercise = manualDeloadExercise('Cable fly', 'Chest');
	miniSetExercise.sets[0].miniSets.push({ reps: 5, load: 25, RIR: 2, completed: true });
	delete mainSetExercise.workStarted;
	delete miniSetExercise.workStarted;

	const [normalizedMain, normalizedMini] = normalizePersistedWorkoutExercises([mainSetExercise, miniSetExercise]);
	normalizedMain.sets[0].completed = false;
	normalizedMini.sets[0].miniSets[0].completed = false;

	assert.equal(canApplyManualDeloadToWorkout([normalizedMain], { exerciseName: 'Bench press' }), false);
	assert.equal(canApplyManualDeloadToWorkout([normalizedMini], { exerciseName: 'Cable fly' }), false);
});

test('comparison pairs exclude current deload exercises', () => {
	const current = applyManualDeload(manualDeloadExercise('Bench press', 'Chest'));
	const previous = previousWorkoutExercise('Bench press');

	assert.deepEqual(getComparableWorkoutExercisePairs([current], [previous]), []);
});

test('comparison pairs require a prior normal performance', () => {
	const current = manualDeloadExercise('Bench press', 'Chest');
	const previousDeload = { ...previousWorkoutExercise('Bench press'), isDeload: true };

	assert.deepEqual(getComparableWorkoutExercisePairs([current], [previousDeload]), []);
});

test('comparison pairs retain only normal exercises with a matching prior performance', () => {
	const bench = manualDeloadExercise('Bench press', 'Chest');
	const deloadFly = applyManualDeload(manualDeloadExercise('Cable fly', 'Chest'));
	const unmatchedCurl = manualDeloadExercise('Curl', 'Biceps');
	const previousBench = previousWorkoutExercise('Bench press');

	const pairs = getComparableWorkoutExercisePairs([bench, deloadFly, unmatchedCurl], [previousBench]);

	assert.deepEqual(
		pairs.map(({ currentExercise }) => currentExercise.name),
		['Bench press']
	);
});

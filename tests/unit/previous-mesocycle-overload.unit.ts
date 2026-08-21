import assert from 'node:assert/strict';
import test from 'node:test';
import type { ActiveMesocycleWithProgressionData } from '../../src/lib/trpc/routes/workouts.js';
import {
	getPreviousWorkoutExercisePerformances,
	getProgressionPerformances,
	progressiveOverloadMagic
} from '../../src/lib/utils/workoutUtils.js';

type ProgressionWorkouts = ActiveMesocycleWithProgressionData['workoutsOfMesocycle'];

function set(setIndex: number, reps: number, load: number, options: { skipped?: boolean; RIR?: number } = {}) {
	return {
		id: `set-${setIndex}`,
		workoutExerciseId: 'exercise',
		setIndex,
		reps,
		load,
		RIR: options.RIR ?? 2,
		skipped: options.skipped ?? false,
		miniSets: []
	};
}

function workoutMembership(options: {
	id: string;
	mesocycleId: string;
	splitDayIndex?: number;
	startedAt: string;
	load: number;
	reps?: number;
	templateId?: string | null;
	isDeload?: boolean;
	name?: string;
	userBodyweight?: number;
}): ProgressionWorkouts[number] {
	const name = options.name ?? 'Bench press';
	return {
		id: `${options.id}-membership`,
		workoutId: options.id,
		mesocycleId: options.mesocycleId,
		splitDayIndex: options.splitDayIndex ?? 0,
		workoutStatus: null,
		workout: {
			id: options.id,
			userId: 'user',
			userBodyweight: options.userBodyweight ?? 190,
			startedAt: new Date(options.startedAt),
			endedAt: new Date(options.startedAt),
			note: null,
			workoutExercises: [
				{
					id: `${options.id}-exercise`,
					workoutId: options.id,
					exerciseIndex: 0,
					name,
					targetMuscleGroup: 'Chest',
					customMuscleGroup: null,
					bodyweightFraction: null,
					setType: 'Straight',
					changeType: null,
					changeAmount: null,
					repRangeStart: 5,
					repRangeEnd: 12,
					note: null,
					overloadPercentage: null,
					lastSetToFailure: false,
					forceRIRMatching: false,
					minimumWeightChange: 5,
					preferredProgressionVariable: null,
					repRangeMode: null,
					mesocycleExerciseTemplateId: options.templateId ?? `${options.mesocycleId}-template`,
					topRepRangeStart: null,
					topRepRangeEnd: null,
					isDeload: options.isDeload ?? false,
					sets: [set(0, options.reps ?? 8, options.load)]
				}
			]
		}
	} as ProgressionWorkouts[number];
}

function mesocycleFixture(
	workoutsOfMesocycle: ProgressionWorkouts,
	options: { templateId?: string; sets?: number } = {}
): ActiveMesocycleWithProgressionData {
	const templateId = options.templateId ?? 'new-template';
	return {
		id: 'new-mesocycle',
		name: 'Cloned meso',
		userId: 'user',
		exerciseSplitId: null,
		RIRProgression: [4],
		startDate: new Date('2026-08-01T00:00:00Z'),
		endDate: null,
		startOverloadPercentage: 2.5,
		lastSetToFailure: false,
		forceRIRMatching: false,
		preferredProgressionVariable: 'Reps',
		repRangeMode: 'Fixed',
		mesocycleExerciseSplitDays: [
			{
				id: 'day',
				name: 'Push',
				dayIndex: 0,
				isRestDay: false,
				mesocycleId: 'new-mesocycle',
				mesocycleSplitDayExercises: [
					{
						id: templateId,
						name: 'Bench press',
						exerciseIndex: 0,
						targetMuscleGroup: 'Chest',
						customMuscleGroup: null,
						bodyweightFraction: null,
						sets: options.sets ?? 1,
						setType: 'Straight',
						repRangeStart: 5,
						repRangeEnd: 12,
						changeType: null,
						changeAmount: null,
						note: null,
						mesocycleExerciseSplitDayId: 'day',
						overloadPercentage: null,
						lastSetToFailure: false,
						forceRIRMatching: false,
						minimumWeightChange: 5,
						preferredProgressionVariable: null,
						repRangeMode: null,
						adaptiveRepRangeStart: null,
						adaptiveRepRangeEnd: null,
						adaptiveTopRepRangeStart: null,
						adaptiveTopRepRangeEnd: null,
						adaptiveRepRangeSourceId: null,
						adaptiveTopRepRangeSourceId: null,
						adaptiveRepRangeResetAt: null,
						topRepRangeStart: null,
						topRepRangeEnd: null
					}
				]
			}
		],
		mesocycleCyclicSetChanges: [],
		workoutsOfMesocycle
	} as unknown as ActiveMesocycleWithProgressionData;
}

function suggestedSet(exercise: { sets: { reps?: number; load?: number }[] }) {
	return { reps: exercise.sets[0]?.reps, load: exercise.sets[0]?.load };
}

test('week 1 of a cloned meso uses the last previous-meso performance and the normal overload increment', () => {
	const previousMesocycleWorkouts = [
		workoutMembership({
			id: 'older-previous',
			mesocycleId: 'old-mesocycle',
			startedAt: '2026-06-01T12:00:00Z',
			load: 90,
			reps: 8,
			templateId: 'old-template'
		}),
		workoutMembership({
			id: 'latest-previous',
			mesocycleId: 'old-mesocycle',
			startedAt: '2026-06-22T12:00:00Z',
			load: 100,
			reps: 8,
			templateId: 'old-template'
		})
	];
	const emptyClonedMeso = mesocycleFixture([]);
	const expected = progressiveOverloadMagic(
		mesocycleFixture([previousMesocycleWorkouts[1]], { templateId: 'old-template' }),
		1,
		190,
		0
	)[0];
	const seeded = progressiveOverloadMagic(emptyClonedMeso, 1, 190, 0, previousMesocycleWorkouts)[0];

	assert.deepEqual(suggestedSet(seeded), suggestedSet(expected));
	assert.equal(seeded.sets[0].load, 100);
	assert.notEqual(seeded.sets[0].reps, undefined);
	assert.ok((seeded.sets[0].reps ?? 0) >= 8);
});

test('once the new meso has its own logs, older-meso performances are ignored', () => {
	const olderHeavierPreviousMeso = [
		workoutMembership({
			id: 'previous-heavy',
			mesocycleId: 'old-mesocycle',
			startedAt: '2026-06-22T12:00:00Z',
			load: 200,
			reps: 10,
			templateId: 'old-template'
		})
	];
	const currentMesoWorkouts = [
		workoutMembership({
			id: 'current-week-1',
			mesocycleId: 'new-mesocycle',
			startedAt: '2026-08-01T12:00:00Z',
			load: 105,
			reps: 8,
			templateId: 'new-template'
		})
	];
	const currentMeso = mesocycleFixture(currentMesoWorkouts);
	const withoutOlder = progressiveOverloadMagic(currentMeso, 2, 190, 0)[0];
	const withOlderIgnored = progressiveOverloadMagic(currentMeso, 2, 190, 0, olderHeavierPreviousMeso)[0];

	assert.deepEqual(suggestedSet(withOlderIgnored), suggestedSet(withoutOlder));
	assert.notEqual(withOlderIgnored.sets[0].load, 200);
});

test('previous-meso fallback matches by name even when cloned template ids differ', () => {
	const previousMesocycleWorkouts = [
		workoutMembership({
			id: 'previous',
			mesocycleId: 'old-mesocycle',
			startedAt: '2026-06-22T12:00:00Z',
			load: 115,
			templateId: 'old-template'
		})
	];

	const performances = getProgressionPerformances(
		{ name: 'Bench press', mesocycleExerciseTemplateId: 'new-template' },
		[],
		0,
		previousMesocycleWorkouts
	);

	assert.equal(performances.length, 1);
	assert.equal(performances[0].exercise.sets[0].load, 115);
});

test('previous-meso fallback skips deloads and other split days', () => {
	const previousMesocycleWorkouts = [
		workoutMembership({
			id: 'deload',
			mesocycleId: 'old-mesocycle',
			startedAt: '2026-06-29T12:00:00Z',
			load: 60,
			isDeload: true
		}),
		workoutMembership({
			id: 'other-day',
			mesocycleId: 'old-mesocycle',
			startedAt: '2026-06-30T12:00:00Z',
			load: 185,
			splitDayIndex: 1
		})
	];

	assert.deepEqual(
		getProgressionPerformances(
			{ name: 'Bench press', mesocycleExerciseTemplateId: 'new-template' },
			[],
			0,
			previousMesocycleWorkouts
		),
		[]
	);

	const blank = progressiveOverloadMagic(mesocycleFixture([]), 1, 190, 0, previousMesocycleWorkouts)[0];
	assert.equal(blank.sets[0].load, undefined);
	assert.equal(blank.sets[0].reps, undefined);
});

test('previous workout comparison uses previous-meso data only until this meso has logs', () => {
	const previousMesocycleWorkouts = [
		workoutMembership({
			id: 'previous',
			mesocycleId: 'old-mesocycle',
			startedAt: '2026-06-22T12:00:00Z',
			load: 100,
			userBodyweight: 188,
			templateId: 'old-template'
		})
	];
	const currentMesoWorkouts = [
		workoutMembership({
			id: 'current',
			mesocycleId: 'new-mesocycle',
			startedAt: '2026-08-01T12:00:00Z',
			load: 110,
			userBodyweight: 192,
			templateId: 'new-template'
		})
	];

	const beforeCurrentLogs = getPreviousWorkoutExercisePerformances(
		[{ name: 'Bench press', mesocycleExerciseTemplateId: 'new-template' }],
		[],
		0,
		previousMesocycleWorkouts
	);
	assert.deepEqual(
		beforeCurrentLogs.map(({ name, userBodyweight, sets }) => ({
			name,
			userBodyweight,
			load: sets[0].load
		})),
		[{ name: 'Bench press', userBodyweight: 188, load: 100 }]
	);

	const afterCurrentLogs = getPreviousWorkoutExercisePerformances(
		[{ name: 'Bench press', mesocycleExerciseTemplateId: 'new-template' }],
		currentMesoWorkouts,
		0,
		previousMesocycleWorkouts
	);
	assert.deepEqual(
		afterCurrentLogs.map(({ name, userBodyweight, sets }) => ({
			name,
			userBodyweight,
			load: sets[0].load
		})),
		[{ name: 'Bench press', userBodyweight: 192, load: 110 }]
	);
});

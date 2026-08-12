import assert from 'node:assert/strict';
import test from 'node:test';
import type { ActiveMesocycleWithProgressionData } from '../../src/lib/trpc/routes/workouts.js';
import { getTotalExercisePerformanceChange, progressiveOverloadMagic } from '../../src/lib/utils/workoutUtils.js';
import { normalizeSavedMesocycleState } from '../../src/routes/mesocycles/manage/mesocycleStorage.js';

type ProgressionVariable = 'Reps' | 'Load';
type RepRangeMode = 'Fixed' | 'Adaptive';

type FixtureOptions = {
	mesocyclePreference?: ProgressionVariable;
	exercisePreference?: ProgressionVariable | null;
	mesocycleRepRangeMode?: RepRangeMode;
	exerciseRepRangeMode?: RepRangeMode | null;
	adaptiveRepRangeStart?: number | null;
	adaptiveRepRangeEnd?: number | null;
	adaptiveTopRepRangeStart?: number | null;
	adaptiveTopRepRangeEnd?: number | null;
	setType?: 'Straight' | 'Down' | 'Drop' | 'MyorepMatch' | 'TopBackoff';
	reps?: number[];
	skipped?: boolean[];
	load?: number;
	minimumWeightChange?: number;
	bodyweightFraction?: number | null;
	repRangeStart?: number;
	repRangeEnd?: number;
	startOverloadPercentage?: number;
	topRepRangeStart?: number | null;
	topRepRangeEnd?: number | null;
	changeType?: 'AbsoluteLoad' | 'Percentage' | null;
	changeAmount?: number | null;
	miniSets?: { reps: number; load: number; RIR: number }[];
};

function progressionFixture(options: FixtureOptions = {}): ActiveMesocycleWithProgressionData {
	const reps = options.reps ?? [8];
	const load = options.load ?? 100;
	const setType = options.setType ?? 'Straight';
	const exerciseTemplate = {
		id: 'template',
		name: 'Test lift',
		exerciseIndex: 0,
		targetMuscleGroup: 'Chest' as const,
		customMuscleGroup: null,
		bodyweightFraction: options.bodyweightFraction ?? null,
		sets: reps.length,
		setType,
		repRangeStart: options.repRangeStart ?? 5,
		repRangeEnd: options.repRangeEnd ?? 12,
		changeType: options.changeType ?? null,
		changeAmount: options.changeAmount ?? null,
		note: null,
		mesocycleExerciseSplitDayId: 'day',
		overloadPercentage: null,
		lastSetToFailure: false,
		forceRIRMatching: false,
		minimumWeightChange: options.minimumWeightChange ?? 5,
		topRepRangeStart: options.topRepRangeStart ?? null,
		topRepRangeEnd: options.topRepRangeEnd ?? null,
		preferredProgressionVariable: options.exercisePreference ?? null,
		repRangeMode: options.exerciseRepRangeMode ?? null,
		adaptiveRepRangeStart: options.adaptiveRepRangeStart ?? null,
		adaptiveRepRangeEnd: options.adaptiveRepRangeEnd ?? null,
		adaptiveTopRepRangeStart: options.adaptiveTopRepRangeStart ?? null,
		adaptiveTopRepRangeEnd: options.adaptiveTopRepRangeEnd ?? null,
		adaptiveRepRangeSourceId: null,
		adaptiveTopRepRangeSourceId: null,
		adaptiveRepRangeResetAt: null
	};
	const sets = reps.map((setReps, setIndex) => ({
		id: `set-${setIndex}`,
		workoutExerciseId: 'exercise',
		setIndex,
		reps: setReps,
		load,
		RIR: 0,
		skipped: options.skipped?.[setIndex] ?? false,
		miniSets: (options.miniSets ?? []).map((miniSet, miniSetIndex) => ({
			id: `mini-${setIndex}-${miniSetIndex}`,
			workoutExerciseSetId: `set-${setIndex}`,
			miniSetIndex,
			...miniSet
		}))
	}));

	return {
		id: 'mesocycle',
		name: 'Preference fixture',
		userId: 'user',
		exerciseSplitId: null,
		RIRProgression: [4],
		startDate: new Date('2026-08-01T00:00:00Z'),
		endDate: null,
		startOverloadPercentage: options.startOverloadPercentage ?? 2.5,
		lastSetToFailure: false,
		forceRIRMatching: false,
		preferredProgressionVariable: options.mesocyclePreference ?? 'Reps',
		repRangeMode: options.mesocycleRepRangeMode ?? 'Fixed',
		mesocycleExerciseSplitDays: [
			{
				id: 'day',
				name: 'Push',
				dayIndex: 0,
				isRestDay: false,
				mesocycleId: 'mesocycle',
				mesocycleSplitDayExercises: [exerciseTemplate]
			}
		],
		mesocycleCyclicSetChanges: [],
		workoutsOfMesocycle: [
			{
				id: 'membership',
				workoutId: 'workout',
				mesocycleId: 'mesocycle',
				splitDayIndex: 0,
				workoutStatus: null,
				workout: {
					id: 'workout',
					userId: 'user',
					userBodyweight: 200,
					startedAt: new Date('2026-08-01T12:00:00Z'),
					endedAt: new Date('2026-08-01T13:00:00Z'),
					note: null,
					workoutExercises: [
						{
							...exerciseTemplate,
							id: 'exercise',
							workoutId: 'workout',
							isDeload: false,
							sets
						}
					]
				}
			}
		]
	} as unknown as ActiveMesocycleWithProgressionData;
}

function progress(options: FixtureOptions = {}) {
	return progressiveOverloadMagic(progressionFixture(options), 1, 200, 0)[0];
}

test('the closest total-performance candidate wins before the rep ceiling', () => {
	const loadFirst = progress({ mesocyclePreference: 'Load' });
	const repsFirst = progress({ mesocyclePreference: 'Reps' });

	assert.equal(loadFirst.sets[0].load, 100);
	assert.equal(loadFirst.sets[0].reps, 9);
	assert.equal(repsFirst.sets[0].load, 100);
	assert.equal(repsFirst.sets[0].reps, 9);
});

test('a nullable exercise preference remains inherited without bypassing total-performance selection', () => {
	const inherited = progress({ mesocyclePreference: 'Load', exercisePreference: null });
	assert.equal(inherited.sets[0].load, 100);
	assert.equal(inherited.preferredProgressionVariable, null);
	assert.deepEqual(inherited.manualDeloadMetadata, { sourceTemplateId: 'template', originalSetCount: 1 });
	assert.equal(progress({ mesocyclePreference: 'Load', exercisePreference: 'Reps' }).sets[0].load, 100);
});

test('load progression is one step and rolls back when the candidate violates the lower bound', () => {
	assert.equal(progress({ mesocyclePreference: 'Load', reps: [12] }).sets[0].load, 105);
	assert.equal(progress({ mesocyclePreference: 'Load', minimumWeightChange: 50 }).sets[0].load, 100);
});

test('reps-first trades reps for one load step only after overload allocation crosses the upper bound', () => {
	assert.equal(progress({ mesocyclePreference: 'Reps', reps: [11] }).sets[0].load, 100);
	assert.equal(progress({ mesocyclePreference: 'Reps', reps: [12] }).sets[0].load, 105);
});

test('reps-first uses the total rep ceiling before increasing a straight-set load', () => {
	const belowTotalCeiling = progress({
		mesocyclePreference: 'Reps',
		reps: [13, 8, 8],
		repRangeStart: 5,
		repRangeEnd: 12
	});
	const aboveTotalCeiling = progress({
		mesocyclePreference: 'Reps',
		reps: [13, 12, 12],
		repRangeStart: 5,
		repRangeEnd: 12
	});

	assert.deepEqual(
		belowTotalCeiling.sets.map((set) => set.load),
		[100, 100, 100]
	);
	assert.deepEqual(
		aboveTotalCeiling.sets.map((set) => set.load),
		[105, 105, 105]
	);
});

test('high-rep straight sets progress by total reps instead of taking a premature load jump', () => {
	const result = progress({
		mesocyclePreference: 'Reps',
		reps: [30, 23, 17],
		load: 55,
		minimumWeightChange: 5,
		repRangeStart: 5,
		repRangeEnd: 30
	});

	assert.deepEqual(
		result.sets.map((set) => [set.load, set.reps]),
		[
			[55, 30],
			[55, 25],
			[55, 18]
		]
	);
});

test('the total-ceiling load step remains positive after equivalent reps are rounded', () => {
	const result = progress({
		mesocyclePreference: 'Reps',
		reps: [30, 30, 30],
		load: 55,
		minimumWeightChange: 5,
		repRangeStart: 5,
		repRangeEnd: 30
	});
	const previousSets = progressionFixture({ reps: [30, 30, 30], load: 55 }).workoutsOfMesocycle[0].workout
		.workoutExercises[0].sets;

	assert.deepEqual(
		result.sets.map((set) => set.load),
		[60, 60, 60]
	);
	assert.ok(
		getTotalExercisePerformanceChange(
			previousSets,
			result.sets.map((set) => ({
				reps: set.reps!,
				load: set.load!,
				RIR: set.RIR!,
				miniSets: set.miniSets.map((miniSet) => ({ reps: miniSet.reps!, load: miniSet.load!, RIR: miniSet.RIR! }))
			})),
			200,
			200,
			null,
			null
		) > 0
	);
});

test('load-first rejects a rounded whole-exercise candidate that reduces total performance', () => {
	const result = progress({
		mesocyclePreference: 'Load',
		startOverloadPercentage: 0,
		reps: [8, 8, 8],
		load: 100,
		minimumWeightChange: 5
	});

	assert.deepEqual(
		result.sets.map((set) => [set.load, set.reps]),
		[
			[100, 8],
			[100, 8],
			[100, 8]
		]
	);
});

test('total exercise performance weights all set values instead of averaging set percentages', () => {
	const change = getTotalExercisePerformanceChange(
		[30, 23, 17].map((reps) => ({ reps, load: 55, RIR: 1, miniSets: [] })),
		[
			{ reps: 15, load: 70, RIR: 1, miniSets: [] },
			{ reps: 15, load: 70, RIR: 1, miniSets: [] },
			{ reps: 9, load: 70, RIR: 0, miniSets: [] }
		],
		0,
		0,
		null,
		null
	);

	assert.ok(Math.abs(change - -4.322069689853681) < 0.000001);
});

test('TopBackoff uses its top-set lower bound when checking load feasibility', () => {
	const result = progress({
		mesocyclePreference: 'Load',
		setType: 'TopBackoff',
		reps: [8],
		repRangeStart: 5,
		repRangeEnd: 12,
		topRepRangeStart: 8,
		topRepRangeEnd: 10
	});

	assert.equal(result.sets[0].load, 100);
});

test('different-load set types also wait for the exercise total rep ceiling', () => {
	const result = progress({
		mesocyclePreference: 'Reps',
		setType: 'Down',
		reps: [13, 8, 8],
		repRangeStart: 5,
		repRangeEnd: 12,
		changeType: 'AbsoluteLoad',
		changeAmount: 5
	});

	assert.deepEqual(
		result.sets.map((set) => set.load),
		[100, 100, 100]
	);
});

test('pending adaptive rails stay broad while learned rails constrain load progression', () => {
	const pending = progress({ mesocyclePreference: 'Load', mesocycleRepRangeMode: 'Adaptive', reps: [30] });
	const established = progress({
		mesocyclePreference: 'Load',
		mesocycleRepRangeMode: 'Adaptive',
		adaptiveRepRangeStart: 8,
		adaptiveRepRangeEnd: 12,
		reps: [30]
	});

	assert.equal(pending.repRangeStart, 5);
	assert.equal(pending.repRangeEnd, 30);
	assert.equal(pending.sets[0].load, 105);
	assert.equal(established.repRangeStart, 8);
	assert.equal(established.repRangeEnd, 12);
	assert.equal(established.sets[0].load, 100);
});

test('reps-first uses independently learned TopBackoff rails', () => {
	const result = progress({
		mesocyclePreference: 'Reps',
		mesocycleRepRangeMode: 'Adaptive',
		setType: 'TopBackoff',
		reps: [8, 12],
		adaptiveTopRepRangeStart: 6,
		adaptiveTopRepRangeEnd: 8,
		adaptiveRepRangeStart: 10,
		adaptiveRepRangeEnd: 12,
		topRepRangeStart: 1,
		topRepRangeEnd: 2
	});

	assert.equal(result.topRepRangeStart, 6);
	assert.equal(result.topRepRangeEnd, 8);
	assert.equal(result.repRangeStart, 10);
	assert.equal(result.repRangeEnd, 12);
});

test('same-load MyorepMatch sets and mini sets progress atomically', () => {
	const result = progress({
		mesocyclePreference: 'Load',
		setType: 'MyorepMatch',
		reps: [12, 12],
		miniSets: [{ reps: 4, load: 100, RIR: 0 }]
	});

	assert.deepEqual(
		result.sets.map((set) => set.load),
		[105, 105]
	);
	assert.deepEqual(
		result.sets.flatMap((set) => set.miniSets.map((miniSet) => miniSet.load)),
		[105, 105]
	);
});

test('bodyweight is included when evaluating a load-first candidate', () => {
	const result = progress({
		mesocyclePreference: 'Load',
		load: 0,
		bodyweightFraction: 1,
		minimumWeightChange: 5,
		reps: [8]
	});

	assert.equal(result.sets[0].load, 5);
});

test('a positive load candidate beats a closer negative rep candidate after bodyweight loss', () => {
	const fixture = progressionFixture({
		mesocyclePreference: 'Reps',
		bodyweightFraction: 1,
		load: 0,
		reps: [12],
		repRangeStart: 5,
		repRangeEnd: 12,
		minimumWeightChange: 5
	});
	fixture.workoutsOfMesocycle[0].workout.userBodyweight = 220;

	const result = progressiveOverloadMagic(fixture, 1, 200, 0)[0];
	const previousSet = fixture.workoutsOfMesocycle[0].workout.workoutExercises[0].sets[0];
	const change = getTotalExercisePerformanceChange(
		[previousSet],
		[{ reps: result.sets[0].reps!, load: result.sets[0].load!, RIR: result.sets[0].RIR!, miniSets: [] }],
		220,
		200,
		1,
		1
	);

	assert.ok(change > 0);
});

test('rep optimization crosses multiple negative intermediate candidates to reach positive performance', () => {
	const fixture = progressionFixture({
		mesocyclePreference: 'Reps',
		bodyweightFraction: 1,
		load: 0,
		reps: [8],
		repRangeStart: 5,
		repRangeEnd: 30,
		minimumWeightChange: 100
	});
	fixture.workoutsOfMesocycle[0].workout.userBodyweight = 210;

	const result = progressiveOverloadMagic(fixture, 1, 200, 0)[0];
	assert.ok(result.sets[0].reps! > 8);
	assert.ok(
		getTotalExercisePerformanceChange(
			[fixture.workoutsOfMesocycle[0].workout.workoutExercises[0].sets[0]],
			[{ reps: result.sets[0].reps!, load: result.sets[0].load!, RIR: result.sets[0].RIR!, miniSets: [] }],
			210,
			200,
			1,
			1
		) > 0
	);
});

test('a skipped bodyweight set does not roll back a feasible same-load increase', () => {
	const result = progress({
		mesocyclePreference: 'Load',
		load: 0,
		bodyweightFraction: 1,
		minimumWeightChange: 5,
		reps: [8, 0],
		skipped: [false, true]
	});

	assert.equal(result.sets[0].load, 5);
	assert.equal(result.sets[1].load, undefined);
	assert.equal(result.sets[1].reps, undefined);
});

test('skipped sets do not consume the total rep target', () => {
	const result = progress({
		mesocyclePreference: 'Reps',
		reps: [12, 0, 11],
		skipped: [false, true, false],
		repRangeStart: 5,
		repRangeEnd: 12
	});

	assert.deepEqual(
		result.sets.map((set) => set.reps),
		[12, undefined, 12]
	);
});

test('percentage drop mini-set load stays proportional to its progressed parent', () => {
	const result = progress({
		mesocyclePreference: 'Load',
		setType: 'Drop',
		reps: [12],
		changeType: 'Percentage',
		changeAmount: 20,
		miniSets: [{ reps: 4, load: 80, RIR: 0 }]
	});

	assert.equal(result.sets[0].load, 105);
	assert.equal(result.sets[0].miniSets[0].load, 84);
});

test('legacy saved mesocycles default to reps-first without replacing explicit or nullable preferences', () => {
	const legacy = normalizeSavedMesocycleState({
		mesocycle: { name: 'Legacy' },
		mesocycleExerciseTemplates: [[{ name: 'Inherited' }]]
	});
	const explicit = normalizeSavedMesocycleState({
		mesocycle: { preferredProgressionVariable: 'Load' },
		mesocycleExerciseTemplates: [[{ preferredProgressionVariable: 'Reps' }]]
	});

	assert.equal(legacy.mesocycle.preferredProgressionVariable, 'Reps');
	assert.equal(legacy.mesocycle.repRangeMode, 'Fixed');
	assert.equal(legacy.mesocycleExerciseTemplates?.[0][0].preferredProgressionVariable, null);
	assert.equal(legacy.mesocycleExerciseTemplates?.[0][0].repRangeMode, null);
	assert.equal(legacy.mesocycleExerciseTemplates?.[0][0].adaptiveRepRangeResetAt, null);
	assert.equal(explicit.mesocycle.preferredProgressionVariable, 'Load');
	assert.equal(explicit.mesocycleExerciseTemplates?.[0][0].preferredProgressionVariable, 'Reps');
});

test('legacy preference normalization reads only plain saved objects', () => {
	const inheritedPreference = Object.create({ preferredProgressionVariable: 'Load' }) as object;
	const normalized = normalizeSavedMesocycleState({
		mesocycle: inheritedPreference,
		mesocycleExerciseTemplates: [[inheritedPreference]]
	});

	assert.equal(normalized.mesocycle.preferredProgressionVariable, 'Reps');
	assert.equal(normalized.mesocycleExerciseTemplates[0][0].preferredProgressionVariable, null);
});

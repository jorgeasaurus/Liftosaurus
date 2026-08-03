import assert from 'node:assert/strict';
import test from 'node:test';
import type { ActiveMesocycleWithProgressionData } from '../../src/lib/trpc/routes/workouts.js';
import { progressiveOverloadMagic } from '../../src/lib/utils/workoutUtils.js';
import { normalizeSavedMesocycleState } from '../../src/routes/mesocycles/manage/mesocycleStorage.js';

type ProgressionVariable = 'Reps' | 'Load';

type FixtureOptions = {
	mesocyclePreference?: ProgressionVariable;
	exercisePreference?: ProgressionVariable | null;
	setType?: 'Straight' | 'Drop' | 'MyorepMatch' | 'TopBackoff';
	reps?: number[];
	skipped?: boolean[];
	load?: number;
	minimumWeightChange?: number;
	bodyweightFraction?: number | null;
	repRangeStart?: number;
	repRangeEnd?: number;
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
		preferredProgressionVariable: options.exercisePreference ?? null
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
		startOverloadPercentage: 2.5,
		lastSetToFailure: false,
		forceRIRMatching: false,
		preferredProgressionVariable: options.mesocyclePreference ?? 'Reps',
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

test('load-first takes one feasible load step while reps-first keeps allocating reps', () => {
	const loadFirst = progress({ mesocyclePreference: 'Load' });
	const repsFirst = progress({ mesocyclePreference: 'Reps' });

	assert.equal(loadFirst.sets[0].load, 105);
	assert.equal(repsFirst.sets[0].load, 100);
});

test('a nullable exercise preference inherits the mesocycle and an explicit override wins', () => {
	const inherited = progress({ mesocyclePreference: 'Load', exercisePreference: null });
	assert.equal(inherited.sets[0].load, 105);
	assert.equal(inherited.preferredProgressionVariable, null);
	assert.deepEqual(inherited.manualDeloadMetadata, { sourceTemplateId: 'template', originalSetCount: 1 });
	assert.equal(progress({ mesocyclePreference: 'Load', exercisePreference: 'Reps' }).sets[0].load, 100);
});

test('load progression is one step and rolls back when the candidate violates the lower bound', () => {
	assert.equal(progress({ mesocyclePreference: 'Load', reps: [30] }).sets[0].load, 105);
	assert.equal(progress({ mesocyclePreference: 'Load', minimumWeightChange: 50 }).sets[0].load, 100);
});

test('reps-first trades reps for one load step only after overload allocation crosses the upper bound', () => {
	assert.equal(progress({ mesocyclePreference: 'Reps', reps: [11] }).sets[0].load, 100);
	assert.equal(progress({ mesocyclePreference: 'Reps', reps: [12] }).sets[0].load, 105);
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

test('same-load MyorepMatch sets and mini sets progress atomically', () => {
	const result = progress({
		mesocyclePreference: 'Load',
		setType: 'MyorepMatch',
		reps: [10, 8],
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

test('percentage drop mini-set load stays proportional to its progressed parent', () => {
	const result = progress({
		mesocyclePreference: 'Load',
		setType: 'Drop',
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
	assert.equal(legacy.mesocycleExerciseTemplates?.[0][0].preferredProgressionVariable, null);
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

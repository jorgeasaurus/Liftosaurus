import assert from 'node:assert/strict';
import test from 'node:test';
import {
	learnAdaptiveRepRanges,
	getPendingAdaptiveRepRangeConfirmation,
	matchesAdaptivePerformanceIdentity,
	needsAdaptiveRepRangeConfirmation,
	reconcileAdaptiveRepRanges,
	resolveRepRange
} from '../../src/lib/utils/adaptiveRepRanges.js';

test('legacy adaptive identity matches exercise name only within the original split day', () => {
	const template = { id: 'template-row-a', name: 'Cable row', splitDayIndex: 0 };

	assert.equal(
		matchesAdaptivePerformanceIdentity(template, {
			mesocycleExerciseTemplateId: null,
			exerciseName: 'Cable row',
			splitDayIndex: 0
		}),
		true
	);
	assert.equal(
		matchesAdaptivePerformanceIdentity(template, {
			mesocycleExerciseTemplateId: null,
			exerciseName: 'Cable row',
			splitDayIndex: 1
		}),
		false
	);
	assert.equal(
		matchesAdaptivePerformanceIdentity(template, {
			mesocycleExerciseTemplateId: 'template-row-a',
			exerciseName: 'Renamed row',
			splitDayIndex: 1
		}),
		true
	);
});

test('the first completed working parent set learns a 3-RIR-normalized two-rep band', () => {
	const learned = learnAdaptiveRepRanges({
		setType: 'Straight',
		sets: [
			{ setIndex: 0, reps: 10, RIR: 1, skipped: false },
			{ setIndex: 1, reps: 12, RIR: 3, skipped: false }
		]
	});

	assert.deepEqual(learned, {
		standard: { start: 6, end: 10 },
		top: null
	});
});

test('only pending adaptive parent performances outside 5-30 require confirmation', () => {
	const sets = [
		{ setIndex: 0, reps: 31, RIR: 3, skipped: false },
		{ setIndex: 1, reps: 4, RIR: 3, skipped: true }
	];

	assert.equal(
		needsAdaptiveRepRangeConfirmation({ mode: 'Adaptive', established: false, setType: 'Straight', sets }),
		true
	);
	assert.deepEqual(
		getPendingAdaptiveRepRangeConfirmation({ mode: 'Adaptive', established: false, setType: 'Straight', sets }),
		{ category: 'standard', reps: 31 }
	);
	assert.equal(
		needsAdaptiveRepRangeConfirmation({ mode: 'Adaptive', established: true, setType: 'Straight', sets }),
		false
	);
	assert.equal(
		needsAdaptiveRepRangeConfirmation({ mode: 'Fixed', established: false, setType: 'Straight', sets }),
		false
	);
	assert.equal(
		needsAdaptiveRepRangeConfirmation({
			mode: 'Adaptive',
			established: false,
			setType: 'Straight',
			sets: [
				{ setIndex: 0, reps: 10, RIR: 3, skipped: false },
				{ setIndex: 1, reps: 31, RIR: 3, skipped: false }
			]
		}),
		false
	);
});

test('adaptive ranges use broad pending rails and learned rails without changing fixed defaults', () => {
	const template = {
		repRangeStart: 8,
		repRangeEnd: 12,
		topRepRangeStart: 5,
		topRepRangeEnd: 8,
		adaptiveRepRangeStart: 11,
		adaptiveRepRangeEnd: 15,
		adaptiveTopRepRangeStart: null,
		adaptiveTopRepRangeEnd: null
	};

	assert.deepEqual(resolveRepRange(template, 'Fixed', false), { start: 8, end: 12, status: 'fixed' });
	assert.deepEqual(resolveRepRange(template, 'Adaptive', false), { start: 11, end: 15, status: 'established' });
	assert.deepEqual(resolveRepRange(template, 'Adaptive', true), { start: 5, end: 30, status: 'pending' });
});

test('reconciliation selects the earliest eligible normal workout independently for top and backoff bands', () => {
	const learned = reconcileAdaptiveRepRanges([
		{
			workoutExerciseId: 'rest',
			performedAt: new Date('2026-01-01'),
			setType: 'TopBackoff',
			isDeload: false,
			workoutStatus: 'RestDay',
			sets: [{ setIndex: 0, reps: 20, RIR: 3, skipped: false }]
		},
		{
			workoutExerciseId: 'backoff-source',
			performedAt: new Date('2026-01-02'),
			setType: 'TopBackoff',
			isDeload: false,
			workoutStatus: null,
			sets: [
				{ setIndex: 0, reps: 8, RIR: 2, skipped: true },
				{ setIndex: 1, reps: 14, RIR: 2, skipped: false }
			]
		},
		{
			workoutExerciseId: 'top-source',
			performedAt: new Date('2026-01-03'),
			setType: 'TopBackoff',
			isDeload: false,
			workoutStatus: null,
			sets: [
				{ setIndex: 0, reps: 8, RIR: 2, skipped: false },
				{ setIndex: 1, reps: 30, RIR: 3, skipped: false }
			]
		},
		{
			workoutExerciseId: 'deload',
			performedAt: new Date('2025-12-31'),
			setType: 'TopBackoff',
			isDeload: true,
			workoutStatus: null,
			sets: [{ setIndex: 0, reps: 5, RIR: 3, skipped: false }]
		}
	]);

	assert.deepEqual(learned, {
		standard: { range: { start: 11, end: 15 }, sourceWorkoutExerciseId: 'backoff-source' },
		top: { range: { start: 5, end: 9 }, sourceWorkoutExerciseId: 'top-source' }
	});
});

test('reset ignores every performance completed before the reset boundary', () => {
	const learned = reconcileAdaptiveRepRanges(
		[
			{
				workoutExerciseId: 'before-reset',
				performedAt: new Date('2026-01-01'),
				setType: 'Straight',
				isDeload: false,
				workoutStatus: null,
				sets: [{ setIndex: 0, reps: 10, RIR: 3, skipped: false }]
			},
			{
				workoutExerciseId: 'after-reset',
				performedAt: new Date('2026-01-03'),
				setType: 'Straight',
				isDeload: false,
				workoutStatus: null,
				sets: [{ setIndex: 0, reps: 20, RIR: 3, skipped: false }]
			}
		],
		new Date('2026-01-02')
	);

	assert.equal(learned.standard?.sourceWorkoutExerciseId, 'after-reset');
});

test('changing a template to TopBackoff can learn its top rail without replacing the earlier standard rail', () => {
	const learned = reconcileAdaptiveRepRanges([
		{
			workoutExerciseId: 'straight-source',
			performedAt: new Date('2026-01-01'),
			setType: 'Straight',
			isDeload: false,
			workoutStatus: null,
			sets: [{ setIndex: 0, reps: 10, RIR: 3, skipped: false }]
		},
		{
			workoutExerciseId: 'top-source',
			performedAt: new Date('2026-01-02'),
			setType: 'TopBackoff',
			isDeload: false,
			workoutStatus: null,
			sets: [{ setIndex: 0, reps: 8, RIR: 3, skipped: false }]
		}
	]);

	assert.equal(learned.standard?.sourceWorkoutExerciseId, 'straight-source');
	assert.equal(learned.top?.sourceWorkoutExerciseId, 'top-source');
});

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { selectWorkoutStartData } from '../../src/routes/workouts/manage/start/workoutStartData';

describe('workout start data reconciliation', () => {
	it('keeps a restored cross-tab draft when the deferred default resolves later', async () => {
		let resolveDefault!: (value: { bodyweight: number }) => void;
		const deferredDefault = new Promise<{ bodyweight: number }>((resolve) => {
			resolveDefault = resolve;
		});
		let revision = 0;
		let restoredDraft: { bodyweight: number } | null = null;
		const requestRevision = revision;
		const selectionPromise = deferredDefault.then((defaultWorkoutData) =>
			selectWorkoutStartData({
				defaultWorkoutData,
				restoredWorkoutData: restoredDraft,
				editing: false,
				requestRevision,
				currentRevision: revision,
				appliedRevision: revision
			})
		);

		restoredDraft = { bodyweight: 205 };
		revision += 1;
		resolveDefault({ bodyweight: 180 });

		assert.deepEqual(await selectionPromise, {
			workoutData: { bodyweight: 205 },
			appliedRevision: 1,
			restoredDraft: true
		});
	});

	it('uses the deferred default when no draft revision changed', () => {
		assert.deepEqual(
			selectWorkoutStartData({
				defaultWorkoutData: { bodyweight: 180 },
				restoredWorkoutData: { bodyweight: 205 },
				editing: false,
				requestRevision: 0,
				currentRevision: 0,
				appliedRevision: 0
			}),
			{ workoutData: { bodyweight: 180 }, appliedRevision: 0, restoredDraft: false }
		);
	});

	it('does not label defaults as restored when a revision has no stored draft', () => {
		assert.deepEqual(
			selectWorkoutStartData({
				defaultWorkoutData: { bodyweight: 180 },
				restoredWorkoutData: null,
				editing: false,
				requestRevision: 0,
				currentRevision: 1,
				appliedRevision: 0
			}),
			{ workoutData: { bodyweight: 180 }, appliedRevision: 1, restoredDraft: false }
		);
	});
});

import { expect, test } from './fixtures';
import {
	WORKOUT_DRAFT_RECORD_VERSION,
	workoutDraftStorageKeys
} from '../src/routes/workouts/manage/workoutDraftStorage';

test('completed sets show their rep result relative to the target range after reload', async ({ page, userData }) => {
	const exerciseName = 'Bench press';
	const sets = [13, 10, 4].map((reps) => ({
		reps,
		plannedReps: 10,
		load: 195,
		RIR: 2,
		completed: true,
		skipped: false,
		miniSets: []
	}));
	const keys = workoutDraftStorageKeys(userData.userId);

	await page.goto('/');
	await page.evaluate(
		({ activeKey, modeKey, exerciseName, sets, version }) => {
			localStorage.setItem(
				activeKey,
				JSON.stringify({
					version,
					draft: {
						workoutData: {
							startedAt: '2026-08-07T12:00:00.000Z',
							endedAt: null,
							userBodyweight: 195,
							workoutExercises: [{ name: exerciseName, targetMuscleGroup: 'Chest', customMuscleGroup: null }],
							note: null,
							isLastWorkout: false
						},
						workoutExercises: [
							{
								name: exerciseName,
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
								lastSetToFailure: null,
								forceRIRMatching: null,
								minimumWeightChange: 5,
								topRepRangeStart: null,
								topRepRangeEnd: null,
								isDeload: false,
								workStarted: true,
								sets
							}
						],
						previousWorkoutData: { exercises: [] }
					}
				})
			);
			localStorage.setItem(modeKey, 'active');
		},
		{
			activeKey: keys.active,
			modeKey: keys.mode,
			exerciseName,
			sets,
			version: WORKOUT_DRAFT_RECORD_VERSION
		}
	);

	await page.setViewportSize({ width: 430, height: 800 });
	await page.goto('/workouts/manage/exercises?keepCurrent');

	const statuses = page.getByTestId(/Bench press-set-\d-rep-target-status/);
	await expect(statuses).toHaveCount(3);
	await expect(statuses.nth(0)).toHaveAttribute('aria-label', '1 rep above target range');
	await expect(statuses.nth(1)).toHaveAttribute('aria-label', 'Reps within target range');
	await expect(statuses.nth(2)).toHaveAttribute('aria-label', '1 rep below target range');

	await page.reload();
	await expect(statuses).toHaveCount(3);
	await expect(statuses.nth(0)).toHaveAttribute('aria-label', '1 rep above target range');
	await expect(statuses.nth(1)).toHaveAttribute('aria-label', 'Reps within target range');
	await expect(statuses.nth(2)).toHaveAttribute('aria-label', '1 rep below target range');
});

test('TopBackoff sets use their dedicated top-set target range after reload', async ({ page, userData }) => {
	const exerciseName = 'Top-backoff bench press';
	const sets = [
		{ reps: 6, plannedReps: 10, load: 225, RIR: 2, completed: true, skipped: false, miniSets: [] },
		{ reps: 6, plannedReps: 10, load: 185, RIR: 2, completed: true, skipped: false, miniSets: [] }
	];
	const keys = workoutDraftStorageKeys(userData.userId);

	await page.goto('/');
	await page.evaluate(
		({ activeKey, modeKey, exerciseName, sets, version }) => {
			localStorage.setItem(
				activeKey,
				JSON.stringify({
					version,
					draft: {
						workoutData: {
							startedAt: '2026-08-07T12:00:00.000Z',
							endedAt: null,
							userBodyweight: 195,
							workoutExercises: [{ name: exerciseName, targetMuscleGroup: 'Chest', customMuscleGroup: null }],
							note: null,
							isLastWorkout: false
						},
						workoutExercises: [
							{
								name: exerciseName,
								targetMuscleGroup: 'Chest',
								customMuscleGroup: null,
								bodyweightFraction: null,
								setType: 'TopBackoff',
								changeType: null,
								changeAmount: null,
								repRangeStart: 5,
								repRangeEnd: 12,
								note: null,
								overloadPercentage: null,
								lastSetToFailure: null,
								forceRIRMatching: null,
								minimumWeightChange: 5,
								topRepRangeStart: 8,
								topRepRangeEnd: 10,
								isDeload: false,
								workStarted: true,
								sets
							}
						],
						previousWorkoutData: { exercises: [] }
					}
				})
			);
			localStorage.setItem(modeKey, 'active');
		},
		{
			activeKey: keys.active,
			modeKey: keys.mode,
			exerciseName,
			sets,
			version: WORKOUT_DRAFT_RECORD_VERSION
		}
	);

	await page.setViewportSize({ width: 430, height: 800 });
	await page.goto('/workouts/manage/exercises?keepCurrent');

	const statuses = page.getByTestId(/Top-backoff bench press-set-\d-rep-target-status/);
	await expect(statuses).toHaveCount(2);
	await expect(statuses.nth(0)).toHaveAttribute('aria-label', '2 reps below target range');
	await expect(statuses.nth(1)).toHaveAttribute('aria-label', 'Reps within target range');

	await page.reload();
	await expect(statuses).toHaveCount(2);
	await expect(statuses.nth(0)).toHaveAttribute('aria-label', '2 reps below target range');
	await expect(statuses.nth(1)).toHaveAttribute('aria-label', 'Reps within target range');
});

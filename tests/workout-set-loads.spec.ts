import { expect, test } from './fixtures';
import {
	WORKOUT_DRAFT_RECORD_VERSION,
	workoutDraftStorageKeys
} from '../src/routes/workouts/manage/workoutDraftStorage';

test('allows a later straight-set load to be overridden and persists it', async ({ page, userData }) => {
	const exerciseName = 'Dumbbell lateral raise';
	const keys = workoutDraftStorageKeys(userData.userId);
	const sets = [25, 22, 15, 20].map((reps) => ({
		reps,
		plannedReps: reps,
		load: 40,
		RIR: 1,
		completed: false,
		skipped: false,
		miniSets: []
	}));

	await page.goto('/');
	await page.evaluate(
		({ activeKey, modeKey, exerciseName, sets, version }) => {
			localStorage.setItem(
				activeKey,
				JSON.stringify({
					version,
					draft: {
						workoutData: {
							startedAt: '2026-08-09T12:00:00.000Z',
							endedAt: null,
							userBodyweight: 195,
							workoutExercises: [{ name: exerciseName, targetMuscleGroup: 'SideDelts', customMuscleGroup: null }],
							note: null,
							isLastWorkout: false
						},
						workoutExercises: [
							{
								name: exerciseName,
								targetMuscleGroup: 'SideDelts',
								customMuscleGroup: null,
								bodyweightFraction: null,
								setType: 'Straight',
								changeType: null,
								changeAmount: null,
								repRangeStart: 18,
								repRangeEnd: 26,
								note: null,
								overloadPercentage: null,
								lastSetToFailure: null,
								forceRIRMatching: null,
								minimumWeightChange: 5,
								topRepRangeStart: null,
								topRepRangeEnd: null,
								isDeload: false,
								workStarted: false,
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

	await page.goto('/workouts/manage/exercises?keepCurrent');

	const laterLoad = page.locator('[id="Dumbbell\\ lateral\\ raise-set-2-load"]');
	await expect(laterLoad).toBeEditable();
	await laterLoad.fill('35');
	await page.getByTestId('Dumbbell lateral raise-set-2-action').click();
	await page.reload();
	await expect(laterLoad).toHaveValue('35');
});

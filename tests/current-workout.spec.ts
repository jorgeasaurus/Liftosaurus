import { expect, test } from './fixtures';
import { prisma } from '../src/lib/prisma';
import { createCaller } from '../src/lib/trpc/router';
import { createId } from '@paralleldrive/cuid2';
import {
	WORKOUT_DRAFT_RECORD_VERSION,
	workoutDraftStorageKeys
} from '../src/routes/workouts/manage/workoutDraftStorage';

test('Workout always resumes the active workout directly', async ({ page, userData }) => {
	const keys = workoutDraftStorageKeys(userData.userId);
	const exerciseName = 'Current workout press';

	await page.goto('/');
	await page.evaluate(
		({ activeKey, modeKey, exerciseName, version }) => {
			localStorage.setItem(
				activeKey,
				JSON.stringify({
					version,
					draft: {
						workoutData: {
							startedAt: '2026-08-13T12:00:00.000Z',
							endedAt: null,
							userBodyweight: 195,
							userBodyFat: 18.5,
							workoutExercises: [{ name: exerciseName, targetMuscleGroup: 'Chest', customMuscleGroup: null }],
							note: null,
							isLastWorkout: false
						},
						workoutExercises: [
							{
								name: exerciseName,
								targetMuscleGroup: 'Chest',
								customMuscleGroup: null,
								bodyweightFraction: 1,
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
								workStarted: false,
								sets: [
									{
										load: 135,
										reps: 10,
										RIR: 2,
										completed: true,
										skipped: false,
										miniSets: []
									},
									{
										load: 135,
										reps: 10,
										RIR: 2,
										completed: true,
										skipped: false,
										miniSets: []
									}
								]
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
			version: WORKOUT_DRAFT_RECORD_VERSION
		}
	);

	await page.goto('/workout');

	await expect(page).toHaveURL('/workouts/manage/exercises?keepCurrent&current');
	await expect(page.getByText(exerciseName, { exact: true })).toBeVisible();
	await expect(page.locator(`[id="${exerciseName}-set-1-load"]`)).toHaveValue('135');
	await expect(page.getByRole('link', { name: 'Workout', exact: true })).toHaveAttribute('href', '/workout');

	const load = page.locator(`[id="${exerciseName}-set-1-load"]`);
	const reps = page.locator(`[id="${exerciseName}-set-1-reps"]`);
	const secondLoad = page.locator(`[id="${exerciseName}-set-2-load"]`);
	await expect(load).toBeEditable();
	await expect(reps).toBeEditable();
	await load.fill('0');
	await load.blur();
	await expect(load).toHaveValue('0');
	await load.fill('135.1');
	await load.blur();
	await expect(load).toHaveValue('0');
	await load.fill('140');
	await expect(secondLoad).toHaveValue('135');
	await reps.fill('9');
	await page.waitForFunction((activeKey) => {
		const set = JSON.parse(localStorage.getItem(activeKey) ?? '{}').draft?.workoutExercises?.[0]?.sets?.[0];
		return set?.load === 140 && set?.reps === 9 && set?.completed === true;
	}, keys.active);
	await page.reload();
	await expect(load).toHaveValue('140');
	await expect(reps).toHaveValue('9');

	await page.getByRole('button', { name: 'Finish workout' }).click();
	await expect(page).toHaveURL('/workout', { timeout: 20_000 });
	await expect(page.getByText('No current workout')).toBeVisible();
	await expect.poll(() => prisma.workout.count({ where: { userId: userData.userId } })).toBe(1);
	await expect.poll(() => page.evaluate((activeKey) => localStorage.getItem(activeKey), keys.active)).toBeNull();
});

test('Workout prepares the next planned session with the latest measurements', async ({ page, userData }) => {
	await prisma.workout.create({
		data: {
			userId: userData.userId,
			userBodyweight: 187,
			userBodyFat: 17.25,
			startedAt: new Date('2026-08-12T12:00:00.000Z'),
			endedAt: new Date('2026-08-12T13:00:00.000Z')
		}
	});
	await prisma.mesocycle.create({
		data: {
			name: 'Current plan',
			userId: userData.userId,
			RIRProgression: [3],
			startDate: new Date('2026-08-13T00:00:00.000Z'),
			startOverloadPercentage: 2,
			lastSetToFailure: false,
			forceRIRMatching: false,
			mesocycleExerciseSplitDays: {
				create: {
					name: 'Upper',
					dayIndex: 0,
					isRestDay: false,
					mesocycleSplitDayExercises: {
						create: {
							name: 'Incline press',
							exerciseIndex: 0,
							targetMuscleGroup: 'Chest',
							bodyweightFraction: null,
							setType: 'Straight',
							sets: 2,
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
							topRepRangeEnd: null
						}
					}
				}
			}
		}
	});

	await page.goto('/workout');

	await expect(page).toHaveURL('/workouts/manage/exercises?keepCurrent&current');
	await expect(page.getByText('Incline press', { exact: true })).toBeVisible();
	await expect(page.getByLabel('Bodyweight (lbs)')).toHaveCount(0);
	await page.getByRole('button', { name: 'Session details' }).click();
	await expect(page.getByLabel('Bodyweight (lbs)')).toHaveValue('187');
	await expect(page.getByLabel('Body fat (%) optional')).toHaveValue('17.25');
	await page.getByLabel('Bodyweight (lbs)').fill('');
	await page.getByLabel('Bodyweight (lbs)').blur();
	await expect(page.getByLabel('Bodyweight (lbs)')).toHaveValue('187');
	await page.getByLabel('Body fat (%) optional').fill('101');
	await page.getByLabel('Body fat (%) optional').blur();
	await expect(page.getByLabel('Body fat (%) optional')).toHaveValue('17.25');
	await page.getByLabel('Bodyweight (lbs)').fill('188');
	await page.getByLabel('Bodyweight (lbs)').press('Tab');
	const keys = workoutDraftStorageKeys(userData.userId);
	await expect
		.poll(() =>
			page.evaluate((activeKey) => {
				const data = JSON.parse(localStorage.getItem(activeKey) ?? '{}').draft?.workoutData;
				return [data?.userBodyweight, data?.userBodyFat];
			}, keys.active)
		)
		.toEqual([188, 17.25]);
});

test('concurrent retries finish the same draft only once', async ({ userData }) => {
	const caller = createCaller({ userId: userData.userId, event: null as never });
	const completionId = createId();
	const input = {
		draftOwnerUserId: userData.userId,
		workoutData: { completionId, userBodyweight: 190 },
		workoutExercises: [],
		workoutExercisesSets: [],
		workoutExercisesMiniSets: []
	};

	const results = await Promise.all([caller.workouts.create(input), caller.workouts.create(input)]);

	expect(results.map(({ message }) => message)).toEqual([
		'Workout created successfully',
		'Workout created successfully'
	]);
	await expect(prisma.workout.count({ where: { userId: userData.userId, completionId } })).resolves.toBe(1);
});

test('free workouts accept completion IDs without mesocycle cycle metadata', async ({ userData }) => {
	const caller = createCaller({ userId: userData.userId, event: null as never });
	const completionId = createId();

	await expect(
		caller.workouts.create({
			draftOwnerUserId: userData.userId,
			workoutData: { completionId, userBodyweight: 190 },
			workoutExercises: [],
			workoutExercisesSets: [],
			workoutExercisesMiniSets: []
		})
	).resolves.toMatchObject({ message: 'Workout created successfully' });
	await expect(prisma.workout.count({ where: { userId: userData.userId, completionId } })).resolves.toBe(1);
});

test('reusing a completion ID with different workout data is rejected', async ({ userData }) => {
	const caller = createCaller({ userId: userData.userId, event: null as never });
	const completionId = createId();
	const input = {
		draftOwnerUserId: userData.userId,
		workoutData: { completionId, userBodyweight: 190 },
		workoutExercises: [],
		workoutExercisesSets: [],
		workoutExercisesMiniSets: []
	};

	await caller.workouts.create(input);
	await expect(
		caller.workouts.create({ ...input, workoutData: { ...input.workoutData, userBodyweight: 191 } })
	).rejects.toThrow('Completion ID was already used for different workout data');
	await expect(
		prisma.workout.findUniqueOrThrow({ where: { userId_completionId: { userId: userData.userId, completionId } } })
	).resolves.toMatchObject({ userBodyweight: 190 });
});

test('Workout completes a rest day without leaving the canonical tab', async ({ page, userData }) => {
	await prisma.workout.create({
		data: {
			userId: userData.userId,
			userBodyweight: 190,
			startedAt: new Date('2026-08-12T12:00:00.000Z'),
			endedAt: new Date('2026-08-12T13:00:00.000Z')
		}
	});
	await prisma.mesocycle.create({
		data: {
			name: 'Recovery plan',
			userId: userData.userId,
			RIRProgression: [3],
			startDate: new Date('2026-08-13T00:00:00.000Z'),
			startOverloadPercentage: 2,
			lastSetToFailure: false,
			forceRIRMatching: false,
			mesocycleExerciseSplitDays: { create: { name: 'Rest', dayIndex: 0, isRestDay: true } }
		}
	});

	await page.goto('/workout');
	await expect(page.getByText('Rest day', { exact: true })).toBeVisible();
	await page.getByRole('button', { name: 'Complete rest day' }).click();

	await expect(page).toHaveURL('/workout');
	await expect(page.getByText('Rest day', { exact: true })).toBeVisible();
	await expect
		.poll(() =>
			prisma.workout.count({
				where: { userId: userData.userId, workoutOfMesocycle: { workoutStatus: 'RestDay' } }
			})
		)
		.toBe(1);
});

import type { MuscleGroup } from '@prisma/client';
import { prisma } from '../src/lib/prisma';
import { expect, test } from './fixtures';

const muscleGroups: MuscleGroup[] = ['Calves', 'Quads', 'Hamstrings', 'Biceps', 'Triceps', 'Glutes'];

test('mobile workout actions stay above navigation and incomplete set edits persist', async ({ page, userData }) => {
	await prisma.mesocycle.create({
		data: {
			name: 'Mobile workout start',
			userId: userData.userId,
			RIRProgression: [4],
			startDate: new Date('2026-08-08T00:00:00Z'),
			startOverloadPercentage: 2,
			lastSetToFailure: false,
			forceRIRMatching: false,
			mesocycleExerciseSplitDays: {
				create: {
					name: 'Thursday',
					dayIndex: 0,
					isRestDay: false,
					mesocycleSplitDayExercises: {
						create: muscleGroups.map((targetMuscleGroup, exerciseIndex) => ({
							name: `${targetMuscleGroup} exercise`,
							exerciseIndex,
							targetMuscleGroup,
							bodyweightFraction: null,
							setType: 'Straight',
							sets: 3,
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
						}))
					}
				}
			}
		}
	});

	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/workouts/manage/start');
	await expect(page.getByRole('spinbutton', { name: 'Body fat (%)' })).toBeVisible();
	await expect(page.getByRole('button', { name: 'Next' })).toBeDisabled();
	await page.getByRole('spinbutton', { name: 'Bodyweight (lbs)' }).fill('190');

	const viewport = page.viewportSize();
	expect(viewport).not.toBeNull();
	const nextButton = page.getByRole('button', { name: 'Next' });
	await expect(nextButton).toBeVisible();
	await expect(nextButton).toBeEnabled();
	await page.getByRole('spinbutton', { name: 'Body fat (%)' }).fill('18.5');
	const buttonBounds = await nextButton.boundingBox();
	expect(buttonBounds).not.toBeNull();
	expect(buttonBounds!.y + buttonBounds!.height).toBeLessThanOrEqual(viewport!.height);
	const navigation = page.getByRole('navigation', { name: 'Primary navigation' });
	await expect(navigation).toBeVisible();
	const navigationBounds = await navigation.boundingBox();
	expect(navigationBounds).not.toBeNull();
	expect(buttonBounds!.y + buttonBounds!.height).toBeLessThanOrEqual(navigationBounds!.y);
	await expect(navigation.getByRole('link', { name: 'Workout', exact: true })).toHaveAttribute('aria-current', 'page');

	await page.getByLabel('Bodyweight (lbs)').fill('195');
	await nextButton.click();
	await expect(page).toHaveURL(/\/workouts\/manage\/exercises/);
	await expect(page.getByTestId('next-set-guidance')).toContainText('Calves exercise');

	const loadInput = page.locator('input[id$="-set-1-load"]').first();
	const repsInput = page.locator('input[id$="-set-1-reps"]').first();
	const rirInput = page.getByLabel('RIR').first();
	await loadInput.fill('80');
	await repsInput.fill('10');
	await rirInput.evaluate((input: HTMLInputElement) => {
		input.value = '2';
		input.dispatchEvent(new Event('input', { bubbles: true }));
	});
	await navigation.getByRole('link', { name: 'History', exact: true }).click();
	await expect(page).toHaveURL('/workouts');
	await expect(navigation.getByRole('link', { name: 'Workout', exact: true })).toHaveAttribute('href', '/workout');
	await navigation.getByRole('link', { name: 'Workout', exact: true }).click();
	await expect(page).toHaveURL('/workouts/manage/exercises?keepCurrent&current');
	await expect(page.locator('input[id$="-set-1-load"]').first()).toHaveValue('80');
	await expect(page.locator('input[id$="-set-1-reps"]').first()).toHaveValue('10');
	await expect(page.getByLabel('RIR').first()).toHaveValue('2');

	const setActionBounds = await page.getByTestId('Calves exercise-set-1-action').boundingBox();
	expect(setActionBounds).not.toBeNull();
	expect(setActionBounds!.height).toBeGreaterThanOrEqual(44);
	expect(setActionBounds!.width).toBeGreaterThanOrEqual(44);

	await page.reload();
	await expect(page.locator('input[id$="-set-1-load"]').first()).toHaveValue('80');
	await expect(page.locator('input[id$="-set-1-reps"]').first()).toHaveValue('10');
	await expect(page.getByLabel('RIR').first()).toHaveValue('2');
});

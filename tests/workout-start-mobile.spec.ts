import type { MuscleGroup } from '@prisma/client';
import { prisma } from '../src/lib/prisma';
import { expect, test } from './fixtures';

const muscleGroups: MuscleGroup[] = ['Calves', 'Quads', 'Hamstrings', 'Biceps', 'Triceps', 'Glutes'];

test('next button is fully visible when the mobile workout start page opens', async ({ page, userData }) => {
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

	const nextButton = page.getByRole('button', { name: 'Next' });
	await expect(nextButton).toBeVisible();
	const buttonBounds = await nextButton.boundingBox();
	expect(buttonBounds).not.toBeNull();
	expect(buttonBounds!.y + buttonBounds!.height).toBeLessThanOrEqual(844);
});

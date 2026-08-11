import type { MuscleGroup } from '@prisma/client';
import { prisma } from '../src/lib/prisma';
import { expect, test } from './fixtures';

const exercises: { name: string; targetMuscleGroup: MuscleGroup }[] = [
	{ name: 'Cable Overhead Triceps Extension (Rope)', targetMuscleGroup: 'Triceps' },
	{ name: 'Hanging Straight Leg Raise', targetMuscleGroup: 'Abs' }
];

test('today workout card stays within a narrow mobile viewport', async ({ page, userData }) => {
	await prisma.mesocycle.create({
		data: {
			name: 'Mobile dashboard layout',
			userId: userData.userId,
			RIRProgression: [3],
			startDate: new Date('2026-08-10T00:00:00.000Z'),
			startOverloadPercentage: 2,
			lastSetToFailure: false,
			forceRIRMatching: false,
			mesocycleExerciseSplitDays: {
				create: {
					name: 'Today',
					dayIndex: 0,
					isRestDay: false,
					mesocycleSplitDayExercises: {
						create: exercises.map((exercise, exerciseIndex) => ({
							...exercise,
							exerciseIndex,
							bodyweightFraction: null,
							setType: 'Straight',
							sets: 3,
							changeType: null,
							changeAmount: null,
							repRangeStart: 8,
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
	await page.goto('/dashboard');
	await expect(page.getByRole('button', { name: 'Start workout' })).toBeVisible();

	const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
	expect(overflow).toBe(false);

	const viewport = page.viewportSize();
	expect(viewport).not.toBeNull();
	const rows = page.locator('ol > li');
	await expect(rows).toHaveCount(exercises.length);
	for (const row of await rows.all()) {
		const bounds = await row.boundingBox();
		expect(bounds).not.toBeNull();
		expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(viewport!.width);
	}
});

import { prisma } from '../src/lib/prisma';
import { expect, test } from './fixtures';

test('completed workout exercises remain visible on mobile', async ({ page, userData }) => {
	const exerciseName = 'Mobile detail bench press';
	const workout = await prisma.workout.create({
		data: {
			userId: userData.userId,
			userBodyweight: 185,
			startedAt: new Date('2026-08-10T12:00:00Z'),
			endedAt: new Date('2026-08-10T13:00:00Z'),
			workoutExercises: {
				create: {
					exerciseIndex: 0,
					name: exerciseName,
					targetMuscleGroup: 'Chest',
					bodyweightFraction: null,
					setType: 'Straight',
					repRangeStart: 8,
					repRangeEnd: 12,
					sets: {
						create: { setIndex: 0, reps: 10, load: 135, RIR: 2, skipped: false }
					}
				}
			}
		}
	});
	const consoleErrors: string[] = [];
	page.on('console', (message) => {
		if (message.type() === 'error') consoleErrors.push(message.text());
	});

	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto(`/workouts/${workout.id}`);
	const exercisesTab = page.getByRole('tab', { name: 'Exercises' });
	await exercisesTab.click();

	await expect(exercisesTab).toHaveAttribute('data-state', 'active');
	await expect(page.getByRole('tabpanel')).toBeVisible();
	await expect(page.getByText(exerciseName, { exact: true })).toBeAttached();
	expect(consoleErrors).toEqual([]);
	await expect(page.getByText(exerciseName, { exact: true })).toBeVisible();
});

test('completed workout without exercises shows an explanatory empty state', async ({ page, userData }) => {
	const workout = await prisma.workout.create({
		data: {
			userId: userData.userId,
			userBodyweight: 185,
			startedAt: new Date('2026-08-10T12:00:00Z'),
			endedAt: new Date('2026-08-10T13:00:00Z')
		}
	});

	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto(`/workouts/${workout.id}`);
	await page.getByRole('tab', { name: 'Exercises' }).click();

	await expect(page.getByText('No exercises were recorded for this workout.')).toBeVisible();
	await expect(page.getByRole('heading', { name: 'View workout' }).getByRole('button')).toHaveCount(0);
});

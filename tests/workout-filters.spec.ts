import { prisma } from '../src/lib/prisma';
import { expect, test } from './fixtures';

test('workout status filters preserve distinct none-selected and all-selected states', async ({ page, userData }) => {
	await prisma.workout.create({
		data: {
			userId: userData.userId,
			userBodyweight: 180,
			startedAt: new Date('2026-08-01T12:00:00Z'),
			endedAt: new Date('2026-08-01T13:00:00Z')
		}
	});

	await page.goto('/workouts');
	const filterButton = page.getByLabel('search');
	await filterButton.click();
	await page.getByLabel('Normal').click();
	await page.getByLabel('Skipped').click();
	await page.getByLabel('RestDay').click();
	await page.getByRole('button', { name: 'Apply filters' }).click();

	await expect(page).toHaveURL(/selectedWorkoutStatuses=%5B%5D/);
	await expect(filterButton).toContainText('1 active');

	await filterButton.click();
	await page.getByLabel('Normal').click();
	await page.getByLabel('Skipped').click();
	await page.getByLabel('RestDay').click();
	await page.getByRole('button', { name: 'Apply filters' }).click();

	await expect(page).not.toHaveURL(/selectedWorkoutStatuses/);
	await expect(filterButton).not.toContainText('active');
});

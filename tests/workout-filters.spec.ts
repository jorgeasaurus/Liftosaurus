import { prisma } from '../src/lib/prisma';
import { expect, test } from './fixtures';

test.use({ locale: 'en-US' });

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
	const filterButton = page.getByLabel('Filter workouts');
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

test('quick workout filters update status without clearing other filters', async ({ page, userData }) => {
	const mesocycle = await prisma.mesocycle.create({
		data: {
			name: 'Quick filter mesocycle',
			userId: userData.userId,
			RIRProgression: [3],
			startDate: new Date('2026-07-01T00:00:00Z'),
			startOverloadPercentage: 2,
			lastSetToFailure: false,
			forceRIRMatching: false,
			mesocycleExerciseSplitDays: {
				create: [
					{ name: 'Training', dayIndex: 0, isRestDay: false },
					{ name: '', dayIndex: 1, isRestDay: true }
				]
			}
		}
	});
	await prisma.workout.create({
		data: {
			userId: userData.userId,
			userBodyweight: 180,
			startedAt: new Date('2026-08-01T12:00:00Z'),
			endedAt: new Date('2026-08-01T13:00:00Z')
		}
	});
	await prisma.workout.create({
		data: {
			userId: userData.userId,
			userBodyweight: 180,
			startedAt: new Date('2026-08-02T12:00:00Z'),
			endedAt: new Date('2026-08-02T13:00:00Z'),
			workoutOfMesocycle: {
				create: { mesocycleId: mesocycle.id, splitDayIndex: 0, workoutStatus: 'Skipped' }
			}
		}
	});
	await prisma.workout.create({
		data: {
			userId: userData.userId,
			userBodyweight: 180,
			startedAt: new Date('2026-08-03T12:00:00Z'),
			endedAt: new Date('2026-08-03T13:00:00Z'),
			workoutOfMesocycle: {
				create: { mesocycleId: mesocycle.id, splitDayIndex: 1, workoutStatus: 'RestDay' }
			}
		}
	});

	await page.goto('/workouts?startDate=2026-08-01');
	await expect(page.getByRole('group', { name: 'Quick workout filters' })).toBeVisible();
	await page.getByRole('button', { name: 'Normal', exact: true }).click();

	await expect(page).toHaveURL(/startDate=2026-08-01/);
	await expect(page).toHaveURL(/selectedWorkoutStatuses=%5Bnull%5D/);
	await expect(page.getByRole('button', { name: 'Normal', exact: true })).toHaveAttribute('aria-pressed', 'true');
	await expect(page.getByText('August 01')).toBeVisible();
	await expect(page.getByText('August 02')).toHaveCount(0);
	await expect(page.getByText('August 03')).toHaveCount(0);

	await page.getByRole('button', { name: 'Skipped', exact: true }).click();
	await expect(page).toHaveURL(/selectedWorkoutStatuses=%5B%22Skipped%22%5D/);
	await expect(page).toHaveURL(/startDate=2026-08-01/);
	await expect(page.getByText('August 01')).toHaveCount(0);
	await expect(page.getByText('August 02')).toBeVisible();
	await expect(page.getByText('August 03')).toHaveCount(0);

	await page.getByRole('button', { name: 'Rest', exact: true }).click();
	await expect(page).toHaveURL(/startDate=2026-08-01/);
	await expect(page.getByText('August 01')).toHaveCount(0);
	await expect(page.getByText('August 02')).toHaveCount(0);
	await expect(page.getByText('August 03')).toBeVisible();
	await page.getByLabel('Filter workouts').click();
	await expect(page.getByLabel('Normal')).not.toBeChecked();
	await expect(page.getByLabel('Skipped')).not.toBeChecked();
	await expect(page.getByLabel('RestDay')).toBeChecked();
	await page.getByRole('button', { name: 'Apply filters' }).click();
	await expect(page).toHaveURL(/selectedWorkoutStatuses=%5B%22RestDay%22%5D/);

	await page.getByRole('button', { name: 'All', exact: true }).click();
	await expect(page).not.toHaveURL(/selectedWorkoutStatuses/);
	await expect(page).toHaveURL(/startDate=2026-08-01/);
	await expect(page.getByText('August 01')).toBeVisible();
	await expect(page.getByText('August 02')).toBeVisible();
	await expect(page.getByText('August 03')).toBeVisible();
	await expect(page.getByRole('button', { name: 'All', exact: true })).toHaveAttribute('aria-pressed', 'true');
});

test('quick filters discard an older workout response after the filter changes', async ({ page, userData }) => {
	const mesocycle = await prisma.mesocycle.create({
		data: {
			name: 'Stale response mesocycle',
			userId: userData.userId,
			RIRProgression: [3],
			startDate: new Date('2026-07-01T00:00:00Z'),
			startOverloadPercentage: 2,
			lastSetToFailure: false,
			forceRIRMatching: false,
			mesocycleExerciseSplitDays: { create: { name: 'Training', dayIndex: 0, isRestDay: false } }
		}
	});
	await prisma.workout.createMany({
		data: [
			{
				userId: userData.userId,
				userBodyweight: 180,
				startedAt: new Date('2026-08-01T12:00:00Z'),
				endedAt: new Date('2026-08-01T13:00:00Z')
			},
			{
				userId: userData.userId,
				userBodyweight: 180,
				startedAt: new Date('2026-08-02T12:00:00Z'),
				endedAt: new Date('2026-08-02T13:00:00Z')
			}
		]
	});
	const skippedWorkout = await prisma.workout.findFirstOrThrow({
		where: { userId: userData.userId, startedAt: new Date('2026-08-02T12:00:00Z') }
	});
	await prisma.workoutOfMesocycle.create({
		data: {
			workoutId: skippedWorkout.id,
			mesocycleId: mesocycle.id,
			splitDayIndex: 0,
			workoutStatus: 'Skipped'
		}
	});

	let releaseInitialResponse!: () => void;
	let initialResponseCaptured!: () => void;
	const initialResponseGate = new Promise<void>((resolve) => (releaseInitialResponse = resolve));
	const initialResponseWasCaptured = new Promise<void>((resolve) => (initialResponseCaptured = resolve));
	let requestCount = 0;
	await page.route(
		(url) => url.href.includes('workouts.load'),
		async (route) => {
			requestCount += 1;
			if (requestCount !== 1) {
				await route.continue();
				return;
			}

			const staleResponse = await route.fetch();
			initialResponseCaptured();
			await initialResponseGate;
			await route.fulfill({ response: staleResponse });
		}
	);

	try {
		await page.goto('/workouts');
		await initialResponseWasCaptured;
		await page.getByRole('button', { name: 'Skipped', exact: true }).click();
		await expect(page).toHaveURL(/selectedWorkoutStatuses=%5B%22Skipped%22%5D/);
		await expect(page.getByText('August 02')).toBeVisible();

		releaseInitialResponse();
		await expect(page.getByText('August 01')).toHaveCount(0);
		await expect(page.getByText('August 02')).toHaveCount(1);
	} finally {
		releaseInitialResponse();
		await page.unrouteAll({ behavior: 'wait' });
	}
});

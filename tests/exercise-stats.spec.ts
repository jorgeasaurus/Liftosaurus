import { createId } from '@paralleldrive/cuid2';
import { prisma } from '../src/lib/prisma';
import { expect, test } from './fixtures';

const exerciseName = 'Chart history press';

function workoutData(userId: string, performanceIndex: number) {
	const startedAt =
		performanceIndex === 1 || performanceIndex === 2
			? new Date('2026-01-03T12:00:00.000Z')
			: new Date(2026, 0, performanceIndex + 1, 12);
	return {
		userId,
		startedAt,
		endedAt: new Date(startedAt.getTime() + 60 * 60 * 1000),
		userBodyweight: 190,
		workoutExercises: {
			create: {
				exerciseIndex: 0,
				name: exerciseName,
				targetMuscleGroup: 'Chest' as const,
				bodyweightFraction: performanceIndex === 51 ? 0.5 : null,
				setType: 'Straight' as const,
				repRangeStart: 5,
				repRangeEnd: 10,
				sets: {
					create: {
						setIndex: 0,
						reps: 8,
						load: 100 + performanceIndex,
						RIR: 2,
						skipped: false
					}
				}
			}
		}
	};
}

test('loads complete chart history independently from paginated performance cards', async ({ page, userData }) => {
	const otherUserId = createId();
	await prisma.$transaction([
		...Array.from({ length: 52 }, (_, performanceIndex) =>
			prisma.workout.create({ data: workoutData(userData.userId, performanceIndex) })
		),
		prisma.user.create({
			data: {
				id: otherUserId,
				email: `test-user-${otherUserId}@Liftosaurus.com`
			}
		}),
		prisma.workout.create({ data: workoutData(otherUserId, 20) })
	]);

	try {
		let chartRequestCount = 0;
		let successfulChartRequestCount = 0;
		let failNextChartRequest = true;
		page.on('response', (response) => {
			if (response.url().includes('workouts.getExerciseChartHistory') && response.ok()) {
				successfulChartRequestCount += 1;
			}
		});
		await page.route(
			(url) => url.href.includes('workouts.getExerciseChartHistory'),
			async (route) => {
				chartRequestCount += 1;
				if (failNextChartRequest) {
					failNextChartRequest = false;
					await route.fulfill({ status: 503, body: 'chart temporarily unavailable' });
					return;
				}
				await route.continue();
			}
		);

		await page.goto('/exercise-stats');
		await page.getByRole('main').getByRole('combobox').click();
		const exerciseSearch = page.getByPlaceholder('Type here');
		await exerciseSearch.fill(exerciseName);
		const exerciseOption = page.getByRole('option', { name: exerciseName, exact: true });
		await expect(exerciseOption).toBeVisible();
		await exerciseOption.dispatchEvent('click');

		await expect(page.getByTestId('exercise-performance-card')).toHaveCount(10);
		expect(chartRequestCount).toBe(0);

		await page.getByRole('button', { name: 'Show progression chart' }).click();
		await expect(page.getByRole('alert')).toContainText('Could not load chart history.');
		await expect(page.getByTestId('exercise-performance-card')).toHaveCount(10);
		expect(chartRequestCount).toBe(1);

		await page.getByRole('button', { name: 'Retry chart' }).click();
		await expect(page.getByText('52 performances', { exact: true })).toBeVisible();
		await expect(page.getByRole('img', { name: `${exerciseName} relative overload progression chart` })).toBeVisible();
		const chartTable = page.getByRole('table', {
			name: `${exerciseName} relative overload progression chart data`
		});
		await expect(chartTable).toBeAttached();
		const performanceIds = await chartTable
			.locator('tbody tr')
			.evaluateAll((rows) => rows.map((row) => row.getAttribute('data-performance-id')));
		expect(performanceIds).toHaveLength(52);
		expect(new Set(performanceIds).size).toBe(52);
		expect(chartRequestCount).toBe(3);
		expect(successfulChartRequestCount).toBe(2);

		await page.getByRole('main').evaluate((main) => main.scrollTo(0, main.scrollHeight));
		await expect(page.getByTestId('exercise-performance-card')).toHaveCount(20);
		await expect(chartTable.locator('tbody tr')).toHaveCount(52);

		await page.getByLabel('Menu').click();
		await expect(page.getByLabel('Load + BW')).toBeVisible();
		await page.getByLabel('Load + BW').click();
		await expect(
			page.getByRole('img', { name: `${exerciseName} load plus bodyweight progression chart` })
		).toBeVisible();

		await page.keyboard.press('Escape');
		await page.getByRole('button', { name: 'Filter exercises' }).click();
		await page.getByRole('button', { name: 'Jan 1, 2026 - Feb 21, 2026' }).click();
		await page.locator('[data-value="2026-01-01"]').click();
		await page.locator('[data-value="2026-01-31"]').click();
		await expect(page.getByRole('img', { name: `${exerciseName} absolute load progression chart` })).toBeVisible();
		await page.keyboard.press('Escape');
		await page.keyboard.press('Escape');
		await page.getByLabel('Menu').click();
		await expect(page.getByRole('radio', { name: 'Absolute load' })).toBeChecked();
		await expect(page.getByLabel('Load + BW')).toHaveCount(0);
		await page.keyboard.press('Escape');

		await page.evaluate(() => window.scrollTo(0, 0));
		await page.getByRole('main').getByRole('combobox').click();
		await exerciseSearch.fill(exerciseName);
		await expect(exerciseOption).toBeVisible();
		await exerciseOption.dispatchEvent('click');
		await expect(page.getByTestId('exercise-performance-card')).toHaveCount(10);
		expect(chartRequestCount).toBe(3);
		expect(successfulChartRequestCount).toBe(2);
	} finally {
		await prisma.user.delete({ where: { id: otherUserId } });
	}
});

test('late initial card history cannot narrow already loaded chart history', async ({ page, userData }) => {
	await prisma.$transaction(
		Array.from({ length: 30 }, (_, performanceIndex) =>
			prisma.workout.create({ data: workoutData(userData.userId, performanceIndex) })
		)
	);

	let releaseCardHistory!: () => void;
	const cardHistoryGate = new Promise<void>((resolve) => (releaseCardHistory = resolve));
	await page.route(
		(url) => url.href.includes('workouts.getExerciseHistory'),
		async (route) => {
			await cardHistoryGate;
			await route.continue();
		}
	);

	try {
		await page.goto('/exercise-stats');
		await page.getByRole('main').getByRole('combobox').click();
		await page.getByPlaceholder('Type here').fill(exerciseName);
		await page.getByRole('option', { name: exerciseName, exact: true }).dispatchEvent('click');

		await page.getByRole('button', { name: 'Show progression chart' }).click();
		const chartTable = page.getByRole('table', {
			name: `${exerciseName} relative overload progression chart data`
		});
		await expect(chartTable.locator('tbody tr')).toHaveCount(30);

		releaseCardHistory();
		await expect(page.getByTestId('exercise-performance-card')).toHaveCount(10);
		await expect(chartTable.locator('tbody tr')).toHaveCount(30);
	} finally {
		releaseCardHistory();
	}
});

test('allows chart filtering when card history fails independently', async ({ page, userData }) => {
	await prisma.$transaction(
		Array.from({ length: 2 }, (_, performanceIndex) =>
			prisma.workout.create({ data: workoutData(userData.userId, performanceIndex) })
		)
	);
	await page.route(
		(url) => url.href.includes('workouts.getExerciseHistory'),
		(route) => route.fulfill({ status: 503, body: 'performance history temporarily unavailable' })
	);

	await page.goto('/exercise-stats');
	await page.getByRole('main').getByRole('combobox').click();
	await page.getByPlaceholder('Type here').fill(exerciseName);
	await page.getByRole('option', { name: exerciseName, exact: true }).dispatchEvent('click');
	await expect(page.getByRole('alert')).toContainText('Could not load performance history.');

	await page.getByRole('button', { name: 'Show progression chart' }).click();
	await expect(page.getByText('2 performances', { exact: true })).toBeVisible();
	const filterButton = page.getByRole('button', { name: 'Filter exercises' });
	await expect(filterButton).toBeEnabled();
	await filterButton.click();
	await expect(page.getByText('Filter by date', { exact: true })).toBeVisible();
});

test('owns a performance-history retry before remounting pagination', async ({ page, userData }) => {
	await prisma.$transaction(
		Array.from({ length: 15 }, (_, performanceIndex) =>
			prisma.workout.create({ data: workoutData(userData.userId, performanceIndex) })
		)
	);

	let cardRequestCount = 0;
	let releaseRetry!: () => void;
	let retryStarted!: () => void;
	const retryGate = new Promise<void>((resolve) => (releaseRetry = resolve));
	const retryRequestStarted = new Promise<void>((resolve) => (retryStarted = resolve));
	await page.route(
		(url) => url.href.includes('workouts.getExerciseHistory'),
		async (route) => {
			cardRequestCount += 1;
			if (cardRequestCount === 1) {
				await route.fulfill({ status: 503, body: 'performance history temporarily unavailable' });
				return;
			}
			if (cardRequestCount === 2) {
				retryStarted();
				await retryGate;
			}
			await route.continue();
		}
	);

	try {
		await page.goto('/exercise-stats');
		await page.getByRole('main').getByRole('combobox').click();
		await page.getByPlaceholder('Type here').fill(exerciseName);
		await page.getByRole('option', { name: exerciseName, exact: true }).dispatchEvent('click');
		await expect(page.getByRole('alert')).toContainText('Could not load performance history.');

		await page.getByRole('button', { name: 'Retry performances' }).click();
		await retryRequestStarted;
		await expect(page.getByRole('status')).toContainText('Loading performance history.');
		expect(cardRequestCount).toBe(2);

		releaseRetry();
		await expect(page.getByTestId('exercise-performance-card')).toHaveCount(10);
		await page.evaluate(
			() =>
				new Promise<void>((resolve) =>
					requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))
				)
		);
		expect(cardRequestCount).toBe(2);

		await page.getByRole('main').evaluate((main) => main.scrollTo(0, main.scrollHeight));
		await expect(page.getByTestId('exercise-performance-card')).toHaveCount(15);
		expect(cardRequestCount).toBe(3);
	} finally {
		releaseRetry();
	}
});

test.describe('local calendar date filtering', () => {
	test.use({ timezoneId: 'America/Los_Angeles' });

	test('keeps a UTC-midnight workout on its displayed local day', async ({ page, userData }) => {
		const startedAt = new Date('2026-08-03T03:30:00.000Z');
		await prisma.workout.create({
			data: {
				...workoutData(userData.userId, 0),
				startedAt,
				endedAt: new Date(startedAt.getTime() + 60 * 60 * 1000)
			}
		});

		await page.goto('/exercise-stats');
		await page.getByRole('main').getByRole('combobox').click();
		await page.getByPlaceholder('Type here').fill(exerciseName);
		await page.getByRole('option', { name: exerciseName, exact: true }).dispatchEvent('click');
		await expect(page.getByTestId('exercise-performance-card')).toContainText('8/2/2026');

		await page.getByRole('button', { name: 'Show progression chart' }).click();
		const chartTable = page.getByRole('table', {
			name: `${exerciseName} relative overload progression chart data`
		});
		await expect(chartTable.locator('tbody tr')).toHaveCount(1);
		await expect(chartTable.locator('tbody tr')).toContainText('8/2/2026');

		await page.getByRole('button', { name: 'Filter exercises' }).click();
		const dateRangeButton = page.getByRole('button', { name: 'Aug 2, 2026 - Aug 2, 2026' });
		await expect(dateRangeButton).toBeVisible();
		await dateRangeButton.click();
		await page.locator('[data-value="2026-08-01"]').click();
		await page.locator('[data-value="2026-08-02"]').click();
		await expect(chartTable.locator('tbody tr')).toHaveCount(1);
		await expect(page.getByTestId('exercise-performance-card')).toHaveCount(1);
	});
});

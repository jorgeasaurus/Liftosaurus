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

test('changes only exact-name historical performances for the authenticated user to a built-in muscle group', async ({
	page,
	userData
}) => {
	const otherUserId = createId();
	let mutationRequestCount = 0;
	page.on('request', (request) => {
		if (request.url().includes('users.updateHistoricalExerciseMuscleGroup')) mutationRequestCount += 1;
	});
	await prisma.$transaction([
		prisma.workout.create({ data: workoutData(userData.userId, 0) }),
		prisma.workout.create({
			data: {
				...workoutData(userData.userId, 1),
				workoutExercises: {
					create: {
						...workoutData(userData.userId, 1).workoutExercises.create,
						targetMuscleGroup: 'Custom',
						customMuscleGroup: 'Pressing'
					}
				}
			}
		}),
		prisma.workout.create({
			data: {
				...workoutData(userData.userId, 2),
				workoutExercises: {
					create: { ...workoutData(userData.userId, 2).workoutExercises.create, name: exerciseName.toLowerCase() }
				}
			}
		}),
		prisma.user.create({ data: { id: otherUserId, email: `test-user-${otherUserId}@Liftosaurus.com` } }),
		prisma.workout.create({
			data: {
				...workoutData(otherUserId, 3),
				workoutExercises: {
					create: {
						...workoutData(otherUserId, 3).workoutExercises.create,
						targetMuscleGroup: 'Custom',
						customMuscleGroup: 'Other tenant'
					}
				}
			}
		})
	]);

	try {
		await page.goto('/exercise-stats');
		await page.getByRole('main').getByRole('combobox').click();
		await page.getByPlaceholder('Type here').fill(exerciseName);
		await page.getByRole('option', { name: exerciseName, exact: true }).dispatchEvent('click');
		await expect(page.getByTestId('exercise-performance-card')).toHaveCount(2);
		await page.getByRole('button', { name: 'Show progression chart' }).click();
		const chartTable = page.getByRole('table', {
			name: `${exerciseName} relative overload progression chart data`
		});
		await expect(chartTable.locator('tbody tr')).toHaveCount(2);
		await page.getByRole('button', { name: 'Filter exercises' }).click();
		await page.getByRole('button', { name: 'Jan 1, 2026 - Jan 3, 2026' }).click();
		await page.locator('[data-value="2026-01-02"]').click();
		await page.locator('[data-value="2026-01-03"]').click();
		await page.keyboard.press('Escape');
		await page.keyboard.press('Escape');
		await expect(page.getByTestId('exercise-performance-card')).toHaveCount(1);
		await expect(chartTable.locator('tbody tr')).toHaveCount(1);

		await page.getByRole('button', { name: 'Change muscle group' }).click();
		await expect(
			page.getByText('Only completed workout history with this exact exercise name will change.')
		).toBeVisible();
		await expect(page.getByText('Templates, future workouts, and cyclic set changes stay unchanged.')).toBeVisible();
		await page.getByRole('combobox', { name: 'Target muscle group' }).click();
		await page.getByRole('option', { name: 'Biceps', exact: true }).click();
		await page.getByRole('button', { name: 'Update workout history' }).click();
		await expect(page.getByText('Updated 2 historical performances')).toBeVisible();
		await expect(page.getByRole('main').getByRole('combobox')).toContainText(exerciseName);
		await expect(page.getByTestId('exercise-performance-card')).toHaveCount(1);
		await expect(page.getByTestId('exercise-performance-card')).toContainText('Biceps');
		await expect(chartTable.locator('tbody tr')).toHaveCount(1);
		await page.getByRole('main').getByRole('combobox').click();
		await expect(page.locator('[data-cmdk-group-heading]').filter({ hasText: 'Biceps' })).toBeVisible();
		await page.keyboard.press('Escape');
		await page.getByRole('button', { name: 'Filter exercises' }).click();
		await expect(page.getByRole('button', { name: 'Jan 2, 2026 - Jan 3, 2026' })).toBeVisible();
		expect(mutationRequestCount).toBe(1);

		const ownExactMatches = await prisma.workoutExercise.findMany({
			where: { name: exerciseName, workout: { userId: userData.userId } },
			select: { targetMuscleGroup: true, customMuscleGroup: true }
		});
		expect(ownExactMatches).toEqual([
			{ targetMuscleGroup: 'Biceps', customMuscleGroup: null },
			{ targetMuscleGroup: 'Biceps', customMuscleGroup: null }
		]);
		await expect(
			prisma.workoutExercise.findFirstOrThrow({
				where: { name: exerciseName.toLowerCase(), workout: { userId: userData.userId } },
				select: { targetMuscleGroup: true }
			})
		).resolves.toEqual({ targetMuscleGroup: 'Chest' });
		await expect(
			prisma.workoutExercise.findFirstOrThrow({
				where: { name: exerciseName, workout: { userId: otherUserId } },
				select: { targetMuscleGroup: true, customMuscleGroup: true }
			})
		).resolves.toEqual({ targetMuscleGroup: 'Custom', customMuscleGroup: 'Other tenant' });
	} finally {
		await prisma.user.delete({ where: { id: otherUserId } });
	}
});

test('keeps the canonical muscle group when stale initial history arrives after the update', async ({
	page,
	userData
}) => {
	await prisma.workout.create({ data: workoutData(userData.userId, 0) });
	let releaseInitialHistory!: () => void;
	let initialHistoryCaptured!: () => void;
	const initialHistoryGate = new Promise<void>((resolve) => (releaseInitialHistory = resolve));
	const initialHistoryWasCaptured = new Promise<void>((resolve) => (initialHistoryCaptured = resolve));
	await page.route(
		(url) => url.href.includes('workouts.getExerciseHistory'),
		async (route) => {
			const staleResponse = await route.fetch();
			initialHistoryCaptured();
			await initialHistoryGate;
			await route.fulfill({ response: staleResponse });
		}
	);

	try {
		await page.goto('/exercise-stats');
		await page.getByRole('main').getByRole('combobox').click();
		await page.getByPlaceholder('Type here').fill(exerciseName);
		await page.getByRole('option', { name: exerciseName, exact: true }).dispatchEvent('click');
		await initialHistoryWasCaptured;

		await page.getByRole('button', { name: 'Change muscle group' }).click();
		await page.getByRole('combobox', { name: 'Target muscle group' }).click();
		await page.getByRole('option', { name: 'Biceps', exact: true }).click();
		await page.getByRole('button', { name: 'Update workout history' }).click();
		await expect(page.getByText('Updated 1 historical performance', { exact: true })).toBeVisible();

		releaseInitialHistory();
		await expect(page.getByTestId('exercise-performance-card')).toHaveCount(1);
		await expect(page.getByTestId('exercise-performance-card')).toContainText('Biceps');
		await expect(page.getByTestId('exercise-performance-card')).not.toContainText('Chest');
	} finally {
		releaseInitialHistory();
	}
});

test('keeps the canonical muscle group when stale pagination arrives after the update', async ({ page, userData }) => {
	await prisma.$transaction(
		Array.from({ length: 15 }, (_, performanceIndex) =>
			prisma.workout.create({ data: workoutData(userData.userId, performanceIndex) })
		)
	);
	let historyRequestCount = 0;
	let releasePagination!: () => void;
	let paginationCaptured!: () => void;
	const paginationGate = new Promise<void>((resolve) => (releasePagination = resolve));
	const paginationWasCaptured = new Promise<void>((resolve) => (paginationCaptured = resolve));
	await page.route(
		(url) => url.href.includes('workouts.getExerciseHistory'),
		async (route) => {
			historyRequestCount += 1;
			if (historyRequestCount === 1) {
				await route.continue();
				return;
			}
			const staleResponse = await route.fetch();
			paginationCaptured();
			await paginationGate;
			await route.fulfill({ response: staleResponse });
		}
	);

	try {
		await page.goto('/exercise-stats');
		await page.getByRole('main').getByRole('combobox').click();
		await page.getByPlaceholder('Type here').fill(exerciseName);
		await page.getByRole('option', { name: exerciseName, exact: true }).dispatchEvent('click');
		await expect(page.getByTestId('exercise-performance-card')).toHaveCount(10);

		await page.getByRole('main').evaluate((main) => main.scrollTo(0, main.scrollHeight));
		await paginationWasCaptured;
		await page.getByRole('button', { name: 'Change muscle group' }).click();
		await page.getByRole('combobox', { name: 'Target muscle group' }).click();
		await page.getByRole('option', { name: 'Biceps', exact: true }).click();
		await page.getByRole('button', { name: 'Update workout history' }).click();
		await expect(page.getByText('Updated 15 historical performances', { exact: true })).toBeVisible();

		releasePagination();
		await expect(page.getByTestId('exercise-performance-card')).toHaveCount(15);
		await expect(page.getByTestId('exercise-performance-card').filter({ hasText: 'Chest' })).toHaveCount(0);
		await expect(page.getByTestId('exercise-performance-card').filter({ hasText: 'Biceps' })).toHaveCount(15);
	} finally {
		releasePagination();
	}
});

test('ignores an older mutation response after a newer muscle-group update succeeds', async ({ page, userData }) => {
	const otherExerciseName = 'Chart history row';
	const otherExerciseWorkout = workoutData(userData.userId, 1);
	otherExerciseWorkout.workoutExercises.create.name = otherExerciseName;
	await prisma.$transaction([
		prisma.workout.create({ data: workoutData(userData.userId, 0) }),
		prisma.workout.create({ data: otherExerciseWorkout })
	]);

	let mutationRequestCount = 0;
	let releaseFirstMutation!: () => void;
	let firstMutationCaptured!: () => void;
	const firstMutationGate = new Promise<void>((resolve) => (releaseFirstMutation = resolve));
	const firstMutationWasCaptured = new Promise<void>((resolve) => (firstMutationCaptured = resolve));
	await page.route(
		(url) => url.href.includes('users.updateHistoricalExerciseMuscleGroup'),
		async (route) => {
			mutationRequestCount += 1;
			if (mutationRequestCount !== 1) {
				await route.continue();
				return;
			}
			const olderResponse = await route.fetch();
			firstMutationCaptured();
			await firstMutationGate;
			await route.fulfill({ response: olderResponse });
		}
	);

	try {
		await page.goto('/exercise-stats');
		await page.getByRole('main').getByRole('combobox').click();
		await page.getByPlaceholder('Type here').fill(exerciseName);
		await page.getByRole('option', { name: exerciseName, exact: true }).dispatchEvent('click');
		await page.getByRole('button', { name: 'Change muscle group' }).click();
		await page.getByRole('combobox', { name: 'Target muscle group' }).click();
		await page.getByRole('option', { name: 'Biceps', exact: true }).click();
		await page.getByRole('button', { name: 'Update workout history' }).click();
		await firstMutationWasCaptured;

		await page.keyboard.press('Escape');
		await page.getByRole('main').getByRole('combobox').click();
		await page.getByPlaceholder('Type here').fill(otherExerciseName);
		await page.getByRole('option', { name: otherExerciseName, exact: true }).dispatchEvent('click');
		await page.getByRole('main').getByRole('combobox').click();
		await page.getByPlaceholder('Type here').fill(exerciseName);
		await page.getByRole('option', { name: exerciseName, exact: true }).dispatchEvent('click');
		await page.getByRole('button', { name: 'Change muscle group' }).click();
		await page.getByRole('combobox', { name: 'Target muscle group' }).click();
		await page.getByRole('option', { name: 'Triceps', exact: true }).click();
		await page.getByRole('button', { name: 'Update workout history' }).click();
		await expect(page.getByText('Updated 1 historical performance', { exact: true })).toBeVisible();
		await expect(page.getByTestId('exercise-performance-card')).toContainText('Triceps');

		const olderResponseReceived = page.waitForResponse((response) =>
			response.url().includes('users.updateHistoricalExerciseMuscleGroup')
		);
		releaseFirstMutation();
		await olderResponseReceived;
		await page.evaluate(
			() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))
		);
		await expect(page.getByTestId('exercise-performance-card')).toContainText('Triceps');
		await expect(page.getByTestId('exercise-performance-card')).not.toContainText('Biceps');
		expect(mutationRequestCount).toBe(2);
	} finally {
		releaseFirstMutation();
	}
});

test('changes history to a normalized custom group without changing templates or cyclic settings', async ({
	page,
	userData
}) => {
	let mutationRequestCount = 0;
	page.on('request', (request) => {
		if (request.url().includes('users.updateHistoricalExerciseMuscleGroup')) mutationRequestCount += 1;
	});
	await prisma.$transaction([
		prisma.workout.create({ data: workoutData(userData.userId, 0) }),
		prisma.exerciseSplit.create({
			data: {
				name: 'Future split',
				userId: userData.userId,
				exerciseSplitDays: {
					create: {
						name: 'Push',
						dayIndex: 0,
						isRestDay: false,
						exercises: {
							create: {
								name: exerciseName,
								exerciseIndex: 0,
								targetMuscleGroup: 'Chest',
								setType: 'Straight',
								repRangeStart: 5,
								repRangeEnd: 10
							}
						}
					}
				}
			}
		}),
		prisma.mesocycle.create({
			data: {
				name: 'Future mesocycle',
				userId: userData.userId,
				RIRProgression: [3],
				startOverloadPercentage: 0,
				lastSetToFailure: false,
				forceRIRMatching: false,
				mesocycleExerciseSplitDays: {
					create: {
						name: 'Push',
						dayIndex: 0,
						isRestDay: false,
						mesocycleSplitDayExercises: {
							create: {
								name: exerciseName,
								exerciseIndex: 0,
								targetMuscleGroup: 'Chest',
								sets: 3,
								setType: 'Straight',
								repRangeStart: 5,
								repRangeEnd: 10
							}
						}
					}
				},
				mesocycleCyclicSetChanges: {
					create: {
						muscleGroup: 'Chest',
						regardlessOfProgress: false,
						setIncreaseAmount: 1,
						maxVolume: 20
					}
				}
			}
		})
	]);

	await page.goto('/exercise-stats');
	await page.getByRole('main').getByRole('combobox').click();
	await page.getByPlaceholder('Type here').fill(exerciseName);
	await page.getByRole('option', { name: exerciseName, exact: true }).dispatchEvent('click');
	await page.getByRole('button', { name: 'Change muscle group' }).click();
	await page.getByRole('combobox', { name: 'Target muscle group' }).click();
	await page.getByRole('option', { name: 'Custom', exact: true }).click();
	await page.getByLabel('Custom muscle group').fill('   ');
	await page.getByRole('button', { name: 'Update workout history' }).click();
	await expect(page.getByRole('alert')).toContainText('Enter a custom muscle group.');
	expect(mutationRequestCount).toBe(0);
	await page.getByLabel('Custom muscle group').fill('  Push muscles  ');
	await page.getByRole('button', { name: 'Update workout history' }).click();
	await expect(page.getByText('Updated 1 historical performance', { exact: true })).toBeVisible();
	expect(mutationRequestCount).toBe(1);
	await expect(page.getByRole('main').getByRole('combobox')).toContainText(exerciseName);
	await expect(page.getByTestId('exercise-performance-card')).toContainText('Push muscles');
	await page.getByRole('button', { name: 'Change muscle group' }).click();
	await expect(page.getByLabel('Custom muscle group')).toHaveValue('Push muscles');
	await page.keyboard.press('Escape');

	await expect(
		prisma.workoutExercise.findFirstOrThrow({
			where: { name: exerciseName, workout: { userId: userData.userId } },
			select: { targetMuscleGroup: true, customMuscleGroup: true }
		})
	).resolves.toEqual({ targetMuscleGroup: 'Custom', customMuscleGroup: 'Push muscles' });
	await expect(
		prisma.exerciseTemplate.findFirstOrThrow({
			where: { name: exerciseName, exerciseSplitDay: { exerciseSplit: { userId: userData.userId } } },
			select: { targetMuscleGroup: true, customMuscleGroup: true }
		})
	).resolves.toEqual({ targetMuscleGroup: 'Chest', customMuscleGroup: null });
	await expect(
		prisma.mesocycleExerciseTemplate.findFirstOrThrow({
			where: { name: exerciseName, mesocycleExerciseSplitDay: { mesocycle: { userId: userData.userId } } },
			select: { targetMuscleGroup: true, customMuscleGroup: true }
		})
	).resolves.toEqual({ targetMuscleGroup: 'Chest', customMuscleGroup: null });
	await expect(
		prisma.mesocycleCyclicSetChange.findFirstOrThrow({
			where: { mesocycle: { userId: userData.userId } },
			select: { muscleGroup: true, customMuscleGroup: true }
		})
	).resolves.toEqual({ muscleGroup: 'Chest', customMuscleGroup: null });
});

test('keeps failed muscle-group requests retryable without applying an early update', async ({ page, userData }) => {
	await prisma.workout.create({ data: workoutData(userData.userId, 0) });
	let requestCount = 0;
	let releaseRetry!: () => void;
	let retryStarted!: () => void;
	const retryGate = new Promise<void>((resolve) => (releaseRetry = resolve));
	const retryRequestStarted = new Promise<void>((resolve) => (retryStarted = resolve));
	await page.route(
		(url) => url.href.includes('users.updateHistoricalExerciseMuscleGroup'),
		async (route) => {
			requestCount += 1;
			if (requestCount === 1) {
				await route.fulfill({ status: 503, body: 'muscle group update temporarily unavailable' });
				return;
			}
			if (requestCount === 2) {
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
		await page.getByRole('button', { name: 'Change muscle group' }).click();
		await page.getByRole('combobox', { name: 'Target muscle group' }).click();
		await page.getByRole('option', { name: 'Triceps', exact: true }).click();
		await page.getByRole('button', { name: 'Update workout history' }).click();
		await expect(page.getByRole('alert')).toContainText('Could not update workout history.');
		await expect(
			prisma.workoutExercise.findFirstOrThrow({
				where: { name: exerciseName, workout: { userId: userData.userId } },
				select: { targetMuscleGroup: true }
			})
		).resolves.toEqual({ targetMuscleGroup: 'Chest' });

		await page.getByRole('button', { name: 'Retry update' }).click();
		await retryRequestStarted;
		await expect(page.getByRole('button', { name: 'Updating' })).toBeDisabled();
		expect(requestCount).toBe(2);
		releaseRetry();
		await expect(page.getByText('Updated 1 historical performance', { exact: true })).toBeVisible();
		await expect(
			prisma.workoutExercise.findFirstOrThrow({
				where: { name: exerciseName, workout: { userId: userData.userId } },
				select: { targetMuscleGroup: true }
			})
		).resolves.toEqual({ targetMuscleGroup: 'Triceps' });
		expect(requestCount).toBe(2);
	} finally {
		releaseRetry();
	}
});

test('reports a generic not-found error when no exact historical performance remains', async ({ page, userData }) => {
	const workout = await prisma.workout.create({ data: workoutData(userData.userId, 0) });
	await page.goto('/exercise-stats');
	await page.getByRole('main').getByRole('combobox').click();
	await page.getByPlaceholder('Type here').fill(exerciseName);
	await page.getByRole('option', { name: exerciseName, exact: true }).dispatchEvent('click');
	await expect(page.getByTestId('exercise-performance-card')).toHaveCount(1);
	await prisma.workout.delete({ where: { id: workout.id } });

	await page.getByRole('button', { name: 'Change muscle group' }).click();
	await page.getByRole('combobox', { name: 'Target muscle group' }).click();
	await page.getByRole('option', { name: 'Biceps', exact: true }).click();
	const responsePromise = page.waitForResponse((response) =>
		response.url().includes('users.updateHistoricalExerciseMuscleGroup')
	);
	await page.getByRole('button', { name: 'Update workout history' }).click();
	const response = await responsePromise;
	const responseBody = await response.text();
	expect(response.status()).toBe(404);
	expect(responseBody).toContain('Historical exercise performances not found');
	expect(responseBody).not.toContain(exerciseName);
	await expect(page.getByRole('alert')).toContainText('Could not update workout history.');
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

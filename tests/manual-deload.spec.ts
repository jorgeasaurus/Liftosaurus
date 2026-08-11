import { createId } from '@paralleldrive/cuid2';
import type { Page } from '@playwright/test';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import transformer from 'trpc-transformer';
import { prisma } from '../src/lib/prisma';
import type { Router } from '../src/lib/trpc/router';
import { workoutDraftStorageKeys } from '../src/routes/workouts/manage/workoutDraftStorage';
import { expect, test } from './fixtures';

function workoutExercise() {
	return {
		name: 'Bench press',
		exerciseIndex: 0,
		targetMuscleGroup: 'Chest' as const,
		customMuscleGroup: null,
		bodyweightFraction: null,
		setType: 'Straight' as const,
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
	};
}

async function createAuthenticatedClient(page: Page) {
	const cookies = await page.context().cookies();
	return createTRPCProxyClient<Router>({
		transformer,
		links: [
			httpBatchLink({
				url: `http://localhost:${process.env.PLAYWRIGHT_PORT ?? 4173}/trpc`,
				headers: { cookie: cookies.map(({ name, value }) => `${name}=${value}`).join('; ') }
			})
		]
	});
}

test('saved deload restores template volume and normal progression the following week', async ({ page, userData }) => {
	const mesocycleId = createId();
	await prisma.mesocycle.create({
		data: {
			id: mesocycleId,
			name: 'Manual deload persistence',
			userId: userData.userId,
			RIRProgression: [4],
			startDate: new Date('2026-07-01T00:00:00Z'),
			startOverloadPercentage: 2,
			lastSetToFailure: false,
			forceRIRMatching: false,
			mesocycleExerciseSplitDays: {
				create: {
					name: 'Push',
					dayIndex: 0,
					isRestDay: false,
					mesocycleSplitDayExercises: {
						create: { ...workoutExercise(), sets: 3 }
					}
				}
			}
		}
	});
	await prisma.workout.create({
		data: {
			userId: userData.userId,
			userBodyweight: 190,
			startedAt: new Date('2026-07-01T12:00:00Z'),
			endedAt: new Date('2026-07-01T13:00:00Z'),
			workoutOfMesocycle: { create: { mesocycleId, splitDayIndex: 0 } },
			workoutExercises: {
				create: {
					...workoutExercise(),
					sets: {
						create: Array.from({ length: 3 }, (_, setIndex) => ({
							setIndex,
							reps: 10,
							load: 100,
							RIR: 2,
							skipped: false
						}))
					}
				}
			}
		}
	});

	await page.goto('/workouts/manage/start');
	await page.getByPlaceholder('Type here').fill('190');
	await page.getByRole('button', { name: 'Next' }).click();
	await expect(page.locator('#Bench\\ press-set-3-reps')).toBeVisible();
	await page.getByTestId('Bench press-menu-button').click();
	await page.getByRole('menuitem', { name: 'Deload exercise' }).click();

	await expect(page.getByText('Deload', { exact: true })).toBeVisible();
	await expect(page.locator('#Bench\\ press-set-3-reps')).toHaveCount(0);
	await expect(page.locator('#Bench\\ press-set-1-load')).toHaveValue('50');
	await page.getByRole('button', { name: 'Compare to previous workout' }).click();
	await expect(page.getByText('Manual deloads are excluded from progression comparisons.')).toBeVisible();
	await page.getByRole('button', { name: 'Compare to previous workout' }).click();
	await page.getByTestId('Bench press-menu-button').click();
	await page.getByRole('menuitem', { name: 'Edit' }).click();
	await page.getByPlaceholder('Type here or search...').fill('Incline press');
	await page.getByRole('button', { name: 'Edit exercise' }).click();
	await page.getByTestId('Incline press-set-1-action').click();
	await page.getByTestId('Incline press-set-2-action').click();
	await page.getByRole('button', { name: 'Finish workout' }).click();
	await expect(page.getByText('No comparable normal exercise performances are available.')).toBeVisible();
	await expect(page.locator('#chart-canvas')).toHaveCount(0);
	await page.getByRole('button', { name: 'Save' }).click();
	await expect(page.getByRole('status')).toContainText('Workout created successfully');

	const client = await createAuthenticatedClient(page);
	const nextWorkoutData = await client.workouts.getWorkoutExercisesWithPreviousData.query({
		userBodyweight: 190,
		splitDayIndex: 0
	});
	expect(nextWorkoutData.previousWorkoutData?.exercises.map(({ name }) => name)).toEqual(['Bench press']);
	expect(nextWorkoutData.previousWorkoutData?.exercises.every(({ isDeload }) => !isDeload)).toBe(true);

	await page.goto('/workouts/manage/start');
	await page.getByRole('button', { name: 'Next' }).click();
	await expect(page.locator('#Bench\\ press-set-3-reps')).toBeVisible();
	await expect(page.locator('#Bench\\ press-set-1-load')).toHaveValue('100');
	await expect(page.getByText('Incline press', { exact: true })).toHaveCount(0);
});

test('reopening a completed set does not re-enable deload', async ({ page, userData }) => {
	await prisma.mesocycle.create({
		data: {
			name: 'Manual deload started guard',
			userId: userData.userId,
			RIRProgression: [4],
			startDate: new Date('2026-07-01T00:00:00Z'),
			startOverloadPercentage: 2,
			lastSetToFailure: false,
			forceRIRMatching: false,
			mesocycleExerciseSplitDays: {
				create: {
					name: 'Push',
					dayIndex: 0,
					isRestDay: false,
					mesocycleSplitDayExercises: { create: { ...workoutExercise(), sets: 1 } }
				}
			}
		}
	});

	await page.goto('/workouts/manage/start');
	await page.getByPlaceholder('Type here').fill('190');
	await page.getByRole('button', { name: 'Next' }).click();
	await page.locator('#Bench\\ press-set-1-reps').fill('10');
	await page.locator('#Bench\\ press-set-1-load').fill('100');
	await page.locator('#Bench\\ press-RIR').fill('2');
	await page.getByTestId('Bench press-set-1-action').click();
	await page.getByTestId('Bench press-set-1-action').click();
	await page.getByTestId('Bench press-menu-button').click();

	await expect(page.getByRole('menuitem', { name: 'Deload exercise' })).toBeDisabled();
});

test('legacy local storage keeps deload disabled after reopening a completed set', async ({ page, userData }) => {
	await page.goto('/');
	await page.evaluate(
		({ exercise, storageKey }) => {
			localStorage.setItem(
				storageKey,
				JSON.stringify({
					workoutData: {
						startedAt: '2026-07-08T12:00:00.000Z',
						endedAt: null,
						userBodyweight: 190,
						workoutExercises: [],
						note: null,
						isLastWorkout: false
					},
					workoutExercises: [
						{
							...exercise,
							sets: [
								{
									reps: 10,
									load: 100,
									RIR: 2,
									completed: true,
									skipped: false,
									miniSets: []
								}
							]
						}
					],
					editingWorkoutId: null
				})
			);
		},
		{ exercise: workoutExercise(), storageKey: workoutDraftStorageKeys(userData.userId).legacy }
	);

	await page.goto('/workouts/manage/exercises?keepCurrent');
	await page.getByTestId('Bench press-set-1-action').click();
	await page.getByTestId('Bench press-menu-button').click();

	await expect(page.getByRole('menuitem', { name: 'Deload exercise' })).toBeDisabled();
});

test('mixed deload history resolves each exercise from its latest normal workout', async ({ page, userData }) => {
	const mesocycle = await prisma.mesocycle.create({
		data: {
			name: 'Manual deload mixed baseline',
			userId: userData.userId,
			RIRProgression: [4],
			startDate: new Date('2026-07-01T00:00:00Z'),
			startOverloadPercentage: 2,
			lastSetToFailure: false,
			forceRIRMatching: false,
			mesocycleExerciseSplitDays: {
				create: {
					name: 'Push',
					dayIndex: 0,
					isRestDay: false,
					mesocycleSplitDayExercises: {
						create: [
							{ ...workoutExercise(), name: 'Bench press', exerciseIndex: 0, sets: 3 },
							{ ...workoutExercise(), name: 'Cable fly', exerciseIndex: 1, sets: 3 }
						]
					}
				}
			}
		}
	});
	for (const [startedAt, userBodyweight, benchIsDeload] of [
		[new Date('2026-07-01T12:00:00Z'), 180, false],
		[new Date('2026-07-08T12:00:00Z'), 195, true]
	] as const) {
		await prisma.workout.create({
			data: {
				userId: userData.userId,
				userBodyweight,
				startedAt,
				endedAt: new Date(startedAt.getTime() + 60 * 60 * 1000),
				workoutOfMesocycle: { create: { mesocycleId: mesocycle.id, splitDayIndex: 0 } },
				workoutExercises: {
					create: [
						{
							...workoutExercise(),
							name: 'Bench press',
							exerciseIndex: 0,
							isDeload: benchIsDeload,
							sets: { create: { setIndex: 0, reps: 10, load: 100, RIR: 2, skipped: false } }
						},
						{
							...workoutExercise(),
							name: 'Cable fly',
							exerciseIndex: 1,
							isDeload: false,
							sets: { create: { setIndex: 0, reps: 10, load: 50, RIR: 2, skipped: false } }
						}
					]
				}
			}
		});
	}
	const client = await createAuthenticatedClient(page);

	const nextWorkout = await client.workouts.getWorkoutExercisesWithPreviousData.query({
		userBodyweight: 200,
		splitDayIndex: 0
	});
	expect(
		nextWorkout.previousWorkoutData?.exercises.map(({ name, userBodyweight }) => ({ name, userBodyweight }))
	).toEqual([
		{ name: 'Bench press', userBodyweight: 180 },
		{ name: 'Cable fly', userBodyweight: 195 }
	]);

	await page.goto('/workouts/manage/start');
	await page.getByPlaceholder('Type here').fill('200');
	await page.getByRole('button', { name: 'Next' }).click();
	for (const exerciseName of ['Bench press', 'Cable fly']) {
		await page.locator(`[id="${exerciseName}-RIR"]`).fill('2');
		for (let setNumber = 1; setNumber <= 3; setNumber += 1) {
			await page.locator(`[id="${exerciseName}-set-${setNumber}-reps"]`).fill('10');
			if (setNumber === 1) {
				await page
					.locator(`[id="${exerciseName}-set-${setNumber}-load"]`)
					.fill(exerciseName === 'Bench press' ? '100' : '50');
			}
			await page.getByTestId(`${exerciseName}-set-${setNumber}-action`).click();
		}
	}
	await page.getByRole('button', { name: 'Finish workout' }).click();
	await expect(
		page.getByText(
			'Overall comparison is unavailable because the latest normal exercise baselines come from different workouts.'
		)
	).toBeVisible();
});

test('mixed deload comparison includes only matched normal exercises', async ({ page, userData }) => {
	const mesocycle = await prisma.mesocycle.create({
		data: {
			name: 'Manual deload comparable exercises',
			userId: userData.userId,
			RIRProgression: [4],
			startDate: new Date('2026-07-01T00:00:00Z'),
			startOverloadPercentage: 2,
			lastSetToFailure: false,
			forceRIRMatching: false,
			mesocycleExerciseSplitDays: {
				create: {
					name: 'Push',
					dayIndex: 0,
					isRestDay: false,
					mesocycleSplitDayExercises: {
						create: [
							{ ...workoutExercise(), name: 'Bench press', exerciseIndex: 0, sets: 2 },
							{ ...workoutExercise(), name: 'Cable fly', exerciseIndex: 1, sets: 2 },
							{ ...workoutExercise(), name: 'Curl', exerciseIndex: 2, targetMuscleGroup: 'Biceps', sets: 2 }
						]
					}
				}
			}
		}
	});
	await prisma.workout.create({
		data: {
			userId: userData.userId,
			userBodyweight: 190,
			startedAt: new Date('2026-07-01T12:00:00Z'),
			endedAt: new Date('2026-07-01T13:00:00Z'),
			workoutOfMesocycle: { create: { mesocycleId: mesocycle.id, splitDayIndex: 0 } },
			workoutExercises: {
				create: [
					{
						...workoutExercise(),
						name: 'Bench press',
						exerciseIndex: 0,
						sets: { create: { setIndex: 0, reps: 10, load: 100, RIR: 2, skipped: false } }
					},
					{
						...workoutExercise(),
						name: 'Cable fly',
						exerciseIndex: 1,
						sets: { create: { setIndex: 0, reps: 10, load: 50, RIR: 2, skipped: false } }
					}
				]
			}
		}
	});

	await page.goto('/workouts/manage/start');
	await page.getByPlaceholder('Type here').fill('190');
	await page.getByRole('button', { name: 'Next' }).click();
	await page.getByTestId('Bench press-menu-button').click();
	await page.getByRole('menuitem', { name: 'Deload exercise' }).click();
	await page.getByRole('button', { name: 'Compare to previous workout' }).click();
	await expect(page.getByText('Manual deloads are excluded from progression comparisons.')).toBeVisible();
	await expect(page.getByText('No previous normal performance is available to compare.')).toBeVisible();
	await page.getByRole('button', { name: 'Compare to previous workout' }).click();

	for (const [exerciseName, setCount, load] of [
		['Bench press', 1, '50'],
		['Cable fly', 2, '50'],
		['Curl', 2, '25']
	] as const) {
		await page.locator(`[id="${exerciseName}-RIR"]`).fill('2');
		for (let setNumber = 1; setNumber <= setCount; setNumber += 1) {
			await page
				.locator(`[id="${exerciseName}-set-${setNumber}-reps"]`)
				.fill(exerciseName === 'Bench press' ? '5' : '10');
			if (setNumber === 1) await page.locator(`[id="${exerciseName}-set-${setNumber}-load"]`).fill(load);
			await page.getByTestId(`${exerciseName}-set-${setNumber}-action`).click();
		}
	}
	await page.getByRole('button', { name: 'Finish workout' }).click();

	await expect(page.locator('#chart-canvas')).toBeVisible();
	await expect(page.getByText('No comparable normal exercise performances are available.')).toHaveCount(0);
	await expect(
		page.getByText(
			'Overall comparison is unavailable because the latest normal exercise baselines come from different workouts.'
		)
	).toHaveCount(0);
});

test('a user cannot replace another users workout while saving a deload', async ({ page, userData }) => {
	const victimId = createId();
	const victim = await prisma.user.create({
		data: {
			id: victimId,
			email: `test-user-manual-deload-victim-${victimId}@Liftosaurus.com`,
			workouts: {
				create: {
					userBodyweight: 180,
					startedAt: new Date('2026-07-01T12:00:00Z'),
					endedAt: new Date('2026-07-01T13:00:00Z')
				}
			}
		},
		include: { workouts: true }
	});
	const victimWorkout = victim.workouts[0];
	const client = await createAuthenticatedClient(page);

	await expect(
		client.workouts.editById.mutate({
			id: victimWorkout.id,
			endedAt: '2026-07-02',
			data: {
				draftOwnerUserId: userData.userId,
				workoutData: { startedAt: '2026-07-02T12:00:00.000Z', userBodyweight: 999 },
				workoutExercises: [],
				workoutExercisesSets: [],
				workoutExercisesMiniSets: []
			}
		})
	).rejects.toThrow('Workout not found');

	await expect(prisma.workout.findUnique({ where: { id: victimWorkout.id } })).resolves.toMatchObject({
		userId: victimId,
		userBodyweight: 180
	});
});

test('template name collisions reject the workout and preserve the current mesocycle templates', async ({
	page,
	userData
}) => {
	const mesocycle = await prisma.mesocycle.create({
		data: {
			name: 'Manual deload collision guard',
			userId: userData.userId,
			RIRProgression: [4],
			startDate: new Date('2026-07-01T00:00:00Z'),
			startOverloadPercentage: 2,
			lastSetToFailure: false,
			forceRIRMatching: false,
			mesocycleExerciseSplitDays: {
				create: {
					name: 'Push',
					dayIndex: 0,
					isRestDay: false,
					mesocycleSplitDayExercises: {
						create: [
							{ ...workoutExercise(), name: 'Bench press', exerciseIndex: 0, sets: 3 },
							{ ...workoutExercise(), name: 'Cable fly', exerciseIndex: 1, sets: 3 }
						]
					}
				}
			}
		},
		include: { mesocycleExerciseSplitDays: { include: { mesocycleSplitDayExercises: true } } }
	});
	const sourceTemplate = mesocycle.mesocycleExerciseSplitDays[0].mesocycleSplitDayExercises.find(
		({ name }) => name === 'Bench press'
	)!;
	const templatesBefore = await prisma.mesocycleExerciseTemplate.findMany({
		where: { mesocycleExerciseSplitDay: { mesocycleId: mesocycle.id } },
		orderBy: { exerciseIndex: 'asc' }
	});
	const client = await createAuthenticatedClient(page);

	await expect(
		client.workouts.create.mutate({
			draftOwnerUserId: userData.userId,
			workoutData: {
				startedAt: '2026-07-08T12:00:00.000Z',
				userBodyweight: 190,
				workoutOfMesocycle: { mesocycle: { id: mesocycle.id }, splitDayIndex: 0, workoutStatus: null }
			},
			workoutExercises: [
				{ ...workoutExercise(), name: 'Incline press', exerciseIndex: 0, isDeload: true },
				{ ...workoutExercise(), name: 'Bench press', exerciseIndex: 1, isDeload: false }
			],
			manualDeloadMetadata: [{ sourceTemplateId: sourceTemplate.id, originalSetCount: 3 }],
			workoutExercisesSets: [
				[{ setIndex: 0, reps: 5, load: 50, RIR: 2, skipped: false }],
				[{ setIndex: 0, reps: 10, load: 100, RIR: 2, skipped: false }]
			],
			workoutExercisesMiniSets: [[[]], [[]]]
		})
	).rejects.toThrow('Manual deload metadata must align with workout exercises');

	await expect(
		client.workouts.create.mutate({
			draftOwnerUserId: userData.userId,
			workoutData: {
				startedAt: '2026-07-08T12:00:00.000Z',
				userBodyweight: 190,
				workoutOfMesocycle: { mesocycle: { id: mesocycle.id }, splitDayIndex: 0, workoutStatus: null }
			},
			workoutExercises: [
				{ ...workoutExercise(), name: 'Incline press', exerciseIndex: 0, isDeload: true },
				{ ...workoutExercise(), name: 'Bench press', exerciseIndex: 1, isDeload: false }
			],
			manualDeloadMetadata: [{ sourceTemplateId: sourceTemplate.id, originalSetCount: 3 }, null],
			workoutExercisesSets: [
				[{ setIndex: 0, reps: 5, load: 50, RIR: 2, skipped: false }],
				[{ setIndex: 0, reps: 10, load: 100, RIR: 2, skipped: false }]
			],
			workoutExercisesMiniSets: [[[]], [[]]]
		})
	).rejects.toThrow('Duplicate exercise names are not allowed in the next mesocycle workout');
	await expect(
		client.workouts.create.mutate({
			draftOwnerUserId: userData.userId,
			workoutData: {
				startedAt: '2026-07-08T12:00:00.000Z',
				userBodyweight: 190,
				workoutOfMesocycle: { mesocycle: { id: mesocycle.id }, splitDayIndex: 0, workoutStatus: null }
			},
			workoutExercises: [
				{ ...workoutExercise(), name: 'Incline press', exerciseIndex: 0, isDeload: true },
				{ ...workoutExercise(), name: 'Decline press', exerciseIndex: 1, isDeload: true }
			],
			manualDeloadMetadata: [
				{ sourceTemplateId: sourceTemplate.id, originalSetCount: 3 },
				{ sourceTemplateId: sourceTemplate.id, originalSetCount: 3 }
			],
			workoutExercisesSets: [
				[{ setIndex: 0, reps: 5, load: 50, RIR: 2, skipped: false }],
				[{ setIndex: 0, reps: 5, load: 50, RIR: 2, skipped: false }]
			],
			workoutExercisesMiniSets: [[[]], [[]]]
		})
	).rejects.toThrow('A deload source template can only be restored once');

	await expect(
		prisma.mesocycleExerciseTemplate.findMany({
			where: { mesocycleExerciseSplitDay: { mesocycleId: mesocycle.id } },
			orderBy: { exerciseIndex: 'asc' }
		})
	).resolves.toEqual(templatesBefore);
	await expect(prisma.workoutOfMesocycle.count({ where: { mesocycleId: mesocycle.id } })).resolves.toBe(0);
});

test('reordered deload keeps its stable source template in contiguous workout order', async ({ page, userData }) => {
	const mesocycle = await prisma.mesocycle.create({
		data: {
			name: 'Manual deload reorder',
			userId: userData.userId,
			RIRProgression: [4],
			startDate: new Date('2026-07-01T00:00:00Z'),
			startOverloadPercentage: 2,
			lastSetToFailure: false,
			forceRIRMatching: false,
			mesocycleExerciseSplitDays: {
				create: {
					name: 'Push',
					dayIndex: 0,
					isRestDay: false,
					mesocycleSplitDayExercises: {
						create: [
							{ ...workoutExercise(), name: 'Bench press', exerciseIndex: 0, sets: 3 },
							{ ...workoutExercise(), name: 'Cable fly', exerciseIndex: 1, sets: 2 }
						]
					}
				}
			}
		},
		include: { mesocycleExerciseSplitDays: { include: { mesocycleSplitDayExercises: true } } }
	});
	const sourceTemplate = mesocycle.mesocycleExerciseSplitDays[0].mesocycleSplitDayExercises.find(
		({ name }) => name === 'Bench press'
	)!;
	const client = await createAuthenticatedClient(page);

	await client.workouts.create.mutate({
		draftOwnerUserId: userData.userId,
		workoutData: {
			startedAt: '2026-07-08T12:00:00.000Z',
			userBodyweight: 190,
			workoutOfMesocycle: { mesocycle: { id: mesocycle.id }, splitDayIndex: 0, workoutStatus: null }
		},
		workoutExercises: [
			{ ...workoutExercise(), name: 'Cable fly', exerciseIndex: 0, isDeload: false },
			{ ...workoutExercise(), name: 'Bench press', exerciseIndex: 1, isDeload: true }
		],
		manualDeloadMetadata: [null, { sourceTemplateId: sourceTemplate.id, originalSetCount: 3 }],
		workoutExercisesSets: [
			[
				{ setIndex: 0, reps: 10, load: 50, RIR: 2, skipped: false },
				{ setIndex: 1, reps: 9, load: 50, RIR: 2, skipped: false }
			],
			[{ setIndex: 0, reps: 5, load: 50, RIR: 2, skipped: false }]
		],
		workoutExercisesMiniSets: [[[], []], [[]]]
	});

	const templates = await prisma.mesocycleExerciseTemplate.findMany({
		where: { mesocycleExerciseSplitDay: { mesocycleId: mesocycle.id } },
		select: { id: true, name: true, exerciseIndex: true, sets: true },
		orderBy: { exerciseIndex: 'asc' }
	});
	expect(templates.map(({ name, exerciseIndex, sets }) => ({ name, exerciseIndex, sets }))).toEqual([
		{ name: 'Cable fly', exerciseIndex: 0, sets: 2 },
		{ name: 'Bench press', exerciseIndex: 1, sets: 3 }
	]);
	expect(templates.find(({ name }) => name === 'Bench press')?.id).toBe(sourceTemplate.id);
});

import { createId } from '@paralleldrive/cuid2';
import { prisma } from '../src/lib/prisma';
import { expect, test } from './fixtures';

let outsiderUserId: string | undefined;

test.afterEach(async () => {
	if (outsiderUserId) {
		await prisma.user.deleteMany({ where: { id: outsiderUserId } });
		outsiderUserId = undefined;
	}
});

test('dashboard bodyweight charts use pounds and exclude another user data', async ({ page, userData }) => {
	await prisma.workout.create({
		data: {
			userId: userData.userId,
			userBodyweight: 191.5,
			startedAt: new Date('2026-07-01T12:00:00Z'),
			endedAt: new Date('2026-07-01T13:00:00Z')
		}
	});

	outsiderUserId = createId();
	await prisma.user.create({
		data: {
			id: outsiderUserId,
			email: `test-user-dashboard-outsider-${outsiderUserId}@Liftosaurus.com`,
			workouts: {
				create: {
					userBodyweight: 999,
					startedAt: new Date('2026-07-02T12:00:00Z'),
					endedAt: new Date('2026-07-02T13:00:00Z')
				}
			}
		}
	});

	await page.goto('/dashboard');
	await expect(page.getByRole('heading', { name: 'Progress trends' })).toBeVisible();
	await expect(page.getByText('Latest: 191.5 lb')).toBeVisible();
	await expect(page.getByRole('img', { name: 'Bodyweight chart in lb' })).toBeVisible();
	await expect(page.getByRole('table', { name: 'Bodyweight historical data' })).toContainText('191.5 lb');
	await expect(page.getByRole('main')).not.toContainText('999');

	await page.getByRole('combobox', { name: 'Dashboard chart' }).click();
	await page.getByRole('option', { name: 'Bodyweight · 7-day average' }).click();
	await expect(page.getByText('Latest: 191.5 lb')).toBeVisible();
	await expect(page.getByRole('img', { name: 'Bodyweight · 7-day average chart in lb' })).toBeVisible();

	await page.getByRole('combobox', { name: 'Dashboard chart' }).click();
	await page.getByRole('option', { name: 'Work volume' }).click();
	await expect(page.getByText('No data yet for this chart.')).toBeVisible();
});

test('dashboard offers relative performance by default and optional work volume', async ({ page, userData }) => {
	const mesocycle = await prisma.mesocycle.create({
		data: {
			name: 'Dashboard metrics',
			userId: userData.userId,
			RIRProgression: [3],
			startDate: new Date('2026-07-01T00:00:00Z'),
			startOverloadPercentage: 2,
			lastSetToFailure: false,
			forceRIRMatching: false,
			mesocycleExerciseSplitDays: {
				create: { name: 'Push', dayIndex: 0, isRestDay: false }
			}
		}
	});

	for (const [index, load] of [100, 110].entries()) {
		await prisma.workout.create({
			data: {
				userId: userData.userId,
				userBodyweight: 190,
				startedAt: new Date(`2026-07-0${index * 7 + 1}T12:00:00Z`),
				endedAt: new Date(`2026-07-0${index * 7 + 1}T13:00:00Z`),
				workoutOfMesocycle: {
					create: { mesocycleId: mesocycle.id, splitDayIndex: 0 }
				},
				workoutExercises: {
					create: {
						exerciseIndex: 0,
						name: 'Bench press',
						targetMuscleGroup: 'Chest',
						bodyweightFraction: null,
						setType: 'Straight',
						repRangeStart: 8,
						repRangeEnd: 12,
						sets: {
							create: { setIndex: 0, reps: 10, load, RIR: 2, skipped: false }
						}
					}
				}
			}
		});
	}

	await page.goto('/dashboard');
	await expect(page.getByRole('combobox', { name: 'Dashboard chart' })).toContainText('Relative performance');
	await expect(page.getByRole('img', { name: 'Relative performance chart in %' })).toBeVisible();
	await expect(page.getByText('Latest: 10.0 %')).toBeVisible();

	await page.getByRole('combobox', { name: 'Dashboard chart' }).click();
	await page.getByRole('option', { name: 'Work volume' }).click();
	await expect(page.getByText('Latest: 1100 lb × reps')).toBeVisible();
	await expect(page.getByRole('img', { name: 'Work volume chart in lb × reps' })).toBeVisible();
	await expect(page.getByRole('table', { name: 'Work volume historical data' })).toContainText('1100 lb × reps');
});

test('mobile dashboard renders rest days without workout controls', async ({ page, userData }) => {
	await prisma.mesocycle.create({
		data: {
			name: 'Rest day dashboard',
			userId: userData.userId,
			RIRProgression: [3],
			startDate: new Date(),
			startOverloadPercentage: 2,
			lastSetToFailure: false,
			forceRIRMatching: false,
			mesocycleExerciseSplitDays: {
				create: { name: 'Recovery', dayIndex: 0, isRestDay: true }
			}
		}
	});

	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/dashboard');
	const sessionCard = page.locator('.mobile-session-card');
	await expect(sessionCard).toContainText('Rest day');
	await expect(sessionCard).toContainText('Recovery day');
	await expect(sessionCard).not.toContainText('RIR target');
	await expect(sessionCard.getByRole('link', { name: /Start workout/i })).toHaveCount(0);
});

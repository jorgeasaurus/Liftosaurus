import { createId } from '@paralleldrive/cuid2';
import { expect, test } from '@playwright/test';
import { randomUUID } from 'node:crypto';
import { prisma } from '../src/lib/prisma';

async function createExportGraph(userId: string, prefix: string) {
	const splitId = `${prefix}-split`;
	const splitDayId = `${prefix}-split-day`;
	const mesocycleId = `${prefix}-mesocycle`;
	const mesocycleDayId = `${prefix}-mesocycle-day`;
	const workoutId = `${prefix}-workout`;
	const workoutExerciseId = `${prefix}-workout-exercise`;
	const setId = `${prefix}-set`;

	await prisma.exerciseSplit.create({
		data: {
			id: splitId,
			name: `${prefix} exercise split`,
			userId,
			exerciseSplitDays: {
				create: {
					id: splitDayId,
					name: `${prefix} split day`,
					dayIndex: 0,
					isRestDay: false,
					exercises: {
						create: {
							id: `${prefix}-exercise-template`,
							name: `${prefix} exercise template`,
							exerciseIndex: 0,
							targetMuscleGroup: 'Chest',
							setType: 'Straight',
							repRangeStart: 8,
							repRangeEnd: 12
						}
					}
				}
			}
		}
	});

	await prisma.mesocycle.create({
		data: {
			id: mesocycleId,
			name: `${prefix} mesocycle`,
			userId,
			exerciseSplitId: splitId,
			RIRProgression: [1],
			startDate: new Date('2026-07-01T00:00:00.000Z'),
			startOverloadPercentage: 0.02,
			lastSetToFailure: false,
			forceRIRMatching: false,
			mesocycleCyclicSetChanges: {
				create: {
					id: `${prefix}-cyclic-set-change`,
					muscleGroup: 'Chest',
					regardlessOfProgress: false,
					setIncreaseAmount: 1,
					maxVolume: 20
				}
			},
			mesocycleExerciseSplitDays: {
				create: {
					id: mesocycleDayId,
					name: `${prefix} mesocycle day`,
					dayIndex: 0,
					isRestDay: false,
					mesocycleSplitDayExercises: {
						create: {
							id: `${prefix}-mesocycle-template`,
							name: `${prefix} mesocycle exercise`,
							exerciseIndex: 0,
							targetMuscleGroup: 'Chest',
							sets: 1,
							setType: 'Straight',
							repRangeStart: 8,
							repRangeEnd: 12
						}
					}
				}
			}
		}
	});

	await prisma.workout.create({
		data: {
			id: workoutId,
			userId,
			userBodyweight: 195,
			startedAt: new Date('2026-08-01T10:00:00.000Z'),
			endedAt: new Date('2026-08-01T11:00:00.000Z'),
			note: `${prefix} workout note`,
			workoutOfMesocycle: {
				create: {
					id: `${prefix}-workout-of-mesocycle`,
					mesocycleId,
					splitDayIndex: 0
				}
			},
			workoutExercises: {
				create: {
					id: workoutExerciseId,
					exerciseIndex: 0,
					name: prefix.startsWith('owner') ? '=OWNER FORMULA' : `${prefix} workout exercise`,
					targetMuscleGroup: 'Chest',
					bodyweightFraction: 0.5,
					setType: 'Myorep',
					repRangeStart: 8,
					repRangeEnd: 12,
					sets: {
						create: {
							id: setId,
							setIndex: 0,
							reps: 10,
							load: 135,
							RIR: 2,
							skipped: false,
							miniSets: {
								create: {
									id: `${prefix}-mini-set`,
									miniSetIndex: 0,
									reps: 4,
									load: 135,
									RIR: 0
								}
							}
						}
					}
				}
			}
		}
	});

	return { splitId, splitDayId, mesocycleId, mesocycleDayId, workoutId, workoutExerciseId, setId };
}

test('export endpoints reject anonymous requests', async ({ browser }) => {
	const context = await browser.newContext({ baseURL: test.info().project.use.baseURL as string });

	try {
		const [jsonResponse, csvResponse] = await Promise.all([
			context.request.get('/api/export/json'),
			context.request.get('/api/export/csv')
		]);

		expect(jsonResponse.status(), await jsonResponse.text()).toBe(401);
		expect(csvResponse.status(), await csvResponse.text()).toBe(401);
	} finally {
		await context.close();
	}
});

test('downloads complete owner-only exports without authentication secrets', async ({ page }) => {
	const ownerPrefix = `owner-${createId()}`;
	const outsiderPrefix = `OUTSIDER-${createId()}`;
	const ownerId = createId();
	const outsiderId = createId();
	const sessionToken = randomUUID();
	const providerAccountId = createId();
	const providerSecret = `PROVIDER-SECRET-${createId()}`;

	await prisma.user.create({
		data: {
			id: ownerId,
			email: `export-e2e-${ownerId}@liftosaurus.invalid`,
			sessions: {
				create: {
					sessionToken,
					expires: new Date(Date.now() + 60 * 60 * 1000)
				}
			}
		}
	});
	await prisma.user.create({
		data: { id: outsiderId, email: `export-e2e-${outsiderId}@liftosaurus.invalid` }
	});

	try {
		const ownerGraph = await createExportGraph(ownerId, ownerPrefix);
		await createExportGraph(outsiderId, outsiderPrefix);
		await prisma.account.create({
			data: {
				userId: ownerId,
				type: 'oauth',
				provider: 'export-test',
				providerAccountId,
				refresh_token: providerSecret,
				access_token: providerSecret
			}
		});
		await page.context().addCookies([
			{
				name: 'authjs.session-token',
				value: sessionToken,
				domain: 'localhost',
				path: '/'
			}
		]);
		await page.addInitScript(() => localStorage.setItem('Liftosaurus_terms_accepted', 'true'));

		const jsonResponse = await page.request.get('/api/export/json');
		expect(jsonResponse.status()).toBe(200);
		expect(jsonResponse.headers()['content-type']).toBe('application/json; charset=utf-8');
		expect(jsonResponse.headers()['cache-control']).toContain('no-store');
		expect(jsonResponse.headers()['content-disposition']).toMatch(
			/attachment; filename="liftosaurus-backup-\d{4}-\d{2}-\d{2}\.json"/
		);

		const jsonText = await jsonResponse.text();
		const backup = JSON.parse(jsonText);

		expect(backup.format).toBe('liftosaurus-user-backup');
		expect(backup.version).toBe(1);
		expect(backup.data.user.id).toBe(ownerId);
		expect(Object.keys(backup.data).sort()).toEqual(
			[
				'customExercises',
				'exerciseSplitDays',
				'exerciseSplits',
				'exerciseTemplates',
				'mesocycleCyclicSetChanges',
				'mesocycleExerciseSplitDays',
				'mesocycleExerciseTemplates',
				'mesocycles',
				'user',
				'userSettings',
				'workoutExerciseMiniSets',
				'workoutExerciseSets',
				'workoutExercises',
				'workouts',
				'workoutsOfMesocycle'
			].sort()
		);
		expect(backup.data.exerciseSplits[0].id).toBe(ownerGraph.splitId);
		expect(backup.data.exerciseSplitDays[0].exerciseSplitId).toBe(ownerGraph.splitId);
		expect(backup.data.mesocycles[0].exerciseSplitId).toBe(ownerGraph.splitId);
		expect(backup.data.workoutsOfMesocycle[0].mesocycleId).toBe(ownerGraph.mesocycleId);
		expect(backup.data.workoutExercises[0].workoutId).toBe(ownerGraph.workoutId);
		expect(backup.data.workoutExerciseSets[0].workoutExerciseId).toBe(ownerGraph.workoutExerciseId);
		expect(backup.data.workoutExerciseMiniSets[0].workoutExerciseSetId).toBe(ownerGraph.setId);
		expect(jsonText).not.toContain(outsiderPrefix);
		expect(jsonText).not.toContain(providerSecret);
		expect(jsonText).not.toContain(sessionToken);
		expect(backup.data).not.toHaveProperty('accounts');
		expect(backup.data).not.toHaveProperty('sessions');
		expect(backup.data).not.toHaveProperty('verificationTokens');

		const csvResponse = await page.request.get('/api/export/csv');
		expect(csvResponse.status()).toBe(200);
		expect(csvResponse.headers()['content-type']).toBe('text/csv; charset=utf-8');
		const csv = await csvResponse.text();
		expect(csv.split('\r\n')).toHaveLength(4);
		expect(csv).toContain("'=OWNER FORMULA");
		expect(csv).toContain('"bodyweight_fraction"');
		expect(csv).toContain('"external_load_lb","effective_load_lb"');
		expect(csv.match(/"135","232\.5"/g)).toHaveLength(2);
		expect(csv).toContain('"regular"');
		expect(csv).toContain('"mini"');
		expect(csv).not.toContain(outsiderPrefix);

		await page.goto('/settings');
		await expect(page.getByTestId('data-export')).toContainText('Export your data');
		await expect(page.getByRole('link', { name: 'Download JSON backup' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'Download workout CSV' })).toBeVisible();

		const downloadPromise = page.waitForEvent('download');
		await page.getByRole('link', { name: 'Download JSON backup' }).click();
		const download = await downloadPromise;
		expect(download.suggestedFilename()).toMatch(/^liftosaurus-backup-\d{4}-\d{2}-\d{2}\.json$/);
	} finally {
		await prisma.user.deleteMany({ where: { id: { in: [ownerId, outsiderId] } } });
	}
});

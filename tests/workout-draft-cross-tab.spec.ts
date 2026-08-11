import { createId } from '@paralleldrive/cuid2';
import type { Page } from '@playwright/test';
import { prisma } from '../src/lib/prisma';
import { expect, test } from './fixtures';

function workoutData(userBodyweight: number, endedAt: string | null) {
	return {
		startedAt: '2026-08-02T17:00:00.000Z',
		endedAt,
		userBodyweight,
		workoutExercises: [],
		note: null,
		isLastWorkout: false
	};
}

function completedExercise(name: string) {
	return {
		name,
		targetMuscleGroup: 'Chest',
		customMuscleGroup: null,
		bodyweightFraction: null,
		setType: 'Straight',
		changeType: null,
		changeAmount: null,
		repRangeStart: 5,
		repRangeEnd: 10,
		note: null,
		overloadPercentage: null,
		lastSetToFailure: null,
		forceRIRMatching: null,
		minimumWeightChange: null,
		topRepRangeStart: null,
		topRepRangeEnd: null,
		sets: [{ reps: 9, load: 135, RIR: 2, skipped: false, completed: true, miniSets: [] }]
	};
}

async function flushStorageEvent(page: Page) {
	await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

function draftKeys(userId: string) {
	const namespace = `workoutRunes:user:${encodeURIComponent(userId)}`;
	return {
		legacy: namespace,
		active: `${namespace}:active`,
		edit: `${namespace}:edit`,
		mode: `${namespace}:mode`
	};
}

function editDraftLockName(userId: string) {
	return `liftosaurus:workout-draft:${draftKeys(userId).edit}`;
}

async function disableWebLocks(page: Page) {
	await page.addInitScript(() => {
		Object.defineProperty(navigator, 'locks', { configurable: true, value: undefined });
	});
}

async function holdEditDraftLock(page: Page, userId: string) {
	const lockName = editDraftLockName(userId);
	await page.evaluate((lockName) => {
		void navigator.locks.request(lockName, async () => {
			(window as typeof window & { draftLockHeld?: boolean }).draftLockHeld = true;
			await new Promise<void>((resolve) => {
				(window as typeof window & { releaseDraftLock?: () => void }).releaseDraftLock = resolve;
			});
		});
	}, lockName);
	await expect
		.poll(() => page.evaluate(() => (window as typeof window & { draftLockHeld?: boolean }).draftLockHeld))
		.toBe(true);
}

async function waitForPendingEditMutation(page: Page, userId: string) {
	const lockName = editDraftLockName(userId);
	await expect
		.poll(() =>
			page.evaluate(async (lockName) => {
				const snapshot = await navigator.locks.query();
				return snapshot.pending?.some((lock) => lock.name === lockName) ?? false;
			}, lockName)
		)
		.toBe(true);
}

async function writeEditRecordAndRelease(page: Page, userId: string, raw: string) {
	await page.evaluate(
		({ editKey, raw }) => {
			localStorage.setItem(editKey, raw);
			(window as typeof window & { releaseDraftLock?: () => void }).releaseDraftLock?.();
		},
		{ editKey: draftKeys(userId).edit, raw }
	);
}

type ActiveDraft = {
	workoutData: ReturnType<typeof workoutData>;
	workoutExercises: [];
	previousWorkoutData: null;
};

async function openEditInTwoTabs(page: Page, userId: string, activeDraft: ActiveDraft | null) {
	const otherEditPage = await page.context().newPage();
	const keys = draftKeys(userId);
	await page.goto('/workouts/manage/start');
	await otherEditPage.goto('/workouts/manage/start');

	await page.evaluate(
		({ activeDraft, editDraft, keys }) => {
			if (activeDraft) {
				localStorage.setItem(keys.active, JSON.stringify({ version: 1, draft: activeDraft }));
			} else {
				localStorage.removeItem(keys.active);
			}
			localStorage.setItem(keys.edit, JSON.stringify({ version: 1, draft: editDraft }));
			sessionStorage.setItem(keys.mode, 'edit');
		},
		{
			activeDraft,
			keys,
			editDraft: {
				workoutId: createId(),
				workoutData: workoutData(150, '2026-08-02T18:00:00.000Z'),
				workoutExercises: []
			}
		}
	);
	await otherEditPage.evaluate((modeKey) => sessionStorage.setItem(modeKey, 'edit'), keys.mode);
	await page.reload();
	await otherEditPage.reload();

	await expect(page.getByRole('heading', { name: 'Edit workout' })).toBeVisible();
	await expect(otherEditPage.getByRole('heading', { name: 'Edit workout' })).toBeVisible();
	await expect(otherEditPage.getByRole('spinbutton', { name: 'Bodyweight (lbs)' })).toHaveValue('150');
	return otherEditPage;
}

test('canceling an edit in another tab visibly restores the active workout draft', async ({ page, userData }) => {
	const keys = draftKeys(userData.userId);
	const otherEditPage = await openEditInTwoTabs(page, userData.userId, {
		workoutData: workoutData(200, null),
		workoutExercises: [],
		previousWorkoutData: null
	});

	await page.getByRole('button', { name: 'Cancel edit' }).click();

	await expect(otherEditPage.getByRole('heading', { name: 'New workout' })).toBeVisible();
	await expect(otherEditPage.getByRole('spinbutton', { name: 'Bodyweight (lbs)' })).toHaveValue('200');

	await otherEditPage.getByRole('spinbutton', { name: 'Bodyweight (lbs)' }).fill('205');
	await page.evaluate(
		({ editDraft, editKey }) => localStorage.setItem(editKey, JSON.stringify({ version: 1, draft: editDraft })),
		{
			editKey: keys.edit,
			editDraft: {
				workoutId: createId(),
				workoutData: workoutData(160, '2026-08-03T18:00:00.000Z'),
				workoutExercises: []
			}
		}
	);
	await expect(otherEditPage.getByRole('spinbutton', { name: 'Bodyweight (lbs)' })).toHaveValue('205');
});

test('canceling an edit in another tab clears stale edit fields when no active draft exists', async ({
	page,
	userData
}) => {
	const otherEditPage = await openEditInTwoTabs(page, userData.userId, null);

	await page.getByRole('button', { name: 'Cancel edit' }).click();

	await expect(otherEditPage.getByRole('heading', { name: 'New workout' })).toBeVisible();
	await expect(otherEditPage.getByRole('spinbutton', { name: 'Bodyweight (lbs)' })).toHaveValue('');
});

test('entering historical edit preserves an unreadable active workout record', async ({ page, userData }) => {
	const keys = draftKeys(userData.userId);
	const workout = await prisma.workout.create({
		data: {
			userId: userData.userId,
			userBodyweight: 190,
			startedAt: new Date('2026-07-01T17:00:00.000Z'),
			endedAt: new Date('2026-07-01T18:00:00.000Z')
		}
	});
	const futureActiveRecord = JSON.stringify({ version: 999, draft: { important: 'future active workout' } });

	await page.goto(`/workouts/${workout.id}`);
	await page.evaluate(({ activeKey, futureActiveRecord }) => localStorage.setItem(activeKey, futureActiveRecord), {
		activeKey: keys.active,
		futureActiveRecord
	});
	await page.getByLabel('workout-options').click();
	await page.getByRole('menuitem', { name: 'Edit' }).click();

	await expect(page.getByRole('heading', { name: 'Edit workout' })).toBeVisible();
	await expect
		.poll(() => page.evaluate((activeKey) => localStorage.getItem(activeKey), keys.active))
		.toBe(futureActiveRecord);
});

test('future active records survive stale save and reset transitions', async ({ page, userData }) => {
	const keys = draftKeys(userData.userId);
	const otherPage = await page.context().newPage();
	const draft = {
		workoutData: workoutData(200, null),
		workoutExercises: [completedExercise('Bench press')],
		previousWorkoutData: null
	};
	await page.goto('/workouts/manage/start');
	await otherPage.goto('/workouts/manage/start');
	await page.evaluate(
		({ activeKey, draft }) => localStorage.setItem(activeKey, JSON.stringify({ version: 1, draft })),
		{ activeKey: keys.active, draft }
	);
	await page.reload();
	await expect(page.getByRole('spinbutton', { name: 'Bodyweight (lbs)' })).toHaveValue('200');

	const futureActiveRecord = JSON.stringify({ version: 999, draft: { important: 'future active workout' } });
	await otherPage.evaluate(({ activeKey, futureActiveRecord }) => localStorage.setItem(activeKey, futureActiveRecord), {
		activeKey: keys.active,
		futureActiveRecord
	});
	await flushStorageEvent(page);

	await page.getByRole('button', { name: 'Next' }).click();
	await page.getByRole('button', { name: 'Keep current' }).click();
	await expect(page).toHaveURL(/\/workouts\/manage\/exercises/);
	await expect
		.poll(() => page.evaluate((activeKey) => localStorage.getItem(activeKey), keys.active))
		.toBe(futureActiveRecord);

	await page.getByRole('button', { name: 'Finish workout' }).click();
	await expect(page).toHaveURL(/\/workouts\/manage\/overview/);
	await page.getByRole('button', { name: 'Save' }).click();
	await expect(page).toHaveURL(/\/workouts$/);
	await expect
		.poll(() => page.evaluate((activeKey) => localStorage.getItem(activeKey), keys.active))
		.toBe(futureActiveRecord);
});

test('future edit records survive stale cancel and rejected new-workout transitions', async ({ page, userData }) => {
	const keys = draftKeys(userData.userId);
	const otherPage = await openEditInTwoTabs(page, userData.userId, null);
	const futureEditRecord = JSON.stringify({ version: 999, draft: { important: 'future edit' } });
	await otherPage.evaluate(({ editKey, futureEditRecord }) => localStorage.setItem(editKey, futureEditRecord), {
		editKey: keys.edit,
		futureEditRecord
	});
	await flushStorageEvent(page);

	await page.getByRole('button', { name: 'Cancel edit' }).click();
	await expect.poll(() => page.evaluate((editKey) => localStorage.getItem(editKey), keys.edit)).toBe(futureEditRecord);

	const editDraft = {
		workoutId: createId(),
		workoutData: workoutData(160, '2026-08-02T18:00:00.000Z'),
		workoutExercises: []
	};
	await page.evaluate(
		({ editDraft, keys }) => {
			localStorage.setItem(keys.edit, JSON.stringify({ version: 1, draft: editDraft }));
			sessionStorage.setItem(keys.mode, 'edit');
		},
		{ editDraft, keys }
	);
	await page.goto('/workouts/manage/start');
	await expect(page.getByRole('heading', { name: 'Edit workout' })).toBeVisible();

	const secondFutureEditRecord = JSON.stringify({ version: 999, draft: { important: 'second future edit' } });
	await otherPage.evaluate(
		({ editKey, secondFutureEditRecord }) => localStorage.setItem(editKey, secondFutureEditRecord),
		{ editKey: keys.edit, secondFutureEditRecord }
	);
	await flushStorageEvent(page);
	await page.getByRole('link', { name: 'Workouts', exact: true }).click();
	await page.getByRole('button', { name: 'create-workout' }).click();
	await expect(page).toHaveURL(/\/workouts$/);
	await expect
		.poll(() => page.evaluate((editKey) => localStorage.getItem(editKey), keys.edit))
		.toBe(secondFutureEditRecord);
});

test('locked concurrent edit writers survive stale cancel across valid, future, and corrupt records', async ({
	page,
	userData
}) => {
	const keys = draftKeys(userData.userId);
	const writerPage = await page.context().newPage();
	await writerPage.goto('/workouts/manage/start');
	const initialEdit = {
		workoutId: createId(),
		workoutData: workoutData(150, '2026-08-02T18:00:00.000Z'),
		workoutExercises: []
	};
	const records = [
		JSON.stringify({
			version: 1,
			draft: {
				...initialEdit,
				workoutId: createId(),
				workoutData: workoutData(170, '2026-08-03T18:00:00.000Z')
			}
		}),
		JSON.stringify({ version: 999, draft: { important: 'future edit' } }),
		'{corrupt edit record'
	];

	for (const [index, replacementRaw] of records.entries()) {
		await page.goto('/workouts/manage/start');
		await page.evaluate(
			({ initialEdit, keys }) => {
				localStorage.setItem(keys.edit, JSON.stringify({ version: 1, draft: initialEdit }));
				sessionStorage.setItem(keys.mode, 'edit');
			},
			{ initialEdit, keys }
		);
		await page.reload();
		await expect(page.getByRole('heading', { name: 'Edit workout' })).toBeVisible();

		await writerPage.evaluate(() => {
			delete (window as typeof window & { draftLockHeld?: boolean }).draftLockHeld;
			delete (window as typeof window & { releaseDraftLock?: () => void }).releaseDraftLock;
		});
		await holdEditDraftLock(writerPage, userData.userId);
		await expect
			.poll(() => writerPage.evaluate(() => (window as typeof window & { draftLockHeld?: boolean }).draftLockHeld))
			.toBe(true);

		await page.getByRole('button', { name: 'Cancel edit' }).evaluate((button: HTMLButtonElement) => button.click());
		await waitForPendingEditMutation(page, userData.userId);
		await writeEditRecordAndRelease(writerPage, userData.userId, replacementRaw);

		await expect.poll(() => page.evaluate((editKey) => localStorage.getItem(editKey), keys.edit)).toBe(replacementRaw);
		if (index === 0) {
			await expect(page.getByRole('heading', { name: 'Edit workout' })).toBeVisible();
			await expect(page.getByRole('spinbutton', { name: 'Bodyweight (lbs)' })).toHaveValue('170');
		} else {
			await expect(page.getByRole('alert')).toContainText('saved draft was left untouched');
			await expect(page.getByRole('heading', { name: 'Edit workout' })).toBeVisible();
			await expect(page.getByRole('spinbutton', { name: 'Bodyweight (lbs)' })).toHaveValue('150');
		}
	}
});

test('no-Web-Locks mode warns, stays usable in memory, and preserves every raw record', async ({ page, userData }) => {
	const keys = draftKeys(userData.userId);
	const activeRaw = JSON.stringify({
		version: 1,
		draft: { workoutData: workoutData(201, null), workoutExercises: [], previousWorkoutData: null }
	});
	const editRaw = '{future edit bytes';
	const scopedLegacyRaw = '{scoped legacy bytes';
	const originGlobalRaw = '{unowned origin-global bytes';
	const modeRaw = 'active';
	const pageErrors: Error[] = [];
	page.on('pageerror', (error) => pageErrors.push(error));
	await disableWebLocks(page);
	await page.addInitScript(
		({ activeRaw, editRaw, keys, modeRaw, originGlobalRaw, scopedLegacyRaw }) => {
			const marker = `${keys.legacy}:no-lock-seeded`;
			if (localStorage.getItem(marker) !== null) return;
			localStorage.setItem(keys.active, activeRaw);
			localStorage.setItem(keys.edit, editRaw);
			localStorage.setItem(keys.legacy, scopedLegacyRaw);
			localStorage.setItem('workoutRunes', originGlobalRaw);
			sessionStorage.setItem(keys.mode, modeRaw);
			localStorage.setItem(marker, 'true');
		},
		{ activeRaw, editRaw, keys, modeRaw, originGlobalRaw, scopedLegacyRaw }
	);

	await page.goto('/workouts/manage/start');
	await expect(page.getByRole('alert')).toContainText('Workout draft persistence is unavailable');
	await expect(page.getByRole('spinbutton', { name: 'Bodyweight (lbs)' })).toHaveValue('201');
	await page.getByRole('spinbutton', { name: 'Bodyweight (lbs)' }).fill('209');
	await page.getByRole('button', { name: 'Next' }).click();
	await page.getByRole('button', { name: 'Overwrite' }).click();
	await expect(page).toHaveURL(/\/workouts\/manage\/exercises/);

	const persisted = await page.evaluate(
		(keys) => ({
			active: localStorage.getItem(keys.active),
			edit: localStorage.getItem(keys.edit),
			legacy: localStorage.getItem(keys.legacy),
			mode: sessionStorage.getItem(keys.mode),
			originGlobal: localStorage.getItem('workoutRunes')
		}),
		keys
	);
	expect(persisted).toEqual({
		active: activeRaw,
		edit: editRaw,
		legacy: scopedLegacyRaw,
		mode: modeRaw,
		originGlobal: originGlobalRaw
	});
	expect(pageErrors).toEqual([]);
});

test('queued account A writes are fenced across same-document A to anonymous to B navigation', async ({
	page,
	userData
}) => {
	test.slow();
	const secondUserId = createId();
	const secondSessionToken = createId();
	await prisma.session.create({
		data: {
			sessionToken: secondSessionToken,
			expires: new Date(Date.now() + 60 * 60 * 1000),
			user: { create: { id: secondUserId, email: `draft-epoch-${secondUserId}@Liftosaurus.com` } }
		}
	});

	try {
		const firstKeys = draftKeys(userData.userId);
		const secondKeys = draftKeys(secondUserId);
		const lockPage = await openEditInTwoTabs(page, userData.userId, null);
		const firstRaw = await page.evaluate((editKey) => localStorage.getItem(editKey), firstKeys.edit);
		const secondDraft = {
			workoutData: workoutData(207, null),
			workoutExercises: [],
			previousWorkoutData: null
		};
		await page.evaluate(
			({ activeKey, secondDraft }) =>
				localStorage.setItem(activeKey, JSON.stringify({ version: 1, draft: secondDraft })),
			{ activeKey: secondKeys.active, secondDraft }
		);

		await holdEditDraftLock(lockPage, userData.userId);
		await page.getByRole('button', { name: 'Cancel edit' }).evaluate((button: HTMLButtonElement) => button.click());
		await waitForPendingEditMutation(page, userData.userId);
		await page.evaluate(() => {
			(window as typeof window & { sameDocumentSessionSentinel?: string }).sameDocumentSessionSentinel = 'mounted';
		});

		await page.context().clearCookies();
		await page
			.getByRole('link', { name: 'Today', exact: true })
			.evaluate((link: HTMLAnchorElement) => link.click());
		await expect(page).toHaveURL(/\/$/);
		await expect(page.getByRole('button', { name: 'Sign in', exact: true })).toBeVisible();
		expect(
			await page.evaluate(
				() => (window as typeof window & { sameDocumentSessionSentinel?: string }).sameDocumentSessionSentinel
			)
		).toBe('mounted');

		const appOrigin = new URL(page.url()).origin;
		await page.context().addCookies([{ name: 'authjs.session-token', value: secondSessionToken, url: appOrigin }]);
		await page.goto('/workouts');
		await expect(page).toHaveURL(/\/workouts$/);
		await page.getByRole('button', { name: 'create-workout' }).click();
		await expect(page.getByRole('spinbutton', { name: 'Bodyweight (lbs)' })).toHaveValue('207');

		await lockPage.evaluate(() => (window as typeof window & { releaseDraftLock?: () => void }).releaseDraftLock?.());
		await expect.poll(() => page.evaluate((editKey) => localStorage.getItem(editKey), firstKeys.edit)).toBe(firstRaw);
		expect(await page.evaluate((activeKey) => localStorage.getItem(activeKey), secondKeys.active)).toContain('207');
	} finally {
		await prisma.session.deleteMany({ where: { userId: secondUserId } });
		await prisma.user.deleteMany({ where: { id: secondUserId } });
	}
});

test('real logout and account switch preserve scoped drafts and quarantined storage', async ({ page, userData }) => {
	test.slow();
	const secondUserId = createId();
	const secondSessionToken = createId();
	await prisma.session.create({
		data: {
			sessionToken: secondSessionToken,
			expires: new Date(Date.now() + 60 * 60 * 1000),
			user: { create: { id: secondUserId, email: `logout-isolation-${secondUserId}@Liftosaurus.com` } }
		}
	});

	const firstKeys = draftKeys(userData.userId);
	const secondKeys = draftKeys(secondUserId);
	const firstRaw = JSON.stringify({
		version: 1,
		draft: { workoutData: workoutData(181, null), workoutExercises: [], previousWorkoutData: null }
	});
	const secondRaw = JSON.stringify({
		version: 1,
		draft: { workoutData: workoutData(207, null), workoutExercises: [], previousWorkoutData: null }
	});
	const originGlobalRaw = '{quarantined global legacy';
	const unrelatedRaw = 'preserve me';

	try {
		await page.setViewportSize({ width: 430, height: 800 });
		await page.goto('/dashboard');
		await page.evaluate(
			({ firstKeys, firstRaw, originGlobalRaw, secondKeys, secondRaw, unrelatedRaw }) => {
				localStorage.setItem(firstKeys.active, firstRaw);
				localStorage.setItem(secondKeys.active, secondRaw);
				localStorage.setItem('workoutRunes', originGlobalRaw);
				localStorage.setItem('logout-sentinel', unrelatedRaw);
			},
			{ firstKeys, firstRaw, originGlobalRaw, secondKeys, secondRaw, unrelatedRaw }
		);

		await page.getByRole('button', { name: 'Open profile menu' }).last().click();
		await page.getByRole('menuitem', { name: 'Logout' }).click();
		await expect(page.getByRole('button', { name: 'Sign in', exact: true })).toBeVisible();

		const preserved = await page.evaluate(
			({ firstKeys, secondKeys }) => ({
				first: localStorage.getItem(firstKeys.active),
				second: localStorage.getItem(secondKeys.active),
				originGlobal: localStorage.getItem('workoutRunes'),
				unrelated: localStorage.getItem('logout-sentinel')
			}),
			{ firstKeys, secondKeys }
		);
		expect(preserved).toEqual({
			first: firstRaw,
			second: secondRaw,
			originGlobal: originGlobalRaw,
			unrelated: unrelatedRaw
		});

		const appOrigin = new URL(page.url()).origin;
		await page.context().addCookies([{ name: 'authjs.session-token', value: secondSessionToken, url: appOrigin }]);
		await page.goto('/workouts/manage/start');
		await expect(page.getByRole('spinbutton', { name: 'Bodyweight (lbs)' })).toHaveValue('207');
		expect(await page.evaluate((activeKey) => localStorage.getItem(activeKey), firstKeys.active)).toBe(firstRaw);
		expect(await page.evaluate(() => localStorage.getItem('workoutRunes'))).toBe(originGlobalRaw);
	} finally {
		await prisma.session.upsert({
			where: { sessionToken: userData.sessionToken },
			create: {
				sessionToken: userData.sessionToken,
				userId: userData.userId,
				expires: new Date(Date.now() + 60 * 60 * 1000)
			},
			update: { expires: new Date(Date.now() + 60 * 60 * 1000) }
		});
		await prisma.session.deleteMany({ where: { userId: secondUserId } });
		await prisma.user.deleteMany({ where: { id: secondUserId } });
	}
});

test('same browser keeps authenticated users drafts isolated', async ({ page, userData }) => {
	const secondUserId = createId();
	const secondSessionToken = createId();
	await prisma.session.create({
		data: {
			sessionToken: secondSessionToken,
			expires: new Date(Date.now() + 60 * 60 * 1000),
			user: { create: { id: secondUserId, email: `draft-isolation-${secondUserId}@Liftosaurus.com` } }
		}
	});

	try {
		const firstKeys = draftKeys(userData.userId);
		const secondKeys = draftKeys(secondUserId);
		const originGlobalRaw = '{unowned legacy sentinel';
		await page.goto('/workouts/manage/start');
		await page.evaluate((originGlobalRaw) => localStorage.setItem('workoutRunes', originGlobalRaw), originGlobalRaw);
		await page.getByRole('spinbutton', { name: 'Bodyweight (lbs)' }).fill('181');
		await page.getByRole('button', { name: 'Next' }).click();
		await expect(page).toHaveURL(/\/workouts\/manage\/exercises/);
		const firstRaw = await page.evaluate((activeKey) => localStorage.getItem(activeKey), firstKeys.active);
		expect(firstRaw).toContain('181');

		const appOrigin = new URL(page.url()).origin;
		await page.context().addCookies([{ name: 'authjs.session-token', value: secondSessionToken, url: appOrigin }]);
		await page.goto('/workouts/manage/start');
		await expect(page.getByRole('spinbutton', { name: 'Bodyweight (lbs)' })).not.toHaveValue('181');
		await page.getByRole('spinbutton', { name: 'Bodyweight (lbs)' }).fill('207');
		await page.getByRole('button', { name: 'Next' }).click();
		await expect(page).toHaveURL(/\/workouts\/manage\/exercises/);
		const secondRaw = await page.evaluate((activeKey) => localStorage.getItem(activeKey), secondKeys.active);
		expect(secondRaw).toContain('207');
		expect(
			JSON.parse((await page.evaluate((activeKey) => localStorage.getItem(activeKey), firstKeys.active)) ?? '{}')
		).toEqual(JSON.parse(firstRaw ?? '{}'));

		await page.context().addCookies([{ name: 'authjs.session-token', value: userData.sessionToken, url: appOrigin }]);
		await page.goto('/workouts/manage/start');
		await expect(page.getByRole('spinbutton', { name: 'Bodyweight (lbs)' })).toHaveValue('181');
		expect(await page.evaluate(() => localStorage.getItem('workoutRunes'))).toBe(originGlobalRaw);
	} finally {
		await prisma.session.deleteMany({ where: { userId: secondUserId } });
		await prisma.user.deleteMany({ where: { id: secondUserId } });
	}
});

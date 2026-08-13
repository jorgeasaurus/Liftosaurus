import { expect, test } from './fixtures';

test.beforeEach(async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
});

test('public landing page remains vertically scrollable', async ({ browser }) => {
	const publicPage = await browser.newPage({
		baseURL: test.info().project.use.baseURL as string,
		viewport: { width: 390, height: 844 }
	});
	await publicPage.context().clearCookies();
	await publicPage.goto('/');
	await expect(publicPage.locator('#how-it-works')).not.toBeInViewport();
	await publicPage.getByRole('link', { name: /See how it works/ }).click();
	await expect(publicPage.locator('#how-it-works')).toBeInViewport();
	expect(await publicPage.evaluate(() => document.body.scrollHeight > document.body.clientHeight)).toBe(true);
	await publicPage.close();
});

test('mobile navigation exposes workout-first destinations and preserves viewport bounds', async ({ page }) => {
	await page.goto('/dashboard');

	const navigation = page.getByRole('navigation', { name: 'Primary navigation' });
	await expect(navigation).toBeVisible();

	const expectedLinks = [
		['Workout', '/workout'],
		['History', '/workouts'],
		['Plans', '/plans'],
		['Exercises', '/exercises'],
		['More', '/more']
	] as const;

	for (const [name, href] of expectedLinks) {
		const link = navigation.getByRole('link', { name, exact: true });
		await expect(link).toHaveAttribute('href', href);
		const bounds = await link.boundingBox();
		expect(bounds).not.toBeNull();
		expect(bounds!.height).toBeGreaterThanOrEqual(44);
		expect(bounds!.width).toBeGreaterThanOrEqual(44);
	}

	await navigation.getByRole('link', { name: 'Workout', exact: true }).click();
	await expect(page).toHaveURL('/workout');
	await expect(
		page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name: 'Workout', exact: true })
	).toHaveAttribute('aria-current', 'page');
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(
		true
	);

	await page.setViewportSize({ width: 390, height: 700 });
	expect(await page.evaluate(() => Math.round(document.body.getBoundingClientRect().height))).toBe(700);
});

test('mobile hubs keep plan, exercise, and account tools one tap away', async ({ page }) => {
	await page.goto('/plans');
	await expect(page.getByRole('heading', { name: 'Plans', exact: true })).toBeVisible();
	await expect(page.getByRole('link', { name: /Mesocycles/ })).toHaveAttribute('href', '/mesocycles');
	await expect(page.getByRole('link', { name: /Exercise splits/ })).toHaveAttribute('href', '/exercise-splits');
	await expect(page.getByRole('link', { name: /Split templates/ })).toHaveAttribute(
		'href',
		'/exercise-splits/templates'
	);
	await expect(page.getByRole('link', { name: 'Plans', exact: true })).toHaveAttribute('aria-current', 'page');

	await page.getByRole('link', { name: 'Exercises', exact: true }).click();
	await expect(page.getByRole('heading', { name: 'Exercises', exact: true })).toBeVisible();
	await expect(page.getByPlaceholder('Search exercises')).toBeVisible();
	await expect(page.getByRole('button', { name: 'Filter exercises' })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Progress' })).toHaveAttribute('href', '/exercise-stats');

	await page.getByRole('link', { name: 'More', exact: true }).click();
	await expect(page.getByRole('heading', { name: 'More', exact: true })).toBeVisible();
	await expect(page.getByRole('link', { name: /Profile/ })).toHaveAttribute('href', '/profile');
	await expect(page.getByRole('link', { name: /Settings/ })).toHaveAttribute('href', '/settings');
	await expect(page.getByRole('link', { name: /Documentation/ })).toHaveAttribute('href', '/docs');
});

test('nested routes select the correct mobile section', async ({ page }) => {
	const cases = [
		['/workouts', 'History'],
		['/mesocycles', 'Plans'],
		['/exercise-splits', 'Plans'],
		['/exercise-stats', 'Exercises'],
		['/profile', 'More'],
		['/settings', 'More']
	] as const;

	for (const [path, activeLabel] of cases) {
		await page.goto(path);
		const currentLinks = page.getByRole('navigation', { name: 'Primary navigation' }).locator('[aria-current="page"]');
		await expect(currentLinks).toHaveCount(1);
		await expect(currentLinks).toHaveText(activeLabel);
	}
});

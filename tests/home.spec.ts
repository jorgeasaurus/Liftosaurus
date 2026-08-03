import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('/');
});

test('page has expected h1', async ({ page }) => {
	await expect(page.getByRole('heading', { name: 'Liftosaurus' })).toBeVisible();
});

test('has title', async ({ page }) => {
	await expect(page).toHaveTitle(/Liftosaurus/);
});

test('login button opens provider list', async ({ page }) => {
	await page.getByRole('button', { name: 'Login' }).first().click();
	await expect(page.getByRole('menuitem', { name: 'google' })).toBeVisible();
	await expect(page.getByRole('menuitem', { name: 'github' })).toBeVisible();
});

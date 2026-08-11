import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('/');
});

test('page introduces the product with its marketing headline', async ({ page }) => {
	await expect(page.getByRole('heading', { name: 'Train with clarity. Progress with proof.' })).toBeVisible();
});

test('has title', async ({ page }) => {
	await expect(page).toHaveTitle(/Liftosaurus/);
});

test('sign in opens the available provider list', async ({ page }) => {
	await page.getByRole('button', { name: 'Sign in' }).click();
	await expect(page.getByRole('menuitem', { name: 'GitHub' })).toBeVisible();
});

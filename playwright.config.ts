import { devices, type PlaywrightTestConfig } from '@playwright/test';
import { getPlaywrightPort } from './tests/playwright-port';

const port = getPlaywrightPort(process.env.PLAYWRIGHT_PORT);
const baseURL = `http://localhost:${port}`;

const config: PlaywrightTestConfig = {
	webServer: {
		command: `pnpm build && pnpm preview --port ${port}`,
		port,
		reuseExistingServer: !process.env.CI
	},
	testDir: 'tests',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/,
	fullyParallel: true,
	retries: 3,
	globalSetup: './tests/global-setup',
	globalTeardown: './tests/global-teardown',
	workers: 1,
	reporter: process.env.CI ? 'list' : 'html',
	use: {
		baseURL,
		trace: 'on-first-retry',
		video: 'retain-on-failure',
		locale: 'en-US'
	},
	timeout: 30000,
	projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }]
};

export default config;

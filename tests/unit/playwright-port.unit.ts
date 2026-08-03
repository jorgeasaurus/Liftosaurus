import assert from 'node:assert/strict';
import test from 'node:test';
import { getPlaywrightPort } from '../playwright-port.js';

test('Playwright port uses the configured valid TCP port', () => {
	assert.equal(getPlaywrightPort('4317'), 4317);
});

test('Playwright port falls back for empty, invalid, and out-of-range values', () => {
	for (const value of ['', 'not-a-port', '0', '65536', '4173.5']) {
		assert.equal(getPlaywrightPort(value), 4173);
	}
});

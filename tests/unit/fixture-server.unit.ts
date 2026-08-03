import assert from 'node:assert/strict';
import test from 'node:test';
import { getFixtureServerDetails } from '../fixtureServer.js';

test('derives authentication cookie and navigation details from a 127.0.0.1 base URL', () => {
	assert.deepEqual(getFixtureServerDetails('http://127.0.0.1:4176'), {
		origin: 'http://127.0.0.1:4176',
		profileURL: 'http://127.0.0.1:4176/profile',
		cookieDomain: '127.0.0.1',
		cookieSecure: false
	});
});

test('marks fixture cookies secure when the configured base URL uses HTTPS', () => {
	assert.deepEqual(getFixtureServerDetails('https://liftosaurus.example'), {
		origin: 'https://liftosaurus.example',
		profileURL: 'https://liftosaurus.example/profile',
		cookieDomain: 'liftosaurus.example',
		cookieSecure: true
	});
});

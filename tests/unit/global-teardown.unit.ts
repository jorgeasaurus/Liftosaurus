import assert from 'node:assert/strict';
import test from 'node:test';
import globalTeardown from '../global-teardown';

test('global teardown skips cleanup when global setup did not create test users', async () => {
	const originalTestUsersData = process.env.TEST_USERS_DATA;
	delete process.env.TEST_USERS_DATA;

	try {
		await globalTeardown();
	} finally {
		if (originalTestUsersData === undefined) delete process.env.TEST_USERS_DATA;
		else process.env.TEST_USERS_DATA = originalTestUsersData;
	}

	assert.ok(true);
});

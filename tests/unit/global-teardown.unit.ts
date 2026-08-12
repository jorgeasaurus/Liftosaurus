import assert from 'node:assert/strict';
import test from 'node:test';
import { getTestUserCleanupFilters } from '../global-teardown';

test('global teardown retains fallback cleanup when global setup did not publish test users', () => {
	assert.deepEqual(getTestUserCleanupFilters(), [
		{
			email: {
				startsWith: 'test-user-',
				endsWith: '@Liftosaurus.com'
			}
		}
	]);
});

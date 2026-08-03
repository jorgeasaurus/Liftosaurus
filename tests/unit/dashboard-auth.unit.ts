import assert from 'node:assert/strict';
import test from 'node:test';
import { load } from '../../src/routes/dashboard/+page.server.js';

test('dashboard load aborts with 401 before querying data when unauthenticated', async () => {
	let authCalls = 0;
	await assert.rejects(
		load({
			depends() {},
			locals: {
				auth: async () => {
					authCalls++;
					return null;
				}
			}
		} as never),
		(error: unknown) =>
			typeof error === 'object' && error !== null && 'status' in error && (error as { status: number }).status === 401
	);
	assert.equal(authCalls, 1);
});

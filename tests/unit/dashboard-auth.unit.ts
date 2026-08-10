import assert from 'node:assert/strict';
import test from 'node:test';
import { load } from '../../src/routes/dashboard/+page.server.js';

test('dashboard load redirects unauthenticated users to the landing page before querying data', async () => {
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
			typeof error === 'object' &&
			error !== null &&
			'status' in error &&
			'location' in error &&
			(error as { status: number; location: string }).status === 302 &&
			(error as { status: number; location: string }).location === '/'
	);
	assert.equal(authCalls, 1);
});

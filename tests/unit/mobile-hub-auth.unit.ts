import assert from 'node:assert/strict';
import test from 'node:test';
import { load as loadMore } from '../../src/routes/more/+page.server.js';
import { load as loadPlans } from '../../src/routes/plans/+page.server.js';

for (const [name, load] of [
	['More', loadMore],
	['Plans', loadPlans]
] as const) {
	test(`${name} redirects unauthenticated users to the landing page`, async () => {
		await assert.rejects(
			load({ locals: { auth: async () => null } } as never),
			(error: unknown) =>
				typeof error === 'object' &&
				error !== null &&
				'status' in error &&
				'location' in error &&
				(error as { status: number; location: string }).status === 302 &&
				(error as { status: number; location: string }).location === '/'
		);
	});
}

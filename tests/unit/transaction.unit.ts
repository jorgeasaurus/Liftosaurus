import assert from 'node:assert/strict';
import test from 'node:test';
import { retryTransactionConflicts } from '../../src/lib/trpc/transaction.js';

test('Cockroach serialization conflicts retry while other failures surface immediately', async () => {
	let conflictAttempts = 0;
	const result = await retryTransactionConflicts(async () => {
		conflictAttempts += 1;
		if (conflictAttempts < 3) throw Object.assign(new Error('serialization conflict'), { code: 'P2034' });
		return 'committed';
	});
	assert.equal(result, 'committed');
	assert.equal(conflictAttempts, 3);

	let otherAttempts = 0;
	await assert.rejects(
		retryTransactionConflicts(async () => {
			otherAttempts += 1;
			throw Object.assign(new Error('validation failed'), { code: 'P2002' });
		}),
		/validation failed/
	);
	assert.equal(otherAttempts, 1);
});

test('Cockroach serialization retries are bounded', async () => {
	let attempts = 0;
	await assert.rejects(
		retryTransactionConflicts(async () => {
			attempts += 1;
			throw Object.assign(new Error('serialization conflict'), { code: 'P2034' });
		}),
		/serialization conflict/
	);
	assert.equal(attempts, 5);
});

import assert from 'node:assert/strict';
import test from 'node:test';
import { retryTransactionConflicts } from '../../src/lib/trpc/transaction.js';

test('Prisma serialization conflicts retry while other failures surface immediately', async () => {
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

test('Prisma serialization retries use capped exponential jittered backoff', async () => {
	let attempts = 0;
	const delays: number[] = [];
	const result = await retryTransactionConflicts(
		async () => {
			attempts += 1;
			if (attempts < 5) throw Object.assign(new Error('serialization conflict'), { code: 'P2034' });
			return 'committed';
		},
		{
			sleep: async (milliseconds) => {
				delays.push(milliseconds);
			},
			random: () => 0.5
		}
	);

	assert.equal(result, 'committed');
	assert.deepEqual(delays, [7.5, 15, 30, 37.5]);
});

test('Prisma serialization retries are bounded', async () => {
	let attempts = 0;
	await assert.rejects(
		retryTransactionConflicts(
			async () => {
				attempts += 1;
				throw Object.assign(new Error('serialization conflict'), { code: 'P2034' });
			},
			{ sleep: async () => undefined }
		),
		/serialization conflict/
	);
	assert.equal(attempts, 5);
});

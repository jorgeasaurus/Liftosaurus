import { prisma } from '$lib/prisma';
import { Prisma } from '@prisma/client';

const MAX_TRANSACTION_ATTEMPTS = 5;
const BASE_RETRY_DELAY_MS = 10;
const MAX_RETRY_DELAY_MS = 50;

type RetryTransactionOptions = {
	sleep?: (milliseconds: number) => Promise<void>;
	random?: () => number;
};

export async function retryTransactionConflicts<T>(
	operation: () => Promise<T>,
	{
		sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds)),
		random = Math.random
	}: RetryTransactionOptions = {}
): Promise<T> {
	for (let attempt = 1; ; attempt += 1) {
		try {
			return await operation();
		} catch (error) {
			const canRetry = typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2034';
			if (!canRetry || attempt === MAX_TRANSACTION_ATTEMPTS) throw error;
			const exponentialDelay = Math.min(BASE_RETRY_DELAY_MS * 2 ** (attempt - 1), MAX_RETRY_DELAY_MS);
			await sleep(exponentialDelay * (0.5 + random() / 2));
		}
	}
}

export async function runSerializableTransaction<T>(
	operation: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<T> {
	return retryTransactionConflicts(() =>
		prisma.$transaction(operation, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable })
	);
}

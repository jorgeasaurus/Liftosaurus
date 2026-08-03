import { prisma } from '$lib/prisma';
import { Prisma } from '@prisma/client';

const MAX_TRANSACTION_ATTEMPTS = 5;

export async function retryTransactionConflicts<T>(operation: () => Promise<T>): Promise<T> {
	for (let attempt = 1; ; attempt += 1) {
		try {
			return await operation();
		} catch (error) {
			const canRetry = typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2034';
			if (!canRetry || attempt === MAX_TRANSACTION_ATTEMPTS) throw error;
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

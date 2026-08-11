import { config } from 'dotenv';
import type { Prisma } from '@prisma/client';
config();
import { prisma } from '../src/lib/prisma';
import type { UserData } from './global-setup';

export function getTestUserCleanupFilters(testUsersDataJson?: string) {
	const filters: Prisma.UserWhereInput[] = [];
	if (testUsersDataJson) {
		const testUsersData: UserData[] = JSON.parse(testUsersDataJson);
		filters.push({ id: { in: testUsersData.map(({ userId }) => userId) } });
	}

	filters.push({
		email: {
			startsWith: 'test-user-',
			endsWith: '@Liftosaurus.com'
		}
	});

	return filters;
}

export default async function globalTeardown() {
	for (const where of getTestUserCleanupFilters(process.env.TEST_USERS_DATA)) {
		await prisma.user.deleteMany({ where });
	}
}

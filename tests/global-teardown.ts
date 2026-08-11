import { config } from 'dotenv';
config();
import { prisma } from '../src/lib/prisma';
import type { UserData } from './global-setup';

export default async function globalTeardown() {
	const testUsersDataJson = process.env.TEST_USERS_DATA;
	if (!testUsersDataJson) return;

	const testUsersData: UserData[] = JSON.parse(testUsersDataJson);

	await prisma.user.deleteMany({
		where: { id: { in: testUsersData.map(({ userId }) => userId) } }
	});

	await prisma.user.deleteMany({
		where: {
			email: {
				startsWith: 'test-user-',
				endsWith: '@Liftosaurus.com'
			}
		}
	});
}

import { dev } from '$app/environment';
import { prisma } from '$lib/prisma';
import { error, json } from '@sveltejs/kit';
import { randomUUID } from 'node:crypto';

const AGENT_EMAIL = 'agent-test@liftosaurus.local';
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

export const POST = async ({ cookies, request }) => {
	if (!dev || process.env.AGENT_LOGIN_ENABLED !== 'true') error(404, 'Not found');
	if (request.headers.get('origin') !== new URL(request.url).origin) error(403, 'Forbidden');

	const sessionToken = randomUUID();
	const expires = new Date(Date.now() + SESSION_DURATION_MS);
	const user = await prisma.$transaction(async (transaction) => {
		const agentUser = await transaction.user.upsert({
			where: { email: AGENT_EMAIL },
			update: { name: 'Agent Test User' },
			create: { email: AGENT_EMAIL, name: 'Agent Test User' }
		});
		await transaction.session.deleteMany({ where: { userId: agentUser.id } });
		await transaction.session.create({ data: { sessionToken, expires, userId: agentUser.id } });
		return agentUser;
	});

	cookies.set('authjs.session-token', sessionToken, {
		expires,
		httpOnly: true,
		path: '/',
		sameSite: 'lax',
		secure: !dev
	});

	return json({ userId: user.id });
};

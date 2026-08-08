import { dev } from '$app/environment';

export const load = async ({ locals, url }) => {
	// Session state can change between client-side navigations without remounting this layout.
	void url.pathname;
	const session = await locals.auth();
	return { session, agentLoginEnabled: dev && process.env.AGENT_LOGIN_ENABLED === 'true' };
};

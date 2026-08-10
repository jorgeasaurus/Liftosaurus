import { redirect } from '@sveltejs/kit';

export const load = async ({ parent, url }) => {
	const { session } = await parent();
	if (session && !url.searchParams.has('forceView')) redirect(302, '/dashboard');
};

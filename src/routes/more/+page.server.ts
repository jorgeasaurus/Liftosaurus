import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	if (!(await locals.auth())) redirect(302, '/');
};

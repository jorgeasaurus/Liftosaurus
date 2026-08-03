import { buildUserJsonBackup, backupFilename } from '$lib/server/user-export.js';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	const session = await locals.auth();
	const userId = session?.user?.id;

	if (!userId) error(401, 'Not logged in');

	const exportedAt = new Date();
	const backup = await buildUserJsonBackup(userId, exportedAt);

	return new Response(JSON.stringify(backup, null, 2), {
		headers: {
			'cache-control': 'private, no-store, max-age=0',
			'content-disposition': `attachment; filename="${backupFilename('json', exportedAt)}"`,
			'content-type': 'application/json; charset=utf-8',
			pragma: 'no-cache',
			'x-content-type-options': 'nosniff'
		}
	});
};

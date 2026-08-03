import { backupFilename, buildUserCsvExport } from '$lib/server/user-export.js';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	const session = await locals.auth();
	const userId = session?.user?.id;

	if (!userId) error(401, 'Not logged in');

	const exportedAt = new Date();
	const csv = await buildUserCsvExport(userId);

	return new Response(csv, {
		headers: {
			'cache-control': 'private, no-store, max-age=0',
			'content-disposition': `attachment; filename="${backupFilename('csv', exportedAt)}"`,
			'content-type': 'text/csv; charset=utf-8',
			pragma: 'no-cache',
			'x-content-type-options': 'nosniff'
		}
	});
};

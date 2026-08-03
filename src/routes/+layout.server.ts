export const load = async ({ locals, url }) => {
	// Session state can change between client-side navigations without remounting this layout.
	void url.pathname;
	const session = await locals.auth();
	return { session };
};

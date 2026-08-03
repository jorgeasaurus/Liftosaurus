export function getFixtureServerDetails(baseURL: string) {
	const serverURL = new URL(baseURL);
	return {
		origin: serverURL.origin,
		profileURL: new URL('/profile', serverURL).href,
		cookieDomain: serverURL.hostname,
		cookieSecure: serverURL.protocol === 'https:'
	};
}

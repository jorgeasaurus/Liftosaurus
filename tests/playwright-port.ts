export const DEFAULT_PLAYWRIGHT_PORT = 4173;

export function getPlaywrightPort(value: string | undefined) {
	const port = Number(value);
	return Number.isInteger(port) && port >= 1 && port <= 65535 ? port : DEFAULT_PLAYWRIGHT_PORT;
}

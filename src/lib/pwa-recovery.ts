export type StylesheetRecovery = {
	isPageLoaded: () => boolean;
	waitForPageLoad: () => Promise<void>;
	waitForStylesheetStatus: () => Promise<void>;
	hasFailedStylesheet: () => boolean;
	activateWaitingWorker: (reloadPage: boolean) => Promise<void>;
};

export type StylesheetLoad = {
	hasSheet: boolean;
	responseStatuses: readonly number[];
};

export function hasFailedStylesheetLoad(stylesheets: readonly StylesheetLoad[]): boolean {
	return stylesheets.some(
		(stylesheet) => !stylesheet.hasSheet || stylesheet.responseStatuses.some((status) => status >= 400)
	);
}

export async function recoverFailedStylesheet(recovery: StylesheetRecovery): Promise<boolean> {
	if (!recovery.isPageLoaded()) await recovery.waitForPageLoad();
	await recovery.waitForStylesheetStatus();
	if (!recovery.hasFailedStylesheet()) return false;

	await recovery.activateWaitingWorker(true);
	return true;
}

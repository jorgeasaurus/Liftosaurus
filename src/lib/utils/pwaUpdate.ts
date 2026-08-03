export function activateAppUpdate(updateServiceWorker: (reloadPage: boolean) => unknown) {
	return updateServiceWorker(true);
}

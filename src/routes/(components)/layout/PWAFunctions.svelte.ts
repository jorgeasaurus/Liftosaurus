import { browser } from '$app/environment';
import { hasFailedStylesheetLoad, recoverFailedStylesheet } from '$lib/pwa-recovery';
import { useRegisterSW } from 'virtual:pwa-register/svelte';

let checkForUpdates: (() => Promise<void>) | null = null;
let sw: ReturnType<typeof useRegisterSW> | null = null;

function waitForPageLoad(): Promise<void> {
	if (document.readyState === 'complete') return Promise.resolve();
	return new Promise((resolve) => window.addEventListener('load', () => resolve(), { once: true }));
}

if (browser) {
	sw = useRegisterSW({
		onNeedRefresh() {
			void recoverFailedStylesheet({
				isPageLoaded: () => document.readyState === 'complete',
				waitForPageLoad,
				waitForStylesheetStatus: () =>
					new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))),
				hasFailedStylesheet: () =>
					hasFailedStylesheetLoad(
						Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')).map((link) => ({
							hasSheet: link.sheet !== null,
							responseStatuses: performance
								.getEntriesByName(link.href)
								.map((entry) => (entry instanceof PerformanceResourceTiming ? entry.responseStatus : 0))
						}))
					),
				activateWaitingWorker: (reloadPage) => sw!.updateServiceWorker(reloadPage)
			});
		},
		onRegisteredSW(swUrl, r) {
			checkForUpdates = async () => {
				if (!r) return;
				if (!navigator || r.installing) return;
				if ('connection' in navigator && !navigator.onLine) return;

				const resp = await fetch(swUrl, {
					cache: 'no-store',
					headers: {
						cache: 'no-store',
						'cache-control': 'no-cache'
					}
				});
				if (resp.status === 200) await r.update();
			};

			if (r) {
				void checkForUpdates();
				setInterval(checkForUpdates, 3600000);
			}
			console.log(`SW Registered: ${r}`);
		},
		onRegisterError(error: unknown) {
			console.log('SW registration error', error);
		}
	});
}

export const needRefresh = sw?.needRefresh;
export const updateServiceWorker = sw?.updateServiceWorker;
export const offlineReady = sw?.offlineReady;
export const updateDataLossDialog = $state({ open: false });

export { checkForUpdates };

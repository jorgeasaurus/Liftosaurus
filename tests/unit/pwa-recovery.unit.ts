import assert from 'node:assert/strict';
import test from 'node:test';
import { hasFailedStylesheetLoad, recoverFailedStylesheet } from '../../src/lib/pwa-recovery.js';

test('detects a stylesheet 404 even while the browser still exposes a sheet', () => {
	assert.equal(hasFailedStylesheetLoad([{ hasSheet: true, responseStatuses: [404] }]), true);
	assert.equal(hasFailedStylesheetLoad([{ hasSheet: true, responseStatuses: [200] }]), false);
});

test('activates a waiting worker after the page finishes with a failed stylesheet', async () => {
	let pageLoaded = false;
	const activations: boolean[] = [];

	const recovered = await recoverFailedStylesheet({
		isPageLoaded: () => pageLoaded,
		waitForPageLoad: async () => {
			pageLoaded = true;
		},
		waitForStylesheetStatus: async () => undefined,
		hasFailedStylesheet: () => pageLoaded,
		activateWaitingWorker: async (reloadPage) => {
			activations.push(reloadPage);
		}
	});

	assert.equal(recovered, true);
	assert.deepEqual(activations, [true]);
});

test('preserves the normal update prompt when stylesheets loaded', async () => {
	let activated = false;

	const recovered = await recoverFailedStylesheet({
		isPageLoaded: () => true,
		waitForPageLoad: async () => undefined,
		waitForStylesheetStatus: async () => undefined,
		hasFailedStylesheet: () => false,
		activateWaitingWorker: async () => {
			activated = true;
		}
	});

	assert.equal(recovered, false);
	assert.equal(activated, false);
});

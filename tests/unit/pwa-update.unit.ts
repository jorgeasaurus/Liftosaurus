import assert from 'node:assert/strict';
import { it } from 'node:test';
import { activateAppUpdate } from '../../src/lib/utils/pwaUpdate';
import { keyValueStorage } from './workout-draft-test-utils';

it('activates a PWA update without clearing draft or quarantined storage', () => {
	const storage = keyValueStorage({
		'workoutRunes:user:account-a:active': 'account-a-draft',
		'workoutRunes:user:account-b:edit': 'account-b-draft',
		workoutRunes: 'quarantined-global-legacy',
		'unrelated-sentinel': 'preserved'
	});
	const originalLocalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
	Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: storage });

	try {
		let reloadPage: boolean | undefined;
		activateAppUpdate((reload) => {
			reloadPage = reload;
		});

		assert.equal(reloadPage, true);
		assert.equal(storage.getItem('workoutRunes:user:account-a:active'), 'account-a-draft');
		assert.equal(storage.getItem('workoutRunes:user:account-b:edit'), 'account-b-draft');
		assert.equal(storage.getItem('workoutRunes'), 'quarantined-global-legacy');
		assert.equal(storage.getItem('unrelated-sentinel'), 'preserved');
	} finally {
		if (originalLocalStorage) Object.defineProperty(globalThis, 'localStorage', originalLocalStorage);
		else Reflect.deleteProperty(globalThis, 'localStorage');
	}
});

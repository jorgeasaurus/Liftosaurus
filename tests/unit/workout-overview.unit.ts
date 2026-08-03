import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const overviewSource = readFileSync(
	new URL('../../src/routes/workouts/manage/overview/+page.svelte', import.meta.url),
	'utf8'
);

test('an invalid preprocessed workout releases the saving state before returning', () => {
	assert.match(
		overviewSource,
		/if \(createData === undefined\) \{\s+savingWorkout = false;\s+return;\s+\}/,
		'the undefined preprocessing path must leave the Save button usable'
	);
});

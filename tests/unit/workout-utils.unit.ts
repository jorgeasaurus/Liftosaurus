import assert from 'node:assert/strict';
import test from 'node:test';
import { getPreviousBodyweightFraction } from '../../src/lib/utils/workoutUtils.js';

test('previous bodyweight fraction preserves an explicit non-bodyweight exercise', () => {
	const fraction = getPreviousBodyweightFraction([{ name: 'Pull-up', bodyweightFraction: null }], 'Pull-up', 1);

	assert.equal(fraction, null);
});

test('previous bodyweight fraction falls back to the current exercise when no history matches', () => {
	const fraction = getPreviousBodyweightFraction([{ name: 'Dip', bodyweightFraction: 0.85 }], 'Pull-up', 1);

	assert.equal(fraction, 1);
});

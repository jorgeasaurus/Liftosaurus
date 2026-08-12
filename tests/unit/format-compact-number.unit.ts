import assert from 'node:assert/strict';
import test from 'node:test';
import { formatCompactNumber } from '../../src/lib/utils/formatCompactNumber.js';

test('compact counts truncate instead of overstating values near display thresholds', () => {
	assert.equal(formatCompactNumber(9999), '9999');
	assert.equal(formatCompactNumber(10000), '10.0k');
	assert.equal(formatCompactNumber(99999), '99.9k');
	assert.equal(formatCompactNumber(100000), '100k');
	assert.equal(formatCompactNumber(100999), '100k');
});

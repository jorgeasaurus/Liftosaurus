import assert from 'node:assert/strict';
import test from 'node:test';
import { createId } from '@paralleldrive/cuid2';
import { ExerciseSplitSchema } from '../../src/lib/zodSchemas/index.js';

test('generated Zod schemas import and validate CUID2 identifiers', () => {
	const id = createId();
	assert.deepEqual(ExerciseSplitSchema.parse({ id, name: 'Test split', userId: id }), {
		id,
		name: 'Test split',
		userId: id
	});
});

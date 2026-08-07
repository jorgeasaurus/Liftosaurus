import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createId } from '@paralleldrive/cuid2';
import { z } from '../../src/lib/zodSchemas';

describe('zod cuid2 compatibility', () => {
	it('accepts a library-generated cuid2 and rejects invalid values', () => {
		const schema = z.object({ id: z.cuid2() });
		const validId = createId();

		assert.deepEqual(schema.parse({ id: validId }), { id: validId });
		assert.throws(() => schema.parse({ id: 'not-a-cuid2' }), /Invalid cuid2/);
	});
});

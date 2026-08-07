import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { z } from '../../src/lib/zodSchemas';

describe('zod cuid2 compatibility', () => {
	it('accepts cuid2-style ids and rejects invalid values', () => {
		const schema = z.object({ id: z.cuid2() });

		assert.deepEqual(schema.parse({ id: 'clh4i2w6q0' }), { id: 'clh4i2w6q0' });
		assert.throws(() => schema.parse({ id: 'not-a-cuid2' }), /Invalid cuid2/);
	});
});

// Re-applies the cuid/cuid2 Proxy shim after prisma generate overwrites the file.
// zod v3.23+ removed z.cuid() and z.cuid2(); zod-prisma-types still emits them.
const fs = require('node:fs');
const path = require('node:path');

const target = path.join(__dirname, '../src/lib/zodSchemas/index.ts');
const content = fs.readFileSync(target, 'utf8');

if (content.startsWith('// @ts-nocheck')) {
	console.log('zod-schemas: shim already present, skipping.');
	process.exit(0);
}

const SHIM_HEADER = `// @ts-nocheck — generated file; Proxy shim below polyfills cuid/cuid2 removed in zod v3.23+
import { isCuid } from '@paralleldrive/cuid2';
import type { Prisma } from '@prisma/client';
import { z as baseZ, type ZodEffects, type ZodString } from 'zod';

export const z = new Proxy(baseZ, {
\tget(target, prop, receiver) {
\t\tif (prop === 'cuid') return () => baseZ.string().refine(isCuid, { message: 'Invalid cuid' });
\t\tif (prop === 'cuid2') return () => baseZ.string().refine(isCuid, { message: 'Invalid cuid2' });
\t\treturn Reflect.get(target, prop, receiver);
\t}
}) as typeof baseZ & {
\tcuid: () => ZodEffects<ZodString, string, string>;
\tcuid2: () => ZodEffects<ZodString, string, string>;
};

`;

// Replace the generated z import line with the shim header
const patched = content.replace(
	/^import \{ z \} from 'zod';\nimport type \{ Prisma \} from '@prisma\/client';\n/m,
	SHIM_HEADER
);

if (patched === content) {
	console.error('zod-schemas: could not locate expected import header — shim not applied.');
	process.exit(1);
}

fs.writeFileSync(target, patched, 'utf8');
console.log('zod-schemas: cuid/cuid2 shim applied.');

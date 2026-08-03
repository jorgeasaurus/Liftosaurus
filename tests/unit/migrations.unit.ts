import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

test('ordered migrations do not create the same named index more than once', () => {
	const migrationsDirectory = join(process.cwd(), 'prisma', 'migrations');
	const declarations = new Map<string, string[]>();

	const migrationDirectories = readdirSync(migrationsDirectory, { withFileTypes: true })
		.filter((entry) => entry.isDirectory())
		.map((entry) => entry.name)
		.sort();

	for (const migrationDirectory of migrationDirectories) {
		const migrationPath = join(migrationsDirectory, migrationDirectory, 'migration.sql');
		const sql = readFileSync(migrationPath, 'utf8');

		for (const match of sql.matchAll(/CREATE (?:UNIQUE )?INDEX "([^"]+)"/g)) {
			const indexName = match[1];
			declarations.set(indexName, [...(declarations.get(indexName) ?? []), migrationDirectory]);
		}
	}

	const duplicates = [...declarations]
		.filter(([, migrationDirectories]) => migrationDirectories.length > 1)
		.map(([indexName, migrationDirectories]) => `${indexName}: ${migrationDirectories.join(', ')}`);

	assert.deepEqual(duplicates, []);
});

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import github from '@auth/sveltekit/providers/github';

test('GitHub provider is given the RFC 9207 issuer Auth.js otherwise rejects', () => {
	const defaults = github();
	assert.equal(defaults.type, 'oauth');
	assert.equal(defaults.issuer, undefined);

	const configured = github({ issuer: 'https://github.com/login/oauth' });
	assert.equal(configured.options?.issuer, 'https://github.com/login/oauth');

	const hooks = readFileSync(new URL('../../src/hooks.server.ts', import.meta.url), 'utf8');
	assert.match(hooks, /github\(\{[\s\S]*issuer:\s*'https:\/\/github\.com\/login\/oauth'/);
	assert.match(hooks, /basePath:\s*'\/auth'/);
	assert.match(hooks, /trustHost:\s*true/);
});

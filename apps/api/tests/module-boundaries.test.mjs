import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('UsersModule does not depend back on IdentityModule', async () => {
  const source = await readFile(new URL('../src/modules/users/users.module.ts', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /identity/i);
  assert.doesNotMatch(source, /SessionGuard/);
});

test('session-owned current-user endpoint is composed inside IdentityModule', async () => {
  const source = await readFile(new URL('../src/modules/identity/identity.module.ts', import.meta.url), 'utf8');
  assert.match(source, /MeController/);
  assert.match(source, /SessionGuard/);
});

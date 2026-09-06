import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('login does not pretend deleted media was restored', async () => {
  const source = await readFile(new URL('../src/modules/users/infrastructure/postgres-users.repository.ts', import.meta.url), 'utf8');
  const markLogin = source.slice(source.indexOf('async markLogin'), source.indexOf('async touchActivity'));
  assert.doesNotMatch(markLogin, /media_pruned_at\s*=\s*NULL/i);
});

test('refresh is activity, not a new login', async () => {
  const source = await readFile(new URL('../src/modules/identity/application/auth.service.ts', import.meta.url), 'utf8');
  const refresh = source.slice(source.indexOf('async rotateRefresh'), source.indexOf('async logout'));
  assert.match(refresh, /touchActivity/);
  assert.doesNotMatch(refresh, /markLogin/);
});

test('new actor is loaded after registration transaction commits', async () => {
  const source = await readFile(new URL('../src/modules/identity/application/auth.service.ts', import.meta.url), 'utf8');
  const verify = source.slice(source.indexOf('async verifyEmailOtp'), source.indexOf('async authenticateAccess'));
  assert.match(verify, /const result = await this\.db\.transaction/);
  assert.match(verify, /const actor = await this\.loadActor\(result\.userId\)/);
});

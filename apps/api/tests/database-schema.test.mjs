import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('identity schema keeps lifecycle activity separate from login security timestamp', async () => {
  const sql = await readFile(new URL('../../../database/migrations/002_accounts_users.sql', import.meta.url), 'utf8');
  assert.match(sql, /last_login_at/);
  assert.match(sql, /last_active_at/);
  assert.match(sql, /legal_hold/);
});

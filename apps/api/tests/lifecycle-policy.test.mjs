import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const policyPath = new URL('../src/modules/lifecycle/domain/inactivity-policy.ts', import.meta.url);

test('lifecycle policy keeps the agreed inactivity thresholds explicit', async () => {
  const source = await readFile(policyPath, 'utf8');
  assert.match(source, /MEDIA_PRUNE_AFTER_DAYS = 7/);
  assert.match(source, /ACCOUNT_DELETE_AFTER_DAYS = 365/);
  assert.match(source, /legalHold/);
  assert.match(source, /mediaPrunedAt/);
});

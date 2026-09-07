import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('SystemModule is wired into the root application so /health exists', async () => {
  const appModule = await readFile(new URL('../src/app.module.ts', import.meta.url), 'utf8');
  const systemModule = await readFile(new URL('../src/system/system.module.ts', import.meta.url), 'utf8');
  const healthController = await readFile(new URL('../src/system/health.controller.ts', import.meta.url), 'utf8');
  assert.match(appModule, /SystemModule/);
  assert.match(systemModule, /HealthController/);
  assert.match(healthController, /Controller\('health'\)/);
});

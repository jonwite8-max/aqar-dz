import { access } from 'node:fs/promises';
const required=['apps/web/app/layout.tsx','apps/web/lib/routes.ts','apps/api/src/app.module.ts','apps/api/src/modules/index.ts','docs/architecture/ADR-001-modular-monolith.md','docs/COMPONENT-LEDGER.md','infra/docker-compose.yml','.github/workflows/ci.yml'];
for(const path of required) await access(path);
console.log(`structure ok: ${required.length} critical paths verified`);

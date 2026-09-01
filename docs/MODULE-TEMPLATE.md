# قالب Module جديد

عند بدء تنفيذ أي محرك يتحول مجلده إلى:
```text
module-name/
├── domain/          # Entities, value objects, domain rules, domain events
├── application/     # Use cases, ports, commands/queries
├── infrastructure/  # DB adapters, queues, providers
├── interfaces/      # HTTP/event consumers and DTO mapping
└── module-name.module.ts
```

## ممنوع
- Business Logic في Controller/Page.
- الاستيراد من `infrastructure` لنطاق آخر.
- Repository عام يتعامل مع أكثر من نطاق.
- `utils.ts` ضخم أو Helpers مكررة.
- DTO = Database Entity.

## بوابة إنشاء Module
DoR + owner + acceptance criteria + API/schema/event contract + threat impact + tests + migration/rollback إن لزم.

# حالة المرحلة 0–1

## Phase 0 — التأسيس
- الرؤية والنطاق والخطة المرجعية: معتمدة خارج المستودع وسيتم نقل النسخة النصية المعتمدة لاحقًا.
- Architecture: ADR-001.
- Component Ledger: منشأ.

## Phase 1 — الأساس الهندسي
### موجود
- Monorepo + pnpm + Turbo.
- Web/PWA shell وصفحات Skeleton.
- NestJS API shell وحدود Modules.
- Shared contracts فقط.
- Docker Compose: PostGIS + Redis + Object Storage.
- CI skeleton وفحوص structure/lint/typecheck/test/build.
- Threat model تأسيسي.

### لا يزال قبل G5
- تشغيل CI فعليًا ومراجعة النتائج.
- تثبيت lockfile بعد أول install موثوق.
- اختيار ORM وإستراتيجية migrations ضمن ADR مستقل.
- Observability provider الفعلي.
- Secrets manager وبيئات staging/production.
- Security scanning workflows وSBOM.

**ممنوع الانتقال للهوية قبل إغلاق عناصر G1–G5 المطلوبة للمرحلة 1.**

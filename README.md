# Aqar DZ — منصة العقارات الجزائرية

الإصدار الحالي: `v0.2.0-server-lifecycle`.

## الهدف الهندسي
المستودع هو المصدر الرسمي للمشروع الذي يعمل محليًا وعلى VPS. لا توجد نسخة HTML منفصلة تتحول لاحقًا إلى Backend آخر.

## المبادئ
- Modular Monolith بحدود نطاقات صريحة.
- Web/PWA لا يملك منطق الأعمال الحاسم.
- لا وصول مباشر لجداول نطاق آخر.
- PostgreSQL/PostGIS + Redis + Object Storage abstraction.
- كل تغيير يمر عبر DoR → Build → Verification → Regression → G5.
- لا تعديل يدوي داخل حاويات الإنتاج ولا أسرار داخل Git.

## دورة حياة الخمول
السياسة `2026-09-v1`:
- بعد 7 أيام دون تسجيل دخول: تنظيف صور وفيديوهات إعلانات الحساب من التخزين، مع إبقاء نص الإعلان وبياناته ليعيد المستخدم رفع الوسائط عند عودته.
- بعد 365 يومًا دون تسجيل دخول: الحساب مؤهل للحذف بعد الإنذارات، مع فصل السجلات التي يلزم الاحتفاظ بها قانونيًا أو تدقيقيًا.
- `legal_hold` يوقف الحذف الآلي.

التفاصيل: `docs/policies/DATA_LIFECYCLE.md` و`docs/adr/ADR-002-data-lifecycle.md`.

## التشغيل المحلي
```bash
pnpm install
pnpm dev
```

Web: `http://localhost:3000`
API: `http://localhost:4000/api/v1`
Health: `http://localhost:4000/api/v1/health`

## بنية الإنتاج الأولية
راجع `docs/operations/HOSTINGER_VPS.md` و`infra/production/docker-compose.yml`.

## الفحوص
```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

هذه المرحلة تؤسس التشغيل والخمول وحدود النطاقات؛ ميزات الهوية والعقارات والبحث لم تُنفذ بعد ولا يتم تعويضها بمنطق مؤقت في الواجهة.

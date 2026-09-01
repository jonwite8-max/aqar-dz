# Aqar DZ — منصة العقارات الجزائرية

النسخة التأسيسية `v0.1.0-foundation` لمنصة Web + PWA للعقارات في الجزائر.

## المبادئ
- Modular Monolith منظم بحدود نطاقات صريحة.
- الواجهة لا تحتوي منطق أعمال حاسم.
- لا وصول مباشر لجداول نطاق آخر.
- كل تغيير يمر عبر DoR → Build → Verification → Regression → G5.
- لا يُعتبر البديل Done قبل إزالة المسار القديم أو تحديد موعد إزالة ملزم.

## المتطلبات
- Node.js >= 22
- pnpm >= 10
- Docker Desktop للتشغيل المحلي للخدمات المساندة

## التشغيل
```bash
pnpm install
pnpm dev
```

Web: `http://localhost:3000`
API: `http://localhost:4000/api/v1`

## الفحوص
```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## الحالة
هذه النسخة Skeleton تأسيسية فقط. لا تحتوي ميزات عقارية مكتملة أو منطق أعمال مؤقت داخل الصفحات. المرجع التنفيذي في `docs/`.

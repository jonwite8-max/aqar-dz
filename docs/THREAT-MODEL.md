# Threat Model — Foundation

هذه وثيقة تأسيسية وليست Threat Model نهائيًا.

## أصول حساسة
- الهوية وPII ووسائل الاتصال.
- وثائق التحقق والوكالات والملكية.
- الرسائل وسجل المخاطر والتدقيق.
- المدفوعات والفواتير.

## حدود الثقة
Browser/PWA → API → Domain Modules → Data stores / Queue / Object storage / Providers.

## ضوابط الأساس
- HTTPS فقط في الإنتاج.
- Server-side authorization لكل Object حساس.
- RBAC + ABAC.
- MFA للحسابات الإدارية.
- Rate limiting وanti-automation للمسارات الحساسة.
- Signed URLs للوثائق والوسائط الخاصة.
- PII masking في logs.
- Audit غير قابل للتعديل منطقيًا.
- لا PII في Service Worker cache العام.

يجب توسيع هذا الملف قبل G1 لكل مرحلة حساسة.

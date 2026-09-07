# Database migration policy

## قاعدة التنفيذ
كل إصدار يطبق migrations قبل استبدال API الحالي. فشل migration يوقف deploy. لا يبدأ تطبيق جديد على Schema غير متحقق.

## Expand → Migrate/Backfill → Verify → Contract
1. **Expand:** إضافة جداول/حقول/فهارس متوافقة خلفيًا فقط.
2. **Migrate/Backfill:** نقل البيانات عبر Job قابل للاستئناف عند الحاجة.
3. **Verify:** مقارنة العدّادات والقيود وتشغيل Integration/E2E.
4. **Contract:** إزالة المسار القديم في إصدار لاحق فقط بعد ثبوت عدم وجود مستهلكين قدامى.

## Rollback
Migrations في v0.3.0 هي Expand-only؛ الرجوع إلى إصدار التطبيق السابق لا يحتاج حذف الجداول الجديدة. لا ننفذ `DROP` تلقائيًا عند rollback لأن ذلك قد يحذف بيانات كتبها الإصدار الجديد. أي Contract migration يحتاج RFC/ADR وخطة استعادة منفصلة.

## Production
`scripts/deploy/hostinger-vps.sh` يشغّل `db:migrate` بعد تجهيز خدمات البيانات وقبل تشغيل حاويات Web/API الجديدة. يجب أخذ Backup واختبار Restore وفق Runbook قبل أي migration destructive مستقبلًا.

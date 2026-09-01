# Test Strategy

- Unit: قواعد المجال والحالات الحدية.
- Contract/API: توافق العقود.
- Integration: DB/Redis/Object Storage/Queues.
- E2E: رحلات المستخدم الأساسية.
- Regression: كل المراحل المغلقة المتأثرة، بوابة غير قابلة للتجاوز.
- Security: SAST/DAST/dependency/secrets.
- Performance/DR: قبل Beta وGA وربع سنويًا.

أي عيب مكتشف بعد إغلاق مكوّن يجب أن يولد Regression test قبل الإصلاح كلما كان ذلك عمليًا.

# API Conventions

- Prefix: `/api/v1`.
- أسماء resources بصيغة جمع واضحة.
- أخطاء مستقرة عبر `code` وليس نص الرسالة.
- كل خطأ تشغيلي يحتوي `correlationId`.
- Pagination cursor للبيانات الكبيرة.
- Idempotency-Key للعمليات المالية والنشر الحساسة عند الحاجة.
- لا كشف PII أو internal IDs دون حاجة.
- تغيير breaking يتطلب RFC وإصدارًا صريحًا.

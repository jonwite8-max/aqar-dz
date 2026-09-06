# Identity & Users v0.3.0

## قرار المصادقة
المرحلة الأولى تستخدم Email OTP حقيقي عبر SMTP، مع Adapter تطوير اختياري يعيد الرمز فقط عندما `OTP_DEV_ECHO=true` وخارج production. مخطط الهوية يدعم `phone` من البداية، لكن إرسال SMS لا يُفعّل حتى اختيار مزود جزائري/دولي معتمد بدل ربط النطاق بمزود عشوائي.

## الجلسات
- Access token عشوائي opaque لمدة 15 دقيقة، محفوظ في Cookie HttpOnly ولا يخزن خامًا في DB.
- Refresh token عشوائي لمدة 30 يومًا ويتم تدويره عند كل refresh وإبطال السابق.
- قاعدة البيانات تحفظ SHA-256 فقط للتوكنات.
- IP وUser-Agent لا يخزنان خامًا؛ يحفظ HMAC بمفتاح منفصل.
- Cookies في production: Secure + HttpOnly + SameSite=Strict.
- refresh/logout يتطلبان double-submit CSRF token.

## Lifecycle
`last_login_at` سجل أمني لعمليات الدخول. `last_active_at` هو مصدر قرار الخمول، ويتم تحديثه بحد أقصى مرة في الساعة أثناء استعمال جلسة صحيحة. هذا يمنع حذف وسائط مستخدم نشط لمجرد أن جلسته طويلة.

## حدود البيانات
- Users repository يملك `accounts.users` فقط.
- Identity repository يملك `identity.*` فقط.
- Authorization repository يملك `authorization.*` فقط.
- التنسيق عبر Services/Ports، ولا تستعلم وحدة مباشرة من جدول نطاق آخر.

## ما يمنع إقفال Phase 2 حاليًا
- SMS/Phone OTP provider لم يتم اختياره بعد.
- MFA الإداري لم يُنفذ بعد.
- E2E مع PostgreSQL/SMTP staging لم يكتمل بعد.
لذلك هذه الدفعة Vertical Slice وليست G5 للهوية بعد.

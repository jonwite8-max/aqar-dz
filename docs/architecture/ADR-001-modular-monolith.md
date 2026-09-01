# ADR-001 — Modular Monolith

**الحالة:** Accepted  
**الإصدار:** v0.1.0

## القرار
الـBackend يبدأ Modular Monolith بحدود نطاقات صريحة. لا Microservices قبل وجود دليل حمل أو عزل أمني أو ملكية تشغيلية يبرر الاستخراج.

## قواعد إلزامية
1. كل Module يملك Domain/Application/Infrastructure/Interfaces عند بدء منطق مرحلته.
2. لا Module يقرأ جداول Module آخر مباشرة.
3. التكامل يكون عبر Application contracts أو Domain events موثقة.
4. Controllers/Resolvers لا تحتوي قواعد أعمال.
5. الواجهة لا تقرر صلاحية أو سعرًا أو Match score أو Trust score.
6. Shared packages للعقود والتقنيات العامة فقط؛ يمنع Shared Business Logic.

## أسباب القرار
خفض التعقيد المبكر مع إبقاء مسار استخراج الخدمات لاحقًا دون إعادة كتابة المجال.

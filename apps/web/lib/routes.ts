export type AppRoute = { href: string; label: string; description: string; area: string; sections: string[] };
const s = (href: string, label: string, description: string, area: string, sections: string[]): AppRoute => ({ href, label, description, area, sections });
export const routeGroups = [
  { name: 'السوق', items: [
    s('/search','البحث','بحث وفلاتر ونتائج عقارية.','Marketplace',['شريط البحث','الفلاتر','النتائج','الحفظ والتنبيه']),
    s('/map','الخريطة','استكشاف النتائج جغرافيًا.','Marketplace',['الخريطة','نطاق المسافة','النتائج القريبة']),
    s('/property/example','تفاصيل العقار','صفحة عرض العقار ومؤشرات الثقة.','Marketplace',['الصور','السعر','المواصفات','الموقع التقريبي','الناشر','التواصل','الإبلاغ']),
    s('/publish','نشر عقار','مسار إنشاء وإدارة إعلان.','Listing',['نوع العملية','نوع العقار','الموقع','المواصفات','الصور','السعر','الخصوصية','المراجعة']),
    s('/requests','طلبات العقارات','طلبات الباحثين المنظمة.','Requests',['الفلاتر','بطاقات الطلبات','المطابقة']),
    s('/requests/new','نشر طلب','إنشاء ملف بحث عقاري.','Requests',['الغرض','الموقع','الميزانية','شروط ضرورية','شروط مفضلة']),
    s('/favorites','المفضلة','العقارات المحفوظة.','Marketplace',['القائمة','المقارنة','التنبيهات']),
    s('/matches','المطابقات','نتائج المطابقة المفسرة.','Matching',['نسبة التطابق','أسباب المطابقة','الاستبعادات']),
    s('/messages','الرسائل','تواصل داخلي آمن.','Communication',['المحادثات','الطلبات','مكافحة الإساءة']),
    s('/notifications','الإشعارات','إشعارات النظام والمطابقة والمتابعة.','Communication',['System','Security','Matches','Messages']),
    s('/viewings','المواعيد','إدارة طلبات المعاينة.','Leads',['الطلبات','التقويم','الحالة']),
  ]},
  { name: 'الحساب', items: [
    s('/account','حسابي','الملف والإعدادات والثقة.','Account',['الملف','الثقة','النشاط']),
    s('/account/verification','التحقق','حالة تحقق الهوية والصفة.','Account',['الهاتف','الهوية','الوكالة','الملكية']),
    s('/account/privacy','الخصوصية','قواعد كشف الهاتف والموقع.','Account',['الهاتف','ساعات الاتصال','الموقع','الحظر']),
    s('/account/security','الأمان','الجلسات وMFA والأجهزة.','Account',['الجلسات','MFA','الأجهزة']),
    s('/account/notifications','إعدادات الإشعارات','قنوات وتواتر وساعات هدوء.','Account',['القنوات','التواتر','ساعات الهدوء']),
    s('/my/properties','عقاراتي','الأصول العقارية المرتبطة بالحساب.','Account',['العقارات','الحالة']),
    s('/my/listings','إعلاناتي','إعلاناتي ودورة حياتها.','Account',['المسودات','المنشورة','الموقوفة','المؤرشفة']),
    s('/my/requests','طلباتي','ملفات البحث الخاصة بي.','Account',['النشطة','الموقوفة','المكتملة']),
  ]},
  { name: 'الوكالة', items: ['dashboard','properties','listings','clients','leads','viewings','team','analytics','billing'].map((x) => s(`/agency/${x}`,`الوكالة — ${x}`,'مساحة عمل الوكالة ضمن حدود الصلاحيات.','Agency',['ملخص','إجراءات','حالات'])) },
  { name: 'الإدارة', items: ['dashboard','moderation','users','agencies','listings','reports','risk','verification','system'].map((x) => s(`/admin/${x}`,`الإدارة — ${x}`,'واجهة تشغيلية منفصلة ومحمية.','Admin',['ملخص','قائمة عمل','سجل تدقيق'])) },
] as const;
export const allRoutes: AppRoute[] = routeGroups.flatMap((g) => [...g.items]);
export const routeByPath = (path: string) => allRoutes.find((r) => r.href === path || (r.href === '/property/example' && path.startsWith('/property/')));

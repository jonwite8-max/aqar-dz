'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api-client';

type Me = { user: { id: string; status: string; locale: string; lastLoginAt: string | null; lastActiveAt: string }; roles: string[] };

export default function AccountPage() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { void (async () => {
    const response = await apiFetch('/users/me');
    if (response.status === 401) { router.replace('/login'); return; }
    if (!response.ok) { setError('تعذر تحميل الحساب'); return; }
    setMe(await response.json() as Me);
  })(); }, [router]);

  if (error) return <main className="page"><section className="panel"><h1>الحساب</h1><p>{error}</p></section></main>;
  if (!me) return <main className="page"><section className="panel"><h1>جارٍ تحميل الحساب…</h1></section></main>;
  return <main className="page"><section className="pageHeader"><span className="eyebrow">هوية حقيقية من API</span><h1>حسابي</h1><p>حالة الحساب: <strong>{me.user.status}</strong></p></section><section className="grid"><article className="card"><strong>الأدوار</strong><span>{me.roles.join('، ') || 'user'}</span></article><article className="card"><strong>آخر تسجيل دخول</strong><span>{me.user.lastLoginAt ? new Date(me.user.lastLoginAt).toLocaleString('ar-DZ') : '—'}</span></article><article className="card"><strong>آخر نشاط</strong><span>{new Date(me.user.lastActiveAt).toLocaleString('ar-DZ')}</span></article></section></main>;
}

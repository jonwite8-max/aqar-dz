'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiJson } from '@/lib/api-client';
import styles from './login.module.css';

type OtpResponse = { accepted: true; devCode: string | null };

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [stage, setStage] = useState<'email' | 'otp'>('email');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devCode, setDevCode] = useState<string | null>(null);

  async function requestOtp(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError(null);
    try {
      const result = await apiJson<OtpResponse>('/auth/otp/request', { method: 'POST', body: JSON.stringify({ email }) });
      setDevCode(result.devCode); if (result.devCode) setCode(result.devCode); setStage('otp');
    } catch (e) { setError(e instanceof Error ? e.message : 'تعذر إرسال الرمز'); }
    finally { setBusy(false); }
  }

  async function verifyOtp(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError(null);
    try {
      await apiJson('/auth/otp/verify', { method: 'POST', body: JSON.stringify({ email, code }) });
      router.replace('/account'); router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : 'رمز التحقق غير صحيح'); }
    finally { setBusy(false); }
  }

  return <main className={styles.wrap}><section className={styles.card}>
    <p className="eyebrow">حساب عقارات DZ</p>
    <h1 className={styles.title}>{stage === 'email' ? 'الدخول أو إنشاء حساب' : 'تحقق من بريدك'}</h1>
    <p className={styles.muted}>{stage === 'email' ? 'أدخل بريدك. إذا لم يكن لديك حساب فسيتم إنشاؤه بعد التحقق، دون كلمة مرور قابلة للتسريب.' : `أرسلنا رمزًا من 6 أرقام إلى ${email}`}</p>
    {stage === 'email' ? <form onSubmit={requestOtp}><div className={styles.field}><label htmlFor="email">البريد الإلكتروني</label><input id="email" type="email" autoComplete="email" required value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="name@example.com" /></div><button className={styles.button} disabled={busy}>{busy ? 'جارٍ الإرسال…' : 'إرسال رمز الدخول'}</button></form>
    : <form onSubmit={verifyOtp}><div className={styles.field}><label htmlFor="code">رمز التحقق</label><input id="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required value={code} onChange={(e)=>setCode(e.target.value.replace(/\D/g,'').slice(0,6))} /></div><button className={styles.button} disabled={busy || code.length !== 6}>{busy ? 'جارٍ التحقق…' : 'دخول'}</button><button type="button" className={styles.secondary} onClick={()=>{setStage('email');setCode('');setDevCode(null);setError(null);}}>تغيير البريد</button></form>}
    {devCode && <div className={styles.dev}>رمز التطوير: <strong>{devCode}</strong> — لا يظهر هذا في production.</div>}
    {error && <div className={styles.error}>{error}</div>}
    <p className={styles.security}>الجلسة تُدار من السيرفر عبر Cookies محمية. لا يتم حفظ Access/Refresh Token في LocalStorage.</p>
  </section></main>;
}

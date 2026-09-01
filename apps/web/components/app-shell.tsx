import Link from 'next/link';

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="shell"><header className="topbar"><Link className="brand" href="/">عقار DZ</Link><nav><Link href="/search">البحث</Link><Link href="/requests">الطلبات</Link><Link href="/messages">الرسائل</Link><Link href="/account">حسابي</Link></nav></header>{children}<footer>نسخة تأسيسية — لا منطق أعمال داخل الواجهة</footer></div>;
}

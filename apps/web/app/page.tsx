import Link from 'next/link';
import { routeGroups } from '@/lib/routes';

export default function HomePage() {
  return (
    <main className="page">
      <section className="hero">
        <span className="eyebrow">Foundation v0.1.0</span>
        <h1>عقار DZ</h1>
        <p>منصة موحدة للعرض والطلب والثقة والمطابقة في السوق العقاري الجزائري.</p>
        <div className="actions"><Link className="primary" href="/search">ابدأ البحث</Link><Link className="secondary" href="/publish">نشر عقار</Link></div>
      </section>
      <section className="grid">
        {routeGroups.flatMap((group) => group.items.slice(0, 4)).map((item) => (
          <Link className="card" href={item.href} key={item.href}><strong>{item.label}</strong><span>{item.description}</span></Link>
        ))}
      </section>
    </main>
  );
}

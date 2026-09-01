import type { AppRoute } from '@/lib/routes';

export function PageSkeleton({ route }: { route: AppRoute }) {
  return <main className="page"><header className="pageHeader"><span className="eyebrow">{route.area}</span><h1>{route.label}</h1><p>{route.description}</p></header><section className="grid">{route.sections.map((section) => <article className="card" key={section}><strong>{section}</strong><span>سيتم ربط هذا الجزء بمحركه في مرحلته المعتمدة فقط.</span></article>)}</section><section className="panel"><h2>حالة المكوّن</h2><p>Skeleton فقط. لا API وهمي، لا بيانات زائفة، ولا Business Logic مؤقت.</p></section></main>;
}

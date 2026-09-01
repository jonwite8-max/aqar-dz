import { notFound } from 'next/navigation';
import { PageSkeleton } from '@/components/page-skeleton';
import { routeByPath } from '@/lib/routes';

export default async function RoutedSkeleton({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const path = `/${slug.join('/')}`;
  const route = routeByPath(path);
  if (!route) notFound();
  return <PageSkeleton route={route} />;
}

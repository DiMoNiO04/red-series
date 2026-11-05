import { getSeries } from '@/app/series/[slug]/page';
import { notFound } from 'next/navigation';
import { EpisodesCarousel } from './EpisodesCarousel';
import { SeriesMain } from './SeriesMain';

export async function SeriesContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const series = await getSeries(slug);

  if (!series) notFound();

  return (
    <>
      <SeriesMain series={series} />
      <EpisodesCarousel series={series} />
    </>
  );
}

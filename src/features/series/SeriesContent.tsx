import { getSeries } from '@/app/series/[slug]/page';
import { notFound } from 'next/navigation';
import { EpisodesCarousel } from './EpisodesCarousel';
import { SeriesMain } from './SeriesMain';
import { VideoModal } from './VideoModal';

type SeriesContentProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ ep?: string }>;
};

export async function SeriesContent({ params, searchParams }: SeriesContentProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const series = await getSeries(resolvedParams.slug);

  if (!series) notFound();

  const activeEpisode =
    resolvedSearchParams.ep && series.episodes.find(ep => ep.number === parseInt(resolvedSearchParams.ep ?? '1', 10));

  return (
    <>
      <SeriesMain series={series} />
      <EpisodesCarousel series={series} />
      {activeEpisode && (
        <VideoModal
          seriesSlug={series.slug}
          episode={activeEpisode}
        />
      )}
    </>
  );
}

'use client';

import { Episode } from '@prisma/src/generated/prisma/client';
import useEmblaCarousel from 'embla-carousel-react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const ProgressBar = dynamic(() => import('./ProgressBar').then(mod => mod.ProgressBar), {
  ssr: false,
  loading: () => <div className='absolute bottom-0 left-0 w-full h-1 bg-white/20 rounded-full' />,
});

type TSeries = {
  posterUrl: string;
  slug: string;
  episodes: Episode[];
};

export function EpisodesCarousel({ series }: { series: TSeries }) {
  const [emblaRef] = useEmblaCarousel({ align: 'start' });
  const router = useRouter();
  const searchParams = useSearchParams();

  const [progress, setProgress] = useState<Record<number, number>>({});

  useEffect(() => {
    const next: Record<number, number> = {};

    for (const ep of series.episodes) {
      const key = `progress:${series.slug}:${ep.number}`;
      const savedTime = localStorage.getItem(key);

      if (savedTime && ep.durationSec > 0) {
        next[ep.number] = (Number(savedTime) / ep.durationSec) * 100;
      }
    }

    setProgress(next);
  }, [series.slug, series.episodes]);

  const openEpisode = (number: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('ep', String(number));
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <section className='px-10 py-10 relative'>
      <h2 className='mb-4 text-2xl font-semibold'>Episodes</h2>

      <div
        className='overflow-hidden'
        ref={emblaRef}
      >
        <div className='flex gap-4'>
          {series.episodes.map(ep => (
            <div key={ep.id}>
              <button
                key={ep.id}
                onClick={() => openEpisode(ep.number)}
                className='relative w-92 aspect-video shrink-0 overflow-hidden rounded-lg bg-neutral-800 cursor-pointer'
                style={{
                  backgroundImage: `url(${ep.thumbnailUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className='absolute inset-0 bg-black/40' />
                <ProgressBar progress={progress[ep.number] ?? 0} />
              </button>
              <div className='text-white font-medium'>{ep.title}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

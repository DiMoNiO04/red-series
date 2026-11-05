'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { useRouter, useSearchParams } from 'next/navigation';

type TEpisode = {
  id: string;
  number: number;
  title: string;
};

type TSeries = {
  posterUrl: string;
  episodes: TEpisode[];
};

export function EpisodesCarousel({ series }: { series: TSeries }) {
  const [emblaRef] = useEmblaCarousel({ align: 'start' });
  const router = useRouter();
  const searchParams = useSearchParams();

  const openEpisode = (number: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('ep', String(number));
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <section className='px-10 py-10'>
      <h2 className='mb-6 text-lg font-semibold'>Episodes</h2>

      <div
        className='overflow-hidden'
        ref={emblaRef}
      >
        <div className='flex gap-4'>
          {series.episodes.map(ep => (
            <button
              key={ep.id}
              onClick={() => openEpisode(ep.number)}
              className='relative w-40 aspect-video shrink-0 overflow-hidden rounded-md bg-neutral-800'
              style={{
                backgroundImage: `url(${series.posterUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className='absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-xl'>
                {ep.number}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

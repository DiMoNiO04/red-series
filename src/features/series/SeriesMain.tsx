import { Badge } from '@/components/ui-shadcn/badge';
import { Button } from '@/components/ui-shadcn/button';
import { Episode, Genre, Series } from '@prisma/src/generated/prisma/client';
import { Info, Play } from 'lucide-react';
import Image from 'next/image';

type TSeriesMainProps = {
  series: Series & {
    genres: Genre[];
    episodes: Episode[];
  };
};

export function SeriesMain({ series }: TSeriesMainProps) {
  return (
    <>
      <Image
        src={series.imageUrl}
        alt={series.title}
        fill
        priority
        className='object-cover'
      />

      <div className='absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent' />

      <section className='relative h-[60vh] w-full'>
        <div className='absolute bottom-8 left-10 max-w-xl'>
          <h1 className='text-6xl font-bold mb-2'>{series.title}</h1>
          <div className='flex items-center gap-4 text-lg'>
            <span>{series.genres.map(g => g.name).join(', ')}</span>
            <span>{series.episodes.length} Episodes</span>
          </div>

          <div className='flex items-center gap-2 mt-4'>
            <Badge variant={'secondary'}>{series.year}</Badge>
            <Badge variant={'secondary'}>{series.ratingAge}</Badge>
          </div>

          <p className='text-neutral-400 max-w-sm text-lg'>{series.description}</p>

          <div className='flex items-center gap-4 mt-6'>
            <Button
              size='lg'
              className='rounded-3xl'
            >
              <Play fill='black' />
              Watch Now
            </Button>
            <Button
              size='lg'
              variant='secondary'
              className='rounded-3xl'
            >
              More Info
              <Info />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

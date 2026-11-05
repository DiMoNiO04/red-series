import prisma from '@/lib/prisma/prisma';
import { Metadata } from 'next';
import { cacheLife } from 'next/cache';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Red Series',
  description: 'Discover and explore a wide range of captivating series on RED Series',
};

async function getSeries() {
  'use cache';
  cacheLife('minutes');

  return prisma.series.findMany({
    include: {
      genres: true,
    },
  });
}

export default async function Home() {
  const series = await getSeries();

  return (
    <main className='min-h-screen bg-black text-white px-6 py-10'>
      <header className='mb-10 flex items-center justify-between'>
        <h1 className='text-3xl font-bold tracking-wide text-red-500'>RED Series</h1>
      </header>

      <div className='grid grid-cols-2 md:grid-cols-6 gap-6'>
        {series.map(item => (
          <Link
            key={item.id}
            href={`/series/${item.slug}`}
            className='group'
          >
            <div className='relative aspect-2/3 overflow-hidden rounded-lg'>
              <Image
                src={item.posterUrl}
                alt={item.title}
                fill
                priority
                className='object-cover transition-transform duration-300 group-hover:scale-105'
              />
            </div>

            <h2 className='mt-3 text-sm font-semibold'>{item.title}</h2>

            <p className='text-xs text-neutral-400'>
              {item.year} * {item.genres.map(g => g.name).join('')}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}

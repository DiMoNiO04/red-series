import { SeriesContent } from '@/features/series/SeriesContent';
import prisma from '@/lib/prisma/prisma';
import { Metadata } from 'next';
import { cacheLife } from 'next/cache';
import { Suspense } from 'react';

type TSeriesPageParams = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ ep?: string }>;
};

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const series = await prisma.series.findMany({
    select: { slug: true },
  });

  return series.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: TSeriesPageParams): Promise<Metadata> {
  'use cache';
  cacheLife('minutes');

  const { slug } = await params;

  const series = await prisma.series.findUnique({
    where: { slug },
    select: {
      title: true,
      description: true,
      imageUrl: true,
      slug: true,
    },
  });

  if (!series) {
    return {
      title: 'Сериал не найден',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const url = `${baseUrl}/series/${series.slug}`;
  const image = series.imageUrl
    ? series.imageUrl.startsWith('http')
      ? series.imageUrl
      : `${baseUrl}${series.imageUrl}`
    : `${baseUrl}/images/og-default.jpg`;

  return {
    title: series.title,
    description: series.description ?? `Смотреть сериал «${series.title}» онлайн.`,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'video.tv_show',
      title: series.title,
      description: series.description ?? `Смотреть сериал «${series.title}» онлайн.`,
      url,
      siteName: 'RED Series',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: series.title,
        },
      ],
      locale: 'ru_RU',
    },
    twitter: {
      card: 'summary_large_image',
      title: series.title,
      description: series.description ?? `Смотреть сериал «${series.title}» онлайн.`,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export async function getSeries(slug: string) {
  'use cache';
  cacheLife('minutes');

  return prisma.series.findUnique({
    where: { slug },
    include: {
      genres: true,
      episodes: {
        orderBy: { number: 'asc' },
      },
    },
  });
}

export default function Page({ params, searchParams }: TSeriesPageParams) {
  return (
    <main className='min-h-screen bg-black text-white relative'>
      <Suspense fallback={<div>Загрузка...</div>}>
        <SeriesContent
          params={params}
          searchParams={searchParams}
        />
      </Suspense>
    </main>
  );
}

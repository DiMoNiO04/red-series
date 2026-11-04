import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaClient } from './src/generated/prisma/client';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const VIDEO_URL = '/demo.mkv';

async function main() {
  await prisma.episode.deleteMany();
  await prisma.series.deleteMany();
  await prisma.genre.deleteMany();

  const sciFi = await prisma.genre.create({
    data: { name: 'Sci-Fi', slug: 'sci-fi' },
  });

  const fantasy = await prisma.genre.create({
    data: { name: 'Fantasy', slug: 'fantasy' },
  });

  await prisma.series.create({
    data: {
      slug: 'stranger-things-5',
      title: 'Stranger Things 5',
      description: 'A suspense-drama series. Hawkins faces its final confrontation as the rift spreads.',
      year: 2026,
      ratingAge: '18+',
      imageUrl: '/images/st/hero-image.jpg',
      posterUrl: '/images/st/poster.jpg',
      genres: {
        connect: { id: sciFi.id },
      },
      episodes: {
        create: [
          {
            number: 1,
            title: 'The Crawl',
            videoUrl: VIDEO_URL,
            durationSec: 4080, // 68m
            thumbnailUrl: '/images/st/imgi_2_e_5_1.jpg',
          },
          {
            number: 2,
            title: 'The Vanishing of Holly',
            videoUrl: VIDEO_URL,
            durationSec: 3240, // 54m
            thumbnailUrl: '/images/st/imgi_2_e_5_2.jpg',
          },
          {
            number: 3,
            title: 'The Turnbow Trap',
            videoUrl: VIDEO_URL,
            durationSec: 3960, // 66m
            thumbnailUrl: '/images/st/imgi_2_e_5_3.jpg',
          },
          {
            number: 4,
            title: 'Sorcerer',
            videoUrl: VIDEO_URL,
            durationSec: 5160, // 86m
            thumbnailUrl: '/images/st/imgi_2_e_5_4.jpg',
          },
          {
            number: 5,
            title: 'Shockwave',
            videoUrl: VIDEO_URL,
            durationSec: 4080, // 68m
            thumbnailUrl: '/images/st/imgi_2_e_5_5.jpg',
          },
          {
            number: 6,
            title: 'The Piggyback',
            videoUrl: VIDEO_URL,
            durationSec: 4500, // 75m
            thumbnailUrl: '/images/st/imgi_2_e_5_6.jpg',
          },
        ],
      },
    },
  });

  await prisma.series.create({
    data: {
      slug: 'game-of-thrones',
      title: 'Game of Thrones',
      description: 'Noble families fight for control over Westeros, while an ancient enemy returns.',
      year: 2011,
      ratingAge: '18+',
      imageUrl: '/images/got/hero-image.jpg',
      posterUrl: '/images/got/poster.jpg',
      genres: {
        connect: { id: fantasy.id },
      },
      episodes: {
        create: [
          {
            number: 1,
            title: 'Winter Is Coming',
            videoUrl: VIDEO_URL,
            durationSec: 3660, // 61m
            thumbnailUrl: '/images/got/imgi_2_e_1_1.jpg',
          },
          {
            number: 2,
            title: 'The Kingsroad',
            videoUrl: VIDEO_URL,
            durationSec: 3300, // 55m
            thumbnailUrl: '/images/got/imgi_2_e_1_2.jpg',
          },
          {
            number: 3,
            title: 'Lord Snow',
            videoUrl: VIDEO_URL,
            durationSec: 3420, // 57m
            thumbnailUrl: '/images/got/imgi_2_e_1_3.jpg',
          },
          {
            number: 4,
            title: 'Cripples, Bastards, and Broken Things',
            videoUrl: VIDEO_URL,
            durationSec: 3360, // 56m
            thumbnailUrl: '/images/got/imgi_2_e_1_4.jpg',
          },
          {
            number: 5,
            title: 'The Wolf and the Lion',
            videoUrl: VIDEO_URL,
            durationSec: 3240, // 54m
            thumbnailUrl: '/images/got/imgi_2_e_1_5.jpg',
          },
        ],
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });

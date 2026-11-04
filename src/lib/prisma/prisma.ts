import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/src/generated/prisma/client';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prismaClientSingleton = () => {
  return new PrismaClient({ adapter });
};

const globalForPrisma = global as typeof global & {
  prisma?: ReturnType<typeof prismaClientSingleton>;
};
const prisma = globalForPrisma.prisma || prismaClientSingleton();
export default prisma;
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

import { PrismaClient } from '@prisma/client';

export const prisma = globalThis.__modewebPrisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__modewebPrisma = prisma;
}

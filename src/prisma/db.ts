import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => new PrismaClient();

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? new PrismaClient();

export const db = prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;

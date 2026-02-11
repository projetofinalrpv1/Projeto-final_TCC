import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: ['query'], // Isso fará aparecer no terminal cada comando SQL executado (ótimo para o TCC!)
});
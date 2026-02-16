import { PrismaClient } from '@prisma/client';

// Criamos a instância do Prisma. 
// O TS já sabe que 'prisma' tem os métodos .user e .task
export const prisma = new PrismaClient({
  log: ['query', 'error', 'info', 'warn'],
});
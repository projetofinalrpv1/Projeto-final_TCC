import { prisma } from '../lib/prisma';

export class WorkAreaRepository {
async findAll() {
  return await prisma.workArea.findMany({
    select: {
      id: true,
      name: true, // <--- O erro estava aqui, faltou incluir o nome
     
    },
    orderBy: {
      name: "asc"
    }
  });
 }
}
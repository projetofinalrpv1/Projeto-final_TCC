import { prisma } from '../lib/prisma';

export class WorkAreaRepository {
async findAll() {
  return await prisma.workArea.findMany({
    select: {
      id: true,
      name: true,
     
    },
    orderBy: {
      name: "asc"
    }
  });
 }
}
import { prisma } from '../lib/prisma';

export class WorkAreaRepository {
  async findAll() {
    return await prisma.workArea.findMany({
      orderBy: { nome: 'asc' } // Organiza de A-Z
    });
  }
}
import { prisma } from '../lib/prisma';

export class TaskRepository {
  async create(data: any) {
  return await prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      // Se data.status não existir, assume "PENDING"
      status: data.status || 'PENDING', 
      priority: data.priority || 'MEDIUM', // É sempre bom ter um padrão aqui também
      isTemplate: data.isTemplate ?? false, 
      workAreaId: data.workAreaId,
      userId: data.userId || null
    }
  });
}

  async findAll() {
    return await prisma.task.findMany({
      include: {
        user: {
          select: { name: true, email: true, role: true }
        }
      }
    });
  }

  async findTemplatesByArea(workAreaId: string) {
    return await prisma.task.findMany({
      where: {
        workAreaId: workAreaId,
        isTemplate: true
      }
    });
  }

  async createMany(tasks: any[]) {
    return await prisma.task.createMany({
      data: tasks
    });
  }

  // Refatorado para usar 'priority' (Inglês) para evitar erro de mapeamento
  async updateStatus(id: string, status: string, priority?: string) {
    return await prisma.task.update({
      where: { id },
      data: {
        status,
        ...(priority && { priority }) // Apenas atualiza se 'priority' existir
      }
    });
  }

  async delete(id: string) {
    return await prisma.task.delete({
      where: { id }
    });
  }

  async findById(id: string) {
    return await prisma.task.findUnique({
      where: { id }
    });
  }
}
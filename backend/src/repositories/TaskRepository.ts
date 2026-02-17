import { prisma } from '../lib/prisma';

export class TaskRepository {
  async create(data: any) {
  return await prisma.task.create({
    data: {
      titulo: data.titulo,
      descricao: data.descricao,
      status: data.status,
      prioridade: data.prioridade,
      isTemplate: data.isTemplate || false, // Garante um valor
      workAreaId: data.workAreaId, // O CAMPO FALTANTE É ESTE!
      userId: data.userId || null   // Pode ser nulo se for template
    }
  });
}

  async findAll() {
    return await prisma.task.findMany({
      include: {
        user: {
          select: { nome: true, email: true, cargo: true } // Traz dados do dono da task
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

  // src/repositories/TaskRepository.ts

async updateStatus(id: string, status: any, prioridade?: any) {
  return await prisma.task.update({
    where: { id },
    data: { 
      status: status,
      ...(prioridade && { prioridade }) // Só atualiza a prioridade se ela for enviada
    }
  });
}
}

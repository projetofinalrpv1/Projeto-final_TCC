import { prisma } from '../lib/prisma';

export class TaskRepository {
  async create(data: any) {
  return await prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      isTemplate: data.isTemplate || false, 
      workAreaId: data.workAreaId,
      userId: data.userId || null   // Pode ser nulo se for template
    }
  });
}

  async findAll() {
    return await prisma.task.findMany({
      include: {
        user: {
          select: { name: true, email: true, role: true } // Traz dados do dono da task
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

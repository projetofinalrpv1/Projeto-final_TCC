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
  // Busca o id da área Geral dinamicamente
  const areaGeral = await prisma.workArea.findFirst({
    where: { name: 'Geral' }
  });

  return await prisma.task.findMany({
    where: {
      isTemplate: true,
      workAreaId: {
        in: areaGeral
          ? [workAreaId, areaGeral.id] // área do usuário + Geral
          : [workAreaId]               // só área do usuário se Geral não existir
      }
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

  async findByWorkArea(workAreaId: string) {
  return await prisma.task.findMany({
    where: { workAreaId }
  });
}


async checkIfTaskExistsForToday(userId: string, title: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return await prisma.task.findFirst({
    where: {
      userId,
      title,
      createdAt: {
        gte: today // 'gte' significa "maior ou igual a hoje 00:00"
      }
    }
  });
}

async findByUser(userId: string) {
  return await prisma.task.findMany({
    where: {
      userId: userId,
      isTemplate: false // Queremos apenas as tarefas de execução, não os moldes
    },
    orderBy: {
      createdAt: 'desc' // As mais novas aparecem no topo
    }
  });
}

async findTaskByTitleAndDate(userId: string, title: string, date: Date) {
  return await prisma.task.findFirst({
    where: {
      userId,
      title,
      createdAt: {
        gte: date // Maior ou igual ao início do dia
      }
    }
  });
}

async countByStatus(workAreaId: string) {
  const stats = await prisma.task.groupBy({
    by: ['status'],
    where: { workAreaId, isTemplate: false },
    _count: true
  });
  return stats;
}

async findByArea(workAreaId: string) {
  return await prisma.task.findMany({
    where: {
      isTemplate: false,
      user: {
        workAreaId: workAreaId, // ← filtra pelo workAreaId do USUÁRIO, não da tarefa
        isActive: true
      }
    },
    include: {
      user: { select: { name: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
}

async findByUserAndDate(userId: string, date: Date) {
  return await prisma.task.findMany({
    where: {
      userId,
      isTemplate: false,
      createdAt: { gte: date }
    }
  });

  
}

async findTaskByUserAndTitle(userId: string, title: string) {
  return await prisma.task.findFirst({
    where: {
      userId,
      title,
      isTemplate: false
    }
  });
}
}
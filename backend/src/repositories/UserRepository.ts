import { prisma } from '../lib/prisma';

export class UserRepository {
async create(data: any) {
  return await prisma.user.create({
    data: data
  });
}

  async findByEmail(email: string) {
    return await prisma.user.findUnique({ where: { email } });
  }


  async findById(id: string) {
    return await prisma.user.findUnique({ 
      where: { id },
      include: { workArea: true } 
    });
  }

  async findAll() {
  return await prisma.user.findMany({
    where: { isActive: true }, // Só traz os ativos
    include: { workArea: true }
  });
}

  // Atualizado para aceitar o objeto dinâmico 'data' que o seu Service filtrará
  async update(id: string, data: any) {
    return await prisma.user.update({
      where: { id },
      data: data, // O Prisma só atualizará os campos presentes neste objeto
    });
  }

 async deactivate(id: string) {
  return await prisma.user.update({
    where: { id },
    data: { isActive: false } // Apenas desativa
  });
}

  async findTeamByManager(managerId: string) {
  return await prisma.user.findMany({
    where: {
      managerId: managerId
    },
    include: {
      tasks: {
        select: {
          status: true // Para o front calcular % de conclusão
        }
      }
    }
  });
}

async findManagers() {
  return await prisma.user.findMany({
    where: { 
      cargo: 'GESTOR' 
    },
    select: {
      id: true,
      nome: true,
      workArea: { select: { nome: true } } // Bom para mostrar ao lado do nome no Select
    }
  });
}
}
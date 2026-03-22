import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client'; // Importante: Importar os tipos gerados

export class UserRepository {
  // Agora o TypeScript sabe exatamente quais campos são obrigatórios
  async create(data: Prisma.UserCreateInput) {
    return await prisma.user.create({ data });
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
  
  async findManyByRole(role: string) {
  return await prisma.user.findMany({ where: { role } });
}

  async findAll() {
    return await prisma.user.findMany({
      where: { isActive: true },
      include: { workArea: true }
    });
  }

  // Usamos UserUpdateInput para que o TS valide apenas campos editáveis
  async update(id: string, data: Prisma.UserUpdateInput) {
    return await prisma.user.update({
      where: { id },
      data: data,
    });
  }

  async deactivate(id: string) {
    return await prisma.user.update({
      where: { id },
      data: { isActive: false }
    });
  }

  async findTeamByManager(managerId: string) {
    return await prisma.user.findMany({
      where: { managerId: managerId },
      include: {
        tasks: {
          select: { status: true }
        }
      }
    });
  }

  async findManagers() {
    return await prisma.user.findMany({
      where: { role: 'GESTOR' },
      select: {
        id: true,
        name: true,
        workArea: { select: { name: true } }
      }
    });
  }

// Adicione este método no UserRepository.ts
async getAdminDashboard() {
  return await prisma.user.findMany({
    where: { role: 'GESTOR', isActive: true },
    include: {
      workArea: { select: { id: true, name: true } },
      subordinates: {
        where: { isActive: true },
        include: {
          tasks: {
            where: { isTemplate: false },
            select: { status: true }
          }
        }
      }
    }
  });
}
}

export const userRepository = new UserRepository();
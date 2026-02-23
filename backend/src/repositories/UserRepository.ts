import { prisma } from '../lib/prisma';

export class UserRepository {
  async create(data: any) {
    return await prisma.user.create({
      data: {
        nome: data.nome,
        email: data.email,
        senha: data.senha,
        cargo: data.cargo,
        workAreaId: data.workAreaId 
      }
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
      include: {
        workArea: true 
      }
    });
  }

  // Atualizado para aceitar o objeto dinâmico 'data' que o seu Service filtrará
  async update(id: string, data: any) {
    return await prisma.user.update({
      where: { id },
      data: data, // O Prisma só atualizará os campos presentes neste objeto
    });
  }

  async delete(id: string) {
    return await prisma.user.delete({
      where: { id },
    });
  }
}
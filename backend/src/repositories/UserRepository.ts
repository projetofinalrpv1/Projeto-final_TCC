import { prisma } from '../lib/prisma';

export class UserRepository {
  async create(data: any) {
    return await prisma.user.create({
      data: {
        nome: data.nome,
        email: data.email,
        senha: data.senha,
        cargo: data.cargo,
        workAreaId: data.workAreaId // Certifique-se de que este campo está aqui!
      }
    });
  }

  async findByEmail(email: string) {
    return await prisma.user.findUnique({ where: { email } });
  }

  async findAll() {
  return await prisma.user.findMany({
    include: {
      workArea: true // Traz os dados da tabela relacionada
    }
  });
}

  async update(id: string, data: any) {
  return await prisma.user.update({
    where: { id },
    data: data, // Aqui o Prisma recebe o que mudar (nome, senha, etc.)
  });
}

  // UserRepository.ts
  async delete(id: string) {
  return await prisma.user.delete({
    where: { id },
  });
}
}
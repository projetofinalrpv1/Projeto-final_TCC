import { prisma } from '../lib/prisma';

export class MaterialRepository {
  // Cria o material com todos os novos campos
  async create(data: {
    titulo: string;
    gestor: string;
    descricao: string;
    arquivoUrl: string;
    workAreaId: string;
    rota?: string;
  }) {
    return await prisma.material.create({
      data: {
        titulo: data.titulo,
        gestor: data.gestor,
        descricao: data.descricao,
        arquivoUrl: data.arquivoUrl,
        workAreaId: data.workAreaId,
        rota: data.rota || "",
      },
    });
  }

  // Lista todos os materiais de uma área específica
  async findByArea(workAreaId: string) {
    return await prisma.material.findMany({
      where: {
        workAreaId: workAreaId,
      },
      orderBy: {
        createdAt: 'desc', 
      },
    });
  }

  // NOVO MÉTODO: Busca materiais da área "Geral" para servir de padrão
  async findDefaultMaterials() {
    return await prisma.material.findMany({
      where: {
        workArea: {
          nome: "Geral" // Filtra pela área que criamos no Seed
        }
      },
      include: {
        workArea: {
          select: {
            nome: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Busca os detalhes de um material pelo ID (Para a página de detalhes)
  async findById(id: string) {
    return await prisma.material.findUnique({
      where: {
        id: id,
      },
      include: {
        workArea: {
          select: {
            nome: true, 
          },
        },
      },
    });
  }

  async delete(id: string) {
  return await prisma.material.delete({
    where: { id }
  });
}
}
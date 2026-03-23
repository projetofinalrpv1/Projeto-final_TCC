import { prisma } from '../lib/prisma';

export class MaterialRepository {

  async create(data: {
    title: string;
    manager: string;
    description: string;
    fileUrl: string;
    workAreaId: string;
    route?: string;
  }) {
    return await prisma.material.create({
      data: {
        title: data.title,
        manager: data.manager,
        description: data.description,
        fileUrl: data.fileUrl,
        workAreaId: data.workAreaId,
        route: data.route || "",
      },
    });
  }

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

  async findDefaultMaterials() {
    return await prisma.material.findMany({
      where: {
        workArea: {
          name: "Geral" 
        }
      },
      include: {
        workArea: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string) {
    return await prisma.material.findUnique({
      where: { id },
      include: {
        workArea: {
          select: {
            name: true,
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
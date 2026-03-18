// src/services/MaterialService.ts
import { MaterialRepository } from "../repositories/MaterialRepository";
import { AppError } from "../errors/AppError";

export class MaterialService {
  private materialRepository = new MaterialRepository();

  // Mapeia os campos do banco (inglês) para o padrão do frontend (português)
  private toDTO(material: any) {
    return {
      id: material.id,
      titulo: material.title,
      gestor: material.manager,
      descricao: material.description,
      arquivoUrl: material.fileUrl,
      rota: material.route,
      workAreaId: material.workAreaId,
    };
  }

  private async checkOwnership(user: any, materialId: string) {
    const material = await this.materialRepository.findById(materialId);
    if (!material) throw new AppError("Material não encontrado.", 404);
    if (user.role === 'ADMIN') return material;
    if (user.role === 'GESTOR' && material.workAreaId === user.workAreaId) {
      return material;
    }
    throw new AppError("Acesso negado: Você não tem permissão para manipular este material.", 403);
  }

  async executeCreate(data: any, user: any) {
    if (user.role === 'GESTOR' && data.workAreaId !== user.workAreaId) {
      throw new AppError("Você não pode criar materiais para áreas que não gerencia.", 403);
    }

    if (!data.titulo || !data.workAreaId || !data.arquivoUrl) {
      throw new AppError("Dados obrigatórios faltando (título, área ou link).", 400);
    }

    const material = await this.materialRepository.create({
      title: data.titulo,
      manager: data.gestor,
      description: data.descricao || "",
      fileUrl: data.arquivoUrl,
      workAreaId: data.workAreaId,
      route: data.rota
    });

    return this.toDTO(material);
  }

  async executeListByArea(workAreaId: string) {
  const specificMaterials = await this.materialRepository.findByArea(workAreaId);
  const defaultMaterials = await this.materialRepository.findDefaultMaterials();

  // Combina os dois arrays removendo duplicatas pelo id
  const allMaterials = [...specificMaterials, ...defaultMaterials];
  const unique = allMaterials.filter(
    (material, index, self) => index === self.findIndex(m => m.id === material.id)
  );

  return unique.map(this.toDTO);
}

  async executeGetDetails(id: string) {
    const material = await this.materialRepository.findById(id);
    if (!material) throw new AppError("Material não encontrado.", 404);
    return this.toDTO(material);
  }

  async executeDelete(id: string, user: any) {
    await this.checkOwnership(user, id);
    return await this.materialRepository.delete(id);
  }
}
import { MaterialRepository } from "../repositories/MaterialRepository";
import { AppError } from "../errors/AppError";

export class MaterialService {
  private materialRepository = new MaterialRepository();

  // Camada de Cofre: Verifica se o usuário tem autoridade sobre o recurso
  private async checkOwnership(user: any, materialId: string) {
    const material = await this.materialRepository.findById(materialId);
    
    if (!material) throw new AppError("Material não encontrado.", 404);
    
    // ADMIN ignora restrição de área
    if (user.role === 'ADMIN') return material; 
    
    // GESTOR só pode mexer se o material for da área dele
    if (user.role === 'GESTOR' && material.workAreaId === user.workAreaId) {
      return material;
    }

    throw new AppError("Acesso negado: Você não tem permissão para manipular este material.", 403);
  }

  async executeCreate(data: any, user: any) {
    // Regra de negócio: Gestor não pode criar algo fora da sua área
    if (user.role === 'GESTOR' && data.workAreaId !== user.workAreaId) {
      throw new AppError("Você não pode criar materiais para áreas que não gerencia.", 403);
    }

    if (!data.titulo || !data.workAreaId || !data.arquivoUrl) {
      throw new AppError("Dados obrigatórios faltando (título, área ou link).", 400);
    }

    return await this.materialRepository.create({
      title: data.titulo,
      manager: data.gestor,
      description: data.descricao || "",
      fileUrl: data.arquivoUrl,
      workAreaId: data.workAreaId,
      route: data.rota
    });
  }

  async executeListByArea(workAreaId: string) {
    const specificMaterials = await this.materialRepository.findByArea(workAreaId);
    const defaultMaterials = await this.materialRepository.findDefaultMaterials();
    return [...specificMaterials, ...defaultMaterials];
  }

  async executeGetDetails(id: string) {
    const material = await this.materialRepository.findById(id);
    if (!material) throw new AppError("Material não encontrado.", 404);
    return material;
  }

  async executeDelete(id: string, user: any) {
    // Só deleta se o checkOwnership passar
    await this.checkOwnership(user, id);
    return await this.materialRepository.delete(id);
  }
}
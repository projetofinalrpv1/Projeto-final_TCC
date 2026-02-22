// src/services/MaterialService.ts

import { MaterialRepository } from "../repositories/MaterialRepository";

export class MaterialService {
  private materialRepository = new MaterialRepository();

  async executeCreate(data: any) {
    if (!data.titulo) throw new Error("O título é obrigatório.");
    if (!data.workAreaId) throw new Error("A área é obrigatória.");
    if (!data.arquivoUrl) throw new Error("O link do arquivo (Drive) é obrigatório.");

    return await this.materialRepository.create({
      titulo: data.titulo,
      gestor: data.gestor,
      descricao: data.descricao || "", 
      arquivoUrl: data.arquivoUrl,
      workAreaId: data.workAreaId
    });
  }

  async executeGetDetails(id: string) {
    const material = await this.materialRepository.findById(id);
    if (!material) throw new Error("Material não encontrado.");
    return material;
  }

   async executeListByArea(workAreaId: string) {
  // 1. Busca os materiais da área específica (ex: TI)
     const specificMaterials = await this.materialRepository.findByArea(workAreaId);
  
  // 2. Busca os materiais padrão (Área Geral)
     const defaultMaterials = await this.materialRepository.findDefaultMaterials();

  // 3. Une as duas listas
  // Usamos o Spread Operator (...) para criar um único array com tudo
     const allMaterials = [...specificMaterials, ...defaultMaterials];

   return allMaterials;
}

async executeDelete(id: string) {
  // Verifica se o material existe
  const material = await this.materialRepository.findById(id);

  if (!material) {
    throw new Error("Material não encontrado.");
  }

  return await this.materialRepository.delete(id);
}
}
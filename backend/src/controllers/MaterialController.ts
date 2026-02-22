import { FastifyReply, FastifyRequest } from 'fastify';
import { MaterialService } from '../services/MaterialService';

export const createMaterial = async (request: FastifyRequest, reply: FastifyReply) => {
  const materialService = new MaterialService();
  try {
    const material = await materialService.executeCreate(request.body);
    return reply.status(201).send(material);
  } catch (error: any) {
    return reply.status(400).send({ message: error.message });
  }
};

export const listMaterialByArea = async (request: FastifyRequest, reply: FastifyReply) => {
  const materialService = new MaterialService();
  const { workAreaId } = request.params as { workAreaId: string };

  try {
    const materials = await materialService.executeListByArea(workAreaId);
    return reply.send(materials);
  } catch (error: any) {
    return reply.status(400).send({ message: error.message });
  }
};

export const getMaterialDetails = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  const materialService = new MaterialService();

  try {
    const material = await materialService.executeGetDetails(id);
    return reply.send(material);
  } catch (error: any) {
    return reply.status(404).send({ message: error.message });
  }
};

export const deleteMaterial = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  const materialService = new MaterialService(); // Instanciando o service

  try {
    await materialService.executeDelete(id); // Chamando sem o 'this'
    return reply.status(204).send(); 
  } catch (error: any) {
    return reply.status(400).send({ message: error.message });
  }
};
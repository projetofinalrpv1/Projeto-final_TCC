import { FastifyReply, FastifyRequest } from 'fastify';
import { MaterialService } from '../services/MaterialService';

const materialService = new MaterialService();

export const createMaterial = async (request: FastifyRequest, reply: FastifyReply) => {
  const material = await materialService.executeCreate(request.body, request.user);
  return reply.status(201).send(material);
};

export const listMaterialByArea = async (request: FastifyRequest, reply: FastifyReply) => {
  const { workAreaId } = request.params as { workAreaId: string };
  const materials = await materialService.executeListByArea(workAreaId);
  return reply.send(materials);
};

export const getMaterialDetails = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  const material = await materialService.executeGetDetails(id);
  return reply.send(material);
};

export const deleteMaterial = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  // Passamos o request.user para validar o dono do recurso
  await materialService.executeDelete(id, request.user);
  return reply.status(204).send();
};
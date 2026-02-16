import { FastifyReply, FastifyRequest } from 'fastify';
import { WorkAreaRepository } from '../repositories/WorkAreaRepository.ts';

const repository = new WorkAreaRepository();

export const listWorkAreas = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const areas = await repository.findAll();
    return reply.status(200).send(areas);
  } catch (error) {
    return reply.status(500).send({ message: "Erro ao listar áreas de atuação." });
  }
};
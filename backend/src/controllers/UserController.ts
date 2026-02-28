import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { UserService } from '../services/UserService';
import { createUserSchema, patchUserSchema, putUserSchema } from '../schemas/UserSchemas';

// Instanciamos o service uma vez para usar em todos os métodos
const userService = new UserService();

export const createUser = async (request: FastifyRequest, reply: FastifyReply) => {
  const data = createUserSchema.parse(request.body);
  const user = await userService.executeCreate(data); 
  return reply.status(201).send(user);
};

export const listUsers = async (request: FastifyRequest, reply: FastifyReply) => {
  const users = await userService.executeListAll();
  return reply.status(200).send(users);
};

export const patchUser = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  const data = patchUserSchema.parse(request.body);
  
  const user = await userService.executePatch(id, data);
  return reply.status(200).send(user);
};

export const replaceUser = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  const data = putUserSchema.parse(request.body);
  
  const user = await userService.executeReplace(id, data);
  return reply.status(200).send(user);
};

export const deactivateUser = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  // Usando o toggleStatus que criamos no Service
  const user = await userService.executeToggleStatus(id, false);
  return reply.status(200).send({ message: "Usuário desativado com sucesso.", user });
};

export const listManagers = async (request: FastifyRequest, reply: FastifyReply) => {
  const managers = await userService.executeListManagers();
  return reply.status(200).send(managers);
};

export const getTeam = async (request: FastifyRequest, reply: FastifyReply) => {
  const { managerId } = request.params as { managerId: string };
  
  const manager = await userService.executeGetDetails(managerId);
  const team = await userService.executeGetTeam(managerId);

  return reply.status(200).send({ manager, team });
};
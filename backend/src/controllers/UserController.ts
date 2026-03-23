import { FastifyReply, FastifyRequest } from 'fastify';
import { UserService } from '../services/UserService';
import { createUserSchema, patchUserSchema, putUserSchema } from '../schemas/UserSchemas';


const userService = new UserService();

export const createUser = async (request: FastifyRequest, reply: FastifyReply) => {
  const data = createUserSchema.parse(request.body);

  const user = await userService.executeCreate(data, request.user); 
  return reply.status(201).send(user);
};

export const listUsers = async (request: FastifyRequest, reply: FastifyReply) => {
  const users = await userService.executeListAll();
  return reply.status(200).send(users);
};

export const patchUser = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  const data = patchUserSchema.parse(request.body);
  
  // O Service agora verifica se o 'request.user' é o dono do ID ou um ADMIN
  const user = await userService.executePatch(id, data, request.user);
  return reply.status(200).send(user);
};

export const replaceUser = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  const data = putUserSchema.parse(request.body);
  
 
  const user = await userService.executeReplace(id, data, request.user);
  return reply.status(200).send(user);
};

export const deactivateUser = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  
  // Passamos o requester para o service validar a autorização
  const user = await userService.executeToggleStatus(id, false, request.user);
  return reply.status(200).send({ message: "Usuário desativado com sucesso.", user });
};

export const listManagers = async (request: FastifyRequest, reply: FastifyReply) => {
  const managers = await userService.executeListManagers();
  return reply.status(200).send(managers);
};

export const getTeam = async (request: FastifyRequest, reply: FastifyReply) => {
  const { sub } = request.user as { sub: string };
  
  const user = await userService.executeGetDetails(sub);
  
  if (!user.workArea?.id) {
    return reply.status(400).send({ 
      error: "Usuário não tem área de trabalho associada" 
    });
  }
  
  const team = await userService.executeGetTeam(sub, user.workArea.id);
  return reply.status(200).send(team);
};

// Adicione no UserController.ts
export async function getAdminDashboard(request: FastifyRequest, reply: FastifyReply) {
  const data = await userService.executeAdminDashboard();
  return reply.send(data);
}
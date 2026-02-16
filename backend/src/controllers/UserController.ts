import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod'; // 1. Importar o Zod
import { prisma } from '../lib/prisma.ts';
import { UserService } from '../services/UserService';
// 2. Criar o Schema de validação
export const createUserSchema = z.object({
  nome: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  cargo: z.enum(['COLABORADOR', 'GESTOR', 'ADMIN']),
  workAreaId: z.string().uuid("ID da área inválido")
})
export const createUser = async (request: FastifyRequest, reply: FastifyReply) => {
  const userService = new UserService();

  try {
    const validatedData = createUserSchema.parse(request.body);
    
    // Chama o serviço em vez de chamar o Prisma direto
    const user = await userService.executeRegister(validatedData);

    return reply.status(201).send(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({ 
        message: "Erro de validação", 
        // O Zod usa .issues, mas o .format() é mais amigável para APIs
        errors: error.format() 
      });
    }
    
    console.error(error); // Ajuda você a debugar no console
    return reply.status(500).send({ message: "Erro interno." });
  }
}

export const listUsers = async (request: FastifyRequest, reply: FastifyReply) => {
  const userService = new UserService();
  try {
    const users = await userService.executeListAll();
    return reply.status(200).send(users);
  } catch (error) {
    return reply.status(500).send({ message: "Erro ao listar usuários" });
  }

}

export const updateUser = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  const userService = new UserService();

  try {
    const user = await userService.executeUpdate(id, request.body);
    return reply.status(200).send(user);
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ message: "Erro ao atualizar usuário" });
  }
}

// UserController.ts
export const deleteUser = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  const userService = new UserService();

  try {
    await userService.executeDelete(id);
    return reply.status(200).send({ message: "Usuário deletado com sucesso" });
  } catch (error) {
    console.error(error);
    return reply.status(400).send({ message: "Não foi possível deletar o usuário. Verifique se o ID existe." });
  }
}

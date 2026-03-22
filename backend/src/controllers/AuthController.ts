// src/controllers/AuthController.ts
import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthService } from '../services/AuthService';
import { loginSchema } from '../schemas/AuthSchemas';
import { userRepository } from '../repositories/UserRepository';
import bcrypt from 'bcrypt';
import { AppError } from '../errors/AppError';
const authService = new AuthService();

export async function login(request: FastifyRequest, reply: FastifyReply) {
  const { email, password } = loginSchema.parse(request.body);

  const user = await authService.authenticate({ email, password });

  const token = await reply.jwtSign(
    {
      role: user.role,
      workAreaId: user.workAreaId,
    },
    {
      sign: {
        sub: user.id,
        expiresIn: '7d',
      },
    }
  );

  return reply.status(200).send({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      workAreaId: user.workAreaId,
    },
  });
}

// Novo handler — mesmo padrão de função exportada
export async function me(request: FastifyRequest, reply: FastifyReply) {
  // Após o preHandler authenticate, request.user tem o payload do token
  // O 'sub' é o id do usuário — definido no sign.sub do login acima
  const payload = request.user as { sub: string; role: string; workAreaId: string };

  const user = await authService.getMe(payload.sub);

  return reply.status(200).send(user);
}

export async function resetPassword(request: FastifyRequest, reply: FastifyReply) {
  const { email, password } = request.body as { email: string; password: string };
 
  // 1. Verifica se o email existe
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new AppError("E-mail não encontrado.", 404);
  }
 
  // 2. Faz o hash da nova senha
  const hashedPassword = await bcrypt.hash(password, 10);
 
  // 3. Atualiza no banco
  await userRepository.update(user.id, { password: hashedPassword });
 
  return reply.status(200).send({ message: "Senha redefinida com sucesso!" });
}
// src/controllers/AuthController.ts
import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthService } from '../services/AuthService';
import { loginSchema } from '../schemas/AuthSchemas';

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

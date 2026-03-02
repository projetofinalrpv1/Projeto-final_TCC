import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthService } from '../services/AuthService';
import { loginSchema } from '../schemas/AuthSchemas';

const authService = new AuthService();

export async function login(request: FastifyRequest, reply: FastifyReply) {
  // 1. Validação automática do corpo da requisição via Zod
  const { email, password } = loginSchema.parse(request.body);

  // 2. Chama o serviço para validar as credenciais no banco
  const user = await authService.authenticate({ email, password });

  // 3. Geração do Token JWT
  // O 'sub' (subject) é sempre o ID do usuário.
  // Colocamos 'role' e 'workAreaId' no payload para o RBAC funcionar.
  const token = await reply.jwtSign(
    { 
      role: user.role, 
      workAreaId: user.workAreaId 
    }, 
    { 
      sign: { 
        sub: user.id,
        expiresIn: '7d' // Opcional: define expiração (ex: 7 dias)
      } 
    }
  );

  // 4. Retorno para o Frontend (React)
  // Enviamos o token e os dados básicos do usuário para o Contexto de Auth do React
  return reply.status(200).send({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      workAreaId: user.workAreaId
    }
  });
}


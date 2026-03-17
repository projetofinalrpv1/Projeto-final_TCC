// src/hooks/checkPermissions.ts
import { FastifyReply, FastifyRequest } from "fastify";

export async function verifyRole(
  request: FastifyRequest,
  reply: FastifyReply,
  allowedRoles: string[]
) {
  // 1. Decodifica e valida o token JWT — sem isso, request.user é undefined
  try {
    await request.jwtVerify();
  } catch {
    return reply.status(401).send({ message: "Usuário não autenticado." });
  }

  // 2. Agora request.user está populado com o payload do token
  const { role } = request.user as { role: string };

  console.log("Conteúdo do request.user:", JSON.stringify(request.user, null, 2));

  if (!allowedRoles.includes(role)) {
    return reply.status(403).send({ message: "Seu perfil não tem permissão para isso." });
  }
}

export async function verifyWorkArea(
  request: FastifyRequest,
  reply: FastifyReply
) {
  // jwtVerify já foi chamado pelo verifyRole antes deste hook
  const { role, workAreaId } = request.user as { role: string; workAreaId: string };
  const targetAreaId = (request.params as any).workAreaId;

  if (role === 'ADMIN') return; // Admin acessa qualquer área

  if (workAreaId !== targetAreaId) {
    return reply.status(403).send({ message: "Você não tem acesso aos dados desta área." });
  }
}
// src/hooks/checkPermissions.ts
import { FastifyReply, FastifyRequest } from "fastify";

export async function verifyRole(request: FastifyRequest, reply: FastifyReply, allowedRoles: string[]) {
  // 1. Verificação de segurança extra: se o usuário nem existe, barramos aqui.
  if (!request.user) {
    return reply.status(401).send({ message: "Usuário não autenticado." });
  }

  const { role } = request.user; 
  console.log("Conteúdo do request.user:", JSON.stringify(request.user, null, 2));
  if (!allowedRoles.includes(role)) {
    return reply.status(403).send({ message: "Seu perfil não tem permissão para isso." });
  }
}

export async function verifyWorkArea(request: FastifyRequest, reply: FastifyReply) {
  const { role, workAreaId } = request.user;
  const targetAreaId = (request.params as any).workAreaId;

  if (role === 'ADMIN') return; // Admin ignora trava de área

  if (workAreaId !== targetAreaId) {
    return reply.status(403).send({ message: "Você não tem acesso aos dados desta área." });
  }
}
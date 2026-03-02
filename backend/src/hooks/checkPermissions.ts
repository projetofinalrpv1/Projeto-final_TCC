// src/hooks/checkPermissions.ts
import { FastifyReply, FastifyRequest } from "fastify";

export async function verifyRole(request: FastifyRequest, reply: FastifyReply, allowedRoles: string[]) {
  const { role } = request.user; // Pego do JWT decodificado
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
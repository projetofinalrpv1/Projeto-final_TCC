import { FastifyRequest, FastifyReply } from 'fastify';
import { SignatureService } from '../services/SignatureService';

const signatureService = new SignatureService();

/**
 * Finaliza o checklist e abre o processo de assinatura.
 */
export const finalizeChecklist = async (request: FastifyRequest, reply: FastifyReply) => {
  const { workAreaId, signature } = request.body as { workAreaId: string, signature: string };
  const employeeId = request.user.sub;

  await signatureService.requestSignature(workAreaId, employeeId, signature);
  
  return reply.status(201).send({ 
    message: "Checklist finalizado com sucesso! O gestor foi notificado." 
  });
};

/**
 * Lista assinaturas pendentes para o gestor logado.
 */
export const listPendingSignatures = async (request: FastifyRequest, reply: FastifyReply) => {
  const managerId = request.user.sub;
  
  const pendings = await signatureService.getPendingByManager(managerId);
  
  return reply.status(200).send(pendings);
};

/**
 * Gestor assina e aprova o processo.
 */
export const approveSignature = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  const { signature } = request.body as { signature: string };
  const managerId = request.user.sub;

  await signatureService.approveSignature(id, signature, managerId);
  
  return reply.status(200).send({ 
    message: "Documento assinado e processo aprovado." 
  });
};
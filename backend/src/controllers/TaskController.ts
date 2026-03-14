import { FastifyReply, FastifyRequest } from 'fastify';
import { TaskService } from '../services/TaskService';
import { SignatureService } from '../services/SignatureService';

const taskService = new TaskService();
const signatureService = new SignatureService();
/**
 * Cria uma nova tarefa.
 * O userId é extraído do token (request.user.sub) para garantir segurança.
 */
export const createTask = async (request: FastifyRequest, reply: FastifyReply) => {
  const { title, description, isTemplate, workAreaId, priority } = request.body as any;

  // Chamada corrigida: passamos os dados da tarefa E o usuário autenticado
  const task = await taskService.executeCreate(
    {
      title,
      description,
      isTemplate: isTemplate ?? false,
      workAreaId,
      priority: priority || 'MEDIUM',
      userId: request.user.sub, // ID do responsável/dono
    }, 
    request.user // <--- Segundo argumento: Dados para o RBAC (role, sub, workAreaId)
  ); 
  
  return reply.status(201).send(task);
};

/**
 * Lista todas as tarefas do sistema.
 */
export const listTasks = async (request: FastifyRequest, reply: FastifyReply) => {
  const tasks = await taskService.executeListAll();
  return reply.status(200).send(tasks);
};

export const listMyTasks = async (request: FastifyRequest, reply: FastifyReply) => {
  const { sub: userId, workAreaId } = request.user as any;

  const tasks = await taskService.executeListMyTasks(userId, workAreaId, request.user);

  return reply.status(200).send(tasks);
}

export const listTasksFromArea = async (request: FastifyRequest, reply: FastifyReply) => {
  const tasks = await taskService.executeListTasksFromArea(request.user);
  return reply.send(tasks);
};

export const listTemplates = async (request: FastifyRequest, reply: FastifyReply) => {
  const templates = await taskService.executeListTemplates(request.user.workAreaId);
  return reply.send(templates);
};

export const getTaskSummary = async (request: FastifyRequest, reply: FastifyReply) => {
  const summary = await taskService.executeGetTaskSummary(request.user.workAreaId);
  return reply.send(summary);
};
/**
 * Atualiza o status e/ou prioridade de uma tarefa existente.
 * O Service validará se o usuário tem permissão (Admin ou Dono).
 */
export const updateTaskStatus = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  const data = request.body as { status?: string, priority?: string };
  
  const updatedTask = await taskService.executeUpdateStatus(id, data, request.user);
  return reply.status(200).send(updatedTask);
};

/**
 * Remove uma tarefa do sistema.
 * O Service validará se o usuário possui papel de ADMIN.
 */
export const deleteTask = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  
  await taskService.executeDelete(id, request.user);
  return reply.status(204).send();
};

export const finalizeChecklist = async (request: FastifyRequest, reply: FastifyReply) => {
  const { workAreaId, signature } = request.body as { workAreaId: string, signature: string };
  const employeeId = request.user.sub; // Extraído do JWT

  // O SignatureService agora cuida de toda a validação de checklist e salvamento
  await signatureService.requestSignature(workAreaId, employeeId, signature);
  
  return reply.status(201).send({ 
    message: "Checklist validado e processo de assinatura iniciado." 
  });
}
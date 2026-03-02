import { FastifyReply, FastifyRequest } from 'fastify';
import { TaskService } from '../services/TaskService';

export const createTask = async (request: FastifyRequest, reply: FastifyReply) => {
  const taskService = new TaskService();
  
  // 1. Extraímos os dados do corpo (excluímos o userId se ele vier, para evitar spoofing)
  const data = request.body as any; 
  
  // 2. Extraímos o ID do usuário diretamente do "crachá" assinado (JWT)
  const userId = request.user.sub; 

  try {
    // 3. Unimos os dados do corpo com o ID seguro do token
    const task = await taskService.executeCreate({
      ...data,
      userId // Sobrescrevemos ou adicionamos o userId real aqui
    });
    
    return reply.status(201).send(task);
  } catch (error: any) {
    return reply.status(400).send({ message: error.message });
  }
};

export const listTasks = async (request: FastifyRequest, reply: FastifyReply) => {
  const taskService = new TaskService();
  const tasks = await taskService.executeListAll();
  return reply.send(tasks);
};

// src/controllers/TaskController.ts

export const updateTaskStatus = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  const data = request.body;
  const taskService = new TaskService();

  try {
    const updatedTask = await taskService.executeUpdateStatus(id, data);
    return reply.send(updatedTask);
  } catch (error: any) {
    return reply.status(400).send({ message: error.message });
  }
};

export const deleteTask = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  const taskService = new TaskService();

  try {
    await taskService.executeDelete(id);
    return reply.status(204).send();
  } catch (error: any) {
    return reply.status(400).send({ message: error.message });
  }
};
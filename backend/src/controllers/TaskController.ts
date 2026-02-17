import { FastifyReply, FastifyRequest } from 'fastify';
import { TaskService } from '../services/TaskService';

export const createTask = async (request: FastifyRequest, reply: FastifyReply) => {
  const taskService = new TaskService();
  try {
    const task = await taskService.executeCreate(request.body);
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
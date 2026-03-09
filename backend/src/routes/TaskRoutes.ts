import { FastifyInstance } from 'fastify';
import { createTask, listTasks, updateTaskStatus, deleteTask } from '../controllers/TaskController';
import { verifyRole } from '../hooks/checkPermissions';
import { finalizeChecklist } from '../controllers/TaskController';
export async function taskRoutes(app: FastifyInstance) {
  // 1. Global Protection: All routes below require authentication
  app.addHook('onRequest', app.authenticate);

  // 2. Create Task (Restricted: GESTOR or ADMIN)
  app.post('/tasks', {
    onRequest: [app.authenticate,
      (request, reply) => verifyRole(request, reply, ['GESTOR', 'ADMIN'])],
    schema: {
      tags: ['Tasks'],
      summary: 'Create a new task',
      body: {
        type: 'object',
        required: ['title', 'workAreaId'],
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          isTemplate: { type: 'boolean', default: false },
          workAreaId: { type: 'string' },
          userId: { type: 'string', description: 'Optional if is a template' },
          priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'] }
        }
      }
    }
  }, createTask);

  // 3. List Tasks (Available for all authenticated users)
  app.get('/tasks', {
    schema: {
      tags: ['Tasks'],
      summary: 'List all tasks'
    }
  }, listTasks);

  // 4. Update Status (Available for all authenticated users)
  app.patch('/tasks/:id/status', {
    schema: {
      tags: ['Tasks'],
      summary: 'Update task status or priority',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Task ID' }
        }
      },
      body: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'] },
          priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'] }
        }
      }
    }
  }, updateTaskStatus);

  // 5. Delete Task (Restricted: GESTOR or ADMIN)
  app.delete('/tasks/:id', {
    onRequest: [(request, reply) => verifyRole(request, reply, ['GESTOR', 'ADMIN'])],
    schema: {
      summary: 'Delete a specific task',
      tags: ['Tasks'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        }
      },
      response: {
        204: { type: 'null' }
      }
    }
  }, deleteTask);
}
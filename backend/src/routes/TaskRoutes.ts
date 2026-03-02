import { FastifyInstance } from 'fastify';
import { createTask, listTasks, updateTaskStatus, deleteTask } from '../controllers/TaskController';
import { verifyRole } from '../hooks/checkPermissions';

export async function taskRoutes(app: FastifyInstance) {
  // 1. Proteção Global: Todas as rotas abaixo exigem autenticação
  app.addHook('onRequest', app.authenticate);

  // 2. Criar Tarefa (Restrito: GESTOR ou ADMIN)
  app.post('/tasks', {
    onRequest: [(request, reply) => verifyRole(request, reply, ['GESTOR', 'ADMIN'])],
    schema: {
      tags: ['Tarefas'],
      summary: 'Criar uma nova tarefa',
      body: {
        type: 'object',
        required: ['titulo', 'workAreaId'],
        properties: {
          titulo: { type: 'string' },
          descricao: { type: 'string' },
          isTemplate: { type: 'boolean', default: false },
          workAreaId: { type: 'string' },
          userId: { type: 'string', description: 'Opcional se for template' },
          prioridade: { type: 'string', enum: ['BAIXA', 'MEDIA', 'ALTA'] }
        }
      }
    }
  }, createTask);

  // 3. Listar Tarefas (Liberado para todos os autenticados)
  app.get('/tasks', {
    schema: {
      tags: ['Tarefas'],
      summary: 'Listar todas as tarefas'
    }
  }, listTasks);

  // 4. Atualizar Status (Liberado para todos os autenticados)
  app.patch('/tasks/:id/status', {
    schema: {
      tags: ['Tarefas'],
      summary: 'Atualizar status ou prioridade de uma tarefa',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'ID da tarefa' }
        }
      },
      body: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA'] },
          prioridade: { type: 'string', enum: ['BAIXA', 'MEDIA', 'ALTA'] }
        }
      }
    }
  }, updateTaskStatus);

  // 5. Deletar Tarefa (Restrito: GESTOR ou ADMIN)
  app.delete('/tasks/:id', {
    onRequest: [(request, reply) => verifyRole(request, reply, ['GESTOR', 'ADMIN'])],
    schema: {
      summary: 'Deleta uma tarefa específica',
      tags: ['Tarefas'],
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
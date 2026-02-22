import { FastifyInstance } from 'fastify';
import { createTask, listTasks, updateTaskStatus,deleteTask } from '../controllers/TaskController';

export async function taskRoutes(app: FastifyInstance) {
  app.post('/tasks', {
    schema: {
      tags: ['Tarefas'],
      summary: 'Criar uma nova tarefa',
      body: {
        type: 'object',
       required: ['titulo', 'workAreaId'], // userId é opcional se for template
       properties: {
         titulo: { type: 'string' },
         descricao: { type: 'string' },
         isTemplate: { type: 'boolean', default: false }, // NOVO
         workAreaId: { type: 'string' }, // OBRIGATÓRIO agora
        userId: { type: 'string', description: 'Opcional se for template' },
        prioridade: { type: 'string', enum: ['BAIXA', 'MEDIA', 'ALTA'] }
  }
}
    }
  }, createTask);

  app.get('/tasks', {
    schema: {
      tags: ['Tarefas'],
      summary: 'Listar todas as tarefas'
    }
  }, listTasks);

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

app.delete('/tasks/:id', {
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
      204: { type: 'null' },
      400: {
        type: 'object',
        properties: { message: { type: 'string' } }
      }
    }
  }
}, deleteTask);
}


import { FastifyInstance } from 'fastify';
import { createUser, listUsers, updateUser, deleteUser } from '../controllers/UserController';

export async function userRoutes(app: FastifyInstance) {
  app.post('/users', {
    schema: {
      tags: ['Usuários'],
      summary: 'Cadastrar novo colaborador',
      body: {
        type: 'object',
        required: ['nome', 'email', 'senha', 'cargo', 'workAreaId'],
        properties: {
  nome: { type: 'string' }, // Removi o 'example' para evitar conflito
  email: { type: 'string', format: 'email' },
  senha: { type: 'string', minLength: 6 },
  cargo: { 
    type: 'string', 
    enum: ['COLABORADOR', 'GESTOR', 'ADMIN'] 
  },
  workAreaId: { 
    type: 'string', 
    description: 'UUID da área' 
  }
}
      },
      response: {
        201: {
          description: 'Usuário criado com sucesso',
          type: 'object',
          properties: {
            id: { type: 'string' },
            nome: { type: 'string' },
            email: { type: 'string' }
          }
        }
      }
    }
  }, createUser);

app.get('/users', {
  schema: {
    tags: ['Usuários'],
    summary: 'Listar todos os usuários',
    response: {
      200: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            nome: { type: 'string' },
            email: { type: 'string' },
            cargo: { type: 'string' },
            workAreaId: { type: 'string' },
            workArea: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                nome: { type: 'string' }
              }
            }
          }
        }
      }
    }
  }
}, listUsers);

// UserRoutes.ts
app.put('/users/:id', {
  schema: {
    tags: ['Usuários'],
    summary: 'Atualizar dados do usuário (incluindo senha)',
    params: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'ID do usuário' }
      }
    },
    body: {
      type: 'object',
      properties: {
        nome: { type: 'string' },
        email: { type: 'string' },
        senha: { type: 'string', minLength: 6, description: 'Deixe vazio se não quiser mudar' },
        cargo: { type: 'string', enum: ['COLABORADOR', 'GESTOR', 'ADMIN'] },
        workAreaId: { type: 'string' }
      }
    }
  }
}, updateUser);

app.delete('/users/:id', {
  schema: {
    tags: ['Usuários'],
    summary: 'Remover um usuário do sistema',
    params: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'ID UUID do usuário' }
      },
      required: ['id']
    },
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'string' }
        }
      }
    }
  }
}, deleteUser);
}


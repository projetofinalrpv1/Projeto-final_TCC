import { FastifyInstance } from 'fastify';
import { createUser, listUsers, listManagers, replaceUser, deactivateUser, patchUser } from '../controllers/UserController';
import { boolean } from 'zod';

export async function userRoutes(app: FastifyInstance) {

  app.post('/users', {
    schema: {
      tags: ['Usuários'],
      summary: 'Cadastrar novo colaborador ou gestor',
      body: {
        type: 'object',
        required: ['nome', 'email', 'senha', 'cargo', 'workAreaId'],
        properties: {
          nome: { type: 'string' },
          email: { type: 'string', format: 'email' },
          senha: { type: 'string', minLength: 6 },
          cargo: { type: 'string', enum: ['COLABORADOR', 'GESTOR', 'ADMIN'] },
          workAreaId: { type: 'string', format: 'uuid' },
          managerId: { type: 'string', format: 'uuid', nullable: true }
        }
      },
      response: {
        201: {
          description: 'Usuário criado com sucesso',
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            nome: { type: 'string' },
            email: { type: 'string' },
            cargo: { type: 'string' },
            managerId: { type: 'string', nullable: true }
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
              id: { type: 'string', format: 'uuid' },
              nome: { type: 'string' },
              email: { type: 'string' },
              cargo: { type: 'string' },
              workArea: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  nome: { type: 'string' }
                }
              }
            }
          }
        }
      }
    }
  }, listUsers);

  app.get('/users/managers', {
    schema: {
      tags: ['Usuários'],
      summary: 'Listar gestores',
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              nome: { type: 'string' },
              workArea: { type: 'object', properties: { nome: { type: 'string' } } }
            }
          }
        }
      }
    }
  }, listManagers);

  app.put('/users/:id', {
    schema: {
      tags: ['Usuários'],
      summary: 'Atualizar dados do usuário',
      params: {
        type: 'object',
        required: ['id'], // Adicionado: Protege contra chamadas sem ID
        properties: {
          id: { type: 'string', format: 'uuid' }
        }
      },
      body: {
        type: 'object',
        properties: {
          nome: { type: 'string' },
          email: { type: 'string', format: 'email' },
          senha: { type: 'string', minLength: 6 },
          cargo: { type: 'string', enum: ['COLABORADOR', 'GESTOR', 'ADMIN'] },
          workAreaId: { type: 'string', format: 'uuid' }
        }
      }
    }
  }, replaceUser);

  app.patch('/users/:id', {
  schema: {
    tags: ['Usuários'],
    summary: 'Atualização parcial de dados do usuário',
    params: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'string', format: 'uuid' }
      }
    },
    body: {
      type: 'object',
      // Note que aqui não temos 'required'
      properties: {
        nome: { type: 'string' },
        email: { type: 'string', format: 'email' },
        senha: { type: 'string', minLength: 6 },
        cargo: { type: 'string', enum: ['COLABORADOR', 'GESTOR', 'ADMIN'] },
        workAreaId: { type: 'string', format: 'uuid' },
        isActive: {type: 'boolean'}
      }
    }
  }
}, patchUser);

  app.delete('/users/:id', {
    schema: {
      tags: ['Usuários'],
      summary: 'Desativar usuário (Soft Delete)',
      params: {
        type: 'object',
        required: ['id'], // Adicionado: Garante consistência
        properties: {
          id: { type: 'string', format: 'uuid' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: { message: { type: 'string' } }
        }
      }
    }
  }, deactivateUser);
}
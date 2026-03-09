import { FastifyInstance } from 'fastify';
import { createUser, listUsers, listManagers, replaceUser, deactivateUser, patchUser } from '../controllers/UserController';
import { verifyRole } from '../hooks/checkPermissions';
export async function userRoutes(app: FastifyInstance) {

  app.post('/users', {
  onRequest: [
    app.authenticate, // 1. Primeiro verifica se o token é válido
    (request, reply) => verifyRole(request, reply, ['ADMIN']) // 2. Depois checa a role
  ],
    schema: {
      tags: ['Users'],
      summary: 'Register a new collaborator or manager',
      body: {
        type: 'object',
        required: ['name', 'email', 'password', 'role', 'workAreaId'],
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
          role: { type: 'string', enum: ['COLABORADOR', 'GESTOR', 'ADMIN'] },
          workAreaId: { type: 'string', format: 'uuid' },
          managerId: { type: 'string', format: 'uuid', nullable: true }
        }
      },
      response: {
        201: {
          description: 'User created successfully',
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string' },
            managerId: { type: 'string', nullable: true }
          }
        }
      }
    }
  }, createUser);

  app.get('/users', {
   onRequest: [
    app.authenticate, // 1. Primeiro verifica se o token é válido
    (request, reply) => verifyRole(request, reply, ['ADMIN']) // 2. Depois checa a role
  ],
    schema: {
      tags: ['Users'],
      summary: 'List all users',
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              name: { type: 'string' },
              email: { type: 'string' },
              role: { type: 'string' },
              workArea: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  name: { type: 'string' }
                }
              }
            }
          }
        }
      }
    }
  }, listUsers);

  app.get('/users/managers', {
    onRequest: [
    app.authenticate, // 1. Primeiro verifica se o token é válido
    (request, reply) => verifyRole(request, reply, ['ADMIN']) // 2. Depois checa a role
  ],
    schema: {
      tags: ['Users'],
      summary: 'List managers',
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              name: { type: 'string' },
              workArea: { type: 'object', properties: { name: { type: 'string' } } }
            }
          }
        }
      }
    }
  }, listManagers);

  app.put('/users/:id', {
    onRequest: [
    app.authenticate, // 1. Primeiro verifica se o token é válido
    (request, reply) => verifyRole(request, reply, ['ADMIN']) // 2. Depois checa a role
  ],
    schema: {
      tags: ['Users'],
      summary: 'Update user data',
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' }
        }
      },
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
          role: { type: 'string', enum: ['COLABORADOR', 'GESTOR', 'ADMIN'] },
          workAreaId: { type: 'string', format: 'uuid' }
        }
      }
    }
  }, replaceUser);

  app.patch('/users/:id', {
    onRequest: [
    app.authenticate, // 1. Primeiro verifica se o token é válido
    (request, reply) => verifyRole(request, reply, ['ADMIN']) // 2. Depois checa a role
  ],
    schema: {
      tags: ['Users'],
      summary: 'Partial user data update',
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' }
        }
      },
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
          role: { type: 'string', enum: ['COLABORADOR', 'GESTOR', 'ADMIN'] },
          workAreaId: { type: 'string', format: 'uuid' },
          isActive: { type: 'boolean' }
        }
      }
    }
  }, patchUser);

  app.delete('/users/:id', {
    onRequest: [
    app.authenticate, // 1. Primeiro verifica se o token é válido
    (request, reply) => verifyRole(request, reply, ['ADMIN']) // 2. Depois checa a role
  ],
    schema: {
      tags: ['Users'],
      summary: 'Deactivate user (Soft Delete)',
      params: {
        type: 'object',
        required: ['id'],
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
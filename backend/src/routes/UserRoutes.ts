// src/routes/UserRoutes.ts
import { FastifyInstance } from 'fastify';
import {
  createUser,
  listUsers,
  listManagers,
  getTeam,
  replaceUser,
  deactivateUser,
  patchUser
} from '../controllers/UserController';
import { verifyRole } from '../hooks/checkPermissions';

export async function userRoutes(app: FastifyInstance) {

  // POST /api/users
  app.post('/users', {
    onRequest: [
      app.authenticate,
      (request, reply) => verifyRole(request, reply, ['ADMIN'])
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
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string' },
            managerId: { type: 'string', nullable: true }
          }
        }
      }
    }
  }, createUser);

  // GET /api/users
  app.get('/users', {
    onRequest: [
      app.authenticate,
      (request, reply) => verifyRole(request, reply, ['ADMIN'])
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
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' },
              role: { type: 'string' },
              isActive: { type: 'boolean' },
              workArea: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' }
                }
              }
            }
          }
        }
      }
    }
  }, listUsers);

  // GET /api/users/managers
  app.get('/users/managers', {
    onRequest: [
      app.authenticate,
      (request, reply) => verifyRole(request, reply, ['ADMIN'])
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
              id: { type: 'string' },
              name: { type: 'string' },
              workArea: {
                type: 'object',
                properties: { name: { type: 'string' } }
              }
            }
          }
        }
      }
    }
  }, listManagers);

  // GET /api/users/team — equipe do gestor logado
  app.get('/users/team', {
    onRequest: [
    app.authenticate,
    (request, reply) => verifyRole(request, reply, ['ADMIN', 'GESTOR'])
  ],
  schema: {
    tags: ['Users'],
    summary: 'List team members of the logged manager',
    security: [{ bearerAuth: [] }],
    response: {
      200: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string' },
            workArea: { type: 'string' },
            progresso: { type: 'number' },
            totalTasks: { type: 'number' },
            completedTasks: { type: 'number' },
            createdAt: { type: 'string' },
          }
        }
      }
    }
  }
}, getTeam);

  // PUT /api/users/:id
  app.put('/users/:id', {
    onRequest: [
      app.authenticate,
      (request, reply) => verifyRole(request, reply, ['ADMIN'])
    ],
    schema: {
      tags: ['Users'],
      summary: 'Update user data',
      params: {
        type: 'object',
        required: ['id'],
        properties: { id: { type: 'string', format: 'uuid' } }
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

  // PATCH /api/users/:id
  app.patch('/users/:id', {
    onRequest: [
      app.authenticate,
      (request, reply) => verifyRole(request, reply, ['ADMIN', 'GESTOR', 'COLABORADOR'])
    ],
    schema: {
      tags: ['Users'],
      summary: 'Partial user data update',
      params: {
        type: 'object',
        required: ['id'],
        properties: { id: { type: 'string', format: 'uuid' } }
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

  // DELETE /api/users/:id
  app.delete('/users/:id', {
    onRequest: [
      app.authenticate,
      (request, reply) => verifyRole(request, reply, ['ADMIN'])
    ],
    schema: {
      tags: ['Users'],
      summary: 'Deactivate user (Soft Delete)',
      params: {
        type: 'object',
        required: ['id'],
        properties: { id: { type: 'string', format: 'uuid' } }
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
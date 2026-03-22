// src/routes/AuthRoutes.ts
import { FastifyInstance } from 'fastify';
import { login, me, resetPassword } from '../controllers/AuthController';

export async function authRoutes(app: FastifyInstance) {
  // POST /auth/login — pública
  app.post('/login', {
    schema: {
      tags: ['Auth'],
      summary: 'Autenticar usuário',
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                email: { type: 'string' },
                role: { type: 'string' },
                workAreaId: { type: 'string' },
              },
            },
          },
        },
      },
    },
  }, login);

  // Adicione essa rota no seu AuthRoutes.ts existente

// POST /auth/reset-password — rota pública
app.post('/reset-password', {
  schema: {
    tags: ['Auth'],
    summary: 'Redefine a senha do usuário pelo e-mail',
    body: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 6 },
      }
    },
    response: {
      200: {
        type: 'object',
        properties: { message: { type: 'string' } }
      }
    }
  }
}, resetPassword);

  // GET /auth/me — protegida
  app.get('/me', {
    preHandler: [app.authenticate],
    schema: {
      tags: ['Auth'],
      summary: 'Retorna os dados do usuário autenticado',
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string' },
            workAreaId: { type: 'string' },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string' },
          },
        },
        401: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
  }, me);
}
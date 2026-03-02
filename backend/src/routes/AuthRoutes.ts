import { FastifyInstance } from 'fastify';
import { login } from '../controllers/AuthController';

export async function authRoutes(app: FastifyInstance) {
  app.post('/login', {
    schema: {
      tags: ['Auth'],
      summary: 'Autenticar usuário',
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: { token: { type: 'string' } }
        }
      }
    }
  }, login);
}
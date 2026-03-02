import { FastifyInstance } from 'fastify';
import { listWorkAreas } from '../controllers/WorkAreaController';

export async function workAreaRoutes(app: FastifyInstance) {
  app.get('/workareas', {
    schema: {
      description: 'Lista todas as áreas de atuação disponíveis',
      tags: ['Configurações'],
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' }
            }
          }
        }
      }
    }
  }, listWorkAreas);
}
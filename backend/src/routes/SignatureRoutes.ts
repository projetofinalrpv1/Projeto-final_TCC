// src/routes/SignatureRoutes.ts
import { FastifyInstance } from 'fastify';
import { 
  finalizeChecklist, 
  listPendingSignatures, 
  approveSignature 
} from '../controllers/SignatureController';

export async function signatureRoutes(app: FastifyInstance) {

  // POST /api/tasks/finalize
  app.post('/tasks/finalize', {
    onRequest: [app.authenticate],
    schema: {
      tags: ['Assinaturas'],
      summary: 'Finaliza o checklist e solicita assinatura',
      body: {
        type: 'object',
        required: ['workAreaId', 'signature'],
        properties: {
          workAreaId: { type: 'string' },
          signature: { type: 'string' }
        }
      },
      response: {
        201: {
          type: 'object',
          properties: { message: { type: 'string' } }
        }
      }
    }
  }, finalizeChecklist);

  // GET /api/signatures/pending
  app.get('/signatures/pending', {
    onRequest: [app.authenticate],
    schema: {
      tags: ['Assinaturas'],
      summary: 'Lista processos pendentes para o gestor',
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              status: { type: 'string' },
              employeeSignature: { type: 'string' },
              completedAt: { type: 'string' },
               employeeId: { type: 'string' },
              employee: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string' }
                }
              }
            }
          }
        }
      }
    }
  }, listPendingSignatures);

  // PATCH /api/signatures/:id/approve
  app.patch('/signatures/:id/approve', {
    onRequest: [app.authenticate],
    schema: {
      tags: ['Assinaturas'],
      summary: 'Gestor aprova o documento de assinatura',
      params: {
        type: 'object',
        properties: { id: { type: 'string' } }
      },
      body: {
        type: 'object',
        required: ['signature'],
        properties: { signature: { type: 'string' } }
      },
      response: {
        200: {
          type: 'object',
          properties: { message: { type: 'string' } }
        }
      }
    }
  }, approveSignature);
}
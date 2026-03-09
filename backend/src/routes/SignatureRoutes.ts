import { FastifyInstance } from 'fastify';
import { 
  finalizeChecklist, 
  listPendingSignatures, 
  approveSignature 
} from '../controllers/SignatureController';

export async function signatureRoutes(app: FastifyInstance) {

  // 1. Rota Finalizar Checklist
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
      response: { 201: { type: 'object', properties: { message: { type: 'string' } } } }
    }
  }, finalizeChecklist);

  // 2. Rota Listar Pendências
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
              employee: { type: 'object', properties: { name: { type: 'string' } } }
            }
          }
        }
      }
    }
  }, listPendingSignatures);

  // 3. Rota Aprovar Assinatura
  app.patch('/signatures/:id/approve', {
    onRequest: [app.authenticate],
    schema: {
      tags: ['Assinaturas'],
      summary: 'Gestor aprova o documento de assinatura',
      params: { type: 'object', properties: { id: { type: 'string' } } },
      body: {
        type: 'object',
        required: ['signature'],
        properties: { signature: { type: 'string' } }
      }
    }
  }, approveSignature);
}
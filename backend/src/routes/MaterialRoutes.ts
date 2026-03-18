// src/routes/MaterialRoutes.ts
import { FastifyInstance } from 'fastify';
import { createMaterial, listMaterialByArea, getMaterialDetails, deleteMaterial } from '../controllers/MaterialController';
import { verifyRole, verifyWorkArea } from '../hooks/checkPermissions';

export async function materialRoutes(app: FastifyInstance) {

  // POST /api/materials
  app.post('/materials', {
    onRequest: [(request, reply) => verifyRole(request, reply, ['ADMIN', 'GESTOR'])],
    schema: {
      tags: ['Materiais'],
      summary: 'Adicionar novo material de apoio',
      body: {
        type: 'object',
        required: ['titulo', 'gestor', 'workAreaId', 'arquivoUrl', 'descricao'],
        properties: {
          titulo: { type: 'string' },
          gestor: { type: 'string' },
          workAreaId: { type: 'string' },
          arquivoUrl: { type: 'string' },
          descricao: { type: 'string' },
          rota: { type: 'string' }
        }
      },
      response: {
        201: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            titulo: { type: 'string' },
            gestor: { type: 'string' },
            descricao: { type: 'string' },
            arquivoUrl: { type: 'string' },
            rota: { type: 'string' },
            workAreaId: { type: 'string' }
          }
        }
      }
    }
  }, createMaterial);

  // GET /api/materials/:workAreaId
  app.get('/materials/:workAreaId', {
    onRequest: [
      (req, rep) => verifyRole(req, rep, ['ADMIN', 'GESTOR', 'COLABORADOR']),
      verifyWorkArea
    ],
    schema: {
      tags: ['Materiais'],
      summary: 'Listar materiais por área',
      params: {
        type: 'object',
        required: ['workAreaId'],
        properties: {
          workAreaId: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              titulo: { type: 'string' },
              gestor: { type: 'string' },      // ← corrigido de 'professor' para 'gestor'
              descricao: { type: 'string' },   // ← adicionado
              arquivoUrl: { type: 'string' },  // ← adicionado
              rota: { type: 'string' },
              workAreaId: { type: 'string' }
            }
          }
        }
      }
    }
  }, listMaterialByArea);

  // GET /api/materials/detalhes/:id
  app.get('/materials/detalhes/:id', {
    onRequest: [(request, reply) => verifyRole(request, reply, ['ADMIN', 'GESTOR', 'COLABORADOR'])],
    schema: {
      tags: ['Materiais'],
      summary: 'Busca todos os dados de um material específico pelo ID',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'ID único do material' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            titulo: { type: 'string' },
            gestor: { type: 'string' },
            descricao: { type: 'string' },
            arquivoUrl: { type: 'string' },
            rota: { type: 'string' },
            workAreaId: { type: 'string' }
          }
        }
      }
    }
  }, getMaterialDetails);

  // DELETE /api/materials/:id
  app.delete('/materials/:id', {
    onRequest: [(request, reply) => verifyRole(request, reply, ['ADMIN', 'GESTOR'])],
    schema: {
      summary: 'Deleta um material permanentemente',
      description: 'Remove o material do banco de dados usando o ID fornecido.',
      tags: ['Materiais'],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', description: 'ID único do material (UUID)' }
        }
      },
      response: {
        204: {
          description: 'Material deletado com sucesso',
          type: 'null'
        },
        400: {
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    }
  }, deleteMaterial);
}
import { FastifyInstance } from 'fastify';
import { createMaterial, listMaterialByArea, getMaterialDetails, deleteMaterial} from '../controllers/MaterialController';
import { verifyRole, verifyWorkArea } from '../hooks/checkPermissions';
export async function materialRoutes(app: FastifyInstance) {
  
  app.post('/materials', {
    onRequest: [(request, reply) => verifyRole(request, reply, ['ADMIN', 'GESTOR'])],
    schema: {
      tags: ['Materiais'],
      summary: 'Adicionar novo material de apoio',
      body: {
       type: 'object',
       required: ['titulo', 'gestor', 'workAreaId', 'arquivoUrl', 'descricao'], // Todos são importantes
       properties: {
         titulo: { type: 'string' },
         gestor: { type: 'string' },
         workAreaId: { type: 'string' },
         arquivoUrl: { type: 'string' }, // O link do Google Drive que você mencionou
         descricao: { type: 'string' },  // A breve descrição para a página de detalhes
         rota: { type: 'string' }       // Mantemos se você for usar para navegação interna
  }
},
      response: {
        201: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            titulo: { type: 'string' },
            gestor: { type: 'string' },
            rota: { type: 'string' },
            workAreaId: { type: 'string' }
          }
        }
      }
    }
  }, createMaterial);

  app.get('/materials/:workAreaId', {
   onRequest: [
      (req, rep) => verifyRole(req, rep, ['ADMIN', 'GESTOR', 'COLABORADOR']),
      verifyWorkArea // Só permite se o workAreaId da URL bater com o do token
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
              professor: { type: 'string' },
              rota: { type: 'string' },
              workAreaId: { type: 'string' }
            }
          }
        }
      }
    }
  }, listMaterialByArea);

  app.get('/materials/detalhes/:id', {
  onRequest: [(request, reply) => verifyRole(request, reply, ['ADMIN', 'GESTOR'])],
  schema: {
    tags: ['Materiais'],
    summary: 'Busca todos os dados de um material específico pelo ID',
    params: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'ID único do material' }
      }
    }
  }
}, getMaterialDetails);

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
        id: { 
          type: 'string', 
          description: 'ID único do material (UUID)' 
        }
      }
    },
    response: {
      204: {
        description: 'Material deletado com sucesso',
        type: 'null'
      },
      400: {
        description: 'Erro na requisição ou ID inexistente',
        type: 'object',
        properties: {
          message: { type: 'string' }
        }
      }
    }
  }
}, deleteMaterial);
}



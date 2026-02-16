import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { prisma } from './lib/prisma.js';

const app: FastifyInstance = fastify({ 
  logger: true 
});

// 1. Registrar o CORS
app.register(cors, { origin: '*' });

// 2. Registrar o Swagger
app.register(swagger, {
  openapi: {
    info: {
      title: 'API On The Job',
      description: 'Documentação do sistema de gestão de tarefas',
      version: '1.0.0'
    }
  }
});

// 3. Registrar o Swagger UI
app.register(swaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false
  }
});

// 4. Rotas (Com tipagem explícita nas funções)
app.get('/users', async (request, reply) => {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (error) {
    app.log.error(error);
    return reply.status(500).send({ error: 'Erro interno no servidor' });
  }
});

app.get('/healthcheck', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

export { app };
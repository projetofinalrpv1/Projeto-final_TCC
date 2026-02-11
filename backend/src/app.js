import fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { prisma } from './lib/prisma.js';

const app = fastify({ logger: true });

// 1. Registrar o CORS
app.register(cors, { origin: '*' });

// 2. Registrar o Swagger (Configuração básica)
app.register(swagger, {
  openapi: {
    info: {
      title: 'API On The Job',
      description: 'Documentação do sistema de gestão de tarefas',
      version: '1.0.0'
    }
  }
});

// 3. Registrar o Swagger UI (A interface visual)
app.register(swaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false
  }
});

// 4. Suas rotas (Devem vir DEPOIS do Swagger)
app.get('/users', async (request, reply) => {
  const users = await prisma.user.findMany();
  return users;
});

app.get('/healthcheck', async () => {
  return { status: 'ok' };
});

export { app };
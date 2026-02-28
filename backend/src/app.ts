import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

import { userRoutes } from './routes/UserRoutes'; 
import { workAreaRoutes } from './routes/WorkAreaRoutes';
import { taskRoutes } from './routes/TaskRoutes';
import { materialRoutes } from './routes/MaterialRoutes';
import {z} from 'zod'
import { AppError } from './errors/AppError';
import fastifyJwt from '@fastify/jwt';
const app: FastifyInstance = fastify({ 
  logger: true 
});

app.setErrorHandler((error, request, reply) => {
  // Erro de Validação do Zod
  if (error instanceof z.ZodError) {
    return reply.status(400).send({ message: "Erro de validação", errors: error.format() });
  }

  // Erro de Negócio (ex: throw new AppError('Usuário não encontrado', 404))
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({ message: error.message });
  }

  // Erro inesperado (Servidor caiu)
  request.log.error(error); // Loga o erro real no terminal
  return reply.status(500).send({ message: "Erro interno no servidor." });
});

app.register(cors, { origin: '*' });

app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'supersecretkey', // Mantenha no .env!
});

app.register(swagger, {
  openapi: {
    info: {
      title: 'API On The Job',
      description: 'Documentação do sistema de gestão de tarefas',
      version: '1.0.0'
    },

  },

});
app.register(swaggerUi, {
  routePrefix: '/docs'
});

// --- REGISTRO DE ROTAS ---
app.register(userRoutes, { prefix: '/api' });

app.register(workAreaRoutes, { prefix: '/api' });
app.register(taskRoutes, { prefix: '/api' });
app.register(materialRoutes, { prefix: '/api' });

app.get('/healthcheck', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

export { app };
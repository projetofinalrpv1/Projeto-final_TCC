import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import fastifyJwt from '@fastify/jwt';
import { z } from 'zod';

import { AppError } from './errors/AppError';
import auth from './plugins/auth'; // Seu plugin com os decorators (authenticate)

import { authRoutes } from './routes/AuthRoutes';
import { userRoutes } from './routes/UserRoutes'; 
import { workAreaRoutes } from './routes/WorkAreaRoutes';
import { taskRoutes } from './routes/TaskRoutes';
import { materialRoutes } from './routes/MaterialRoutes';

const app: FastifyInstance = fastify({ logger: true });

// 1. Error Handler Global
app.setErrorHandler((error, request, reply) => {
  if (error instanceof z.ZodError) {
    return reply.status(400).send({ message: "Erro de validação", errors: error.format() });
  }
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({ message: error.message });
  }
  request.log.error(error);
  return reply.status(500).send({ message: "Erro interno no servidor." });
});

app.addHook('onRequest', async (request, reply) => {
  console.log('--- HEADERS RECEBIDOS PELO SERVIDOR ---');
  console.log(request.headers); 
});

// 2. Plugins de Infraestrutura
app.register(cors, { origin: '*' });

// 3. Registro do JWT (Crucial: deve vir ANTES das rotas)
app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'supersecret_change_me' // Lembre-se de mudar isso!
});

// 4. Seus Decorators Customizados (ex: authenticate, verifyRole)
app.register(auth); 

// 5. Documentação
app.register(swagger, {
  openapi: {
    info: {
      title: 'API On The Job',
      description: 'Documentação do sistema de gestão de tarefas',
      version: '1.0.0'
    },
    security: [{ bearerAuth: [] }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    }
  }
});
app.register(swaggerUi, { routePrefix: '/docs' });

// 6. Registro de Rotas
app.register(authRoutes, { prefix: '/auth' });
app.register(userRoutes, { prefix: '/api' });
app.register(workAreaRoutes, { prefix: '/api' });
app.register(taskRoutes, { prefix: '/api' });
app.register(materialRoutes, { prefix: '/api' });

app.get('/healthcheck', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

export { app };
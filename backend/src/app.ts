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
import { signatureRoutes } from './routes/SignatureRoutes';

const app: FastifyInstance = fastify({ logger: true });

// 1. Error Handler Global (Mantenha igual)
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

// 2. Verificação do Secret (Crucial)
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("ERRO CRÍTICO: JWT_SECRET não definida no arquivo .env");
}

// 3. Plugins de Infraestrutura
app.register(cors, { origin: '*' });

// 4. Registro do JWT (USANDO A CONSTANTE VALIDADA)
app.register(fastifyJwt, {
  secret: jwtSecret // Aqui o TS não reclama, pois garantimos acima que é string
});

// 5. Seus Decorators Customizados (authenticate, verifyRole)
app.register(auth); 

// 6. Documentação Swagger (Mantenha igual)
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

// 7. Registro de Rotas (Organizado)
app.register(authRoutes, { prefix: '/auth' });
app.register(userRoutes, { prefix: '/api' });
app.register(workAreaRoutes, { prefix: '/api' });
app.register(taskRoutes, { prefix: '/api' });
app.register(materialRoutes, { prefix: '/api' });
app.register(signatureRoutes, { prefix: '/api' });

app.get('/healthcheck', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

export { app };
import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

import { userRoutes } from './routes/UserRoutes'; 
import { workAreaRoutes } from './routes/WorkAreaRoutes';
import { taskRoutes } from './routes/TaskRoutes';
import { materialRoutes } from './routes/MaterialRoutes';

const app: FastifyInstance = fastify({ 
  logger: true 
});

app.register(cors, { origin: '*' });

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
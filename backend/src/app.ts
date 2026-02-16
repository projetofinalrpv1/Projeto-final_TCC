import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

import { userRoutes } from './routes/UserRoutes'; // Importe suas rotas
import { workAreaRoutes } from './routes/WorkAreaRoutes';


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
// Em vez de escrever as rotas aqui, você as "chama" de arquivos externos
app.register(userRoutes, { prefix: '/api' });
app.register(workAreaRoutes, { prefix: '/api' });
// Mantendo apenas o essencial aqui
app.get('/healthcheck', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

export { app };
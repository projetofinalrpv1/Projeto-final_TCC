// src/app.ts
import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import fastifyJwt from '@fastify/jwt';
import { z } from 'zod';

import { AppError } from './errors/AppError';
import auth from './plugins/auth';

//import { whatsappService } from './services/WhatsAppService';
//import { checkAndSendMessages } from './services/QueueService';

import { authRoutes } from './routes/AuthRoutes';
import { userRoutes } from './routes/UserRoutes';
import { workAreaRoutes } from './routes/WorkAreaRoutes';
import { taskRoutes } from './routes/TaskRoutes';
import { materialRoutes } from './routes/MaterialRoutes';
import { signatureRoutes } from './routes/SignatureRoutes';

const app: FastifyInstance = fastify({ logger: true });

// ── 1. Error Handler Global ──
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

// ── 2. Validação do JWT Secret ──
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("ERRO CRÍTICO: JWT_SECRET não definida no arquivo .env");
}

// ── 3. Plugins de Infraestrutura ──
app.register(cors, { origin: 'https://onboardingextensaoonthejob.vercel.app' });
app.register(fastifyJwt, { secret: jwtSecret });
app.register(auth);

// ── 4. Documentação Swagger ──
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

// ── 5. Rotas ──
app.register(authRoutes, { prefix: '/auth' });
app.register(userRoutes, { prefix: '/api' });
app.register(workAreaRoutes, { prefix: '/api' });
app.register(taskRoutes, { prefix: '/api' });
app.register(materialRoutes, { prefix: '/api' });
app.register(signatureRoutes, { prefix: '/api' });

app.get('/healthcheck', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// ── 6. WhatsApp + Worker ──
// app.addHook('onReady', async () => {
//   try {
//     // Conecta ao WhatsApp — QR Code aparece no terminal
//     await whatsappService.connect();
//     console.log('📱 WhatsApp Service iniciado — aguardando conexão...');

//     // Inicia o worker que verifica mensagens pendentes a cada 1 minuto
//     setInterval(() => {
//       checkAndSendMessages();
//     }, 60 * 1000);

//     console.log('🤖 Worker de mensagens WhatsApp iniciado (intervalo: 1 minuto)');
//   } catch (error) {
   
//     console.error('⚠️  Erro ao iniciar WhatsApp Service:', error);
//     console.warn('⚠️  O servidor continuará funcionando sem WhatsApp.');
//   }
// });

// app.get('/test-whatsapp', async (request, reply) => {
//   try {
//     const me = whatsappService.socket?.user;
//     console.log('USER ID:', JSON.stringify(me)); // ← adiciona isso
    
//     await whatsappService.sendToSelf(
//       '🔔 *ON THE JOB* - Teste de integração WhatsApp funcionando!'
//     );
//     return reply.send({ message: 'Mensagem enviada!' });
//   } catch (error: any) {
//     return reply.status(500).send({ message: error.message });
//   }
// });
export { app };
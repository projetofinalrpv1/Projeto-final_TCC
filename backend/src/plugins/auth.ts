import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';

async function authPlugin(app: FastifyInstance) {
  // Aqui você define explicitamente os tipos nos parâmetros
  app.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    console.log("Headers recebidos:", request.headers.authorization);
    try {
      await request.jwtVerify();
    } catch (err) {
      // O reply aqui agora é reconhecido como FastifyReply
      return reply.status(401).send({ message: 'Não autorizado' });
    }
  });
}

export default fp(authPlugin);
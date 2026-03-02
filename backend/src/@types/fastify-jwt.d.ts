import '@fastify/jwt';
import { FastifyRequest, FastifyReply } from 'fastify'; // Importe os tipos

// 1. O que já está aí (JWT)
declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { 
      role: string; 
      workAreaId: string; 
    };
    user: {
      sub: string;
      role: string;
      workAreaId: string;
    };
  }
}

// 2. O QUE FALTA (A Instância da App)
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}
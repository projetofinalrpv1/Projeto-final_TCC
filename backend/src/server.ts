import { app } from './app.ts';

const start = async () => {
  try {
    // Em produção, o host '0.0.0.0' é importante para containers/Docker
    await app.listen({ port: 3333, host: '0.0.0.0' });
    
    console.log("🚀 Servidor TypeScript rodando em http://localhost:3333");
    console.log("📖 Documentação disponível em http://localhost:3333/docs");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
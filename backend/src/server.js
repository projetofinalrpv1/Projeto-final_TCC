import { app } from './app.js';

const start = async () => {
  try {
    await app.listen({ port: 3333, host: '0.0.0.0' });
    console.log('🚀 Servidor rodando em http://localhost:3333');
    console.log('📖 Documentação disponível em http://localhost:3333/docs');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
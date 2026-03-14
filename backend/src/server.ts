import { app } from './app.ts';

const start = async () => {
  try {
    
    const port = Number(process.env.PORT) || 3333;

    await app.listen({ 
      port: port, 
      host: '0.0.0.0' 
    });
    
    console.log(`🚀 Servidor TypeScript rodando em http://localhost:${port}`);
    console.log(`📖 Documentação disponível em http://localhost:${port}/docs`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start()
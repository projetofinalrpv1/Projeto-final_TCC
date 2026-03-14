🚀 Guia de Execução do Projeto: On The Job
Siga as instruções abaixo em ordem para configurar o ambiente de banco de dados, servidor e interface.

📦 Parte 1: Backend (Node.js + Prisma + Fastify)
Abra o seu terminal na pasta principal do projeto.

Navegue para a pasta do servidor:
Bash
cd ./backend

Instale todas as dependências do projeto:

Bash
npm install

Sincronização com o Banco de Dados:
Execute as migrações para criar as tabelas no seu banco de dados (MySQL):
Bash
npx prisma migrate dev
(Este comando lerá seus arquivos de migration e aplicará as tabelas no banco).

Geração do Prisma Client:
Gere os tipos do TypeScript para que o VS Code reconheça os modelos:
Bash
npx prisma generate

Popular o Banco (Seed):
Execute o script que criará os IDs das Áreas, Usuários Admin e as Tarefas Template:

Bash
npx prisma db seed
Inicie o Servidor:

Bash
npm run dev
Nota: O backend estará rodando em http://localhost:3333. Mantenha este terminal aberto.

💻 Parte 2: Frontend (React + Vite)
Abra um novo terminal (sem fechar o do backend).

Navegue para a pasta do frontend:

Bash
cd ./frontend
Instale as dependências:

Bash
npm install
Inicie a aplicação:

Bash
npm run dev

🔑 Credenciais de Acesso:
Administrador: email: admin@empresa.com
               senha: Admin123!

🛠️ Comandos Úteis (Manutenção)
Ver dados no Banco: Caso queira ver se as tarefas foram criadas corretamente sem usar o frontend, execute dentro da pasta backend:

Bash
npx prisma studio
Isso abrirá uma interface no navegador para visualizar todas as suas tabelas.
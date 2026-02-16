
🚀 On The Job - API de Gestão de Tarefas
Este projeto é o backend de um sistema de gestão de tarefas desenvolvido para o Trabalho de Conclusão de Curso (TCC). A API permite o gerenciamento de colaboradores e suas respectivas áreas de atuação, além do controle de tarefas.

🛠️ Tecnologias Utilizadas
Node.js (Ambiente de execução)

Fastify (Framework web focado em performance)

Prisma ORM (Manipulação do banco de dados MySQL)

TypeScript (Tipagem estática para maior segurança)

Bcrypt (Criptografia de senhas)

Swagger (Documentação interativa da API)

📋 Pré-requisitos
Antes de começar, você vai precisar ter instalado:

Node.js (versão 18 ou superior)

MySQL (ou um serviço de banco de dados compatível)

🔧 Instalação e Configuração
Clone o repositório:

Bash
git clone https://github.com/seu-usuario/on-the-job.git
cd on-the-job/backend
Instale as dependências:

Bash
npm install
Configure as variáveis de ambiente:
Crie um arquivo .env na raiz da pasta backend e adicione a URL do seu banco de dados:

Snippet de código
DATABASE_URL="mysql://usuario:senha@localhost:3306/on_the_job_db"
Execute as Migrations:
Para criar as tabelas no seu banco de dados local:

Bash
npx prisma migrate dev
Povoar o banco (Seed):
Para cadastrar as áreas de trabalho iniciais (TI, RH, etc.):

Bash
npx prisma db seed
🚀 Executando a API
Para iniciar o servidor em modo de desenvolvimento:

Bash
npm run dev
A API estará disponível em http://localhost:3333.

📖 Documentação (Swagger)
A documentação interativa com todas as rotas e modelos de dados pode ser acessada em:
👉 http://localhost:3333/docs

🏗️ Estrutura do Banco de Dados
A API utiliza as seguintes entidades:

User: Cadastro de colaboradores com senha criptografada e cargos (GESTOR, COLABORADOR, ADMIN).

WorkArea: Áreas da empresa (TI, RH, Marketing) vinculadas aos usuários.

Task: Tarefas com status (PENDENTE, EM_ANDAMENTO, CONCLUIDA) e prioridades, vinculadas a um usuário.

📂 Organização do Código
O projeto segue a arquitetura em camadas para melhor manutenção:

src/repositories: Camada de acesso aos dados (Prisma).

src/services: Regras de negócio e lógica de criptografia.

src/controllers: Gerenciamento das requisições e respostas HTTP.

src/routes: Definição dos endpoints e documentação Swagger.

Próximos Passos
[ ] Implementação da Autenticação JWT.

[ ] Filtros avançados na listagem de tarefas.

[ ] Integração com o Frontend.
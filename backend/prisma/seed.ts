import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('Admin123!', 8)
  const GERAL_AREA_ID = "28a9b1c7-d4e5-4a2b-8c7d-9f0a1b2c3d4e"

  const areas = [
    { id: "7684be2b-074c-45cf-9d07-99d9d0b41202", name: "TI" },
    { id: "0c57b173-47ed-45aa-8fce-706e563765d4", name: "Recursos Humanos" },
    { id: "452f02b9-69af-4dc8-af20-0ed5b20fb382", name: "Financeiro" },
    { id: "dac8fd20-c9f3-43b6-9210-7a03a3f6142f", name: "Serviços Gerais" },
    { id: GERAL_AREA_ID, name: "Geral" }
  ]

  console.log('⏳ Criando áreas de trabalho...')
  for (const area of areas) {
    await prisma.workArea.upsert({
      where: { name: area.name },
      update: {},
      create: area,
    })
  }

  // --- PASSO 2: BUSCAR A ÁREA GERAL PARA O ADMIN ---


await prisma.user.upsert({
  where: { email: 'admin@empresa.com' },
  update: {},
  create: {
    email: 'admin@empresa.com',
    name: 'Administrador do Sistema',
    password: hashedPassword,
    role: 'ADMIN',
    workArea: {
      // Usamos o ID fixo diretamente, sem precisar de findUnique extra
      connect: { id: GERAL_AREA_ID } 
    }
  },
});

  // 2. Lista de Materiais Iniciais (agora com nomes em inglês)
  const materiaisIniciais = [
    {
      title: 'Material de TI',
      manager: 'Gestor de TI',
      description: 'Arquivo de teste para a área de Tecnologia da Informação.',
      fileUrl: 'https://drive.google.com/file/d/1w9sZGi9xtkkVPbHASDS98IggcijGuGgM/preview',
      workAreaId: "7684be2b-074c-45cf-9d07-99d9d0b41202",
      route: "/app/curso/ti"
    },
    {
      title: 'Material de RH',
      manager: 'Gestor de RH',
      description: 'Arquivo de teste para a área de Recursos Humanos.',
      fileUrl: 'https://drive.google.com/file/d/1Kpj9Kw7iC_eeA-5AQY7-AEuHGPk5YTaN/preview',
      workAreaId: "0c57b173-47ed-45aa-8fce-706e563765d4",
      route: "/app/curso/rh"
    },
    {
      title: 'Material Financeiro',
      manager: 'Gestor Financeiro',
      description: 'Arquivo de teste para a área Financeira.',
      fileUrl: 'https://drive.google.com/file/d/1k_qa3c6CywSbLkhWqlMXnCM5oWCxwB4O/preview',
      workAreaId: "452f02b9-69af-4dc8-af20-0ed5b20fb382",
      route: "/app/curso/financeiro"
    },
    {
      title: 'Material Serviços Gerais',
      manager: 'Gestor SG',
      description: 'Arquivo de teste para a área de Serviços Gerais.',
      fileUrl: 'https://drive.google.com/file/d/1xkkDhwf0g4HOEkAQL8kRdQERhdtcmcqs/preview',
      workAreaId: "dac8fd20-c9f3-43b6-9210-7a03a3f6142f",
      route: "/app/curso/servicos-gerais"
    },
    {
  title: 'Documento Geral da Empresa',
  manager: 'Administração',
  description: 'Documento de integração geral para todos os novos colaboradores.',
  fileUrl: 'https://drive.google.com/file/d/1WXJ1xXtMZpmCv-HUMvXVmRbOPZS1mv3Y/preview',
  workAreaId: GERAL_AREA_ID,
  route: "/app/curso/geral"
}
  ]

  // 3. Inserção com Verificação
  for (const m of materiaisIniciais) {
    const materialExists = await prisma.material.findFirst({
      where: { title: m.title, workAreaId: m.workAreaId } // Atualizado de 'titulo' para 'title'
    })

    if (!materialExists) {
      await prisma.material.create({ data: m })
      console.log(`✅ Material criado: ${m.title}`)
    } else {
      console.log(`ℹ️ Material já existe: ${m.title}`)
    }
  }
}

// --- PASSO 4: TAREFAS TEMPLATE (MOLDES) ---
  const tarefasTemplate = [
    {
      title: "Checklist de Backup Semanal",
      description: "Verificar se os backups de todos os servidores foram concluídos com sucesso.",
      isTemplate: true,
      priority: "HIGH",
      workAreaId: "7684be2b-074c-45cf-9d07-99d9d0b41202", // TI
      userId: null
    },
    {
      title: "Verificação de Ponto Eletrônico",
      description: "Ajustar inconsistências de batida de ponto dos colaboradores.",
      isTemplate: true,
      priority: "MEDIUM",
      workAreaId: "0c57b173-47ed-45aa-8fce-706e563765d4", // RH
      userId: null
    },
    {
      title: "Fechamento de Caixa Diário",
      description: "Conciliar entradas e saídas físicas com o sistema bancário.",
      isTemplate: true,
      priority: "HIGH",
      workAreaId: "452f02b9-69af-4dc8-af20-0ed5b20fb382", // Financeiro
      userId: null
    },
    {
      title: "Inspeção de Limpeza - Áreas Comuns",
      description: "Verificar se os banheiros e refeitório foram limpos conforme cronograma.",
      isTemplate: true,
      priority: "LOW",
      workAreaId: "dac8fd20-c9f3-43b6-9210-7a03a3f6142f", // Serviços Gerais
      userId: null
    },
    {
      title: "Leitura do Mural de Avisos",
      description: "Verificar novos comunicados da diretoria no canal geral.",
      isTemplate: true,
      priority: "MEDIUM",
      workAreaId: GERAL_AREA_ID, // Geral
      userId: null
    }
  ];

  console.log('⏳ Criando tarefas template...');
  for (const t of tarefasTemplate) {
    await prisma.task.upsert({
      where: { 
        // Nome do índice composto gerado pelo Prisma
        title_workAreaId: { 
          title: t.title, 
          workAreaId: t.workAreaId 
        } 
      },
      update: {}, // Se já existir, não muda nada
      create: {
        ...t,
        status: "PENDING" // CAMPO OBRIGATÓRIO: Adicione o status inicial aqui
      },
    });
  }
  console.log('✅ Tarefas template configuradas!');


main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
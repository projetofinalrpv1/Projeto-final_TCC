import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('Admin123!', 8)
  const commonPassword = await bcrypt.hash('Senha123!', 8)
  
  const GERAL_AREA_ID = "28a9b1c7-d4e5-4a2b-8c7d-9f0a1b2c3d4e"
  const TI_AREA_ID = "7684be2b-074c-45cf-9d07-99d9d0b41202"

  // --- 1. CRIAR ÁREAS ---
  const areas = [
    { id: TI_AREA_ID, name: "TI" },
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

  // --- 2. CRIAR USUÁRIOS (ADMIN, GESTOR, COLABORADOR) ---
  console.log('⏳ Criando usuários...')
  
  // Admin
  await prisma.user.upsert({
    where: { email: 'admin@empresa.com' },
    update: {},
    create: {
      email: 'admin@empresa.com',
      name: 'Administrador do Sistema',
      password: hashedPassword,
      role: 'ADMIN',
      workArea: { connect: { id: GERAL_AREA_ID } }
    },
  });

  // Gestor de TI
  await prisma.user.upsert({
    where: { email: 'gestor.ti@empresa.com' },
    update: {},
    create: {
      email: 'gestor.ti@empresa.com',
      name: 'Jorge Gestor (TI)',
      password: commonPassword,
      role: 'GESTOR',
      workArea: { connect: { id: TI_AREA_ID } }
    },
  });

  // Colaborador de TI
  await prisma.user.upsert({
    where: { email: 'colaborador.ti@empresa.com' },
    update: {},
    create: {
      email: 'colaborador.ti@empresa.com',
      name: 'Carlos Colaborador (TI)',
      password: commonPassword,
      role: 'COLABORADOR',
      workArea: { connect: { id: TI_AREA_ID } }
    },
  });

// --- 3. CRIAR MATERIAIS ---
  console.log('⏳ Configurando materiais...')
  const materiaisIniciais = [
    {
      title: 'Material de TI',
      manager: 'Gestor de TI',
      description: 'Arquivo de teste para a área de Tecnologia da Informação.',
      fileUrl: 'https://drive.google.com/file/d/1w9sZGi9xtkkVPbHASDS98IggcijGuGgM/preview',
      workAreaId: TI_AREA_ID,
      route: "/app/curso/ti"
    },
    {
      title: 'Documento Geral da Empresa',
      manager: 'Administração',
      description: 'Documento de integração geral.',
      fileUrl: 'https://drive.google.com/file/d/1WXJ1xXtMZpmCv-HUMvXVmRbOPZS1mv3Y/preview',
      workAreaId: GERAL_AREA_ID,
      route: "/app/curso/geral"
    }
  ]

  for (const m of materiaisIniciais) {
    // Usamos findFirst para checar se já existe, evitando o erro do upsert
    const existe = await prisma.material.findFirst({
      where: { title: m.title, workAreaId: m.workAreaId }
    })

    if (!existe) {
      await prisma.material.create({ data: m })
      console.log(`✅ Material criado: ${m.title}`)
    }
  }

  // --- 4. TAREFAS TEMPLATE ---
  console.log('⏳ Configurando tarefas template...')
  const tarefasTemplate = [
    {
      title: "Checklist de Backup Semanal",
      description: "Verificar backups dos servidores.",
      isTemplate: true,
      priority: "HIGH",
      workAreaId: TI_AREA_ID,
      status: "PENDING"
    },
    {
      title: "Leitura do Mural de Avisos",
      description: "Verificar novos comunicados.",
      isTemplate: true,
      priority: "MEDIUM",
      workAreaId: GERAL_AREA_ID,
      status: "PENDING"
    }
  ];

  for (const t of tarefasTemplate) {
    // Aqui, se você não tiver @@unique([title, workAreaId]) no schema de Task, 
    // use a mesma lógica do findFirst acima para evitar erros:
    const existeTask = await prisma.task.findFirst({
      where: { title: t.title, workAreaId: t.workAreaId, isTemplate: true }
    })

    if (!existeTask) {
      await prisma.task.create({ data: t })
    }
  }
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
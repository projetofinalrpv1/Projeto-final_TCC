import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
const prisma = new PrismaClient()

async function main() {

  const hashedPassword = await bcrypt.hash('Admin123!', 8) // Defina uma senha inicial forte
  
  await prisma.user.upsert({
  where: { email: 'admin@empresa.com' },
  update: {},
  create: {
    email: 'admin@empresa.com',
    name: 'Administrador do Sistema',
    password: hashedPassword,
    role: 'ADMIN',
    // Conecta o usuário a área "Geral" que você já criou acima
    workArea: {
      connect: { name: 'Geral' } 
    }
  },
})
  console.log('✅ Admin verificado/criado com sucesso.')
  // 1. Definição das Áreas (agora usando 'name')
  const areas = [
    { id: "7684be2b-074c-45cf-9d07-99d9d0b41202", name: "TI" },
    { id: "0c57b173-47ed-45aa-8fce-706e563765d4", name: "Recursos Humanos" },
    { id: "452f02b9-69af-4dc8-af20-0ed5b20fb382", name: "Financeiro" },
    { id: "dac8fd20-c9f3-43b6-9210-7a03a3f6142f", name: "Serviços Gerais" },
    { name: "Geral" } 
  ]

  for (const area of areas) {
    await prisma.workArea.upsert({
      where: { name: area.name }, // Atualizado de 'nome' para 'name'
      update: {},
      create: area,
    })
  }

  // Busca o ID da área Geral
  const areaGeral = await prisma.workArea.findUnique({ where: { name: 'Geral' } });

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
      workAreaId: areaGeral?.id as string,
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

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
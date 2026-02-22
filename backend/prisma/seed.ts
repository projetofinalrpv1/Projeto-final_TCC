import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // 1. Definição das Áreas com seus IDs Reais
  const areas = [
    { id: "7684be2b-074c-45cf-9d07-99d9d0b41202", nome: "TI" },
    { id: "0c57b173-47ed-45aa-8fce-706e563765d4", nome: "Recursos Humanos" },
    { id: "452f02b9-69af-4dc8-af20-0ed5b20fb382", nome: "Financeiro" },
    { id: "dac8fd20-c9f3-43b6-9210-7a03a3f6142f", nome: "Serviços Gerais" },
    { nome: "Geral" } // Área para materiais que todos devem ver
  ]

  for (const area of areas) {
    await prisma.workArea.upsert({
      where: { nome: area.nome },
      update: {},
      create: area,
    })
  }

  // Busca o ID da área Geral (que é gerado automaticamente)
  const areaGeral = await prisma.workArea.findUnique({ where: { nome: 'Geral' } });

  // 2. Lista de Materiais Iniciais Vinculados
  const materiaisIniciais = [
    {
      titulo: 'Material de TI',
      gestor: 'Gestor de TI',
      descricao: 'Arquivo de teste para a área de Tecnologia da Informação.',
      arquivoUrl: 'https://drive.google.com/file/d/1w9sZGi9xtkkVPbHASDS98IggcijGuGgM/preview',
      workAreaId: "7684be2b-074c-45cf-9d07-99d9d0b41202", // TI
      rota: "/app/curso/ti"
    },
    {
      titulo: 'Material de RH',
      gestor: 'Gestor de RH',
      descricao: 'Arquivo de teste para a área de Recursos Humanos.',
      arquivoUrl: 'https://drive.google.com/file/d/1Kpj9Kw7iC_eeA-5AQY7-AEuHGPk5YTaN/preview',
      workAreaId: "0c57b173-47ed-45aa-8fce-706e563765d4", // RH
      rota: "/app/curso/rh"
    },
    {
      titulo: 'Material Financeiro',
      gestor: 'Gestor Financeiro',
      descricao: 'Arquivo de teste para a área Financeira.',
      arquivoUrl: 'https://drive.google.com/file/d/1k_qa3c6CywSbLkhWqlMXnCM5oWCxwB4O/preview',
      workAreaId: "452f02b9-69af-4dc8-af20-0ed5b20fb382", // Financeiro
      rota: "/app/curso/financeiro"
    },
    {
      titulo: 'Material Serviços Gerais',
      gestor: 'Gestor SG',
      descricao: 'Arquivo de teste para a área de Serviços Gerais.',
      arquivoUrl: 'https://drive.google.com/file/d/1xkkDhwf0g4HOEkAQL8kRdQERhdtcmcqs/preview',
      workAreaId: "dac8fd20-c9f3-43b6-9210-7a03a3f6142f", // Serviços Gerais
      rota: "/app/curso/servicos-gerais"
    },
    {
      titulo: 'Documento Geral da Empresa',
      gestor: 'Administração',
      descricao: 'Documento de integração geral para todos os novos colaboradores.',
      arquivoUrl: 'https://drive.google.com/file/d/1WXJ1xXtMZpmCv-HUMvXVmRbOPZS1mv3Y/preview',
      workAreaId: areaGeral?.id as string, // Geral
      rota: "/app/curso/geral"
    }
  ]

  // 3. Inserção com Verificação de Existência
  for (const m of materiaisIniciais) {
    const materialExists = await prisma.material.findFirst({
      where: { titulo: m.titulo, workAreaId: m.workAreaId }
    })

    if (!materialExists) {
      await prisma.material.create({ data: m })
      console.log(`✅ Material criado: ${m.titulo}`)
    } else {
      console.log(`ℹ️ Material já existe: ${m.titulo}`)
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
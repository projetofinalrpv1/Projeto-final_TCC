import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const areas = ['TI', 'Recursos Humanos', 'Serviços Gerais', 'Financeiro']
  
  for (const nome of areas) {
    await prisma.workArea.upsert({
      where: { nome },
      update: {},
      create: { nome },
    })
  }
}

main()
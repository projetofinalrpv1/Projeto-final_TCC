import { prisma } from '../lib/prisma';

export class SignatureRepository {
  async saveFinalSignature(workAreaId: string, employeeId: string, employeeSignature: string) {
    return await prisma.signatureProcess.create({
      data: {
        workAreaId,
        employeeId,
        employeeSignature,
        status: 'PENDING',
        completedAt: new Date(),
      }
    });
  }

  async findPendingProcess(employeeId: string, workAreaId: string) {
    return await prisma.signatureProcess.findFirst({
      where: { employeeId, workAreaId, status: 'PENDING' }
    });
  }
  
  // E já pode adicionar aquele método de listagem do gestor aqui:
  async listPendingByManager(managerId: string) {
    return await prisma.signatureProcess.findMany({
      where: {
        status: 'PENDING',
        employee: { managerId: managerId }
      },
      include: { employee: true }
    });
  }

  async approveSignature(id: string, managerSignature: string) {
  return await prisma.signatureProcess.update({
    where: { id },
    data: {
      status: 'APPROVED',
      managerSignature,
      approvedAt: new Date()
    }
  });
}

  async findById(id:string){
     return await prisma.signatureProcess.findUnique({
      where: {id},
      include: {
        employee: true
      }
     });
  }
}

export const signatureRepository = new SignatureRepository();
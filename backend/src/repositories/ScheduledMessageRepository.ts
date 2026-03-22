// src/repositories/ScheduledMessageRepository.ts
import { prisma } from '../lib/prisma';

export class ScheduledMessageRepository {
  // Busca mensagens pendentes cujo horário já passou
  async findPendingMessages() {
    return await prisma.scheduledMessage.findMany({
      where: {
        status: 'pending',
        sendAt: { lte: new Date() }
      }
    });
  }

  // Agenda uma nova mensagem
  async schedule(phone: string, message: string, sendAt: Date) {
    return await prisma.scheduledMessage.create({
      data: { phone, message, sendAt, status: 'pending' }
    });
  }

  // Marca como enviada
  async markAsSent(id: string) {
    return await prisma.scheduledMessage.update({
      where: { id },
      data: { status: 'sent' }
    });
  }

  // Marca como erro
  async markAsError(id: string) {
    return await prisma.scheduledMessage.update({
      where: { id },
      data: { status: 'error' }
    });
  }

  // Verifica se já existe agendamento pendente para esse número
  async findPendingByPhone(phone: string) {
    return await prisma.scheduledMessage.findFirst({
      where: { phone, status: 'pending' }
    });
  }
}

export const scheduledMessageRepository = new ScheduledMessageRepository();
// src/services/QueueService.ts
import { scheduledMessageRepository, ScheduledMessageRepository } from '../repositories/ScheduledMessageRepository';
import { whatsappService } from './WhatsAppService';

export async function checkAndSendMessages() {
  try {
    const messages = await scheduledMessageRepository.findPendingMessages()

    if (messages.length === 0) return;

    console.log(`📨 Processando ${messages.length} mensagem(ns) agendada(s)...`);

    for (const msg of messages) {
      try {
        await whatsappService.sendMessage(msg.phone, msg.message);
        await scheduledMessageRepository.markAsSent(msg.id);
        console.log(`✅ Mensagem ${msg.id} enviada para ${msg.phone}`);
      } catch (error) {
        console.error(`❌ Erro ao enviar mensagem ${msg.id}:`, error);
        await scheduledMessageRepository.markAsError(msg.id);
      }
    }
  } catch (error) {
    console.error('Erro no QueueService:', error);
  }
}

// Agenda a mensagem de lembrete de 30 dias para o gestor
export async function scheduleOnboardingReminder(
  managerPhone: string,
  collaboratorName: string,
  admissionDate: Date
) {
  const sendAt = new Date(admissionDate);
  sendAt.setMinutes(sendAt.getMinutes() + 2); // ← substitui o setDate

  // Evita duplicidade
  const existing = await scheduledMessageRepository.findPendingByPhone(managerPhone);
  if (existing) {
    console.log(`Lembrete já agendado para ${managerPhone}`);
    return;
  }

  const message =
    `🔔 *ON THE JOB - Lembrete de Integração*\n\n` +
    `Olá Gestor! 👋\n\n` +
    `O colaborador *${collaboratorName}* completou *30 dias* de integração hoje.\n\n` +
    `Acesse o sistema para verificar o progresso do treinamento e validar as tarefas concluídas.\n\n` +
    `🔗 http://localhost:5173/app/gestor`;

  await scheduledMessageRepository.schedule(managerPhone, message, sendAt);
  console.log(`📅 Lembrete agendado para ${sendAt.toLocaleDateString('pt-BR')} → ${managerPhone}`);
}
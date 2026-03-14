import { SignatureRepository } from '../repositories/SignatureRepository';
import { TaskRepository } from '../repositories/TaskRepository';
import { AppError } from '../errors/AppError';

export class SignatureService {
  private signatureRepository = new SignatureRepository();
  private taskRepository = new TaskRepository();

  /**
   * Finaliza o checklist e abre o processo de assinatura
   */
  async requestSignature(workAreaId: string, employeeId: string, signature: string) {
  // 1. Evita duplicidade
  const existingProcess = await this.signatureRepository.findPendingProcess(employeeId, workAreaId);
  if (existingProcess) {
    throw new AppError("Já existe um processo de finalização pendente.", 400);
  }

  // 2. Validação de Regra: Apenas as tarefas DESTE colaborador hoje
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  // Buscamos as tarefas que pertencem ao employeeId criadas hoje
  const userTasks = await this.taskRepository.findByUserAndDate(employeeId, startOfToday);
  
  if (!userTasks || userTasks.length === 0) {
    throw new AppError("Você não possui tarefas geradas para hoje. Nada para assinar.", 400);
  }

  // Verifica se existe alguma que NÃO esteja COMPLETED
  const pendingTasks = userTasks.filter(t => t.status !== 'COMPLETED');
  
  if (pendingTasks.length > 0) {
    throw new AppError(
      `Você ainda tem ${pendingTasks.length} tarefa(s) pendente(s). Finalize tudo antes de assinar.`, 
      400
    );
  }

  // 3. Persiste o processo de assinatura
  return await this.signatureRepository.saveFinalSignature(workAreaId, employeeId, signature);
}

  /**
   * Lista assinaturas pendentes para um gestor específico
   */
  async getPendingByManager(managerId: string) {
    return await this.signatureRepository.listPendingByManager(managerId);
  }

  async approveSignature(id: string, managerSignature: string, managerId: string) {
  const process = await this.signatureRepository.findById(id); // Adicione um findById no seu Repo
  
  if (!process) throw new AppError("Processo não encontrado.", 404);
  
  // Regra: Apenas o gestor responsável pode assinar
  // (Supondo que você valide a relação entre o colaborador e o gestor)
  if (process.employee.managerId !== managerId) {
    throw new AppError("Você não tem permissão para assinar este documento.", 403);
  }

  return await this.signatureRepository.approveSignature(id, managerSignature);
}
}
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
    // 1. Evita duplicidade: verifica se já existe uma assinatura pendente para o colaborador na mesma área
    const existingProcess = await this.signatureRepository.findPendingProcess(employeeId, workAreaId);
    if (existingProcess) {
      throw new AppError("Já existe um processo de finalização pendente.", 400);
    }

    // 2. Validação de Regra: todas as tarefas devem estar como 'COMPLETED'
    const tasks = await this.taskRepository.findByWorkArea(workAreaId);
    
    if (!tasks || tasks.length === 0) {
      throw new AppError("Não há tarefas cadastradas para validar.", 400);
    }

    const allDone = tasks.every(t => t.status === 'COMPLETED');
    if (!allDone) {
      throw new AppError("Ainda há tarefas pendentes. Finalize tudo antes de assinar.", 400);
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
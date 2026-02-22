import { TaskRepository } from '../repositories/TaskRepository';

export class TaskService {
  private taskRepository = new TaskRepository();

  async executeCreate(data: any) {
    // Aqui você poderia validar se o userId é válido
    if (!data.titulo) throw new Error("O título é obrigatório.");
    
    return await this.taskRepository.create(data);
  }

  async executeListAll() {
    return await this.taskRepository.findAll();
  }

  async executeUpdateStatus(id: string, { status, prioridade }: any) {
  const statusPermitidos = ['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA'];
  
  if (status && !statusPermitidos.includes(status)) {
    throw new Error("Status inválido. Use: PENDENTE, EM_ANDAMENTO ou CONCLUIDA.");
  }

  return await this.taskRepository.updateStatus(id, status, prioridade);
}

async executeDelete(id: string) {
  const taskExists = await this.taskRepository.findById(id);

  if (!taskExists) {
    throw new Error("Tarefa não encontrada.");
  }

  return await this.taskRepository.delete(id);
}
}
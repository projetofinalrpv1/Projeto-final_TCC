import { TaskRepository } from '../repositories/TaskRepository';

interface ITaskData {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  isTemplate?: boolean;
  workAreaId: string;
  userId?: string;
}

export class TaskService {
  private taskRepository = new TaskRepository();

  async executeCreate(data: ITaskData) {
    // Aqui você poderia validar se o userId é válido
    if (!data.title) throw new Error("O título é obrigatório.");
    
    return await this.taskRepository.create(data);
  }

  async executeListAll() {
    return await this.taskRepository.findAll();
  }

  async executeUpdateStatus(id: string, { status, priority }: any) {
  // Corrigido para Inglês para alinhar com o banco e o schema
    const statusPermitidos = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];
  
  if (status && !statusPermitidos.includes(status)) {
    throw new Error("Invalid status. Use: PENDING, IN_PROGRESS or COMPLETED.");
  }

  return await this.taskRepository.updateStatus(id, status, priority);
}

async executeDelete(id: string) {
  const taskExists = await this.taskRepository.findById(id);

  if (!taskExists) {
    throw new Error("Tarefa não encontrada.");
  }

  return await this.taskRepository.delete(id);
}
}
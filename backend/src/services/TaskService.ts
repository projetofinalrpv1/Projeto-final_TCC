import { TaskRepository } from '../repositories/TaskRepository';
import { AppError } from '../errors/AppError';

interface ITaskData {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  isTemplate?: boolean;
  workAreaId: string;
  userId: string; // Adicione aqui
  requesterRole?: string; // Se precisar validar permissão
}

export class TaskService {
  private taskRepository = new TaskRepository();

  async executeCreate(data: ITaskData, requester: any) {
    // 1. Validações básicas de campos obrigatórios
    if (!data.title) throw new AppError("O título da tarefa é obrigatório.", 400);
    if (!data.workAreaId) throw new AppError("A área de trabalho é obrigatória.", 400);

    // --- REGRAS DE SEGURANÇA ---

    // 1. Se for ADMIN, ele pode criar tarefas em qualquer workAreaId
    const isAdmin = requester.role === 'ADMIN';

    // 2. Se for GESTOR, verificamos se a área onde ele quer criar a tarefa é a mesma dele
    const isManagerOfTargetArea = requester.role === 'GESTOR' && data.workAreaId === requester.workAreaId;

    // Bloqueio: Se não for admin e não for o gestor daquela área específica, barramos a criação.
    // Note que COLABORADORES também caem aqui e são bloqueados (conforme sua regra).
    if (!isAdmin && !isManagerOfTargetArea) {
      throw new AppError(
        "Você não tem permissão para criar tarefas nesta área. Apenas o administrador ou o gestor da própria área podem fazer isso.", 
        403
      );
    }

    // Se passou pelas regras, envia para o repositório
    return await this.taskRepository.create(data);
}

  async executeListAll() {
    return await this.taskRepository.findAll();
  }

  async executeUpdateStatus(id: string, data: { status?: string, priority?: string }, requester: any) {
    const statusPermitidos = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];

    if (data.status && !statusPermitidos.includes(data.status)) {
      throw new AppError("Status inválido. Use: PENDING, IN_PROGRESS ou COMPLETED.", 400);
    }

    const task = await this.taskRepository.findById(id);
    if (!task) throw new AppError("Tarefa não encontrada.", 404);

    // --- REGRAS DE SEGURANÇA REFINADAS ---
    
    // 1. ADMIN: Pode tudo.
    const isAdmin = requester.role === 'ADMIN';
    
    // 2. DONO DA TAREFA: Pode alterar o que é dele.
    const isOwner = task.userId === requester.sub; // Usando 'sub' que vem do seu JWT

    // 3. GESTOR DA ÁREA: Pode alterar qualquer tarefa que pertença à sua área de trabalho.
    const isManagerOfArea = requester.role === 'GESTOR' && task.workAreaId === requester.workAreaId;

    if (!isAdmin && !isOwner && !isManagerOfArea) {
      throw new AppError("Você não tem permissão para alterar esta tarefa. Ela pertence a outra área ou usuário.", 403);
    }

    return await this.taskRepository.updateStatus(id, data.status, data.priority);
}

  async executeDelete(id: string, requester: any) {
  const task = await this.taskRepository.findById(id);
  
  if (!task) {
    throw new AppError("Tarefa não encontrada.", 404);
  }

  // 1. Se for ADMIN, permite deletar qualquer uma
  if (requester.role === 'ADMIN') {
    return await this.taskRepository.delete(id);
  }

  // 2. Se for GESTOR, verifica se a tarefa pertence à área dele
  if (requester.role === 'GESTOR') {
    if (task.workAreaId !== requester.workAreaId) {
      throw new AppError("Você só pode deletar tarefas da sua própria área.", 403);
    }
    return await this.taskRepository.delete(id);
  }

  // 3. Se cair aqui (ex: COLABORADOR), bloqueia
  throw new AppError("Você não tem permissão para deletar tarefas.", 403);
}
}
import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/UserRepository';
import { TaskRepository } from '../repositories/TaskRepository'; // Importe aqui

export class UserService {
  private userRepository = new UserRepository();
  private taskRepository = new TaskRepository(); // Instancie aqui

  async executeRegister({ nome, email, senha, cargo, workAreaId }: any) {
    const userExists = await this.userRepository.findByEmail(email);
    if (userExists) throw new Error("Este e-mail já está em uso.");

    const hashedPassword = await bcrypt.hash(senha, 10);

    const user = await this.userRepository.create({
      nome, email, senha: hashedPassword, cargo, workAreaId
    });

    // 2. BUSCAR TAREFAS DEFAULT (Usando o repositório)
    const templateTasks = await this.taskRepository.findTemplatesByArea(workAreaId);

    // 3. CLONAR TAREFAS (Usando o repositório)
    if (templateTasks.length > 0) {
      const onboardingTasks = templateTasks.map(task => ({
        titulo: task.titulo,
        descricao: task.descricao,
        prioridade: task.prioridade,
        workAreaId: workAreaId,
        userId: user.id, 
        isTemplate: false 
      }));

      await this.taskRepository.createMany(onboardingTasks);
    }

    const { senha: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async executeListAll() {
  const users = await this.userRepository.findAll();
  
  // Removemos a senha de todos os usuários da lista por segurança
  return users.map(({ senha, ...userWithoutPassword }) => userWithoutPassword);
}

async executeUpdate(id: string, data: any) {
  // 1. Verificamos se o usuário existe antes de tentar atualizar
  const userExists = await this.userRepository.findById(id);
  if (!userExists) {
    throw new Error("Usuário não encontrado.");
  }

  // 2. Criamos o objeto de atualização apenas com campos presentes no 'data'
  // O segredo aqui é que o Prisma ignora chaves que são 'undefined'
  const updateData: any = {};

  if (data.nome !== undefined) updateData.nome = data.nome;
  if (data.email !== undefined) updateData.email = data.email;
  if (data.cargo !== undefined) updateData.cargo = data.cargo;
  
  if (data.workAreaId && data.workAreaId.trim() !== "") {
    updateData.workAreaId = data.workAreaId;
  }

  if (data.senha && data.senha.trim() !== "") {
    updateData.senha = await bcrypt.hash(data.senha, 10);
  }

  // 3. Verifica se há algo para atualizar para evitar chamadas inúteis ao banco
  if (Object.keys(updateData).length === 0) {
    throw new Error("Nenhum dado fornecido para atualização.");
  }

  const updatedUser = await this.userRepository.update(id, updateData);

  const { senha: _, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
}

async executeDelete(id: string) {
  // Poderíamos verificar se o usuário existe antes de deletar
  await this.userRepository.delete(id);
  return { message: "Usuário removido com sucesso" };
}
}

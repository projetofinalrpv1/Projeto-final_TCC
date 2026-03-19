import { CreateUserDTO, UpdateUserDTO } from "../schemas/UserSchemas";
import bcrypt from 'bcrypt';
import { UserRepository } from "../repositories/UserRepository";
import { AppError } from "../errors/AppError";

export class UserService {
  private userRepository = new UserRepository();

  private sanitizeUser(user: any) {
    if (!user) return null;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // 1. Criar Usuário: Restrito ao ADMIN
  async executeCreate(data: CreateUserDTO, requester: any) {
    if (requester.role !== 'ADMIN') {
      throw new AppError("Acesso Negado: Apenas o Administrador pode criar novos usuários.", 403);
    }

    const userExists = await this.userRepository.findByEmail(data.email);
    if (userExists) throw new AppError("Este email já está cadastrado.", 409);

    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    const userData = {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
      workArea: { connect: { id: data.workAreaId } },
      ...(data.managerId && { manager: { connect: { id: data.managerId } } })
    };

    const user = await this.userRepository.create(userData);
    return this.sanitizeUser(user);
  }

  async executeListAll() {
    const users = await this.userRepository.findAll();
    return users.map(this.sanitizeUser);
  }

  async executeGetDetails(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new AppError("Usuário não encontrado.", 404);
    
    return this.sanitizeUser(user);
  }

  async executeListManagers() {
    // Assumindo que seu repository tenha uma busca por role ou cargo
    const managers = await this.userRepository.findManyByRole('GESTOR');
    return managers.map(this.sanitizeUser);
  }

  async executeGetTeam(managerId: string) {
    const team = await this.userRepository.findTeamByManager(managerId);
    
    return team.map(member => {
      const totalTasks = member.tasks.length;
      const completedTasks = member.tasks.filter(t => t.status === 'CONCLUIDO' || t.status === 'COMPLETED').length;
      
      const progresso = totalTasks > 0 
        ? Math.round((completedTasks / totalTasks) * 100) 
        : 0;

      return {
        ...this.sanitizeUser(member),
        progresso,
        totalTasks,
        completedTasks,
        // Mudança: workArea.name em vez de nome
        workArea: member.workArea?.name 
      };
    });
  }

async executePatch(id: string, data: UpdateUserDTO, requester: any) {
    const isOwner = requester.id === id;
    const isAdmin = requester.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      throw new AppError("Você não tem permissão para editar este perfil.", 403);
    }

    const userExists = await this.userRepository.findById(id);
    if (!userExists) throw new AppError("Usuário não encontrado.", 404);

    const updateData: any = { ...data };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await this.userRepository.update(id, updateData);
    return this.sanitizeUser(updatedUser);
  }

  async executeReplace(id: string, data: CreateUserDTO, requester: any) { // Adicione o 'requester' aqui
  
  // Regra de segurança: Apenas ADMIN pode substituir dados completos
  if (requester.role !== 'ADMIN') {
    throw new AppError("Acesso Negado: Apenas o Administrador pode realizar esta operação.", 403);
  }

  const userExists = await this.userRepository.findById(id);
  if (!userExists) throw new AppError("Usuário não encontrado.", 404);

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const updatedUser = await this.userRepository.update(id, {
    ...data,
    password: hashedPassword
  });

  return this.sanitizeUser(updatedUser);
}


  async executeToggleStatus(id: string, isActive: boolean, requester:any) {

    const userExists = await this.userRepository.findById(id);

    if (!userExists) throw new AppError("Usuário não encontrado.", 404);

    const updatedUser = await this.userRepository.update(id, { isActive });

    return this.sanitizeUser(updatedUser);
  }

}



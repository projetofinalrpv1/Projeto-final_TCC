import { CreateUserDTO, UpdateUserDTO } from "../schemas/UserSchemas";
import bcrypt from 'bcrypt';
import { UserRepository } from "../repositories/UserRepository";
import { AppError } from "../errors/AppError";

export class UserService {
  private userRepository = new UserRepository();

  // Helper privado para remover dados sensíveis
  private sanitizeUser(user: any) {
    if (!user) return null;
    const { senha, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async executeCreate(data: CreateUserDTO) {
    // 1. Validação
    if (!data.email) throw new AppError("Email é obrigatório.", 400);
    
    const userExists = await this.userRepository.findByEmail(data.email);
    if (userExists) throw new AppError("Este email já está cadastrado.", 409);

    // 2. Processamento
    const hashedPassword = await bcrypt.hash(data.senha, 10);
    const userData = { ...data, senha: hashedPassword };

    // 3. Persistência e Retorno
    const user = await this.userRepository.create(userData);
    return this.sanitizeUser(user);
  }

  async executeListAll() {
    const users = await this.userRepository.findAll();
    return users.map(user => this.sanitizeUser(user));
  }

  async executeListManagers() {
    const managers = await this.userRepository.findManagers();
    return managers.map(user => this.sanitizeUser(user));
  }

  async executeGetTeam(managerId: string) {
    const team = await this.userRepository.findTeamByManager(managerId);
    
    return team.map(member => {
      const totalTasks = member.tasks.length;
      const completedTasks = member.tasks.filter(t => t.status === 'CONCLUIDO' || t.status === 'DONE').length;
      
      const progresso = totalTasks > 0 
        ? Math.round((completedTasks / totalTasks) * 100) 
        : 0;

      return {
        ...this.sanitizeUser(member), // Usa o sanitizador aqui também
        progresso,
        totalTasks,
        completedTasks,
        workArea: member.workArea?.nome
      };
    });
  }

  async executeGetDetails(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new AppError("Usuário não encontrado.", 404);

    return this.sanitizeUser(user);
  }

  async executePatch(id: string, data: UpdateUserDTO) {
   
    const userExists = await this.userRepository.findById(id);
    if (!userExists) throw new AppError("Usuário não encontrado.", 404);

    if (data.senha) {
      data.senha = await bcrypt.hash(data.senha, 10);
    }
    
    const updatedUser = await this.userRepository.update(id, data);
    return this.sanitizeUser(updatedUser);
  }

  async executeReplace(id: string, data: CreateUserDTO) {
    const userExists = await this.userRepository.findById(id);
    if (!userExists) throw new AppError("Usuário não encontrado.", 404);

    const hashedPassword = await bcrypt.hash(data.senha, 10);

    const updatedUser = await this.userRepository.update(id, {
      ...data,
      senha: hashedPassword
    });

    return this.sanitizeUser(updatedUser);
  }

  async executeToggleStatus(id: string, isActive: boolean) {
    const userExists = await this.userRepository.findById(id);
    if (!userExists) throw new AppError("Usuário não encontrado.", 404);

    const updatedUser = await this.userRepository.update(id, { isActive });
    return this.sanitizeUser(updatedUser);
  }
}
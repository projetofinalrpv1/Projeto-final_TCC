import { CreateUserDTO, UpdateUserDTO } from "../schemas/UserSchemas";
import bcrypt from 'bcrypt';
import { UserRepository } from "../repositories/UserRepository";
import { AppError } from "../errors/AppError";

export class UserService {
  private userRepository = new UserRepository();

  // Agora removemos o 'password' do objeto retornado
  private sanitizeUser(user: any) {
    if (!user) return null;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async executeCreate(data: CreateUserDTO) {
    if (!data.email) throw new AppError("Email é obrigatório.", 400);
    
    const userExists = await this.userRepository.findByEmail(data.email);
    if (userExists) throw new AppError("Este email já está cadastrado.", 409);

    // Mudança: data.password em vez de data.senha
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const userData = {
    name: data.name,
    email: data.email,
    password: await bcrypt.hash(data.password, 10),
    role: data.role,
    // A mágica acontece aqui:
    workArea: {
      connect: { id: data.workAreaId }
    },
    // Se managerId for opcional, faça um condicional:
    ...(data.managerId && {
      manager: { connect: { id: data.managerId } }
    })
  };

  return await this.userRepository.create(userData);
}
  // ... (executeListAll e executeListManagers seguem a mesma lógica)

  async executeGetTeam(managerId: string) {
    const team = await this.userRepository.findTeamByManager(managerId);
    
    return team.map(member => {
      const totalTasks = member.tasks.length;
      const completedTasks = member.tasks.filter(t => t.status === 'CONCLUIDO' || t.status === 'DONE').length;
      
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

async executePatch(id: string, data: UpdateUserDTO) {
  const userExists = await this.userRepository.findById(id);
  if (!userExists) throw new AppError("Usuário não encontrado.", 404);

  // 1. Criamos um objeto de atualização "limpo"
  const updateData: any = { ...data };

  // 2. Se a senha for enviada, tratamos o hash
  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 10);
  }


  Object.keys(updateData).forEach((key) => {
    if (updateData[key] === null || updateData[key] === undefined) {
      delete updateData[key];
    }
  });

  // 4. Agora sim, enviamos apenas o que tem valor real
  const updatedUser = await this.userRepository.update(id, updateData);
  return this.sanitizeUser(updatedUser);
}

  async executeReplace(id: string, data: CreateUserDTO) {

    const userExists = await this.userRepository.findById(id);

    if (!userExists) throw new AppError("Usuário não encontrado.", 404);

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const updatedUser = await this.userRepository.update(id, {
      ...data,
      password: hashedPassword

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



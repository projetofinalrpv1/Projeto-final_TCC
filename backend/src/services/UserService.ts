// src/services/UserService.ts
import { CreateUserDTO, UpdateUserDTO } from "../schemas/UserSchemas";
import bcrypt from 'bcrypt';
import { UserRepository } from "../repositories/UserRepository";
import { AppError } from "../errors/AppError";
import { scheduleOnboardingReminder } from "../services/QueueService";
import { emailService } from './EmailService';

export class UserService {
  private userRepository = new UserRepository();

  private sanitizeUser(user: any) {
    if (!user) return null;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

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
      phone: data.phone || null,
      password: hashedPassword,
      role: data.role,
      startDate: data.dataInicio ? new Date(data.dataInicio) : null,
      workArea: { connect: { id: data.workAreaId } },
      ...(data.managerId && { manager: { connect: { id: data.managerId } } })
    };

    const user = await this.userRepository.create(userData);

    // Envia e-mail de boas-vindas com credenciais
    try {
      await emailService.sendWelcomeEmail(
        data.name,
        data.email,
        data.password,
        data.role
      );
    } catch (error) {
      console.error('❌ Erro ao enviar e-mail:', error);
      console.error('❌ Detalhes:', JSON.stringify(error, null, 2));
    }

    // Agenda lembrete WhatsApp de 30 dias (se for colaborador com gestor)
    if (data.role === 'COLABORADOR' && data.managerId) {
      try {
        console.log('🔍 Buscando gestor:', data.managerId);
        const manager = await this.userRepository.findById(data.managerId);
        console.log('📱 Phone do gestor:', manager?.phone);

        if (manager?.phone) {
          await scheduleOnboardingReminder(
            manager.phone,
            data.name,
            new Date()
          );
          console.log('✅ Lembrete WhatsApp agendado com sucesso!');
        } else {
          console.warn('⚠️ Gestor não tem telefone cadastrado! Lembrete não agendado.');
        }
      } catch (error) {
        console.error('❌ Erro ao agendar lembrete WhatsApp:', error);
      }
    }

    return this.sanitizeUser(user);
  }

  async executeListAll() {
    const users = await this.userRepository.findAll();
    return users.map(this.sanitizeUser);
  }

  async executeGetDetails(id: string) {
  const user = await this.userRepository.findById(id);
  if (!user) throw new AppError("Usuário não encontrado.", 404);
  
 
  return {
    ...this.sanitizeUser(user),
    workArea: user.workArea
  };
}

  async executeListManagers() {
    const managers = await this.userRepository.findManyByRole('GESTOR');
    return managers.map(this.sanitizeUser);
  }

  async executeGetTeam(managerId: string, workAreaId: string) {
    const team = await this.userRepository.findTeamByManager(managerId, workAreaId);

    return team.map(member => {
      const totalTasks = member.tasks.length;
      const completedTasks = member.tasks.filter(
        (t: any) => t.status === 'COMPLETED'
      ).length;

      const progresso = totalTasks > 0
        ? Math.round((completedTasks / totalTasks) * 100)
        : 0;

      return {
        ...this.sanitizeUser(member),
        progresso,
        totalTasks,
        completedTasks,
        workArea: member.workArea?.name
      };
    });
  }

  async executePatch(id: string, data: UpdateUserDTO, requester: any) {
    const isOwner = requester.sub === id; // usa sub do JWT
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

  async executeReplace(id: string, data: CreateUserDTO, requester: any) {
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
  
  // Adicione este método no UserService.ts
async executeAdminDashboard() {
  const gestores = await this.userRepository.getAdminDashboard();

  return gestores.map(gestor => {
    const totalColaboradores = gestor.subordinates.length;

    const progressoMedio = totalColaboradores > 0
      ? Math.round(
          gestor.subordinates.reduce((acc, colab) => {
            const total = colab.tasks.length;
            const concluidas = colab.tasks.filter((t: any) => t.status === 'COMPLETED').length;
            const progresso = total > 0 ? (concluidas / total) * 100 : 0;
            return acc + progresso;
          }, 0) / totalColaboradores
        )
      : 0;

    return {
      gestor: { id: gestor.id, name: gestor.name },
      workArea: gestor.workArea?.name || '—',
      workAreaId: gestor.workArea?.id || '',
      totalColaboradores,
      progressoMedio,
    };
  });
}
  async executeToggleStatus(id: string, isActive: boolean, requester: any) {
    const userExists = await this.userRepository.findById(id);
    if (!userExists) throw new AppError("Usuário não encontrado.", 404);

    const updatedUser = await this.userRepository.update(id, { isActive });
    return this.sanitizeUser(updatedUser);
  }
}
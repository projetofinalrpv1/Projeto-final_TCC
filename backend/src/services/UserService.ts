import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/UserRepository';

export class UserService {
  private userRepository = new UserRepository();

  // Adicionamos 'workAreaId' na desestruturação dos parâmetros
  async executeRegister({ nome, email, senha, cargo, workAreaId }: any) {
    // Regra 1: Email duplicado
    const userExists = await this.userRepository.findByEmail(email);
    if (userExists) throw new Error("Este e-mail já está em uso.");

    // Regra 2: Segurança (Bcrypt)
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Regra 3: Persistência (Incluindo a relação com a WorkArea)
    const user = await this.userRepository.create({
      nome,
      email,
      senha: hashedPassword,
      cargo,
      workAreaId // Campo obrigatório após a nossa mudança no schema
    });

    // Retorna sem a senha
    const { senha: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async executeListAll() {
  const users = await this.userRepository.findAll();
  
  // Removemos a senha de todos os usuários da lista por segurança
  return users.map(({ senha, ...userWithoutPassword }) => userWithoutPassword);
}

async executeUpdate(id: string, data: any) {
  // 1. Criamos um objeto vazio
  const updateData: any = {};

  // 2. Só adicionamos ao objeto o que foi enviado e não é vazio
  if (data.nome) updateData.nome = data.nome;
  if (data.email) updateData.email = data.email;
  if (data.cargo) updateData.cargo = data.cargo;
  
  // Aqui está o pulo do gato: só valida o workAreaId se ele existir no body
  if (data.workAreaId && data.workAreaId.trim() !== "") {
    updateData.workAreaId = data.workAreaId;
  }

  if (data.senha && data.senha.trim() !== "") {
    updateData.senha = await bcrypt.hash(data.senha, 10);
  }

  // 3. O Prisma agora só vai dar UPDATE nas colunas que estão dentro de updateData
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

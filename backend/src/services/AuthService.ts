// src/services/AuthService.ts
import bcrypt from 'bcrypt';
import { userRepository } from '../repositories/UserRepository';
import { AppError } from '../errors/AppError';
import { AuthDTO } from '../schemas/AuthSchemas';

export class AuthService {
  async authenticate({ email, password }: AuthDTO) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new AppError("Credenciais inválidas", 401);

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new AppError("Credenciais inválidas", 401);

    return user;
  }

  // Retorna os dados do usuário autenticado a partir do id extraído do token (sub)
  async getMe(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) throw new AppError("Usuário não encontrado.", 404);

    // Reutiliza o mesmo sanitize pattern do UserService — sem expor a senha
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
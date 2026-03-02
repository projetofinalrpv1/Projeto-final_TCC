import bcrypt from 'bcrypt'
import { userRepository } from '../repositories/UserRepository'; 
import { AppError } from '../errors/AppError';
import { LoginInput } from '../schemas/AuthSchemas';
import { AuthDTO } from '../schemas/AuthSchemas';

export class AuthService {
 async authenticate({ email, password }: AuthDTO) {
  const user = await userRepository.findByEmail(email);
  if (!user) throw new AppError("Credenciais inválidas", 401);

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) throw new AppError("Credenciais inválidas", 401);

  // Certifique-se de que o objeto retornado contenha os campos usados no Controller
  return user;
 }
}
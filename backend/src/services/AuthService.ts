import bcrypt from 'bcrypt'
import { userRepository } from '../repositories/UserRepository'; 
import { AppError } from '../errors/AppError';
import { LoginInput } from '../schemas/AuthSchemas';
import { AuthDTO } from '../schemas/AuthSchemas';

export class AuthService {
 async authenticate({ email, password }: AuthDTO) {
  const user = await userRepository.findByEmail(email);
  if (!user) throw new AppError("Credenciais inválidas", 401);

  // LOG DE DEBUG (Remova depois)
  console.log("Tentando logar com:", email);
  console.log("Senha fornecida:", password);
  console.log("Hash no banco:", user.password);

  const passwordMatch = await bcrypt.compare(password, user.password);
  
  console.log("Resultado do compare:", passwordMatch); // Se aqui for false, o hash não bate

  if (!passwordMatch) throw new AppError("Credenciais inválidas", 401);

  return user;
 }
}
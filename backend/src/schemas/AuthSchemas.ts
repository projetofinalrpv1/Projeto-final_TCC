import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export type AuthDTO = z.infer<typeof loginSchema>

// Criamos um tipo para usar no TypeScript se precisar
export type LoginInput = z.infer<typeof loginSchema>;


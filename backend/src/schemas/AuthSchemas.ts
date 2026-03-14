// src/schemas/AuthSchemas.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export type AuthDTO = z.infer<typeof loginSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

// Schema de resposta do /auth/me
// Reutiliza os dados que já vêm do banco via UserService.executeGetDetails()
export const meResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['COLABORADOR', 'GESTOR', 'ADMIN']),
  workAreaId: z.string().uuid(),
  isActive: z.boolean(),
  createdAt: z.string().or(z.date()).optional(),
});

export type MeResponseDTO = z.infer<typeof meResponseSchema>;

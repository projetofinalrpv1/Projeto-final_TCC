import { z } from 'zod';

// Schema base
export const createUserSchema = z.object({
  nome: z.string().min(3),
  email: z.string().email(),
  senha: z.string().min(6),
  cargo: z.enum(['COLABORADOR', 'GESTOR', 'ADMIN']),
  workAreaId: z.string().uuid(),
  managerId: z.string().uuid().optional().nullable(),
});

// A MÁGICA: Gera o tipo (interface) automaticamente
export type CreateUserDTO = z.infer<typeof createUserSchema>;

// Schema de Patch (Partial)
export const patchUserSchema = createUserSchema.partial().extend({
  senha: z.string().min(6).optional().nullable(),
  // Adicione isso aqui para o Zod aceitar o campo:
  isActive: z.boolean().optional(),
});

export const putUserSchema = createUserSchema.extend({
  isActive: z.boolean().optional(),
});

export type PutUserDTO = z.infer<typeof putUserSchema>;
export type UpdateUserDTO = z.infer<typeof patchUserSchema>;

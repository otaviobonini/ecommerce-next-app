import { z } from "zod";

export const RegisterInputSchema = z.object({
  email: z.string().email("E-mail inválido"),
  username: z
    .string()
    .min(2, "Nome de usuário deve ter pelo menos 2 caracteres")
    .max(120, "Nome de usuário deve ter no máximo 120 caracteres"),
  password: z
    .string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .max(120, "Senha deve ter no máximo 120 caracteres"),
});

export const LoginInputSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z
    .string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .max(120, "Senha deve ter no máximo 120 caracteres"),
});

export const RefreshTokenInputSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token é obrigatório"),
});

export const RegisterResponseSchema = z.object({
  userId: z.number(),
  username: z.string(),
  email: z.string().email(),
});

// POST /auth/login -> 200 SafeUserWithToken
export const LoginResponseSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  username: z.string(),
  token: z.string(),
  refreshToken: z.string(),
});

// POST /auth/refresh-token -> 200 { token, refreshToken }
export const RefreshTokenResponseSchema = z.object({
  token: z.string(),
  refreshToken: z.string(),
});

// JWT decodificado (payload), caso precise ler role/id no front
export const JwtPayloadSchema = z.object({
  id: z.number().int().positive(),
  role: z.enum(["USER", "ADMIN"]),
});

export type RegisterInput = z.infer<typeof RegisterInputSchema>;
export type LoginInput = z.infer<typeof LoginInputSchema>;
export type RefreshTokenInput = z.infer<typeof RefreshTokenInputSchema>;

export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type RefreshTokenResponse = z.infer<typeof RefreshTokenResponseSchema>;
export type JwtPayload = z.infer<typeof JwtPayloadSchema>;

// Usuário "seguro" que vai morar no AuthContext (sem token solto no estado de UI)
export type AuthUser = Pick<LoginResponse, "id" | "email" | "username">;

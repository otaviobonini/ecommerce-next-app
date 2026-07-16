import {
  LoginInput,
  LoginResponse,
  LoginResponseSchema,
  RefreshTokenResponse,
  RefreshTokenResponseSchema,
  RegisterInput,
  RegisterResponseSchema,
  type RegisterResponse,
} from "@/schemas/auth.schema";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export async function register(data: RegisterInput): Promise<RegisterResponse> {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message ?? "Erro ao criar conta");
  }

  const json = await res.json();
  return RegisterResponseSchema.parse(json);
}

export async function login(data: LoginInput): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // essencial: deixa o browser guardar o Set-Cookie
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message ?? "Erro ao logar na conta");
  }
  return LoginResponseSchema.parse(await res.json());
}

export async function logout(): Promise<void> {
  await fetch(`${API_URL}/logout`, {
    method: "POST",
    credentials: "include", // manda o cookie refreshToken pro backend invalidar
  });
}

export async function refreshAccessToken(): Promise<RefreshTokenResponse> {
  const res = await fetch(`${API_URL}/refresh-token`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Sessão expirada");
  return RefreshTokenResponseSchema.parse(await res.json());
}

export async function getMe(token: string) {
  const res = await fetch(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Não autenticado");
  return res.json();
}

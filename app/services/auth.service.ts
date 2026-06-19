import {
  LoginInput,
  LoginResponse,
  LoginResponseSchema,
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
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message ?? "Erro ao logar na conta");
  }
  const json = await res.json();
  return LoginResponseSchema.parse(json);
}

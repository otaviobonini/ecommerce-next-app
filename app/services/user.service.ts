import { User } from "@/schemas/user.schema";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export async function getMe(token: string): Promise<User> {
  const res = await fetch(`${API_URL}/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar informações do usuário");
  }

  return res.json();
}

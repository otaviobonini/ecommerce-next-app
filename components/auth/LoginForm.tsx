"use client";

import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { LoginInputSchema } from "@/schemas/auth.schema";

interface Props {
  onSuccess: () => void;
  onSwitchToRegister: () => void;
}

export default function LoginForm({ onSuccess, onSwitchToRegister }: Props) {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // valida no client antes de gastar uma chamada de rede
    const parsed = LoginInputSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Dados inválidos");
      return;
    }

    setIsSubmitting(true);
    try {
      await login(parsed.data);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao entrar");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-center">Entrar</h2>

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          className="border rounded-lg p-3"
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium">
          Senha
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className="border rounded-lg p-3"
          required
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-black text-white rounded-xl p-3 hover:bg-gray-900 disabled:opacity-50 hover:cursor-pointer"
      >
        {isSubmitting ? "Entrando..." : "Entrar"}
      </button>

      <button
        type="button"
        onClick={onSwitchToRegister}
        className="text-sm text-gray-600 hover:underline text-center"
      >
        Não tem conta? Cadastre-se
      </button>
    </form>
  );
}

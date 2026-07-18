"use client";

import { useState } from "react";
import Button from "@/components/Button";
import { useAuth } from "@/app/context/AuthContext";
import { RegisterInputSchema } from "@/schemas/auth.schema";

interface Props {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export default function RegisterForm({ onSuccess, onSwitchToLogin }: Props) {
  const { register } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // valida no client antes de gastar uma chamada de rede
    const parsed = RegisterInputSchema.safeParse({ username, email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Dados inválidos");
      return;
    }

    setIsSubmitting(true);
    try {
      // register() já faz login automaticamente em seguida (ver AuthContext)
      await register(parsed.data);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar conta");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-center">Criar conta</h2>

      <div className="flex flex-col gap-1">
        <label htmlFor="username" className="text-sm font-medium">
          Nome de usuário
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          className="border rounded-lg p-3"
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="register-email" className="text-sm font-medium">
          E-mail
        </label>
        <input
          id="register-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          className="border rounded-lg p-3"
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="register-password" className="text-sm font-medium">
          Senha
        </label>
        <input
          id="register-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          className="border rounded-lg p-3"
          required
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Criando conta..." : "Criar conta"}
      </Button>

      <button
        type="button"
        onClick={onSwitchToLogin}
        className="text-sm text-gray-600 hover:underline text-center"
      >
        Já tem conta? Entrar
      </button>
    </form>
  );
}

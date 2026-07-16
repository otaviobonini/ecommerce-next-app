"use client";
import { LoginInput, AuthUser, RegisterInput } from "@/schemas/auth.schema";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import {
  logout as logoutRequest,
  login as loginRequest,
  register as registerRequest,
} from "../services/auth.service";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "auth_refresh_token";
const USER_KEY = "auth_user";

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (data: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      const savedUser = localStorage.getItem(USER_KEY);

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser) as AuthUser);
      }
    } catch {
      // localStorage corrompido ou indisponível (ex: modo privado) — ignora e segue deslogado
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    // JWT é só Base64 — decodifica o payload sem precisar de biblioteca
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiresAt = payload.exp * 1000; // exp é em segundos, Date usa ms
    const msUntilRenew = expiresAt - Date.now() - 60_000; // renova 60s antes

    if (msUntilRenew <= 0) {
      // token já expirado ou prestes a expirar — renova agora
      renewToken();
      return;
    }

    const timer = setTimeout(renewToken, msUntilRenew);
    return () => clearTimeout(timer); // limpa se o componente desmontar ou token mudar
  }, [token]);

  async function renewToken() {
    const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!storedRefreshToken) return;

    try {
      const res = await fetch(`${API_URL}/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: storedRefreshToken }),
      });
      if (!res.ok) {
        // refreshToken expirado — desloga silenciosamente
        logout();
        return;
      }
      const { token: newToken, refreshToken: newRefreshToken } =
        await res.json();
      persistSession(
        /* user atual, sem mudar */ user!,
        newToken,
        newRefreshToken,
      );
    } catch {
      // falha de rede — vai tentar de novo na próxima vez que a página montar
    }
  }

  function persistSession(
    authUser: AuthUser,
    authToken: string,
    refreshToken: string,
  ) {
    localStorage.setItem(TOKEN_KEY, authToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(authUser));
    // Cookie legível pelo middleware (não é httpOnly, então não é
    // 100% à prova de XSS, mas resolve a leitura no servidor/edge)
    document.cookie = `auth_token=${authToken}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
    setRefreshToken(refreshToken);
    setToken(authToken);
    setUser(authUser);
  }

  async function login(data: LoginInput) {
    const response = await loginRequest(data);
    const authUser: AuthUser = {
      id: response.id,
      email: response.email,
      username: response.username,
    };
    persistSession(authUser, response.token, response.refreshToken);
  }

  async function register(data: RegisterInput) {
    await registerRequest(data);
    await login({ email: data.email, password: data.password });
  }

  async function logout() {
    await logoutRequest(refreshToken!);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    document.cookie = "auth_token=; path=/; max-age=0";
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("No context");
  return context;
}

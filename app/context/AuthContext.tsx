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
  login as loginRequest,
  register as registerRequest,
} from "../services/auth.service";

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

  function persistSession(
    authUser: AuthUser,
    authToken: string,
    refreshToken: string,
  ) {
    localStorage.setItem(TOKEN_KEY, authToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(authUser));
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

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
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

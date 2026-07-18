import { describe, expect, it, vi, beforeEach } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthContext";
import * as authService from "../services/auth.service";

vi.mock("../services/auth.service", () => ({
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  refreshAccessToken: vi.fn().mockRejectedValue(new Error("Sessão expirada")),
  getMe: vi.fn(),
}));

// gera um JWT "fake" válido o suficiente pro AuthContext decodificar
// (ele lê o payload com atob() e espera um campo `exp`)
function makeFakeToken(expiresInSeconds = 3600) {
  const header = btoa(JSON.stringify({ alg: "none" }));
  const payload = btoa(
    JSON.stringify({ exp: Math.floor(Date.now() / 1000) + expiresInSeconds }),
  );
  return `${header}.${payload}.signature`;
}

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("Deve iniciar deslogado quando não há nada no localStorage", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.token).toBeNull();
    expect(result.current.user).toBeNull();
  });

  it("Deve logar e salvar token/usuário no contexto", async () => {
    const fakeToken = makeFakeToken();
    vi.mocked(authService.login).mockResolvedValue({
      id: 1,
      email: "user@email.com",
      username: "user",
      token: fakeToken,
    });

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.login({
        email: "user@email.com",
        password: "123456",
      });
    });

    expect(result.current.token).toBe(fakeToken);
    expect(result.current.user).toEqual({
      id: 1,
      email: "user@email.com",
      username: "user",
    });
    // o access token nunca é persistido em disco: fica só em estado do React
    expect(localStorage.length).toBe(0);
  });

  it("Deve deslogar e limpar token/usuário do contexto", async () => {
    const fakeToken = makeFakeToken();
    vi.mocked(authService.login).mockResolvedValue({
      id: 1,
      email: "user@email.com",
      username: "user",
      token: fakeToken,
    });
    vi.mocked(authService.logout).mockResolvedValue(undefined);

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.login({
        email: "user@email.com",
        password: "123456",
      });
    });

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.token).toBeNull();
    expect(result.current.user).toBeNull();
  });
});

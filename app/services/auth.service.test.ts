import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { register, login, logout } from "./auth.service";

// Helper para criar uma Response falsa sem precisar de um servidor real
function mockFetchResponse(body: unknown, ok = true, status = 200) {
  return {
    ok,
    status,
    json: async () => body,
  } as Response;
}

describe("auth.service", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("register", () => {
    const input = {
      email: "joao@teste.com",
      username: "joao",
      password: "123456",
    };

    it("faz POST em /register e retorna os dados validados pelo schema", async () => {
      const apiResponse = {
        userId: 1,
        username: "joao",
        email: "joao@teste.com",
      };
      vi.mocked(fetch).mockResolvedValueOnce(mockFetchResponse(apiResponse));

      const result = await register(input);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/register"),
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        }),
      );
      expect(result).toEqual(apiResponse);
    });

    it("lança erro com a mensagem da API quando a requisição falha", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        mockFetchResponse({ message: "E-mail já cadastrado" }, false, 409),
      );

      await expect(register(input)).rejects.toThrow("E-mail já cadastrado");
    });

   

    it("lança erro de validação se a API retornar um formato inesperado", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        mockFetchResponse({ userId: "não-é-numero" }),
      );

      await expect(register(input)).rejects.toThrow();
    });
  });

  describe("login", () => {
    const input = { email: "joao@teste.com", password: "123456" };

    it("faz POST em /login e retorna os dados validados pelo schema", async () => {
      const apiResponse = {
        id: 1,
        email: "joao@teste.com",
        username: "joao",
        token: "token-abc",
      };
      vi.mocked(fetch).mockResolvedValueOnce(mockFetchResponse(apiResponse));

      const result = await login(input);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/login"),
        expect.objectContaining({ method: "POST" }),
      );
      expect(result).toEqual(apiResponse);
    });

    it("lança erro com a mensagem da API quando as credenciais são inválidas", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        mockFetchResponse({ message: "Credenciais inválidas" }, false, 401),
      );

      await expect(login(input)).rejects.toThrow("Credenciais inválidas");
    });
  });

  describe("logout", () => {
    it("faz POST em /logout enviando o cookie refreshToken via credentials", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(mockFetchResponse({}));

      await logout();

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/logout"),
        expect.objectContaining({
          method: "POST",
          credentials: "include",
        }),
      );
    });
  });
});

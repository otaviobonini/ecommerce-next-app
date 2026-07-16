import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getMe } from "./user.service";

function mockFetchResponse(body: unknown, ok = true, status = 200) {
  return {
    ok,
    status,
    json: async () => body,
  } as Response;
}

const fakeUser = {
  userId: 1,
  username: "joao",
  email: "joao@teste.com",
  role: "USER",
  address: [],
  order: [],
};

describe("user.service", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("getMe", () => {
    it("faz GET em /me com o token e retorna o usuário", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(mockFetchResponse(fakeUser));

      const result = await getMe("fake-token");

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/me"),
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({
            Authorization: "Bearer fake-token",
          }),
        }),
      );
      expect(result).toEqual(fakeUser);
    });

    it("lança erro genérico quando a requisição falha", async () => {
      // Repare que user.service.ts NÃO lê res.json() no caminho de erro,
      // então a mensagem é sempre fixa, independente do corpo da resposta.
      vi.mocked(fetch).mockResolvedValueOnce(
        mockFetchResponse({ message: "Token expirado" }, false, 401),
      );

      await expect(getMe("fake-token")).rejects.toThrow(
        "Erro ao buscar informações do usuário",
      );
    });
  });
});

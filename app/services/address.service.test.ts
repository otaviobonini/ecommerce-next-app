import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  createAddress,
  deleteAddress,
  editAddress,
  getUserAddresses,
  setDefaultAddress,
} from "./address.service";

// Helper para criar uma Response falsa sem precisar de um servidor real
function mockFetchResponse(body: unknown, ok = true, status = 200) {
  return {
    ok,
    status,
    json: async () => body,
  } as Response;
}

const fakeAddress = {
  addressId: 1,
  userId: 1,
  street: "Rua A",
  city: "Florianópolis",
  state: "SC",
  zipCode: "88000-000",
  isDefault: false,
};

describe("address.service", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("getUserAddresses", () => {
    it("faz GET em /address e retorna os dados validados pelo schema", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(mockFetchResponse([fakeAddress]));

      const result = await getUserAddresses("fake-token");

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/address"),
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({
            Authorization: "Bearer fake-token",
          }),
        }),
      );
      expect(result).toEqual([fakeAddress]);
    });

    it("lança erro com a mensagem da API quando a requisição falha", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        mockFetchResponse({ message: "Token inválido" }, false, 401),
      );

      await expect(getUserAddresses("fake-token")).rejects.toThrow(
        "Token inválido",
      );
    });
  });

  describe("createAddress", () => {
    const input = {
      street: "Rua A",
      city: "Florianópolis",
      state: "SC",
      zipCode: "88000-000",
      isDefault: false,
    };

    it("faz POST em /address com o body e o token corretos", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(mockFetchResponse(fakeAddress));

      const result = await createAddress(input, "fake-token");

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/address"),
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Authorization: "Bearer fake-token",
          }),
          body: JSON.stringify(input),
        }),
      );
      expect(result).toEqual(fakeAddress);
    });

    it("lança erro com a mensagem da API quando a criação falha", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        mockFetchResponse({ message: "Dados inválidos" }, false, 400),
      );

      await expect(createAddress(input, "fake-token")).rejects.toThrow(
        "Dados inválidos",
      );
    });
  });

  describe("editAddress", () => {
    const input = { city: "São José" };

    it("faz PUT em /address/:id com o body correto", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        mockFetchResponse({ ...fakeAddress, city: "São José" }),
      );

      const result = await editAddress(1, input, "fake-token");

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/address/1"),
        expect.objectContaining({
          method: "PUT",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Authorization: "Bearer fake-token",
          }),
          body: JSON.stringify(input),
        }),
      );
      expect(result.city).toBe("São José");
    });

    it("lança erro com a mensagem da API quando a edição falha", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        mockFetchResponse({ message: "Endereço não encontrado" }, false, 404),
      );

      await expect(editAddress(1, input, "fake-token")).rejects.toThrow(
        "Endereço não encontrado",
      );
    });
  });

  describe("deleteAddress", () => {
    it("faz DELETE em /address/:id", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(mockFetchResponse(null));

      await deleteAddress(1, "fake-token");

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/address/1"),
        expect.objectContaining({
          method: "DELETE",
          headers: expect.objectContaining({
            Authorization: "Bearer fake-token",
          }),
        }),
      );
    });

    it("lança erro com a mensagem da API quando a exclusão falha", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        mockFetchResponse({ message: "Endereço não encontrado" }, false, 404),
      );

      await expect(deleteAddress(1, "fake-token")).rejects.toThrow(
        "Endereço não encontrado",
      );
    });
  });

  describe("setDefaultAddress", () => {
    it("faz PUT em /address/:id/default", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(mockFetchResponse(null));

      await setDefaultAddress(1, "fake-token");

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/address/1/default"),
        expect.objectContaining({
          method: "PUT",
          headers: expect.objectContaining({
            Authorization: "Bearer fake-token",
          }),
        }),
      );
    });

    it("lança erro com a mensagem da API quando a operação falha", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        mockFetchResponse({ message: "Endereço não encontrado" }, false, 404),
      );

      await expect(setDefaultAddress(1, "fake-token")).rejects.toThrow(
        "Endereço não encontrado",
      );
    });
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  createCategory,
  deleteCategory,
  uploadCategoryImage,
  editCategories,
} from "./categories.service";

function mockFetchResponse(body: unknown, ok = true, status = 200) {
  return {
    ok,
    status,
    json: async () => body,
  } as Response;
}

const fakeCategory = { categoryId: 1, name: "Roupas", categoryImage: null };

describe("categories.service", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("createCategory", () => {
    it("faz POST em /categories com o token e o body corretos", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(mockFetchResponse(fakeCategory));

      const result = await createCategory("fake-token", { name: "Roupas" });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/categories"),
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Authorization: "Bearer fake-token",
          }),
          body: JSON.stringify({ name: "Roupas" }),
        }),
      );
      expect(result).toEqual(fakeCategory);
    });

    it("lança erro com o status quando falha", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        mockFetchResponse(null, false, 400),
      );

      await expect(
        createCategory("fake-token", { name: "Roupas" }),
      ).rejects.toThrow("Erro ao criar categoria: 400");
    });
  });

  describe("deleteCategory", () => {
    it("faz DELETE em /categories/:categoryId", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(mockFetchResponse(null));

      await deleteCategory("fake-token", 1);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/categories/1"),
        expect.objectContaining({
          method: "DELETE",
          headers: expect.objectContaining({
            Authorization: "Bearer fake-token",
          }),
        }),
      );
    });

    it("lança erro com o id e o status quando falha", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        mockFetchResponse(null, false, 404),
      );

      await expect(deleteCategory("fake-token", 1)).rejects.toThrow(
        "Erro ao excluir categoria 1: 404",
      );
    });
  });

  describe("uploadCategoryImage", () => {
    it("faz POST em /categories/:categoryId/image com FormData", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        mockFetchResponse({
          ...fakeCategory,
          categoryImage: "https://cdn/cat.png",
        }),
      );
      const file = new File(["conteudo"], "foto.png", { type: "image/png" });

      const result = await uploadCategoryImage("fake-token", 1, file);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/categories/1/image"),
        expect.objectContaining({
          method: "POST",
          headers: { Authorization: "Bearer fake-token" },
          body: expect.any(FormData),
        }),
      );
      expect(result.categoryImage).toBe("https://cdn/cat.png");
    });

    it("lança erro genérico quando o upload falha", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        mockFetchResponse(null, false, 500),
      );
      const file = new File(["conteudo"], "foto.png", { type: "image/png" });

      await expect(uploadCategoryImage("fake-token", 1, file)).rejects.toThrow(
        "Erro ao enviar imagem da categoria",
      );
    });
  });

  describe("editCategories", () => {
    it("faz PUT em /categories/:categoryId com o body correto", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        mockFetchResponse({ ...fakeCategory, name: "Calçados" }),
      );

      const result = await editCategories({
        data: { name: "Calçados" },
        categoryId: 1,
        token: "fake-token",
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/categories/1"),
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify({ name: "Calçados" }),
        }),
      );
      expect(result.name).toBe("Calçados");
    });

    it("lança erro com o id e o status quando falha", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        mockFetchResponse(null, false, 404),
      );

      await expect(
        editCategories({ data: {}, categoryId: 1, token: "fake-token" }),
      ).rejects.toThrow("Erro ao editar categoria 1: 404");
    });
  });
});

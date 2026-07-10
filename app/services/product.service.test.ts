import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getCategory,
  getProducts,
  getCategories,
  getProduct,
  getFeaturedProducts,
  getPrimaryImage,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  deleteProductImage,
  setPrimaryProductImage,
} from "./product.service";
import type { Product } from "@/schemas/product";

function mockFetchResponse(body: unknown, ok = true, status = 200) {
  return {
    ok,
    status,
    json: async () => body,
  } as Response;
}

const fakeProduct: Product = {
  productId: 1,
  productName: "Camiseta",
  productPrice: "99.90",
  productDescription: null,
  stock: 5,
  isFeatured: false,
  categoryId: 1,
  images: [
    { imageId: 1, productId: 1, url: "https://cdn/1.png", isPrimary: false },
    { imageId: 2, productId: 1, url: "https://cdn/2.png", isPrimary: true },
  ],
};

describe("product.service", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  // --- rotas públicas (sem token, usam next.revalidate) --------------------

  describe("getCategory", () => {
    it("faz GET em /categories/:categoryId/products", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(mockFetchResponse([fakeProduct]));

      const result = await getCategory(1);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/categories/1/products"),
        expect.objectContaining({ next: { revalidate: 60 } }),
      );
      expect(result).toEqual([fakeProduct]);
    });

    it("lança erro com o status quando falha", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        mockFetchResponse(null, false, 500),
      );

      await expect(getCategory(1)).rejects.toThrow(
        "Erro ao buscar produtos da categoria: 500",
      );
    });
  });

  describe("getProducts", () => {
    it("faz GET em /products com limit e offset padrão", async () => {
      const apiResponse = {
        products: [fakeProduct],
        limit: 10,
        offset: 0,
        total: 1,
        hasPrevious: false,
        hasNext: false,
      };
      vi.mocked(fetch).mockResolvedValueOnce(mockFetchResponse(apiResponse));

      const result = await getProducts();

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/products?limit=10&offset=0"),
        expect.any(Object),
      );
      expect(result).toEqual(apiResponse);
    });

    it("respeita limit e offset customizados", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        mockFetchResponse({
          products: [],
          limit: 5,
          offset: 20,
          total: 0,
          hasPrevious: true,
          hasNext: false,
        }),
      );

      await getProducts(5, 20);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/products?limit=5&offset=20"),
        expect.any(Object),
      );
    });

    it("lança erro com o status quando falha", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        mockFetchResponse(null, false, 500),
      );

      await expect(getProducts()).rejects.toThrow(
        "Erro ao buscar produtos: 500",
      );
    });
  });

  describe("getCategories", () => {
    it("faz GET em /categories e retorna array direto", async () => {
      const apiResponse = [
        { categoryId: 1, name: "Roupas", categoryImage: null },
      ];
      vi.mocked(fetch).mockResolvedValueOnce(mockFetchResponse(apiResponse));

      const result = await getCategories();

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/categories"),
        expect.any(Object),
      );
      expect(result).toEqual(apiResponse);
    });

    it("lança erro com o status quando falha", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        mockFetchResponse(null, false, 500),
      );

      await expect(getCategories()).rejects.toThrow(
        "Erro ao buscar categorias: 500",
      );
    });
  });

  describe("getProduct", () => {
    it("faz GET em /product/:productId", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(mockFetchResponse(fakeProduct));

      const result = await getProduct(1);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/product/1"),
        expect.any(Object),
      );
      expect(result).toEqual(fakeProduct);
    });

    it("lança erro com o id e o status quando falha", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        mockFetchResponse(null, false, 404),
      );

      await expect(getProduct(1)).rejects.toThrow(
        "Erro ao buscar produto 1: 404",
      );
    });
  });

  describe("getFeaturedProducts", () => {
    it("faz GET em /categories/featured/products", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(mockFetchResponse([fakeProduct]));

      const result = await getFeaturedProducts();

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/categories/featured/products"),
        expect.any(Object),
      );
      expect(result).toEqual([fakeProduct]);
    });

    it("lança erro com o status quando falha", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        mockFetchResponse(null, false, 500),
      );

      await expect(getFeaturedProducts()).rejects.toThrow(
        "Erro ao buscar produtos em destaque: 500",
      );
    });
  });

  // --- helper puro (sem fetch) ----------------------------------------------

  describe("getPrimaryImage", () => {
    it("retorna a url da imagem marcada como primária", () => {
      expect(getPrimaryImage(fakeProduct)).toBe("https://cdn/2.png");
    });

    it("cai pra primeira imagem se nenhuma for primária", () => {
      const product = {
        ...fakeProduct,
        images: fakeProduct.images.map((img) => ({ ...img, isPrimary: false })),
      };
      expect(getPrimaryImage(product)).toBe("https://cdn/1.png");
    });

    it("retorna undefined quando não há imagens", () => {
      expect(getPrimaryImage({ ...fakeProduct, images: [] })).toBeUndefined();
    });
  });

  // --- rotas de admin --------------------------------------------------------

  describe("createProduct", () => {
    const input = {
      productName: "Camiseta",
      productPrice: 99.9,
      stock: 5,
    };

    it("faz POST em /product com o token e o body corretos", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(mockFetchResponse(fakeProduct));

      const result = await createProduct("fake-token", input);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/product"),
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Authorization: "Bearer fake-token",
          }),
          body: JSON.stringify(input),
        }),
      );
      expect(result).toEqual(fakeProduct);
    });

    it("lança erro com o status quando falha", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        mockFetchResponse(null, false, 400),
      );

      await expect(createProduct("fake-token", input)).rejects.toThrow(
        "Erro ao criar produto: 400",
      );
    });
  });

  describe("updateProduct", () => {
    it("faz PATCH em /product/:productId com o body correto", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        mockFetchResponse({ ...fakeProduct, stock: 10 }),
      );

      const result = await updateProduct("fake-token", 1, { stock: 10 });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/product/1"),
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify({ stock: 10 }),
        }),
      );
      expect(result.stock).toBe(10);
    });

    it("lança erro com o id e o status quando falha", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        mockFetchResponse(null, false, 404),
      );

      await expect(updateProduct("fake-token", 1, {})).rejects.toThrow(
        "Erro ao atualizar produto 1: 404",
      );
    });
  });

  describe("deleteProduct", () => {
    it("faz DELETE em /product/:productId", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(mockFetchResponse(null));

      await deleteProduct("fake-token", 1);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/product/1"),
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

      await expect(deleteProduct("fake-token", 1)).rejects.toThrow(
        "Erro ao excluir produto 1: 404",
      );
    });
  });

  describe("uploadProductImage", () => {
    it("faz POST em /product/:productId/images com FormData", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        mockFetchResponse({ imageId: 1, url: "https://cdn/1.png" }),
      );
      const file = new File(["conteudo"], "foto.png", { type: "image/png" });

      const result = await uploadProductImage("fake-token", 1, file);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/product/1/images"),
        expect.objectContaining({
          method: "POST",
          headers: { Authorization: "Bearer fake-token" },
          body: expect.any(FormData),
        }),
      );
      expect(result).toEqual({ imageId: 1, url: "https://cdn/1.png" });
    });

    it("lança erro genérico quando o upload falha", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        mockFetchResponse(null, false, 500),
      );
      const file = new File(["conteudo"], "foto.png", { type: "image/png" });

      await expect(uploadProductImage("fake-token", 1, file)).rejects.toThrow(
        "Erro ao enviar imagem",
      );
    });
  });

  describe("deleteProductImage", () => {
    it("faz DELETE em /product/:productId/images/:imageId", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(mockFetchResponse(null));

      await deleteProductImage("fake-token", 1, 2);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/product/1/images/2"),
        expect.objectContaining({ method: "DELETE" }),
      );
    });

    it("lança erro genérico quando falha", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        mockFetchResponse(null, false, 500),
      );

      await expect(deleteProductImage("fake-token", 1, 2)).rejects.toThrow(
        "Erro ao excluir imagem",
      );
    });
  });

  describe("setPrimaryProductImage", () => {
    it("faz PATCH em /product/:productId/images/:imageId/primary", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(mockFetchResponse(null));

      await setPrimaryProductImage("fake-token", 1, 2);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/product/1/images/2/primary"),
        expect.objectContaining({ method: "PATCH" }),
      );
    });

    it("lança erro genérico quando falha", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        mockFetchResponse(null, false, 500),
      );

      await expect(setPrimaryProductImage("fake-token", 1, 2)).rejects.toThrow(
        "Erro ao definir imagem primária",
      );
    });
  });
});

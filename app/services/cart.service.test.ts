import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  createCart,
  getCart,
  getCartItems,
  addCartItem,
  updateCartItemQuantity,
  deleteCartItem,
  clearCart,
} from "./cart.service";

function mockFetchResponse(body: unknown, ok = true, status = 200) {
  return {
    ok,
    status,
    json: async () => body,
  } as Response;
}

const fakeCart = {
  cartId: 1,
  userId: 1,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

const fakeCartItem = {
  cartItemId: 1,
  cartId: 1,
  productId: 10,
  quantity: 2,
};

const fakeProduct = {
  productId: 10,
  productName: "Camiseta",
  productPrice: "99.90",
  productDescription: null,
  stock: 5,
  isFeatured: false,
  categoryId: 1,
  images: [],
};

describe("cart.service", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("createCart", () => {
    it("faz POST em /carts e retorna o carrinho validado pelo schema", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(mockFetchResponse(fakeCart));

      const result = await createCart("fake-token");

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/carts"),
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Authorization: "Bearer fake-token",
          }),
        }),
      );
      expect(result).toEqual(fakeCart);
    });

    it("lança erro com a mensagem da API quando falha", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        mockFetchResponse({ message: "Carrinho já existe" }, false, 409),
      );

      await expect(createCart("fake-token")).rejects.toThrow(
        "Carrinho já existe",
      );
    });
  });

  describe("getCart", () => {
    it("faz GET em /carts e retorna o carrinho validado pelo schema", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(mockFetchResponse(fakeCart));

      const result = await getCart("fake-token");

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/carts"),
        expect.objectContaining({ method: "GET" }),
      );
      expect(result).toEqual(fakeCart);
    });

    it("lança erro com a mensagem da API quando falha", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        mockFetchResponse({ message: "Não autorizado" }, false, 401),
      );

      await expect(getCart("fake-token")).rejects.toThrow("Não autorizado");
    });
  });

  describe("getCartItems", () => {
    it("faz GET em /carts/:cartId/items e retorna os itens com produto aninhado", async () => {
      const apiResponse = [{ ...fakeCartItem, product: fakeProduct }];
      vi.mocked(fetch).mockResolvedValueOnce(mockFetchResponse(apiResponse));

      const result = await getCartItems(1, "fake-token");

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/carts/1/items"),
        expect.objectContaining({ method: "GET" }),
      );
      expect(result).toEqual(apiResponse);
    });

    it("lança erro de validação se o produto aninhado vier faltando campos", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        mockFetchResponse([{ ...fakeCartItem, product: { productId: 10 } }]),
      );

      await expect(getCartItems(1, "fake-token")).rejects.toThrow();
    });
  });

  describe("addCartItem", () => {
    const input = { cartId: 1, productId: 10, quantity: 2 };

    it("faz POST em /carts/items com o body correto", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(mockFetchResponse(fakeCartItem));

      const result = await addCartItem(input, "fake-token");

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/carts/items"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(input),
        }),
      );
      expect(result).toEqual(fakeCartItem);
    });

    it("lança erro com a mensagem da API quando falha", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        mockFetchResponse({ message: "Produto sem estoque" }, false, 400),
      );

      await expect(addCartItem(input, "fake-token")).rejects.toThrow(
        "Produto sem estoque",
      );
    });
  });

  describe("updateCartItemQuantity", () => {
    it("faz PATCH em /carts/items/:cartItemId com a nova quantidade", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        mockFetchResponse({ ...fakeCartItem, quantity: 5 }),
      );

      const result = await updateCartItemQuantity(
        1,
        { quantity: 5 },
        "fake-token",
      );

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/carts/items/1"),
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify({ quantity: 5 }),
        }),
      );
      expect(result.quantity).toBe(5);
    });

    it("lança erro com a mensagem da API quando falha", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        mockFetchResponse({ message: "Quantidade inválida" }, false, 400),
      );

      await expect(
        updateCartItemQuantity(1, { quantity: 5 }, "fake-token"),
      ).rejects.toThrow("Quantidade inválida");
    });
  });

  describe("deleteCartItem", () => {
    it("faz DELETE em /carts/items/:cartItemId", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(mockFetchResponse(null));

      await deleteCartItem(1, "fake-token");

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/carts/items/1"),
        expect.objectContaining({
          method: "DELETE",
          headers: expect.objectContaining({
            Authorization: "Bearer fake-token",
          }),
        }),
      );
    });

    it("lança erro com a mensagem da API quando falha", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        mockFetchResponse({ message: "Item não encontrado" }, false, 404),
      );

      await expect(deleteCartItem(1, "fake-token")).rejects.toThrow(
        "Item não encontrado",
      );
    });
  });

  describe("clearCart", () => {
    it("faz DELETE em /carts/:cartId", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(mockFetchResponse(null));

      await clearCart(1, "fake-token");

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/carts/1"),
        expect.objectContaining({
          method: "DELETE",
          headers: expect.objectContaining({
            Authorization: "Bearer fake-token",
          }),
        }),
      );
    });

    it("lança erro com a mensagem da API quando falha", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        mockFetchResponse({ message: "Carrinho não encontrado" }, false, 404),
      );

      await expect(clearCart(1, "fake-token")).rejects.toThrow(
        "Carrinho não encontrado",
      );
    });
  });
});

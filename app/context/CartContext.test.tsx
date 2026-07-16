import { describe, expect, it, vi } from "vitest";
import { CartProvider, useCart } from "./CartContext";
import { act, renderHook } from "@testing-library/react";

vi.mock("./AuthContext", () => ({
  useAuth: () => ({ token: null }),
}));

describe("CartContext", () => {
  it("Deve adicionar item novo ao carrinho", () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });

    act(() => {
      result.current.addItem({
        productId: 1,
        productName: "Camiseta",
        productPrice: 50,
        quantity: 1,
        imageUrl: "/img.png",
      });
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.totalItems).toBe(1);
    expect(result.current.totalPrice).toBe(50);
  });

  it("incrementa quantidade se o item já existe", () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });
    const item = {
      productId: 1,
      productName: "Camiseta",
      productPrice: 50,
      quantity: 1,
      imageUrl: "/img.png",
    };

    act(() => {
      result.current.addItem(item);
      result.current.addItem(item);
    });

    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.totalPrice).toBe(100);
  });
  it("Deve remover item do carrinho", () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });
    const item = {
      productId: 1,
      productName: "Camiseta",
      productPrice: 50,
      quantity: 1,
      imageUrl: "/img.png",
    };
    act(() => {
      result.current.addItem(item);
      result.current.removeItem(item.productId);
    });
    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });
});

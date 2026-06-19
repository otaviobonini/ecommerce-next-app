import {
  CartSchema,
  CartItemSchema,
  CartItemsResponseSchema,
  type Cart,
  type CartItem,
  type CartItemWithProduct,
  type CreateCartItemInput,
  type UpdateCartItemQuantityInput,
} from "@/schemas/cart.schema";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export async function createCart(token: string): Promise<Cart> {
  const res = await fetch(`${API_URL}/carts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message ?? "Erro ao criar carrinho");
  }

  const json = await res.json();
  return CartSchema.parse(json);
}

export async function getCart(token: string): Promise<Cart> {
  const res = await fetch(`${API_URL}/carts`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message ?? "Erro ao pegar carrinho");
  }

  const json = await res.json();
  return CartSchema.parse(json);
}

export async function getCartItems(
  cartId: number,
  token: string,
): Promise<CartItemWithProduct[]> {
  const res = await fetch(`${API_URL}/carts/${cartId}/items`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message ?? "Erro ao buscar itens do carrinho");
  }

  const json = await res.json();
  return CartItemsResponseSchema.parse(json);
}

export async function addCartItem(
  data: CreateCartItemInput,
  token: string,
): Promise<CartItem> {
  const res = await fetch(`${API_URL}/carts/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message ?? "Erro ao adicionar item ao carrinho");
  }

  const json = await res.json();
  return CartItemSchema.parse(json);
}

export async function updateCartItemQuantity(
  cartItemId: number,
  data: UpdateCartItemQuantityInput,
  token: string,
): Promise<CartItem> {
  const res = await fetch(`${API_URL}/carts/items/${cartItemId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message ?? "Erro ao atualizar quantidade do item");
  }

  const json = await res.json();
  return CartItemSchema.parse(json);
}

export async function deleteCartItem(
  cartItemId: number,
  token: string,
): Promise<void> {
  const res = await fetch(`${API_URL}/carts/items/${cartItemId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message ?? "Erro ao remover item do carrinho");
  }
}

export async function clearCart(cartId: number, token: string): Promise<void> {
  const res = await fetch(`${API_URL}/carts/${cartId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message ?? "Erro ao limpar carrinho");
  }
}

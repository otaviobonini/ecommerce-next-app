import {
  CreateOrderResponseSchema,
  OrderSchema,
  OrdersResponseSchema,
  type CreateOrderInput,
  type CreateOrderResponse,
  type Order,
} from "@/schemas/order.schema";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export async function createOrder(
  data: CreateOrderInput,
  token: string,
): Promise<CreateOrderResponse> {
  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message ?? "Erro ao criar pedido");
  }

  const json = await res.json();
  return CreateOrderResponseSchema.parse(json);
}

export async function getOrderById(
  orderId: number,
  token: string,
): Promise<Order> {
  const res = await fetch(`${API_URL}/orders/${orderId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message ?? "Erro ao buscar pedido");
  }

  const json = await res.json();
  return OrderSchema.parse(json);
}

export async function getUserOrders(
  token: string,
  status?: string,
  offset = 0,
  limit = 20,
): Promise<Order[]> {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  params.set("offset", String(offset));
  params.set("limit", String(limit));

  const res = await fetch(`${API_URL}/orders/me?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message ?? "Erro ao buscar pedidos");
  }

  const json = await res.json();
  return OrdersResponseSchema.parse(json);
}

// Admin routes

export async function getOrders(
  token: string,
  offset?: number,
  limit?: number,
): Promise<Order[]> {
  const res = await fetch(
    `${API_URL}/orders?offset=${offset ?? 0}&limit=${limit ?? 20}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message ?? "Erro ao buscar pedidos");
  }

  const json = await res.json();
  return OrdersResponseSchema.parse(json);
}

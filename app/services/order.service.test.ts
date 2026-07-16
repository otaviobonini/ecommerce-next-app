import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  createOrder,
  getOrderById,
  getUserOrders,
  getOrders,
  updateOrderStatus,
} from "./order.service";

function mockFetchResponse(body: unknown, ok = true, status = 200) {
  return {
    ok,
    status,
    json: async () => body,
  } as Response;
}

const fakeOrder = {
  orderId: 1,
  userId: 1,
  addressId: 1,
  status: "PENDING" as const,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  total: "199.90",
  paymentLink: null,
  orderItems: [],
};

const fakeAdminOrder = {
  orderId: 1,
  status: "PENDING" as const,
  total: "199.90",
  paymentLink: null,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  user: { userId: 1, username: "joao", email: "joao@teste.com" },
  address: {
    addressId: 1,
    street: "Rua A",
    city: "Florianópolis",
    state: "SC",
    zipCode: "88000-000",
    isDefault: true,
  },
  orderItems: [],
};

describe("order.service", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("createOrder", () => {
    it("faz POST em /orders e retorna orderId + paymentLink", async () => {
      const apiResponse = {
        orderId: 1,
        paymentLink: "https://pay.example.com/1",
      };
      vi.mocked(fetch).mockResolvedValueOnce(mockFetchResponse(apiResponse));

      const result = await createOrder({ addressId: 1 }, "fake-token");

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/orders"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ addressId: 1 }),
        }),
      );
      expect(result).toEqual(apiResponse);
    });

    it("lança erro com a mensagem da API quando falha", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        mockFetchResponse({ message: "Endereço inválido" }, false, 400),
      );

      await expect(createOrder({ addressId: 1 }, "fake-token")).rejects.toThrow(
        "Endereço inválido",
      );
    });
  });

  describe("getOrderById", () => {
    it("faz GET em /orders/:orderId e retorna o pedido validado", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(mockFetchResponse(fakeOrder));

      const result = await getOrderById(1, "fake-token");

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/orders/1"),
        expect.objectContaining({ method: "GET" }),
      );
      expect(result).toEqual(fakeOrder);
    });

    it("lança erro com a mensagem da API quando o pedido não existe", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        mockFetchResponse({ message: "Pedido não encontrado" }, false, 404),
      );

      await expect(getOrderById(1, "fake-token")).rejects.toThrow(
        "Pedido não encontrado",
      );
    });
  });

  describe("getUserOrders", () => {
    it("faz GET em /orders/me com offset e limit por padrão", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(mockFetchResponse([fakeOrder]));

      const result = await getUserOrders("fake-token");

      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/orders\/me\?offset=0&limit=20/),
        expect.objectContaining({ method: "GET" }),
      );
      expect(result).toEqual([fakeOrder]);
    });

    it("inclui o filtro de status na query string quando informado", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(mockFetchResponse([fakeOrder]));

      await getUserOrders("fake-token", "PENDING", 10, 5);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(/status=PENDING.*offset=10.*limit=5/),
        expect.objectContaining({ method: "GET" }),
      );
    });

    it("lança erro com a mensagem da API quando falha", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        mockFetchResponse({ message: "Não autorizado" }, false, 401),
      );

      await expect(getUserOrders("fake-token")).rejects.toThrow(
        "Não autorizado",
      );
    });
  });

  describe("getOrders (admin)", () => {
    it("faz GET em /orders com offset e limit padrão", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        mockFetchResponse([fakeAdminOrder]),
      );

      const result = await getOrders("fake-token");

      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/orders\?offset=0&limit=20/),
        expect.objectContaining({ method: "GET" }),
      );
      expect(result).toEqual([fakeAdminOrder]);
    });

    it("lança erro com a mensagem da API quando falha", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        mockFetchResponse({ message: "Acesso negado" }, false, 403),
      );

      await expect(getOrders("fake-token")).rejects.toThrow("Acesso negado");
    });
  });

  describe("updateOrderStatus", () => {
    it("faz PUT em /orders/:orderId/status com o novo status", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        mockFetchResponse({ ...fakeOrder, status: "PAID" }),
      );

      const result = await updateOrderStatus("fake-token", 1, "PAID");

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/orders/1/status"),
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify({ status: "PAID" }),
        }),
      );
      expect(result.status).toBe("PAID");
    });

    it("lança erro com a mensagem da API quando falha", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        mockFetchResponse(
          { message: "Transição de status inválida" },
          false,
          400,
        ),
      );

      await expect(updateOrderStatus("fake-token", 1, "PAID")).rejects.toThrow(
        "Transição de status inválida",
      );
    });
  });
});

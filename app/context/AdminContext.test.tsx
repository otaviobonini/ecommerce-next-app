import { describe, expect, it, vi, beforeEach } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { AdminProvider, useAdmin } from "./AdminContext";
import * as productService from "../services/product.service";
import * as categoriesService from "../services/categories.service";
import * as orderService from "../services/order.service";
import type { Product, Category } from "@/schemas/product";
import type { AdminOrder } from "@/schemas/order.schema";

// AdminContext depende de useAuth() e useUser() — mockamos os dois módulos
// diretamente pra controlar token/role sem precisar dos providers reais.
const mockUseAuth = vi.fn();
const mockUseUser = vi.fn();
vi.mock("./AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));
vi.mock("./UserContext", () => ({
  useUser: () => mockUseUser(),
}));

vi.mock("../services/product.service", () => ({
  createProduct: vi.fn(),
  updateProduct: vi.fn(),
  deleteProduct: vi.fn(),
  uploadProductImage: vi.fn(),
  deleteProductImage: vi.fn(),
  setPrimaryProductImage: vi.fn(),
  getProducts: vi.fn(),
  getCategories: vi.fn(),
}));

vi.mock("../services/categories.service", () => ({
  createCategory: vi.fn(),
  deleteCategory: vi.fn(),
  editCategories: vi.fn(),
  uploadCategoryImage: vi.fn(),
}));

vi.mock("../services/order.service", () => ({
  getOrders: vi.fn(),
  updateOrderStatus: vi.fn(),
}));

const fakeProduct: Product = {
  productId: 1,
  productName: "Camiseta",
  productPrice: "50.00",
  productDescription: null,
  stock: 10,
  isFeatured: false,
  categoryId: null,
  images: [],
};

const fakeCategory: Category = {
  categoryId: 1,
  name: "Roupas",
  categoryImage: null,
};

const fakeOrder: AdminOrder = {
  orderId: 1,
  status: "PENDING",
  total: "50.00",
  paymentLink: null,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  user: { userId: 1, username: "otavio", email: "otavio@email.com" },
  address: {
    addressId: 1,
    street: "Rua A",
    city: "Floripa",
    state: "SC",
    zipCode: "88000-000",
    isDefault: true,
  },
  orderItems: [],
};

describe("AdminContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({ token: "fake-token" });
    mockUseUser.mockReturnValue({ user: { role: "ADMIN" } });
    vi.mocked(productService.getProducts).mockResolvedValue({
      products: [],
      limit: 20,
      offset: 0,
      total: 0,
      hasPrevious: false,
      hasNext: false,
    });
    vi.mocked(productService.getCategories).mockResolvedValue([]);
    vi.mocked(orderService.getOrders).mockResolvedValue([]);
  });

  it("Não carrega dados automaticamente se o usuário não for ADMIN", async () => {
    mockUseUser.mockReturnValue({ user: { role: "USER" } });

    renderHook(() => useAdmin(), { wrapper: AdminProvider });

    // dá um tick pro useEffect rodar, se fosse rodar
    await act(async () => {});

    expect(productService.getProducts).not.toHaveBeenCalled();
    expect(orderService.getOrders).not.toHaveBeenCalled();
  });

  it("Carrega produtos, categorias e pedidos automaticamente quando é ADMIN", async () => {
    vi.mocked(productService.getProducts).mockResolvedValue({
      products: [fakeProduct],
      limit: 20,
      offset: 0,
      total: 1,
      hasPrevious: false,
      hasNext: false,
    });
    vi.mocked(productService.getCategories).mockResolvedValue([fakeCategory]);
    vi.mocked(orderService.getOrders).mockResolvedValue([fakeOrder]);

    const { result } = renderHook(() => useAdmin(), {
      wrapper: AdminProvider,
    });

    await waitFor(() => expect(result.current.products).toHaveLength(1));
    expect(result.current.categories).toHaveLength(1);
    expect(result.current.orders).toHaveLength(1);
  });

  it("Deve criar um produto e adicioná-lo no início da lista", async () => {
    vi.mocked(productService.createProduct).mockResolvedValue(fakeProduct);

    const { result } = renderHook(() => useAdmin(), {
      wrapper: AdminProvider,
    });
    await waitFor(() => expect(result.current.loadingProducts).toBe(false));

    await act(async () => {
      await result.current.createProduct({
        productName: "Camiseta",
        productPrice: 50,
        stock: 10,
      });
    });

    expect(result.current.products).toHaveLength(1);
    expect(result.current.products[0].productName).toBe("Camiseta");
  });

  it("Deve lançar erro ao criar produto sem token", async () => {
    mockUseAuth.mockReturnValue({ token: null });

    const { result } = renderHook(() => useAdmin(), {
      wrapper: AdminProvider,
    });

    await expect(
      result.current.createProduct({
        productName: "Camiseta",
        productPrice: 50,
        stock: 10,
      }),
    ).rejects.toThrow("Sem token de autenticação");
  });

  it("Deve atualizar um produto existente", async () => {
    vi.mocked(productService.getProducts).mockResolvedValue({
      products: [fakeProduct],
      limit: 20,
      offset: 0,
      total: 1,
      hasPrevious: false,
      hasNext: false,
    });
    const updated = { ...fakeProduct, productName: "Camiseta Nova" };
    vi.mocked(productService.updateProduct).mockResolvedValue(updated);

    const { result } = renderHook(() => useAdmin(), {
      wrapper: AdminProvider,
    });
    await waitFor(() => expect(result.current.products).toHaveLength(1));

    await act(async () => {
      await result.current.updateProduct(1, { productName: "Camiseta Nova" });
    });

    expect(result.current.products[0].productName).toBe("Camiseta Nova");
  });

  it("Deve remover um produto da lista", async () => {
    vi.mocked(productService.getProducts).mockResolvedValue({
      products: [fakeProduct],
      limit: 20,
      offset: 0,
      total: 1,
      hasPrevious: false,
      hasNext: false,
    });
    vi.mocked(productService.deleteProduct).mockResolvedValue(undefined);

    const { result } = renderHook(() => useAdmin(), {
      wrapper: AdminProvider,
    });
    await waitFor(() => expect(result.current.products).toHaveLength(1));

    await act(async () => {
      await result.current.deleteProduct(1);
    });

    expect(result.current.products).toHaveLength(0);
  });

  it("Deve criar uma categoria e adicioná-la na lista", async () => {
    vi.mocked(categoriesService.createCategory).mockResolvedValue(fakeCategory);

    const { result } = renderHook(() => useAdmin(), {
      wrapper: AdminProvider,
    });
    await waitFor(() => expect(result.current.loadingCategories).toBe(false));

    await act(async () => {
      await result.current.createCategory({ name: "Roupas" });
    });

    expect(result.current.categories).toHaveLength(1);
  });

  it("Deve remover uma categoria da lista", async () => {
    vi.mocked(productService.getCategories).mockResolvedValue([fakeCategory]);
    vi.mocked(categoriesService.deleteCategory).mockResolvedValue(undefined);

    const { result } = renderHook(() => useAdmin(), {
      wrapper: AdminProvider,
    });
    await waitFor(() => expect(result.current.categories).toHaveLength(1));

    await act(async () => {
      await result.current.deleteCategory(1);
    });

    expect(result.current.categories).toHaveLength(0);
  });

  it("Deve mudar o status de um pedido", async () => {
    vi.mocked(orderService.getOrders).mockResolvedValue([fakeOrder]);
    vi.mocked(orderService.updateOrderStatus).mockResolvedValue({
      ...fakeOrder,
      status: "PAID",
      userId: 1,
      addressId: 1,
      orderItems: [],
    } as never);

    const { result } = renderHook(() => useAdmin(), {
      wrapper: AdminProvider,
    });
    await waitFor(() => expect(result.current.orders).toHaveLength(1));

    await act(async () => {
      await result.current.changeOrderStatus(1, "PAID");
    });

    expect(result.current.orders[0].status).toBe("PAID");
  });
});

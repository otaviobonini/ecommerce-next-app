"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  Category,
  EditProductData,
  Product,
  ProductImage,
} from "@/schemas/product";
import { AdminOrder, Order, OrderStatus } from "@/schemas/order.schema";
import { useAuth } from "./AuthContext";
import { useUser } from "./UserContext";
import {
  createProduct as createProductService,
  updateProduct as updateProductService,
  deleteProduct as deleteProductService,
  uploadProductImage as uploadProductImageService,
  deleteProductImage as deleteProductImageService,
  setPrimaryProductImage as setPrimaryProductImageService,
  getProducts as getProductsService,
} from "../services/product.service";
import {
  createCategory as createCategoryService,
  deleteCategory as deleteCategoryService,
  editCategories as editCategoryService,
  uploadCategoryImage as uploadCategoryImageService,
} from "../services/categories.service";
import { getCategories as getCategoriesService } from "../services/product.service";
import {
  getOrders as getOrdersService,
  updateOrderStatus as updateOrderStatusService,
} from "../services/order.service";

interface NewProductInput {
  productName: string;
  productPrice: number;
  stock: number;
  productDescription?: string;
  isFeatured?: boolean;
  categoryId?: number | null;
}

interface NewCategoryInput {
  name: string;
}

interface AdminContextType {
  // Produtos
  products: Product[];
  loadingProducts: boolean;
  fetchProducts: (limit?: number, offset?: number) => Promise<void>;
  createProduct: (data: NewProductInput) => Promise<Product>;
  updateProduct: (productId: number, data: EditProductData) => Promise<Product>;
  deleteProduct: (productId: number) => Promise<void>;
  uploadProductImage: (productId: number, file: File) => Promise<ProductImage>;
  deleteProductImage: (productId: number, imageId: number) => Promise<void>;
  setPrimaryProductImage: (productId: number, imageId: number) => Promise<void>;

  // Categorias
  categories: Category[];
  loadingCategories: boolean;
  fetchCategories: () => Promise<void>;
  createCategory: (data: NewCategoryInput) => Promise<Category>;
  editCategory: (
    categoryId: number,
    data: { name: string },
  ) => Promise<Category>;
  deleteCategory: (categoryId: number) => Promise<void>;
  uploadCategoryImage: (categoryId: number, file: File) => Promise<void>;

  // Pedidos

  orders: AdminOrder[];
  loadingOrders: boolean;
  fetchOrders: (offset?: number, limit?: number) => Promise<void>;
  changeOrderStatus: (orderId: number, newStatus: OrderStatus) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const { user } = useUser();
  const isAdmin = user?.role === "ADMIN";

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // ---------- Produtos ----------

  const fetchProducts = useCallback(async (limit = 20, offset = 0) => {
    setLoadingProducts(true);
    try {
      const res = await getProductsService(limit, offset);
      setProducts(res.products);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  async function createProduct(data: NewProductInput) {
    if (!token) throw new Error("Sem token de autenticação");
    const product = await createProductService(token, data);
    // A API pode não devolver "images" na criação; normalizamos pra evitar
    // undefined em qualquer lugar que espere product.images (ex: getPrimaryImage)
    const normalized: Product = { ...product, images: product.images ?? [] };
    setProducts((prev) => [normalized, ...prev]);
    return normalized;
  }

  async function updateProduct(productId: number, data: EditProductData) {
    if (!token) throw new Error("Sem token de autenticação");
    const product = await updateProductService(token, productId, data);
    setProducts((prev) =>
      prev.map((p) => (p.productId === productId ? product : p)),
    );
    return product;
  }

  async function deleteProduct(productId: number) {
    if (!token) throw new Error("Sem token de autenticação");
    await deleteProductService(token, productId);
    setProducts((prev) => prev.filter((p) => p.productId !== productId));
  }

  async function uploadProductImage(productId: number, file: File) {
    if (!token) throw new Error("Sem token de autenticação");
    const image = await uploadProductImageService(token, productId, file);
    setProducts((prev) =>
      prev.map((p) =>
        p.productId === productId
          ? { ...p, images: [...(p.images ?? []), image] }
          : p,
      ),
    );
    return image;
  }

  async function deleteProductImage(productId: number, imageId: number) {
    if (!token) throw new Error("Sem token de autenticação");
    await deleteProductImageService(token, productId, imageId);
    setProducts((prev) =>
      prev.map((p) =>
        p.productId === productId
          ? {
              ...p,
              images: (p.images ?? []).filter((img) => img.imageId !== imageId),
            }
          : p,
      ),
    );
  }

  async function setPrimaryProductImage(productId: number, imageId: number) {
    if (!token) throw new Error("Sem token de autenticação");
    await setPrimaryProductImageService(token, productId, imageId);
    setProducts((prev) =>
      prev.map((p) =>
        p.productId === productId
          ? {
              ...p,
              images: (p.images ?? []).map((img) => ({
                ...img,
                isPrimary: img.imageId === imageId,
              })),
            }
          : p,
      ),
    );
  }

  // ---------- Categorias ----------

  const fetchCategories = useCallback(async () => {
    setLoadingCategories(true);
    try {
      const res = await getCategoriesService();
      setCategories(res);
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  async function createCategory(data: NewCategoryInput) {
    if (!token) throw new Error("Sem token de autenticação");
    const category = await createCategoryService(token, data);
    setCategories((prev) => [...prev, category]);
    return category;
  }
  async function editCategory(categoryId: number, data: { name: string }) {
    if (!token) throw new Error("Sem token de autenticação");
    const updatedCategory = await editCategoryService({
      token,
      categoryId,
      data,
    });
    setCategories((prev) =>
      prev.map((c) => (c.categoryId === categoryId ? updatedCategory : c)),
    );
    return updatedCategory;
  }

  async function deleteCategory(categoryId: number) {
    if (!token) throw new Error("Sem token de autenticação");
    await deleteCategoryService(token, categoryId);
    setCategories((prev) => prev.filter((c) => c.categoryId !== categoryId));
  }

  async function uploadCategoryImage(categoryId: number, file: File) {
    if (!token) throw new Error("Sem token de autenticação");
    // O backend retorna a categoria inteira já atualizada com o novo categoryImage
    const updatedCategory = await uploadCategoryImageService(
      token,
      categoryId,
      file,
    );
    setCategories((prev) =>
      prev.map((c) => (c.categoryId === categoryId ? updatedCategory : c)),
    );
  }

  // ---------- Pedidos ----------

  const fetchOrders = useCallback(
    async (offset = 0, limit = 20) => {
      if (!token) return;
      setLoadingOrders(true);
      try {
        const res = await getOrdersService(token, offset, limit);
        setOrders(res);
      } catch (err) {
        console.error("Erro ao buscar pedidos:", err);
      } finally {
        setLoadingOrders(false);
      }
    },
    [token],
  );

  async function changeOrderStatus(orderId: number, newStatus: OrderStatus) {
    if (!token) throw new Error("Sem token de autenticação");

    const updatedOrder = await updateOrderStatusService(
      token,
      orderId,
      newStatus,
    );

    setOrders((prev) =>
      prev.map((order) =>
        order.orderId === orderId
          ? {
              ...order,
              status: updatedOrder.status,
              updatedAt: updatedOrder.updatedAt,
            }
          : order,
      ),
    );
  }
  // Carrega os dados de admin assim que soubermos que o usuário é ADMIN
  useEffect(() => {
    if (!token || !isAdmin) return;
    fetchProducts();
    fetchCategories();
    fetchOrders();
  }, [token, isAdmin, fetchProducts, fetchCategories, fetchOrders]);

  return (
    <AdminContext.Provider
      value={{
        products,
        loadingProducts,
        fetchProducts,
        createProduct,
        updateProduct,
        deleteProduct,
        editCategory,
        uploadProductImage,
        deleteProductImage,
        setPrimaryProductImage,
        changeOrderStatus,
        categories,
        loadingCategories,
        fetchCategories,
        createCategory,
        deleteCategory,
        uploadCategoryImage,

        orders,
        loadingOrders,
        fetchOrders,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin precisa estar dentro de AdminProvider");
  return ctx;
}

"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import {
  addCartItem,
  createCart,
  getCart as getCartService,
  getCartItems as getCartItemsService,
} from "../services/cart.service";
import { CartItemWithProduct } from "@/schemas/cart.schema";
import { useAuth } from "./AuthContext";
export interface CartItem {
  productId: number;
  productName: string;
  productPrice: number;
  quantity: number;
  imageUrl: string;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: number;
  totalPrice: number;
  finishCart: (token: string) => void;
  getCartItems: (token: string) => Promise<CartItemWithProduct[]>;
}
const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!token) return;

    async function syncFromBackend() {
      const cart = await getCartService(token!);
      if (!cart) return; // usuário ainda não tem carrinho — estado normal

      const cartItems = await getCartItemsService(cart.cartId, token!);
      setItems(
        cartItems.map((ci) => ({
          productId: ci.productId,
          productName: ci.product.productName,
          productPrice: Number(ci.product.productPrice),
          quantity: ci.quantity,
          imageUrl:
            ci.product.images.find((i) => i.isPrimary)?.url ??
            ci.product.images[0]?.url ??
            "",
        })),
      );
    }

    syncFromBackend();
  }, [token]);
  function addItem(item: CartItem) {
    setItems((prev: CartItem[]) => {
      const existing = prev.find((i) => i.productId === item.productId);

      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        );
      }

      return [...prev, item];
    });
  }

  async function getCartItems(token: string): Promise<CartItemWithProduct[]> {
    const cart = await getCartService(token);
    return await getCartItemsService(cart.cartId, token);
  }

  function removeItem(productId: number) {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  async function finishCart(token: string): Promise<void> {
    const cart = await createCart(token);

    await Promise.all(
      items.map((item) =>
        addCartItem(
          {
            cartId: cart.cartId,
            productId: item.productId,
            quantity: item.quantity,
          },
          token,
        ),
      ),
    );
    setItems([]);
  }

  function updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
    );
  }
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce(
    (sum, i) => sum + i.quantity * i.productPrice,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        addItem,
        removeItem,
        updateQuantity,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        totalItems,
        totalPrice,
        finishCart,
        getCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("No context");
  return ctx;
}

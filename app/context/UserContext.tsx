"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import { getMe } from "../services/user.service";

export interface User {
  id: number;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  addresses: Address[];
  orders: Order[];
}

interface Address {
  addressId: number;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

interface Order {
  orderId: number;
  status: "PENDING" | "PAID" | "ONGOING" | "DELIVERED" | "CANCELLED";
  total: number;
  createdAt: string;
  address: OrderAddress;
  orderItems: OrderItem[];
}

interface OrderAddress {
  addressId: number;
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

interface OrderItem {
  orderItemId: number;
  quantity: number;
  priceAtTime: number;
  product: Product;
}

interface Product {
  productId: number;
  productName: string;
  productPrice: number;
  images: ProductImage[];
}

interface ProductImage {
  url: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshUser = useCallback(async () => {
    if (!token) {
      setUser(null);
      return;
    }

    try {
      setLoading(true);
      const data = await getMe(token);
      setUser({
        id: data.userId,
        name: data.username,
        email: data.email,
        role: data.role,
        addresses: data.address,
        orders: data.order,
      });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    // fetch-on-token-change: setLoading síncrono é intencional (spinner imediato)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshUser();
  }, [refreshUser]);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        refreshUser,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("UserContext not found");
  }

  return context;
}

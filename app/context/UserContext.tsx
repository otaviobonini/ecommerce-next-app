"use client";

import {
  createContext,
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
  id: number;
  street: string;
  city: string;
}

interface Order {
  id: number;
  status: string;
  total: number;
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

  async function refreshUser() {
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
  }

  useEffect(() => {
    refreshUser();
  }, [token]);

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

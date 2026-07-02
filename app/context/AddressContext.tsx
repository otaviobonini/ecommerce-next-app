"use client";

import {
  Address,
  CreateAddressInput,
  EditAddressInput,
} from "@/schemas/address.schema";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import {
  getUserAddresses as getUserAddressesService,
  createAddress as createAddressService,
  deleteAddress as deleteAddressService,
  editAddress as editAddressService,
  setDefaultAddress as setDefaultAddressService,
} from "../services/address.service";

interface AddressContextType {
  addresses: Address[];
  createAddress: (data: CreateAddressInput, token: string) => Promise<Address>;
  deleteAddress: (addressId: number, token: string) => Promise<void>;
  editAddress: (
    addressId: number,
    data: EditAddressInput,
    token: string,
  ) => Promise<Address>;
  setDefaultAddress: (addressId: number, token: string) => Promise<void>;
}

const AddressContext = createContext<AddressContextType | null>(null);

export function AddressProvider({ children }: { children: ReactNode }) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;

    async function getAddresses(token: string) {
      const addresses = await getUserAddressesService(token);
      setAddresses(addresses);
    }
    getAddresses(token);
  }, [token]);

  async function createAddress(data: CreateAddressInput, token: string) {
    const res = await createAddressService(data, token);
    setAddresses((prev) => [...prev, res]);
    return res;
  }

  async function setDefaultAddress(addressId: number, token: string) {
    await setDefaultAddressService(addressId, token);
    setAddresses((prev) =>
      prev.map((address) => ({
        ...address,
        isDefault: address.addressId === addressId,
      })),
    );
  }
  async function editAddress(
    addressId: number,
    data: EditAddressInput,
    token: string,
  ) {
    const res = await editAddressService(addressId, data, token);
    setAddresses((prev) =>
      prev.map((address) => (address.addressId === addressId ? res : address)),
    );
    return res;
  }

  async function deleteAddress(addressId: number, token: string) {
    await deleteAddressService(addressId, token);
    setAddresses((prev) =>
      prev.filter((address) => address.addressId !== addressId),
    );
  }

  return (
    <AddressContext.Provider
      value={{
        addresses,
        createAddress,
        deleteAddress,
        editAddress,
        setDefaultAddress,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
}

export function useAddress() {
  const ctx = useContext(AddressContext);
  if (!ctx) throw new Error("No context");
  return ctx;
}

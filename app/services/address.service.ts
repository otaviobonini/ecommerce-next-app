import {
  AddressSchema,
  AddressesResponseSchema,
  EditAddressInput,
  type Address,
  type CreateAddressInput,
} from "@/schemas/address.schema";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export async function getUserAddresses(token: string): Promise<Address[]> {
  const res = await fetch(`${API_URL}/address`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message ?? "Erro ao pegar endereços");
  }

  const json = await res.json();
  return AddressesResponseSchema.parse(json);
}

export async function createAddress(
  data: CreateAddressInput,
  token: string,
): Promise<Address> {
  const res = await fetch(`${API_URL}/address`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message ?? "Erro ao criar endereço");
  }

  const json = await res.json();
  return AddressSchema.parse(json);
}

export async function deleteAddress(
  addressId: number,
  token: string,
): Promise<void> {
  const res = await fetch(`${API_URL}/address/${addressId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message ?? "Erro ao deletar endereço");
  }
}

export async function setDefaultAddress(
  addressId: number,
  token: string,
): Promise<void> {
  const res = await fetch(`${API_URL}/address/${addressId}/default`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message ?? "Erro ao mudar endereço padrão");
  }
}

export async function editAddress(
  addressId: number,
  data: EditAddressInput,
  token: string,
): Promise<Address> {
  const res = await fetch(`${API_URL}/address/${addressId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message ?? "Erro ao editar endereço");
  }
  const json = await res.json();
  return AddressSchema.parse(json);
}

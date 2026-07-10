import { describe, expect, it, vi, beforeEach } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { AddressProvider, useAddress } from "./AddressContext";
import * as addressService from "../services/address.service";
import type { Address } from "@/schemas/address.schema";

// AddressContext depende do useAuth() internamente pra saber se há token.
// Mockamos o módulo inteiro pra controlar o token por teste, sem precisar
// envolver tudo num AuthProvider real.
const mockUseAuth = vi.fn();
vi.mock("./AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock("../services/address.service", () => ({
  getUserAddresses: vi.fn(),
  createAddress: vi.fn(),
  deleteAddress: vi.fn(),
  editAddress: vi.fn(),
  setDefaultAddress: vi.fn(),
}));

const fakeAddress: Address = {
  addressId: 1,
  userId: 1,
  street: "Rua A",
  city: "Florianópolis",
  state: "SC",
  zipCode: "88000-000",
  isDefault: false,
};

describe("AddressContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({ token: "fake-token" });
    vi.mocked(addressService.getUserAddresses).mockResolvedValue([]);
  });

  it("Deve carregar os endereços do usuário quando há token", async () => {
    vi.mocked(addressService.getUserAddresses).mockResolvedValue([fakeAddress]);

    const { result } = renderHook(() => useAddress(), {
      wrapper: AddressProvider,
    });

    await waitFor(() => expect(result.current.addresses).toHaveLength(1));
    expect(addressService.getUserAddresses).toHaveBeenCalledWith("fake-token");
  });

  it("Não busca endereços quando não há token", async () => {
    mockUseAuth.mockReturnValue({ token: null });

    renderHook(() => useAddress(), { wrapper: AddressProvider });

    expect(addressService.getUserAddresses).not.toHaveBeenCalled();
  });

  it("Deve criar um endereço e adicionar na lista", async () => {
    vi.mocked(addressService.createAddress).mockResolvedValue(fakeAddress);

    const { result } = renderHook(() => useAddress(), {
      wrapper: AddressProvider,
    });
    await waitFor(() => expect(result.current.addresses).toHaveLength(0));

    await act(async () => {
      await result.current.createAddress(
        {
          street: "Rua A",
          city: "Florianópolis",
          state: "SC",
          zipCode: "88000-000",
          isDefault: false,
        },
        "fake-token",
      );
    });

    expect(result.current.addresses).toHaveLength(1);
    expect(result.current.addresses[0]).toEqual(fakeAddress);
  });

  it("Deve editar um endereço existente", async () => {
    vi.mocked(addressService.getUserAddresses).mockResolvedValue([fakeAddress]);
    const editedAddress = { ...fakeAddress, city: "São José" };
    vi.mocked(addressService.editAddress).mockResolvedValue(editedAddress);

    const { result } = renderHook(() => useAddress(), {
      wrapper: AddressProvider,
    });
    await waitFor(() => expect(result.current.addresses).toHaveLength(1));

    await act(async () => {
      await result.current.editAddress(1, { city: "São José" }, "fake-token");
    });

    expect(result.current.addresses[0].city).toBe("São José");
  });

  it("Deve remover um endereço da lista", async () => {
    vi.mocked(addressService.getUserAddresses).mockResolvedValue([fakeAddress]);
    vi.mocked(addressService.deleteAddress).mockResolvedValue(undefined);

    const { result } = renderHook(() => useAddress(), {
      wrapper: AddressProvider,
    });
    await waitFor(() => expect(result.current.addresses).toHaveLength(1));

    await act(async () => {
      await result.current.deleteAddress(1, "fake-token");
    });

    expect(result.current.addresses).toHaveLength(0);
  });

  it("Deve marcar um endereço como padrão e desmarcar os demais", async () => {
    const secondAddress: Address = { ...fakeAddress, addressId: 2 };
    vi.mocked(addressService.getUserAddresses).mockResolvedValue([
      { ...fakeAddress, isDefault: true },
      secondAddress,
    ]);
    vi.mocked(addressService.setDefaultAddress).mockResolvedValue(undefined);

    const { result } = renderHook(() => useAddress(), {
      wrapper: AddressProvider,
    });
    await waitFor(() => expect(result.current.addresses).toHaveLength(2));

    await act(async () => {
      await result.current.setDefaultAddress(2, "fake-token");
    });

    expect(
      result.current.addresses.find((a) => a.addressId === 1)?.isDefault,
    ).toBe(false);
    expect(
      result.current.addresses.find((a) => a.addressId === 2)?.isDefault,
    ).toBe(true);
  });
});

import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { UserProvider, useUser } from "./UserContext";
import * as userService from "../services/user.service";

const mockUseAuth = vi.fn();
vi.mock("./AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock("../services/user.service", () => ({
  getMe: vi.fn(),
}));

describe("UserContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Deve zerar o usuário quando não há token", async () => {
    mockUseAuth.mockReturnValue({ token: null });

    const { result } = renderHook(() => useUser(), { wrapper: UserProvider });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user).toBeNull();
    expect(userService.getMe).not.toHaveBeenCalled();
  });

  it("Deve buscar e mapear o usuário quando há token", async () => {
    mockUseAuth.mockReturnValue({ token: "fake-token" });
    vi.mocked(userService.getMe).mockResolvedValue({
      userId: 1,
      username: "otavio",
      email: "otavio@email.com",
      role: "USER",
      address: [],
      order: [],
    });

    const { result } = renderHook(() => useUser(), { wrapper: UserProvider });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.user).toEqual({
      id: 1,
      name: "otavio",
      email: "otavio@email.com",
      role: "USER",
      addresses: [],
      orders: [],
    });
  });

  it("Deve permitir atualizar o usuário manualmente via refreshUser", async () => {
    mockUseAuth.mockReturnValue({ token: "fake-token" });
    vi.mocked(userService.getMe).mockResolvedValue({
      userId: 1,
      username: "otavio",
      email: "otavio@email.com",
      role: "USER",
      address: [],
      order: [],
    });

    const { result } = renderHook(() => useUser(), { wrapper: UserProvider });
    await waitFor(() => expect(result.current.loading).toBe(false));

    vi.mocked(userService.getMe).mockResolvedValue({
      userId: 1,
      username: "otavio-novo-nome",
      email: "otavio@email.com",
      role: "USER",
      address: [],
      order: [],
    });

    await result.current.refreshUser();

    await waitFor(() =>
      expect(result.current.user?.name).toBe("otavio-novo-nome"),
    );
  });
});

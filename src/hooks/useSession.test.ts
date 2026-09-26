import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { apiFetch } from "@/lib/api/client";
import { useInvalidateSession, useSession } from "@/hooks/useSession";
import { createTestQueryClientWrapper } from "@/test/query-client";
import type { User } from "@/types/user";

vi.mock("@/lib/api/client", () => ({
  apiFetch: vi.fn(),
}));

const user: User = {
  id: "user-1",
  email: "cliente@test.co",
  firstName: "Cliente",
  lastName: "Prueba",
  phone: null,
  role: "CUSTOMER",
};

// Wrapper nuevo por test: la query "session" tiene staleTime de 5 minutos, así
// que un QueryClient compartido devolvería la caché fresca y la nueva prueba
// nunca vería el segundo resultado de apiFetch.
let wrapper: ReturnType<typeof createTestQueryClientWrapper>;

beforeEach(() => {
  vi.clearAllMocks();
  wrapper = createTestQueryClientWrapper();
});

describe("useSession", () => {
  it("con sesión: expone el user de la API e isAuthenticated true", async () => {
    vi.mocked(apiFetch).mockResolvedValue(user);
    const { result } = renderHook(() => useSession(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(apiFetch).toHaveBeenCalledWith("/api/auth/me");
    expect(result.current.user).toEqual(user);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it("sin sesión: la API devuelve null, user es null e isAuthenticated false", async () => {
    vi.mocked(apiFetch).mockResolvedValue(null);
    const { result } = renderHook(() => useSession(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
});

describe("useInvalidateSession", () => {
  it("invalida la query 'session' y vuelve a consultar la sesión", async () => {
    vi.mocked(apiFetch).mockResolvedValue(user);
    const { result } = renderHook(
      () => ({ session: useSession(), invalidate: useInvalidateSession() }),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.session.isLoading).toBe(false);
    });
    expect(apiFetch).toHaveBeenCalledTimes(1);

    await result.current.invalidate();

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledTimes(2);
    });
    expect(apiFetch).toHaveBeenCalledWith("/api/auth/me");
    expect(result.current.session.user).toEqual(user);
  });
});

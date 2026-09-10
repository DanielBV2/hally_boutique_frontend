import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { login } from "@/lib/api/auth";
import { useLoginMutation } from "@/hooks/useLogin";
import { createTestQueryClientWrapper } from "@/test/query-client";

vi.mock("@/lib/api/auth", () => ({
  login: vi.fn(),
}));

const wrapper = createTestQueryClientWrapper();

const credentials = { email: "cliente@test.co", password: "Test1234!" };

describe("useLoginMutation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("éxito: invoca login con las credenciales", async () => {
    vi.mocked(login).mockResolvedValue({
      user: {
        id: "user-1",
        email: credentials.email,
        firstName: "Cliente",
        lastName: "Prueba",
        phone: null,
        role: "CUSTOMER",
      },
    });
    const { result } = renderHook(() => useLoginMutation(), { wrapper });

    await result.current.mutateAsync(credentials);

    expect(login).toHaveBeenCalledTimes(1);
    expect(vi.mocked(login).mock.calls[0][0]).toEqual(credentials);
  });

  it("error: expone isError y error sin excepción no capturada", async () => {
    const errorMessage = "Credenciales incorrectas";
    vi.mocked(login).mockRejectedValue(new Error(errorMessage));
    const { result } = renderHook(() => useLoginMutation(), { wrapper });

    await expect(result.current.mutateAsync(credentials)).rejects.toThrow(
      errorMessage,
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
    expect(result.current.error).toBeInstanceOf(Error);
    expect((result.current.error as Error).message).toBe(errorMessage);
  });
});
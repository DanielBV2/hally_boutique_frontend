import type { Address, CreateAddressInput } from "@/types/address";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: { message: string };
}

async function handleResponse<T>(res: Response): Promise<T> {
  const json = (await res.json()) as ApiResponse<T>;
  if (!json.success) {
    throw new Error(json.error?.message ?? "Error en la petición");
  }
  return json.data;
}

export async function getAddresses(): Promise<Address[]> {
  const res = await fetch("/api/addresses", { method: "GET" });
  return handleResponse<Address[]>(res);
}

export async function createAddress(input: CreateAddressInput): Promise<Address> {
  const res = await fetch("/api/addresses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handleResponse<Address>(res);
}

export async function updateAddress(
  id: string,
  input: Partial<CreateAddressInput>,
): Promise<Address> {
  const res = await fetch(`/api/addresses/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handleResponse<Address>(res);
}

export async function deleteAddress(id: string): Promise<null> {
  const res = await fetch(`/api/addresses/${id}`, {
    method: "DELETE",
  });
  return handleResponse<null>(res);
}

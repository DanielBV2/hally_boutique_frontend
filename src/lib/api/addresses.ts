import { apiFetch } from "@/lib/api/client";
import type { Address, CreateAddressInput } from "@/types/address";

export async function getAddresses(): Promise<Address[]> {
  return apiFetch<Address[]>("/api/addresses");
}

export async function createAddress(input: CreateAddressInput): Promise<Address> {
  return apiFetch<Address>("/api/addresses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export async function updateAddress(
  id: string,
  input: Partial<CreateAddressInput>,
): Promise<Address> {
  return apiFetch<Address>(`/api/addresses/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export async function deleteAddress(id: string): Promise<null> {
  return apiFetch<null>(`/api/addresses/${id}`, {
    method: "DELETE",
  });
}

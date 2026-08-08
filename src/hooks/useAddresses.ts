"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useSession } from "@/hooks/useSession";
import {
  createAddress,
  deleteAddress,
  getAddresses,
  updateAddress,
} from "@/lib/api/addresses";
import type { CreateAddressInput } from "@/types/address";

export function useAddresses() {
  const { isAuthenticated } = useSession();
  return useQuery({
    queryKey: ["addresses"],
    queryFn: getAddresses,
    enabled: isAuthenticated,
  });
}

export function useCreateAddressMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAddressInput) => createAddress(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
}

export function useUpdateAddressMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: Partial<CreateAddressInput>;
    }) => updateAddress(id, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
}

export function useDeleteAddressMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAddress(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
}

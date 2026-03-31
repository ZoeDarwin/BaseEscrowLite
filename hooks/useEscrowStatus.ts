"use client";

import { useCallback } from "react";
import { usePublicClient, useReadContract } from "wagmi";
import { base } from "wagmi/chains";

import { escrowContract } from "@/lib/contracts";

export type EscrowDeal = {
  id: bigint;
  buyer: string;
  seller: string;
  amount: bigint;
  approved: boolean;
};

export function useEscrowStatus() {
  const publicClient = usePublicClient({ chainId: base.id });

  const {
    data: dealCountRaw,
    isLoading: dealCountLoading,
    refetch: refetchDealCount
  } = useReadContract({
    ...escrowContract,
    functionName: "dealCount"
  });

  const fetchDealById = useCallback(
    async (id: bigint): Promise<EscrowDeal | null> => {
      if (!publicClient) {
        return null;
      }

      try {
        const deal = await publicClient.readContract({
          ...escrowContract,
          functionName: "deals",
          args: [id]
        });

        return {
          id,
          buyer: deal[0],
          seller: deal[1],
          amount: deal[2],
          approved: deal[3]
        };
      } catch {
        return null;
      }
    },
    [publicClient]
  );

  return {
    dealCount: dealCountRaw ?? 0n,
    dealCountLoading,
    refetchDealCount,
    fetchDealById
  };
}
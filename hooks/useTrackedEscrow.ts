"use client";

import { Attribution } from "ox/erc8021";
import {
  decodeEventLog,
  isAddress,
  type Address,
  type Hex
} from "viem";
import { usePublicClient, useWriteContract } from "wagmi";
import { base } from "wagmi/chains";

import { baseEscrowLiteAbi } from "@/lib/abi/baseEscrowLiteAbi";
import { escrowContract } from "@/lib/contracts";
import { trackTransaction } from "@/utils/track";

export type CreateDealTrackedArgs = {
  seller: Address;
  amountWei: bigint;
  userAddress?: string;
};

export type ApproveDealTrackedArgs = {
  id: bigint;
  userAddress?: string;
};

export type CreateDealTrackedResult = {
  txHash: Hex;
  dealId?: bigint;
};

export type ApproveDealTrackedResult = {
  txHash: Hex;
  approvedId?: bigint;
};

const APP_ID = "app-009";
const APP_NAME = "BaseEscrowLite";

export const BUILDER_CODE = "bc_v6gmm9la";
export const DATA_SUFFIX_ENCODED =
  "0x62635f7636676d6d396c610b0080218021802180218021802180218021";

export const DATA_SUFFIX_FROM_CODE = Attribution.toDataSuffix({
  codes: [BUILDER_CODE]
});

export const DATA_SUFFIX: Hex = DATA_SUFFIX_ENCODED;

export function useTrackedEscrow() {
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient({ chainId: base.id });

  const createDealTracked = async ({
    seller,
    amountWei,
    userAddress
  }: CreateDealTrackedArgs): Promise<CreateDealTrackedResult> => {
    if (!isAddress(seller)) {
      throw new Error("Invalid seller address.");
    }

    const txHash = await writeContractAsync({
      ...escrowContract,
      functionName: "createDeal",
      args: [seller],
      value: amountWei,
      dataSuffix: DATA_SUFFIX
    });

    void trackTransaction(APP_ID, APP_NAME, userAddress, txHash);

    if (!publicClient) {
      return { txHash };
    }

    try {
      const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
      for (const log of receipt.logs) {
        try {
          const parsed = decodeEventLog({
            abi: baseEscrowLiteAbi,
            data: log.data,
            topics: log.topics,
            strict: false
          });

          if (parsed.eventName === "Created") {
            const id = (parsed.args as { id?: bigint }).id;
            return { txHash, dealId: id };
          }
        } catch {
          continue;
        }
      }
    } catch {}

    return { txHash };
  };

  const approveDealTracked = async ({
    id,
    userAddress
  }: ApproveDealTrackedArgs): Promise<ApproveDealTrackedResult> => {
    const txHash = await writeContractAsync({
      ...escrowContract,
      functionName: "approve",
      args: [id],
      dataSuffix: DATA_SUFFIX
    });

    void trackTransaction(APP_ID, APP_NAME, userAddress, txHash);

    if (!publicClient) {
      return { txHash };
    }

    try {
      const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
      for (const log of receipt.logs) {
        try {
          const parsed = decodeEventLog({
            abi: baseEscrowLiteAbi,
            data: log.data,
            topics: log.topics,
            strict: false
          });

          if (parsed.eventName === "Approved") {
            const approvedId = (parsed.args as { id?: bigint }).id;
            return { txHash, approvedId };
          }
        } catch {
          continue;
        }
      }
    } catch {}

    return { txHash };
  };

  return {
    createDealTracked,
    approveDealTracked,
    dataSuffix: DATA_SUFFIX
  };
}

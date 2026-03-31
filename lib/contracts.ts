import type { Address } from "viem";

import { baseEscrowLiteAbi } from "@/lib/abi/baseEscrowLiteAbi";

export const BASE_ESCROW_LITE_CONTRACT_ADDRESS: Address =
  "0xb1bcd8D4F4a7FF5d7Bdb3e50bD2362c5881442DB";

// Keep placeholder visible for future replacement workflows.
export const BASEESCROWLITE_CONTRACT_ADDRESS_PLACEHOLDER =
  "BASEESCROWLITE_CONTRACT_ADDRESS_PLACEHOLDER";

export const escrowContract = {
  address: BASE_ESCROW_LITE_CONTRACT_ADDRESS,
  abi: baseEscrowLiteAbi
} as const;
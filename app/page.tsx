"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { isAddress, parseEther } from "viem";
import { useAccount } from "wagmi";

import { BottomNav } from "@/components/BottomNav";
import { DealCreatePanel } from "@/components/DealCreatePanel";
import { EscrowHeader } from "@/components/EscrowHeader";
import { StatusChip } from "@/components/StatusChip";
import { WalletButton } from "@/components/WalletButton";
import { useEscrowStatus } from "@/hooks/useEscrowStatus";
import { useTrackedEscrow } from "@/hooks/useTrackedEscrow";

function errorMessage(err: unknown) {
  if (err instanceof Error && err.message) {
    return err.message;
  }
  return "Transaction failed. Please check your wallet and try again.";
}

function shortAddress(address?: string) {
  if (!address) {
    return "Not connected";
  }
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function HomePage() {
  const { address, isConnected } = useAccount();
  const { dealCount, dealCountLoading, refetchDealCount } = useEscrowStatus();
  const { createDealTracked, approveDealTracked } = useTrackedEscrow();

  const [seller, setSeller] = useState("");
  const [amount, setAmount] = useState("");
  const [approveId, setApproveId] = useState("");

  const [isCreating, setIsCreating] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  const [latestDealId, setLatestDealId] = useState<bigint | undefined>(undefined);
  const [latestTx, setLatestTx] = useState<string | undefined>(undefined);
  const [message, setMessage] = useState<string | undefined>(undefined);

  const countLabel = useMemo(() => {
    if (dealCountLoading) {
      return "Loading deal count...";
    }
    return `Onchain deal count: ${dealCount.toString()}`;
  }, [dealCount, dealCountLoading]);

  const onCreate = async () => {
    setMessage(undefined);

    if (!isConnected || !address) {
      setMessage("Connect wallet before creating a deal.");
      return;
    }
    if (!isAddress(seller)) {
      setMessage("Seller address format is invalid.");
      return;
    }

    let amountWei: bigint;
    try {
      amountWei = parseEther(amount);
    } catch {
      setMessage("Amount must be a valid ETH value.");
      return;
    }

    if (amountWei <= 0n) {
      setMessage("Amount must be greater than 0.");
      return;
    }

    try {
      setIsCreating(true);
      const result = await createDealTracked({
        seller,
        amountWei,
        userAddress: address
      });

      setLatestTx(result.txHash);
      setLatestDealId(result.dealId);

      if (result.dealId !== undefined) {
        setMessage("Deal created successfully.");
      } else {
        setMessage("Deal created successfully.");
      }

      await refetchDealCount();
    } catch (err) {
      setMessage(errorMessage(err));
    } finally {
      setIsCreating(false);
    }
  };

  const onApprove = async () => {
    setMessage(undefined);

    if (!isConnected || !address) {
      setMessage("Connect wallet before approving.");
      return;
    }

    let id: bigint;
    try {
      id = BigInt(approveId);
    } catch {
      setMessage("Deal ID must be a valid number.");
      return;
    }

    try {
      setIsApproving(true);
      const result = await approveDealTracked({ id, userAddress: address });
      setLatestTx(result.txHash);
      setMessage("Funds released successfully.");
      await refetchDealCount();
    } catch (err) {
      setMessage(errorMessage(err));
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <main>
      <EscrowHeader />

      <section className="panel wallet-state">
        <div>
          <p className="muted-text">Wallet</p>
          <p>{shortAddress(address)}</p>
          <p className="muted-text">{countLabel}</p>
        </div>
        <WalletButton />
      </section>

      <div className="stack">
        <DealCreatePanel
          amount={amount}
          approveId={approveId}
          isApproving={isApproving}
          isCreating={isCreating}
          latestDealId={latestDealId}
          latestTx={latestTx}
          message={message}
          onApprove={onApprove}
          onChangeAmount={setAmount}
          onChangeApproveId={setApproveId}
          onChangeSeller={setSeller}
          onCreate={onCreate}
          seller={seller}
        />

        <section className="panel">
          <p className="muted-text">Quick status</p>
          <StatusChip tone="neutral">Buyer deposits funds</StatusChip>
          <StatusChip tone="warning">Buyer approves release</StatusChip>
          <StatusChip tone="success">Seller receives funds</StatusChip>
          <Link className="ghost-button" href="/deals">
            Go to Deal Lookup
          </Link>
        </section>
      </div>

      <BottomNav />
    </main>
  );
}
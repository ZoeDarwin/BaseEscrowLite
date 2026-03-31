"use client";

import { useState } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";

import { BottomNav } from "@/components/BottomNav";
import { DealCard } from "@/components/DealCard";
import { DealLookupPanel } from "@/components/DealLookupPanel";
import { EscrowHeader } from "@/components/EscrowHeader";
import { useEscrowStatus, type EscrowDeal } from "@/hooks/useEscrowStatus";
import { useTrackedEscrow } from "@/hooks/useTrackedEscrow";

function normalize(err: unknown) {
  if (err instanceof Error && err.message) {
    return err.message;
  }
  return "Operation failed.";
}

export default function DealsPage() {
  const { address } = useAccount();
  const { fetchDealById } = useEscrowStatus();
  const { approveDealTracked } = useTrackedEscrow();

  const [dealIdInput, setDealIdInput] = useState("");
  const [deal, setDeal] = useState<EscrowDeal | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const lookup = async () => {
    setFeedback(null);
    let id: bigint;

    try {
      id = BigInt(dealIdInput);
    } catch {
      setFeedback("Please enter a valid deal ID.");
      return;
    }

    setIsLoading(true);
    const found = await fetchDealById(id);
    setIsLoading(false);

    if (!found) {
      setDeal(null);
      setFeedback("Deal not found or read failed onchain.");
      return;
    }

    if (found.buyer === "0x0000000000000000000000000000000000000000") {
      setDeal(null);
      setFeedback("Deal ID has no valid escrow record.");
      return;
    }

    setDeal(found);
  };

  const approveFromCard = async () => {
    if (!deal || !address) {
      return;
    }

    try {
      setIsApproving(true);
      const { txHash } = await approveDealTracked({ id: deal.id, userAddress: address });
      setFeedback(`Funds released successfully. Tx: ${txHash.slice(0, 10)}...${txHash.slice(-8)}`);
      const refreshed = await fetchDealById(deal.id);
      setDeal(refreshed);
    } catch (err) {
      setFeedback(normalize(err));
    } finally {
      setIsApproving(false);
    }
  };

  const canApprove =
    !!deal &&
    !!address &&
    deal.buyer.toLowerCase() === address.toLowerCase() &&
    deal.approved === false;

  return (
    <main>
      <EscrowHeader subtitle="Lookup a single escrow deal as a clean onchain proof card." />

      <div className="stack">
        <DealLookupPanel
          dealIdInput={dealIdInput}
          loading={isLoading}
          onLookup={lookup}
          setDealIdInput={setDealIdInput}
        />

        {deal && <DealCard {...deal} />}

        {canApprove && (
          <section className="panel">
            <button
              className="primary-button"
              disabled={isApproving}
              onClick={approveFromCard}
              type="button"
            >
              {isApproving ? "Submitting..." : "Approve Release"}
            </button>
          </section>
        )}

        {feedback && <section className="panel">{feedback}</section>}

        <Link className="ghost-button" href="/">
          Back to Home
        </Link>
      </div>

      <BottomNav />
    </main>
  );
}

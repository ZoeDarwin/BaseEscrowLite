import { StatusChip } from "@/components/StatusChip";

type EscrowHeaderProps = {
  subtitle?: string;
};

export function EscrowHeader({ subtitle }: EscrowHeaderProps) {
  return (
    <header className="escrow-header">
      <p className="brand-pill">BaseEscrowLite</p>
      <h1>Escrow Agreement Card</h1>
      <p className="muted-text">
        {subtitle ??
          "Buyer-funded escrow: funds are locked onchain until buyer approval releases to seller."}
      </p>
      <div className="chip-row">
        <StatusChip tone="neutral">Onchain + Offchain</StatusChip>
        <StatusChip tone="warning">Demo Contract</StatusChip>
      </div>
    </header>
  );
}
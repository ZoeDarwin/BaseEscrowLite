import { formatEther } from "viem";

import { StatusChip } from "@/components/StatusChip";

type DealCardProps = {
  id: bigint;
  buyer: string;
  seller: string;
  amount: bigint;
  approved: boolean;
};

function trim(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function DealCard({ id, buyer, seller, amount, approved }: DealCardProps) {
  return (
    <article className="panel">
      <div className="panel-head">
        <h2>Deal #{id.toString()}</h2>
        <StatusChip tone={approved ? "success" : "warning"}>
          {approved ? "Released" : "Escrowed"}
        </StatusChip>
      </div>
      <dl className="kv-grid">
        <div>
          <dt>Buyer</dt>
          <dd title={buyer}>{trim(buyer)}</dd>
        </div>
        <div>
          <dt>Seller</dt>
          <dd title={seller}>{trim(seller)}</dd>
        </div>
        <div>
          <dt>Amount</dt>
          <dd>{formatEther(amount)} ETH</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{approved ? "Funds Released" : "Awaiting Buyer Approval"}</dd>
        </div>
      </dl>
    </article>
  );
}
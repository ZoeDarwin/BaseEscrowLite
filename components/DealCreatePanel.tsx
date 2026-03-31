import { StatusChip } from "@/components/StatusChip";

type DealCreatePanelProps = {
  seller: string;
  amount: string;
  approveId: string;
  onChangeSeller: (v: string) => void;
  onChangeAmount: (v: string) => void;
  onChangeApproveId: (v: string) => void;
  onCreate: () => void;
  onApprove: () => void;
  isCreating: boolean;
  isApproving: boolean;
  latestDealId?: bigint;
  latestTx?: string;
  message?: string;
};

function shortHash(hash: string) {
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}

export function DealCreatePanel({
  seller,
  amount,
  approveId,
  onChangeSeller,
  onChangeAmount,
  onChangeApproveId,
  onCreate,
  onApprove,
  isCreating,
  isApproving,
  latestDealId,
  latestTx,
  message
}: DealCreatePanelProps) {
  return (
    <section className="panel">
      <h2>Create Escrow Deal</h2>
      <label className="field">
        <span>Seller Address</span>
        <input
          autoComplete="off"
          onChange={(e) => onChangeSeller(e.target.value.trim())}
          placeholder="0x..."
          value={seller}
        />
      </label>
      <label className="field">
        <span>Amount (ETH)</span>
        <input
          inputMode="decimal"
          onChange={(e) => onChangeAmount(e.target.value)}
          placeholder="0.01"
          value={amount}
        />
      </label>
      <button className="primary-button" disabled={isCreating} onClick={onCreate} type="button">
        {isCreating ? "Submitting..." : "Create Deal"}
      </button>

      <hr className="sep" />

      <h3>Approve Release</h3>
      <label className="field">
        <span>Deal ID</span>
        <input
          inputMode="numeric"
          onChange={(e) => onChangeApproveId(e.target.value)}
          placeholder="0"
          value={approveId}
        />
      </label>
      <button className="secondary-button" disabled={isApproving} onClick={onApprove} type="button">
        {isApproving ? "Submitting..." : "Approve Deal"}
      </button>

      {(latestDealId !== undefined || latestTx || message) && (
        <div className="result-box">
          {latestDealId !== undefined && (
            <p>
              <StatusChip tone="success">Created deal #{latestDealId.toString()}</StatusChip>
            </p>
          )}
          {latestTx && <p>Tx: {shortHash(latestTx)}</p>}
          {message && <p>{message}</p>}
        </div>
      )}
    </section>
  );
}
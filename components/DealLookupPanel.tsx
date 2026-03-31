type DealLookupPanelProps = {
  dealIdInput: string;
  setDealIdInput: (v: string) => void;
  onLookup: () => void;
  loading?: boolean;
};

export function DealLookupPanel({
  dealIdInput,
  setDealIdInput,
  onLookup,
  loading = false
}: DealLookupPanelProps) {
  return (
    <section className="panel">
      <h2>Lookup Deal</h2>
      <label className="field">
        <span>Deal ID</span>
        <input
          inputMode="numeric"
          onChange={(e) => setDealIdInput(e.target.value)}
          placeholder="0"
          value={dealIdInput}
        />
      </label>
      <button className="secondary-button" disabled={loading} onClick={onLookup} type="button">
        {loading ? "Loading..." : "Fetch Deal"}
      </button>
    </section>
  );
}
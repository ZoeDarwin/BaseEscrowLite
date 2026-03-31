export function RuleList() {
  return (
    <section className="panel">
      <h2>Current Rules</h2>
      <ul className="rule-list">
        <li>Buyer creates a funded deal onchain.</li>
        <li>Funds stay in the contract until buyer approval.</li>
        <li>Buyer approval releases funds to seller.</li>
        <li>Current contract supports buyer-funded escrow and buyer approval release.</li>
        <li>Dispute resolution and refund logic can be added in a future upgrade.</li>
      </ul>
    </section>
  );
}
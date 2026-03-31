import { BottomNav } from "@/components/BottomNav";
import { EscrowHeader } from "@/components/EscrowHeader";
import { RuleList } from "@/components/RuleList";

export default function AboutPage() {
  return (
    <main>
      <EscrowHeader subtitle="Simple, honest scope for the current escrow contract release flow." />
      <div className="stack">
        <RuleList />
      </div>
      <BottomNav />
    </main>
  );
}
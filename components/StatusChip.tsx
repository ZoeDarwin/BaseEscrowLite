import type { ReactNode } from "react";

type StatusChipProps = {
  children: ReactNode;
  tone?: "neutral" | "success" | "warning";
};

export function StatusChip({ children, tone = "neutral" }: StatusChipProps) {
  return <span className={`status-chip status-chip--${tone}`}>{children}</span>;
}

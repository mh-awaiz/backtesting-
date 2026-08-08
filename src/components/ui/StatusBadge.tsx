const statusMeta: Record<string, { label: string; color: string }> = {
  new: { label: "New inquiry", color: "text-amber bg-amber/10 border-amber/30" },
  under_review: { label: "Under review", color: "text-amber bg-amber/10 border-amber/30" },
  assigned: { label: "Assigned", color: "text-violet-bright bg-violet/10 border-violet/30" },
  in_progress: { label: "In progress", color: "text-violet-bright bg-violet/10 border-violet/30" },
  testing: { label: "Testing", color: "text-violet-bright bg-violet/10 border-violet/30" },
  client_review: { label: "Client review", color: "text-amber bg-amber/10 border-amber/30" },
  revision: { label: "Revision", color: "text-amber bg-amber/10 border-amber/30" },
  completed: { label: "Completed", color: "text-green bg-green/10 border-green/30" },
  rejected: { label: "Rejected", color: "text-red bg-red/10 border-red/30" },
  cancelled: { label: "Cancelled", color: "text-red bg-red/10 border-red/30" },
  unpaid: { label: "Unpaid", color: "text-red bg-red/10 border-red/30" },
  claimed: { label: "Payment claimed", color: "text-amber bg-amber/10 border-amber/30" },
  verified: { label: "Paid", color: "text-green bg-green/10 border-green/30" },
};

export default function StatusBadge({ status }: { status: string }) {
  const meta = statusMeta[status] ?? { label: status, color: "text-text-dim bg-bg-3 border-border" };
  return (
    <span className={`inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide px-2.5 py-1 border rounded-full ${meta.color}`}>
      {meta.label}
    </span>
  );
}

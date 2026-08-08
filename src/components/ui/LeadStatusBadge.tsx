const statusMeta: Record<string, { label: string; color: string }> = {
  new: { label: "New", color: "text-amber bg-amber/10 border-amber/30" },
  contacted: { label: "Contacted", color: "text-violet-bright bg-violet/10 border-violet/30" },
  converted: { label: "Converted", color: "text-green bg-green/10 border-green/30" },
  closed: { label: "Closed", color: "text-text-dim bg-bg-3 border-border" },
};

export default function LeadStatusBadge({ status }: { status: string }) {
  const meta = statusMeta[status] ?? { label: status, color: "text-text-dim bg-bg-3 border-border" };
  return (
    <span className={`inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide px-2.5 py-1 border rounded-full ${meta.color}`}>
      {meta.label}
    </span>
  );
}

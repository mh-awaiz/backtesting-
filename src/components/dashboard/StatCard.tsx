import Card from "@/components/ui/Card";

export default function StatCard({
  label,
  value,
  icon,
  accent = "text-violet-bright",
}: {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  accent?: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div className="font-mono text-[11px] uppercase tracking-wide text-text-dim">{label}</div>
        {icon && <div className={`text-lg ${accent}`}>{icon}</div>}
      </div>
      <div className="font-display text-3xl text-text mt-2">{value}</div>
    </Card>
  );
}

const stats = [
  { value: "120+", label: "Projects delivered" },
  { value: "40+", label: "Indicators built" },
  { value: "5+", label: "Years combined experience" },
  { value: "24h", label: "Typical first response" },
];

export default function TrustBar() {
  return (
    <div className="border-y border-border bg-bg-2">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8">
        {stats.map((s) => (
          <div key={s.label} className="text-center sm:text-left">
            <div className="font-display text-3xl text-text">{s.value}</div>
            <div className="font-mono text-[11px] uppercase tracking-wide text-text-dim mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

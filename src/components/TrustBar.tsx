const items = [
  "5.0 AVG. RATING",
  "143 REVIEWS",
  "315 ORDERS COMPLETED",
  "BASED IN UAE",
  "PINE SCRIPT · MQL4/5 · PYTHON",
  "REPEAT CLIENT RATE: HIGH",
];

export default function TrustBar() {
  const row = [...items, ...items];
  return (
    <div className="border-y border-line bg-ink-2 overflow-hidden">
      <div className="flex whitespace-nowrap py-3" style={{ animation: "ticker 32s linear infinite" }}>
        {row.map((item, i) => (
          <span
            key={i}
            className="font-mono text-xs tracking-[0.14em] text-paper-dim px-6 flex items-center gap-6"
          >
            {item}
            <span className="text-brass">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}

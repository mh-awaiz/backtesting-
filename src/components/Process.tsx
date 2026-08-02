import Reveal from "./Reveal";

const steps = [
  {
    n: "01",
    title: "Send the rules",
    body: "Describe entries, exits, and any indicators in plain language — or share an existing script that needs edits.",
  },
  {
    n: "02",
    title: "Strategy gets coded",
    body: "Rules are translated into Pine Script, MQL, or Python, matched to the platform your strategy runs on.",
  },
  {
    n: "03",
    title: "Backtest runs",
    body: "The strategy is run against historical data. Win rate, drawdown, and profit factor are logged as they come out.",
  },
  {
    n: "04",
    title: "Report delivered",
    body: "You receive the script plus a verification report, and revisions if a condition needs adjusting.",
  },
];

export default function Process() {
  return (
    <section id="process" className="py-24 sm:py-28 bg-ink-2 border-y border-line">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <Reveal>
          <div className="font-mono text-xs text-brass mb-3">03 · PROCESS</div>
          <h2 className="font-display text-3xl sm:text-4xl text-paper max-w-lg">
            Four steps, in order — nothing skipped.
          </h2>
        </Reveal>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 100} className="h-full">
              <div className="group bg-ink p-7 h-full transition-colors duration-300 hover:bg-ink-3">
                <div className="font-mono text-sm text-brass transition-transform duration-300 group-hover:translate-x-1">
                  {s.n}
                </div>
                <div className="font-display text-xl text-paper mt-4">{s.title}</div>
                <p className="mt-3 text-sm text-paper-dim leading-relaxed">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

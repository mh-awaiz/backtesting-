import { FiCheck, FiClock } from "react-icons/fi";
import Reveal from "./Reveal";

const packages = [
  {
    tier: "Basic",
    tag: "Simple edits",
    price: "AED 58",
    delivery: "1 day delivery",
    description:
      "Minor adjustments to an existing strategy — adding inputs, tweaking a filter, fixing a condition.",
    features: ["Existing strategy required", "1 revision", "Direct message support"],
    featured: false,
  },
  {
    tier: "Standard",
    tag: "Simple strategies",
    price: "AED 154",
    delivery: "1 day delivery",
    description:
      "A strategy built from scratch with two indicators and a clear buy/sell condition.",
    features: [
      "2 indicators, coded from your rules",
      "Full backtest report included",
      "2 revisions",
    ],
    featured: true,
  },
  {
    tier: "Premium",
    tag: "Python strategies",
    price: "AED 424",
    delivery: "2 day delivery · 1 day +AED 77",
    description:
      "Five to six indicators with complex, multi-condition entries and exits, in Python or Pine.",
    features: [
      "5–6 indicators, layered conditions",
      "Full backtest report + equity curve",
      "3 revisions",
    ],
    featured: false,
  },
];

export default function Packages() {
  return (
    <section id="packages" className="py-24 sm:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <Reveal className="max-w-xl">
          <div className="font-mono text-xs text-brass mb-3">02 · PACKAGES</div>
          <h2 className="font-display text-3xl sm:text-4xl text-paper">
            Three ways to get it tested.
          </h2>
          <p className="mt-4 text-paper-dim leading-relaxed">
            Prices scale with the number of conditions and indicators a
            strategy needs — not with how long the conversation takes.
            Contact before ordering if you&apos;re not sure which fits.
          </p>
        </Reveal>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {packages.map((pkg, i) => (
            <Reveal key={pkg.tier} delay={i * 110}>
              <div
                className={`group relative flex flex-col p-7 border h-full transition-all duration-300 hover:-translate-y-1.5 ${
                  pkg.featured
                    ? "border-brass bg-ink-2 hover:shadow-[0_20px_50px_-20px_rgba(201,153,47,0.35)]"
                    : "border-line bg-ink-2/50 hover:border-paper-dim hover:shadow-[0_20px_50px_-25px_rgba(0,0,0,0.5)]"
                }`}
              >
                {pkg.featured && (
                  <div className="absolute -top-3 left-7 font-mono text-[10px] tracking-[0.14em] bg-brass text-ink px-2 py-1">
                    MOST BOOKED
                  </div>
                )}

                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper-dim">
                  {pkg.tag}
                </div>
                <div className="font-display text-2xl text-paper mt-2">{pkg.tier}</div>
                <div className="font-mono text-3xl text-brass-bright mt-4">
                  {pkg.price}
                </div>

                <div className="flex items-center gap-2 mt-3 font-mono text-xs text-paper-dim">
                  <FiClock size={13} />
                  {pkg.delivery}
                </div>

                <p className="mt-5 text-sm text-paper-dim leading-relaxed">
                  {pkg.description}
                </p>

                <ul className="mt-6 space-y-2.5 flex-1">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-paper">
                      <FiCheck className="mt-0.5 shrink-0 text-teal" size={14} />
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  className={`mt-7 text-center py-3 font-mono text-sm transition-all duration-300 group-hover:tracking-wider ${
                    pkg.featured
                      ? "bg-brass text-ink hover:bg-brass-bright"
                      : "border border-line text-paper hover:border-paper-dim"
                  }`}
                >
                  Request this tier
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import Reveal from "./Reveal";
import { FiArrowRight, FiTrendingUp } from "react-icons/fi";

interface IndicatorLite {
  _id: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  features: string[];
}

function MiniChart({ seed }: { seed: number }) {
  const paths = [
    "M0,35 C15,32 25,15 40,20 C55,25 65,8 80,12 C95,16 105,28 120,22",
    "M0,20 C15,25 25,10 40,15 C55,20 65,30 80,25 C95,20 105,5 120,10",
    "M0,28 C15,15 25,22 40,10 C55,5 65,20 80,15 C95,10 105,25 120,18",
  ];
  return (
    <svg viewBox="0 0 120 40" className="w-full h-16" aria-hidden="true">
      <path d={paths[seed % paths.length]} fill="none" stroke="var(--green)" strokeWidth="1.5" />
    </svg>
  );
}

export default function IndicatorShowcase({ indicators }: { indicators: IndicatorLite[] }) {
  return (
    <section id="indicators" className="py-24 sm:py-28 bg-bg-2 border-y border-border">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <Reveal className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="font-mono text-xs text-violet-bright mb-3">INDICATOR SHOWCASE</div>
            <h2 className="font-display text-3xl sm:text-4xl text-text max-w-lg">
              Built by the team, used by traders.
            </h2>
          </div>
          <Link href="/indicators" className="flex items-center gap-1.5 text-sm text-violet-bright hover:underline">
            Explore all indicators <FiArrowRight size={14} />
          </Link>
        </Reveal>

        {indicators.length === 0 ? (
          <div className="mt-14 text-center text-text-dim text-sm py-10 border border-dashed border-border rounded-xl">
            Indicators published from the admin panel will appear here.
          </div>
        ) : (
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {indicators.map((ind, i) => (
              <Reveal key={ind._id} delay={i * 90}>
                <Link href={`/indicators/${ind.slug}`}>
                  <div className="h-full bg-bg border border-border rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-text-dim group">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-wide text-text-dim">{ind.category}</span>
                      <FiTrendingUp className="text-green" size={14} />
                    </div>
                    <MiniChart seed={i} />
                    <div className="font-display text-lg text-text mt-1">{ind.name}</div>
                    <p className="text-sm text-text-dim mt-1.5 leading-relaxed line-clamp-2">{ind.shortDescription}</p>
                    <div className="flex items-center gap-1 mt-4 text-sm text-violet-bright opacity-0 group-hover:opacity-100 transition-opacity">
                      View details <FiArrowRight size={13} />
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

import { FiArrowRight, FiStar } from "react-icons/fi";
import StrategyReportCard from "./StrategyReportCard";

export default function Hero() {
  return (
    <section id="top" className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
      <div
        className="pointer-events-none absolute -top-40 right-[-10%] w-[560px] h-[560px] rounded-full opacity-[0.12] blur-3xl"
        style={{ background: "var(--teal)" }}
        aria-hidden="true"
      />
      <div className="max-w-6xl mx-auto px-5 sm:px-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-14 lg:gap-10 items-center">
        <div>
          <div
            className="flex items-center gap-2 font-mono text-xs text-brass mb-6"
            style={{ animation: "fade-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.05s backwards" }}
          >
            <span className="inline-block w-6 h-px bg-brass" />
            INDEPENDENT BACKTESTING DESK
          </div>

          <h1
            className="font-display text-[2.5rem] leading-[1.08] sm:text-6xl sm:leading-[1.05] text-paper"
            style={{ animation: "fade-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.15s backwards" }}
          >
            Don&apos;t trade a strategy
            <br />
            you haven&apos;t <span className="italic text-brass-bright">put on trial.</span>
          </h1>

          <p
            className="mt-6 text-paper-dim text-lg max-w-lg leading-relaxed"
            style={{ animation: "fade-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.25s backwards" }}
          >
            Send over your rules — a Pine Script idea, an MT4/MT5 EA, or a rough
            sketch of entries and exits. You get back a coded strategy and a
            verified backtest report: win rate, drawdown, profit factor, the
            whole ledger.
          </p>

          <div
            className="mt-9 flex flex-wrap items-center gap-4"
            style={{ animation: "fade-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.35s backwards" }}
          >
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 bg-brass text-ink font-medium px-6 py-3 transition-all duration-300 hover:bg-brass-bright hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-12px_rgba(201,153,47,0.5)]"
            >
              Submit your strategy
              <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href="#packages"
              className="font-mono text-sm text-paper-dim hover:text-paper border-b border-transparent hover:border-paper-dim transition-colors pb-0.5"
            >
              See packages &amp; pricing
            </a>
          </div>

          <div
            className="mt-12 flex items-center gap-6 flex-wrap"
            style={{ animation: "fade-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.45s backwards" }}
          >
            <div className="flex items-center gap-1.5 text-brass-bright">
              {Array.from({ length: 5 }).map((_, i) => (
                <FiStar key={i} className="fill-current" size={14} />
              ))}
              <span className="font-mono text-sm text-paper ml-1">5.0</span>
            </div>
            <div className="font-mono text-xs text-paper-dim uppercase tracking-wide">
              143+ reviews · 315 orders completed
            </div>
          </div>
        </div>

        <div
          className="flex justify-center lg:justify-end"
          style={{ animation: "fade-up 0.8s cubic-bezier(0.22,1,0.36,1) 0.3s backwards" }}
        >
          <StrategyReportCard />
        </div>
      </div>
    </section>
  );
}

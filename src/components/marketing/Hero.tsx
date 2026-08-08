import Link from "next/link";
import { FiArrowRight, FiStar } from "react-icons/fi";
import CodePanel from "./CodePanel";

export default function Hero() {
  return (
    <section id="top" className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden grid-fade">
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full opacity-[0.10] blur-3xl"
        style={{ background: "var(--violet)" }}
        aria-hidden="true"
      />
      <div className="max-w-6xl mx-auto px-5 sm:px-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-14 lg:gap-10 items-center relative">
        <div style={{ animation: "fade-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.05s backwards" }}>
          <div className="flex items-center gap-2 font-mono text-xs text-violet-bright mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green" style={{ animation: "pulse-dot 2s ease-in-out infinite" }} />
            TEAM OF PINESCRIPT DEVELOPERS
          </div>

          <h1 className="font-display font-semibold text-[2.5rem] leading-[1.08] sm:text-6xl sm:leading-[1.05] text-text">
            Custom PineScript development for serious traders.
          </h1>

          <p className="mt-6 text-text-dim text-lg max-w-lg leading-relaxed">
            Indicators, strategies, and automation built by a dedicated team —
            not a single freelancer juggling ten inboxes. Every project gets
            its own dashboard, its own developer, and a direct line to them.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/#contact"
              className="group inline-flex items-center gap-2 bg-violet text-white font-medium px-6 py-3 rounded-lg transition-all duration-300 hover:bg-violet-bright hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-12px_rgba(124,111,240,0.5)]"
            >
              Start your project
              <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link href="/indicators" className="font-mono text-sm text-text-dim hover:text-text border-b border-transparent hover:border-text-dim transition-colors pb-0.5">
              View our indicators
            </Link>
          </div>

          <div className="mt-12 flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-1.5 text-amber">
              {Array.from({ length: 5 }).map((_, i) => (
                <FiStar key={i} className="fill-current" size={14} />
              ))}
              <span className="font-mono text-sm text-text ml-1">Trusted by active traders</span>
            </div>
          </div>
        </div>

        <div
          className="flex justify-center lg:justify-end"
          style={{ animation: "fade-up 0.8s cubic-bezier(0.22,1,0.36,1) 0.3s backwards" }}
        >
          <CodePanel />
        </div>
      </div>
    </section>
  );
}

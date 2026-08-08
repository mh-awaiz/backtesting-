import Reveal from "./Reveal";
import { FiStar } from "react-icons/fi";

const reviews = [
  {
    name: "D. Harrington",
    role: "Swing trader",
    body: "Explained what I wanted in plain terms and got back a script that actually matched — no back-and-forth about basic Pine Script syntax.",
  },
  {
    name: "M. Okafor",
    role: "Prop firm trader",
    body: "Having a dashboard to track the project instead of a DM thread made a real difference. Could see exactly what stage it was at.",
  },
  {
    name: "R. Castillo",
    role: "Indicator collector",
    body: "Asked for a fairly specific multi-condition setup and it came back working on the first pass. Revisions were fast when I asked for tweaks.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 sm:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <Reveal>
          <div className="font-mono text-xs text-violet-bright mb-3">TESTIMONIALS</div>
          <h2 className="font-display text-3xl sm:text-4xl text-text max-w-lg">What clients say.</h2>
        </Reveal>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <Reveal key={r.name} delay={i * 110}>
              <div className="h-full bg-bg-2 border border-border rounded-xl p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:border-text-dim">
                <div className="flex items-center gap-1 text-amber">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <FiStar key={j} size={13} className="fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-sm text-text leading-relaxed flex-1">&ldquo;{r.body}&rdquo;</p>
                <div className="mt-5 pt-4 border-t border-border">
                  <div className="font-mono text-sm text-text">{r.name}</div>
                  <div className="font-mono text-[10px] text-text-dim uppercase tracking-wide">{r.role}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

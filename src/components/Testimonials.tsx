import { FiStar } from "react-icons/fi";
import Reveal from "./Reveal";

const reviews = [
  {
    name: "lakeguy45",
    country: "United States",
    body: "Great experience working with Vansh and his teammate. Very knowledgeable in Pine Script and handled a fairly complex strategy with multiple custom conditions and backtesting requirements. Communication was clear, and they were patient with revisions to ensure everything worked exactly as intended.",
    price: "AED 400–800",
    duration: "4 days",
  },
  {
    name: "joshclarke95",
    country: "Andorra",
    repeat: true,
    body: "Outstanding speed and performance from this coder. I've worked with many coders in the past who either got annoyed with too many requests or were unprofessional — with this freelancer it's the total opposite. Will return to finish all my projects with him and recommend you do the same.",
    price: "AED 400–800",
    duration: "3 days",
  },
  {
    name: "luigim8",
    country: "United Kingdom",
    repeat: true,
    body: "Second order I've placed, and once again I'm extremely happy with the result. I explained my requirements in simple, non-technical terms, and they translated my ideas into a professional, well-built script that worked exactly as intended. Communication and attention to detail were excellent.",
    price: "AED 400–800",
    duration: "7 days",
  },
];

export default function Testimonials() {
  return (
    <section id="results" className="py-24 sm:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <Reveal>
          <div className="font-mono text-xs text-brass mb-3">04 · CLIENT LEDGER</div>
          <h2 className="font-display text-3xl sm:text-4xl text-paper max-w-lg">
            What comes back after the test.
          </h2>
        </Reveal>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <Reveal key={r.name} delay={i * 110} className="h-full">
              <div className="border border-line bg-ink-2 p-7 flex flex-col h-full transition-all duration-300 hover:-translate-y-1.5 hover:border-paper-dim hover:shadow-[0_20px_50px_-25px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-1 text-brass-bright">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FiStar key={i} size={13} className="fill-current" />
                  ))}
                </div>
                <p className="mt-5 text-sm text-paper leading-relaxed flex-1">
                  &ldquo;{r.body}&rdquo;
                </p>
                <div className="mt-6 pt-4 border-t border-line flex items-center justify-between">
                  <div>
                    <div className="font-mono text-sm text-paper">{r.name}</div>
                    <div className="font-mono text-[10px] text-paper-dim uppercase tracking-wide">
                      {r.country}
                      {r.repeat ? " · Repeat client" : ""}
                    </div>
                  </div>
                  <div className="text-right font-mono text-[10px] text-paper-dim">
                    <div>{r.price}</div>
                    <div>{r.duration}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

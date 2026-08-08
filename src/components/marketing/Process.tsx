import Reveal from "./Reveal";

const steps = [
  { n: "01", title: "Submit requirements", body: "Describe what you need — rules, indicators, or a script that needs work." },
  { n: "02", title: "Project review", body: "Admin reviews scope and matches it to the right developer on the team." },
  { n: "03", title: "Development", body: "Your assigned developer builds it, with progress visible in your dashboard." },
  { n: "04", title: "Testing & delivery", body: "The script is tested, delivered, and revised until it does what you asked." },
];

export default function Process() {
  return (
    <section id="process" className="py-24 sm:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <Reveal>
          <div className="font-mono text-xs text-violet-bright mb-3">PROCESS</div>
          <h2 className="font-display text-3xl sm:text-4xl text-text max-w-lg">
            One thread, start to finish.
          </h2>
        </Reveal>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 100}>
              <div className="bg-bg p-7 h-full">
                <div className="font-mono text-sm text-violet-bright">{s.n}</div>
                <div className="font-display text-xl text-text mt-4">{s.title}</div>
                <p className="mt-3 text-sm text-text-dim leading-relaxed">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

import Reveal from "./Reveal";
import { FiCode, FiShield, FiMessageCircle, FiZap, FiLifeBuoy, FiUsers } from "react-icons/fi";

const points = [
  { icon: <FiUsers />, title: "A real team, not one person", body: "Projects are assigned to whoever's the right fit — no single point of failure." },
  { icon: <FiCode />, title: "Clean, maintainable code", body: "Scripts you can hand to another developer later without starting over." },
  { icon: <FiMessageCircle />, title: "Direct developer access", body: "Message the person actually building your project, inside your dashboard." },
  { icon: <FiShield />, title: "Contact stays on-platform", body: "All communication is scanned and kept inside the project thread." },
  { icon: <FiZap />, title: "Fast turnaround", body: "Most requests get an initial review within a day." },
  { icon: <FiLifeBuoy />, title: "Support after delivery", body: "Revisions and fixes don't stop the moment a script ships." },
];

export default function WhyUs() {
  return (
    <section className="py-24 sm:py-28 bg-bg-2 border-y border-border">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <Reveal>
          <div className="font-mono text-xs text-violet-bright mb-3">WHY US</div>
          <h2 className="font-display text-3xl sm:text-4xl text-text max-w-lg">Built for people who trade seriously.</h2>
        </Reveal>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {points.map((p, i) => (
            <Reveal key={p.title} delay={i * 70}>
              <div className="flex gap-4">
                <div className="text-violet-bright text-lg mt-0.5 shrink-0">{p.icon}</div>
                <div>
                  <div className="font-display text-base text-text">{p.title}</div>
                  <p className="text-sm text-text-dim mt-1 leading-relaxed">{p.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

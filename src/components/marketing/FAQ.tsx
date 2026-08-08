"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import { FiChevronDown } from "react-icons/fi";

const faqs = [
  {
    q: "How does pricing work?",
    a: "Every project gets a quote based on scope after admin review — number of conditions, indicators involved, and turnaround needed. You'll see the quote in your dashboard before anything starts.",
  },
  {
    q: "Can I talk directly to the developer working on my project?",
    a: "Yes — once a project is assigned, you and your developer message each other right inside the project page. All communication stays on-platform.",
  },
  {
    q: "How do I pay?",
    a: "Right now payment is by UPI QR code, shown on your project page once a quote is set. Card and other payment methods are coming later.",
  },
  {
    q: "Do you guarantee trading results?",
    a: "No. We build and test scripts to match the logic you describe — we don't make claims about future trading performance, and you shouldn't take a backtest as a guarantee either.",
  },
  {
    q: "Can you convert a strategy from another platform?",
    a: "Yes, MT4/MT5 and Python strategies can usually be ported into Pine Script — mention it in your project description.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 sm:py-28 bg-bg-2 border-y border-border">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <Reveal>
          <div className="font-mono text-xs text-violet-bright mb-3 text-center">FAQ</div>
          <h2 className="font-display text-3xl sm:text-4xl text-text text-center">Common questions.</h2>
        </Reveal>

        <div className="mt-12 space-y-3">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 60}>
              <div className="bg-bg border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="font-display text-base text-text">{f.q}</span>
                  <FiChevronDown
                    className={`text-text-dim shrink-0 ml-4 transition-transform duration-300 ${open === i ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className="grid transition-all duration-300"
                  style={{ gridTemplateRows: open === i ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-4 text-sm text-text-dim leading-relaxed">{f.a}</p>
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

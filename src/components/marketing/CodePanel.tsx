"use client";

import { useEffect, useState } from "react";

const lines = [
  { n: 1, tokens: [["//@version=6", "cmt"]] },
  { n: 2, tokens: [["indicator", "kw"], ["(", "p"], ['"Trend Filter Pro"', "str"], [", overlay=true)", "p"]] },
  { n: 3, tokens: [[]] },
  { n: 4, tokens: [["length", "var"], [" = ", "p"], ["input.int", "fn"], ["(21, ", "p"], ['"EMA Length"', "str"], [")", "p"]] },
  { n: 5, tokens: [["src", "var"], [" = ", "p"], ["close", "kw"]] },
  { n: 6, tokens: [["trend", "var"], [" = ", "p"], ["ta.ema", "fn"], ["(src, length)", "p"]] },
  { n: 7, tokens: [[]] },
  { n: 8, tokens: [["bullish", "var"], [" = ", "p"], ["src > trend", "p"]] },
  { n: 9, tokens: [["plot", "fn"], ["(trend, color = ", "p"], ["bullish", "var"], [" ? ", "p"], ["color.teal", "kw"], [" : ", "p"], ["color.maroon", "kw"], [")", "p"]] },
];

const tokenColor: Record<string, string> = {
  cmt: "text-text-dim",
  kw: "text-violet-bright",
  fn: "text-amber",
  str: "text-green",
  var: "text-text",
  p: "text-text-dim",
};

export default function CodePanel() {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (visibleLines >= lines.length) return;
    const t = setTimeout(() => setVisibleLines((v) => v + 1), 220 + visibleLines * 40);
    return () => clearTimeout(t);
  }, [visibleLines]);

  return (
    <div className="code-window rounded-xl overflow-hidden shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)] w-full max-w-md">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-bg-2">
        <span className="w-2.5 h-2.5 rounded-full bg-red/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-green/70" />
        <span className="ml-3 font-mono text-[11px] text-text-dim">trend_filter.pine</span>
      </div>

      <div className="p-4 font-mono text-[13px] leading-relaxed">
        {lines.map((line, i) => (
          <div
            key={line.n}
            className="flex gap-3"
            style={{
              opacity: i < visibleLines ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
          >
            <span className="text-text-dim/50 select-none w-4 text-right">{line.n}</span>
            <span>
              {line.tokens.map((t, j) =>
                t.length ? (
                  <span key={j} className={tokenColor[t[1]] || "text-text"}>
                    {t[0]}
                  </span>
                ) : null
              )}
              {i === visibleLines - 1 && (
                <span
                  className="inline-block w-[7px] h-[14px] bg-violet-bright ml-0.5 translate-y-[2px]"
                  style={{ animation: "blink-cursor 1s step-end infinite" }}
                />
              )}
            </span>
          </div>
        ))}
      </div>

      {/* mini chart footer */}
      <div className="border-t border-border px-4 py-3 bg-bg-2">
        <svg viewBox="0 0 300 50" className="w-full h-10" aria-hidden="true">
          <path
            d="M0,38 C20,35 30,20 50,24 C70,28 80,10 100,14 C120,18 130,32 150,28 C170,24 180,8 200,10 C220,12 230,26 250,20 C270,14 285,6 300,4"
            fill="none"
            stroke="var(--teal, #3ecf8e)"
            strokeWidth="2"
            style={{ stroke: "var(--green)" }}
          />
        </svg>
      </div>
    </div>
  );
}

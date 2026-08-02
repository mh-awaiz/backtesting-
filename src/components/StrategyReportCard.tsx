"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { label: "Net profit", value: 184.6, suffix: "%", decimals: 1 },
  { label: "Win rate", value: 61, suffix: "%", decimals: 0 },
  { label: "Profit factor", value: 2.34, suffix: "", decimals: 2 },
  { label: "Max drawdown", value: 11.2, suffix: "%", decimals: 1, negative: true },
];

function useCountUp(target: number, decimals: number, start: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let frame: number;
    const duration = 1400;
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start, target]);
  return value.toFixed(decimals);
}

function StatCell({
  label,
  value,
  suffix,
  decimals,
  negative,
  start,
}: {
  label: string;
  value: number;
  suffix: string;
  decimals: number;
  negative?: boolean;
  start: boolean;
}) {
  const display = useCountUp(value, decimals, start);
  return (
    <div className="border-t border-line pt-3">
      <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper-dim">
        {label}
      </div>
      <div
        className={`font-mono text-xl sm:text-2xl mt-1 ${
          negative ? "text-rust" : "text-teal"
        }`}
      >
        {negative ? "-" : "+"}
        {display}
        {suffix}
      </div>
    </div>
  );
}

export default function StrategyReportCard() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 250);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      ref={ref}
      className="relative w-full max-w-md bg-ink-2 border border-line shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]"
    >
      <div className="dotted-tear h-px w-full" />

      <div className="p-6 sm:p-7">
        <div className="flex items-start justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-brass">
              Strategy verification
            </div>
            <div className="font-display text-lg text-paper mt-1">
              EMA Cross + ATR Filter
            </div>
          </div>
          <div className="text-right font-mono text-[10px] text-paper-dim leading-relaxed">
            <div>No. 0447-B</div>
            <div>TradingView · Pine v6</div>
          </div>
        </div>

        {/* equity curve */}
        <div className="mt-5 -mx-1">
          <svg viewBox="0 0 320 110" className="w-full h-28" aria-hidden="true">
            <line x1="0" y1="82" x2="320" y2="82" stroke="var(--line)" strokeWidth="1" />
            <path
              d="M0,90 C 30,88 45,70 70,74 C 95,78 110,55 140,50 C 165,46 175,60 195,58 C 220,55 235,30 260,26 C 280,23 300,15 320,8"
              fill="none"
              stroke="var(--teal)"
              strokeWidth="2"
              strokeLinecap="round"
              pathLength={1}
              style={{
                strokeDasharray: 1,
                strokeDashoffset: visible ? 0 : 1,
                transition: "stroke-dashoffset 1.6s cubic-bezier(0.22,1,0.36,1) 0.15s",
              }}
            />
          </svg>
        </div>

        {/* stats grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 mt-2">
          {stats.map((s) => (
            <StatCell key={s.label} {...s} start={visible} />
          ))}
        </div>
      </div>

      <div className="dotted-tear h-px w-full" />

      <div className="flex items-center justify-between px-6 sm:px-7 py-4">
        <div className="font-mono text-[10px] text-paper-dim">
          Backtested on 4y historical data
        </div>
        <div
          className="font-mono text-xs tracking-[0.15em] text-brass-bright border-2 border-brass-bright px-2 py-1 rotate-[-8deg] select-none"
          style={{
            animation: visible ? "stamp-in 0.5s ease-out 1.5s backwards" : undefined,
          }}
        >
          VERIFIED
        </div>
      </div>
    </div>
  );
}

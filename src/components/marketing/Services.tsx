import Reveal from "./Reveal";
import { FiTrendingUp, FiRepeat, FiZap, FiBell, FiTool, FiCode, FiRefreshCw, FiLayers } from "react-icons/fi";

const services = [
  { icon: <FiTrendingUp />, title: "Custom indicators", desc: "Purpose-built Pine Script indicators from your rules and criteria." },
  { icon: <FiLayers />, title: "Trading strategies", desc: "Full entry/exit strategy scripts, backtestable and alert-ready." },
  { icon: <FiCode />, title: "TradingView development", desc: "General Pine Script v5/v6 development across any project shape." },
  { icon: <FiRefreshCw />, title: "Strategy conversion", desc: "Port a strategy from MT4/MT5, Python, or another platform into Pine." },
  { icon: <FiBell />, title: "Trading alerts", desc: "Webhook-ready alert conditions wired to your indicator or strategy." },
  { icon: <FiZap />, title: "Automation", desc: "Alert-to-webhook pipelines that connect TradingView to your broker." },
  { icon: <FiTool />, title: "Indicator improvements", desc: "Bug fixes, performance tuning, and feature additions to existing scripts." },
  { icon: <FiRepeat />, title: "Custom trading tools", desc: "Dashboards, screeners, and utilities that don't fit a single category." },
];

export default function Services() {
  return (
    <section id="services" className="py-24 sm:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <Reveal className="max-w-xl">
          <div className="font-mono text-xs text-violet-bright mb-3">SERVICES</div>
          <h2 className="font-display text-3xl sm:text-4xl text-text">What the team builds.</h2>
        </Reveal>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 60}>
              <div className="h-full bg-bg-2 border border-border rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-text-dim">
                <div className="text-violet-bright text-xl">{s.icon}</div>
                <div className="font-display text-base text-text mt-4">{s.title}</div>
                <p className="text-sm text-text-dim mt-2 leading-relaxed">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

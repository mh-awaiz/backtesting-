import { FiMail } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="border-t border-line py-12">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="font-display text-lg text-paper">Ledger&amp;Line</div>
          <div className="font-mono text-xs text-paper-dim mt-1">
            Independent backtesting for TradingView, MT4/5 &amp; Python.
          </div>
        </div>

        <a
          href="mailto:hello@ledgerandline.dev"
          className="flex items-center gap-2 font-mono text-sm text-paper-dim hover:text-paper transition-colors"
        >
          <FiMail size={14} />
          hello@ledgerandline.dev
        </a>

        <div className="font-mono text-[11px] text-paper-dim">
          © {new Date().getFullYear()} Ledger&amp;Line. All reports are historical, not investment advice.
        </div>
      </div>
    </footer>
  );
}

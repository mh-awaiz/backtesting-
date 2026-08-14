import Link from "next/link";
import { FiCode, FiMail } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 font-display text-lg text-text">
            <FiCode className="text-violet-bright" />
            Pinex
          </div>
          <div className="font-mono text-xs text-text-dim mt-1">Custom PineScript &amp; TradingView development.</div>
        </div>

        <div className="flex gap-6 font-mono text-sm text-text-dim">
          <Link href="/indicators" className="hover:text-text transition-colors">Indicators</Link>
          <Link href="/#faq" className="hover:text-text transition-colors">FAQ</Link>
          <Link href="/login" className="hover:text-text transition-colors">Log in</Link>
        </div>

        <a href="mailto:hello@pinex.dev" className="flex items-center gap-2 font-mono text-sm text-text-dim hover:text-text transition-colors">
          <FiMail size={14} />
          hello@pinex.dev
        </a>
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 mt-8 pt-6 border-t border-border font-mono text-[11px] text-text-dim">
        © {new Date().getFullYear()} Pinex. Scripts are provided as tools, not financial advice — no trading results are guaranteed.
      </div>
    </footer>
  );
}

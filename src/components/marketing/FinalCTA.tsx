import Link from "next/link";
import Reveal from "./Reveal";
import { FiArrowRight } from "react-icons/fi";

export default function FinalCTA() {
  return (
    <section className="py-24 sm:py-28">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
        <Reveal>
          <h2 className="font-display text-3xl sm:text-5xl text-text">Have a TradingView idea?</h2>
          <p className="mt-4 text-text-dim text-lg max-w-lg mx-auto">
            Tell us what you&apos;re trying to build. Most inquiries get reviewed within a day.
          </p>
          <Link
            href="/#contact"
            className="group inline-flex items-center gap-2 mt-8 bg-violet text-white font-medium px-7 py-3.5 rounded-lg transition-all duration-300 hover:bg-violet-bright hover:-translate-y-0.5"
          >
            Start your project
            <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

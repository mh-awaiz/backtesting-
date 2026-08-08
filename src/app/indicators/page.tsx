export const dynamic = "force-dynamic";

import { connectToDatabase } from "@/lib/mongodb";
import Indicator from "@/models/Indicator";
import Nav from "@/components/marketing/Nav";
import Footer from "@/components/marketing/Footer";
import Link from "next/link";
import { FiArrowRight, FiTrendingUp } from "react-icons/fi";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Indicators — Northbeam",
  description: "Custom PineScript indicators built by the Northbeam team.",
};

function MiniChart({ seed }: { seed: number }) {
  const paths = [
    "M0,35 C15,32 25,15 40,20 C55,25 65,8 80,12 C95,16 105,28 120,22",
    "M0,20 C15,25 25,10 40,15 C55,20 65,30 80,25 C95,20 105,5 120,10",
    "M0,28 C15,15 25,22 40,10 C55,5 65,20 80,15 C95,10 105,25 120,18",
  ];
  return (
    <svg viewBox="0 0 120 40" className="w-full h-16" aria-hidden="true">
      <path d={paths[seed % paths.length]} fill="none" stroke="var(--green)" strokeWidth="1.5" />
    </svg>
  );
}

export default async function IndicatorsPage() {
  await connectToDatabase();
  const indicators = await Indicator.find({ published: true }).sort({ featured: -1, createdAt: -1 }).lean();

  return (
    <main className="min-h-screen bg-bg">
      <Nav />
      <section className="pt-32 pb-20 px-5 sm:px-8 max-w-6xl mx-auto">
        <div className="font-mono text-xs text-violet-bright mb-3">INDICATOR LIBRARY</div>
        <h1 className="font-display text-4xl sm:text-5xl text-text max-w-xl">
          Indicators built by the team.
        </h1>
        <p className="mt-4 text-text-dim max-w-lg">
          Browse what we&apos;ve built already — or use one as a starting point for a custom request.
        </p>

        {indicators.length === 0 ? (
          <div className="mt-14 text-center text-text-dim text-sm py-16 border border-dashed border-border rounded-xl">
            No indicators published yet.
          </div>
        ) : (
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {indicators.map((ind, i) => (
              <Link key={ind._id.toString()} href={`/indicators/${ind.slug}`}>
                <div className="h-full bg-bg-2 border border-border rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-text-dim group">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-wide text-text-dim">{ind.category}</span>
                    <FiTrendingUp className="text-green" size={14} />
                  </div>
                  <MiniChart seed={i} />
                  <div className="font-display text-lg text-text mt-1">{ind.name}</div>
                  <p className="text-sm text-text-dim mt-1.5 leading-relaxed line-clamp-2">{ind.shortDescription}</p>
                  <div className="flex items-center gap-1 mt-4 text-sm text-violet-bright opacity-0 group-hover:opacity-100 transition-opacity">
                    View details <FiArrowRight size={13} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}

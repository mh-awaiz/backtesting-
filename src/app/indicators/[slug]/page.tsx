export const dynamic = "force-dynamic";

import { connectToDatabase } from "@/lib/mongodb";
import Indicator from "@/models/Indicator";
import Nav from "@/components/marketing/Nav";
import Footer from "@/components/marketing/Footer";
import LeadCaptureForm from "@/components/marketing/LeadCaptureForm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FiArrowRight, FiCheck } from "react-icons/fi";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  await connectToDatabase();
  const indicator = await Indicator.findOne({ slug, published: true }).lean();
  if (!indicator) return {};
  return {
    title: `${indicator.name} — Northbeam Indicators`,
    description: indicator.shortDescription,
  };
}

export default async function IndicatorDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectToDatabase();
  const indicator = await Indicator.findOne({ slug, published: true }).lean();
  if (!indicator) notFound();

  return (
    <main className="min-h-screen bg-bg">
      <Nav />
      <section className="pt-32 pb-24 px-5 sm:px-8 max-w-4xl mx-auto">
        <div className="font-mono text-xs text-violet-bright mb-3 uppercase">{indicator.category}</div>
        <h1 className="font-display text-4xl sm:text-5xl text-text">{indicator.name}</h1>
        <p className="mt-4 text-text-dim text-lg max-w-2xl">{indicator.shortDescription}</p>

        <div className="mt-10 code-window rounded-xl p-6">
          <svg viewBox="0 0 400 120" className="w-full h-32" aria-hidden="true">
            <path
              d="M0,90 C40,85 60,50 100,60 C140,70 160,20 200,30 C240,40 260,80 300,65 C340,50 360,15 400,10"
              fill="none"
              stroke="var(--green)"
              strokeWidth="2"
            />
          </svg>
        </div>

        <div className="mt-10 grid sm:grid-cols-[1fr_260px] gap-10">
          <div>
            <h2 className="font-display text-xl text-text">Overview</h2>
            <p className="mt-3 text-sm text-text-dim leading-relaxed whitespace-pre-wrap">{indicator.description}</p>

            {indicator.features?.length > 0 && (
              <>
                <h2 className="font-display text-xl text-text mt-8">Features</h2>
                <ul className="mt-3 space-y-2">
                  {indicator.features.map((f: string) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-text">
                      <FiCheck className="text-green mt-0.5 shrink-0" size={14} />
                      {f}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <div className="space-y-4">
            {indicator.markets?.length > 0 && (
              <div className="bg-bg-2 border border-border rounded-xl p-4">
                <div className="font-mono text-[10px] uppercase tracking-wide text-text-dim mb-2">Markets</div>
                <div className="flex flex-wrap gap-1.5">
                  {indicator.markets.map((m: string) => (
                    <span key={m} className="font-mono text-[11px] px-2 py-1 bg-bg-3 border border-border rounded">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {indicator.timeframes?.length > 0 && (
              <div className="bg-bg-2 border border-border rounded-xl p-4">
                <div className="font-mono text-[10px] uppercase tracking-wide text-text-dim mb-2">Timeframes</div>
                <div className="flex flex-wrap gap-1.5">
                  {indicator.timeframes.map((t: string) => (
                    <span key={t} className="font-mono text-[11px] px-2 py-1 bg-bg-3 border border-border rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="mt-10 text-xs text-text-dim max-w-2xl">
          This page describes indicator logic and features only. Nothing here is a guarantee of trading
          performance or profit.
        </p>

        <Link
          href="/#contact"
          className="group inline-flex items-center gap-2 mt-6 bg-violet text-white font-medium px-6 py-3 rounded-lg transition-all duration-300 hover:bg-violet-bright hover:-translate-y-0.5"
        >
          Build a custom indicator like this
          <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>

        <div className="mt-8 pt-8 border-t border-border max-w-lg">
          <p className="text-xs text-text-dim mb-3">Just curious about this one? Leave your email and we&apos;ll follow up.</p>
          <LeadCaptureForm source={`indicator:${indicator.slug}`} compact />
        </div>
      </section>
      <Footer />
    </main>
  );
}

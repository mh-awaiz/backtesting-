"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiPlus, FiX } from "react-icons/fi";
import Button from "@/components/ui/Button";

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function IndicatorForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState("");
  const [markets, setMarkets] = useState("");
  const [timeframes, setTimeframes] = useState("");
  const [featured, setFeatured] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/indicators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug: slugify(name),
          category,
          shortDescription,
          description,
          features: features.split(",").map((f) => f.trim()).filter(Boolean),
          markets: markets.split(",").map((f) => f.trim()).filter(Boolean),
          timeframes: timeframes.split(",").map((f) => f.trim()).filter(Boolean),
          featured,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      setOpen(false);
      setName(""); setCategory(""); setShortDescription(""); setDescription("");
      setFeatures(""); setMarkets(""); setTimeframes(""); setFeatured(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)}>
        <FiPlus size={15} /> Add indicator
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-bg-2 border border-border rounded-xl p-5 mb-6 space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-mono text-[10px] uppercase tracking-wide text-text-dim">New indicator</div>
        <button type="button" onClick={() => setOpen(false)} className="text-text-dim hover:text-text">
          <FiX size={16} />
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <input placeholder="Name" required value={name} onChange={(e) => setName(e.target.value)}
          className="bg-bg-3 border border-border rounded-lg px-3 py-2.5 text-sm text-text focus:border-violet transition-colors" />
        <input placeholder="Category (e.g. Trend, Momentum)" required value={category} onChange={(e) => setCategory(e.target.value)}
          className="bg-bg-3 border border-border rounded-lg px-3 py-2.5 text-sm text-text focus:border-violet transition-colors" />
      </div>
      <input placeholder="Short description (one line)" required value={shortDescription} onChange={(e) => setShortDescription(e.target.value)}
        className="w-full bg-bg-3 border border-border rounded-lg px-3 py-2.5 text-sm text-text focus:border-violet transition-colors" />
      <textarea placeholder="Full description" required rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
        className="w-full bg-bg-3 border border-border rounded-lg px-3 py-2.5 text-sm text-text focus:border-violet transition-colors resize-none" />
      <input placeholder="Features, comma separated" value={features} onChange={(e) => setFeatures(e.target.value)}
        className="w-full bg-bg-3 border border-border rounded-lg px-3 py-2.5 text-sm text-text focus:border-violet transition-colors" />
      <div className="grid sm:grid-cols-2 gap-3">
        <input placeholder="Markets, comma separated" value={markets} onChange={(e) => setMarkets(e.target.value)}
          className="bg-bg-3 border border-border rounded-lg px-3 py-2.5 text-sm text-text focus:border-violet transition-colors" />
        <input placeholder="Timeframes, comma separated" value={timeframes} onChange={(e) => setTimeframes(e.target.value)}
          className="bg-bg-3 border border-border rounded-lg px-3 py-2.5 text-sm text-text focus:border-violet transition-colors" />
      </div>
      <label className="flex items-center gap-2 text-sm text-text-dim">
        <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="accent-violet" />
        Feature on homepage
      </label>

      {error && <div className="text-red text-xs">{error}</div>}
      <Button type="submit" disabled={loading}>
        {loading ? "Saving…" : "Publish indicator"}
      </Button>
    </form>
  );
}

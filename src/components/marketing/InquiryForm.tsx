"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FiSend, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import Button from "@/components/ui/Button";

export default function InquiryForm({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      title: data.get("title"),
      description: data.get("description"),
      platformLink: data.get("platformLink"),
      budget: data.get("budget"),
      timeline: data.get("timeline"),
    };

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        sessionStorage.setItem("pendingInquiry", JSON.stringify(payload));
        router.push("/register");
        return;
      }

      const responseData = await res.json();
      if (!res.ok) {
        throw new Error(responseData.error || "Something went wrong.");
      }

      if (compact) {
        router.push(`/client/projects/${responseData.id}`);
        return;
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-green/30 bg-bg-2 rounded-xl p-10 text-center">
        <FiCheckCircle className="mx-auto text-green" size={28} />
        <h3 className="font-display text-2xl text-text mt-4">Request received.</h3>
        <p className="text-text-dim mt-2 text-sm max-w-sm mx-auto">
          Your project is in the queue for review. You can track it from your dashboard once you&apos;re logged in.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-bg-2 border border-border rounded-xl p-6 sm:p-8">
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <label className="font-mono text-[10px] uppercase tracking-wide text-text-dim">Project title</label>
          <input
            name="title"
            required
            placeholder="e.g. Custom trend-following strategy"
            className="mt-1.5 w-full bg-bg-3 border border-border rounded-lg px-3 py-2.5 text-sm text-text placeholder:text-text-dim/60 focus:border-violet transition-colors"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="font-mono text-[10px] uppercase tracking-wide text-text-dim">
            Describe what you need
          </label>
          <textarea
            name="description"
            required
            rows={5}
            placeholder="Entry/exit rules, indicators involved, what platform it runs on…"
            className="mt-1.5 w-full bg-bg-3 border border-border rounded-lg px-3 py-2.5 text-sm text-text placeholder:text-text-dim/60 focus:border-violet transition-colors resize-none"
          />
        </div>
        <div>
          <label className="font-mono text-[10px] uppercase tracking-wide text-text-dim">
            Existing script link (optional)
          </label>
          <input
            name="platformLink"
            placeholder="TradingView / GitHub link"
            className="mt-1.5 w-full bg-bg-3 border border-border rounded-lg px-3 py-2.5 text-sm text-text placeholder:text-text-dim/60 focus:border-violet transition-colors"
          />
        </div>
        <div>
          <label className="font-mono text-[10px] uppercase tracking-wide text-text-dim">Budget (optional)</label>
          <input
            name="budget"
            placeholder="e.g. $150–300"
            className="mt-1.5 w-full bg-bg-3 border border-border rounded-lg px-3 py-2.5 text-sm text-text placeholder:text-text-dim/60 focus:border-violet transition-colors"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="font-mono text-[10px] uppercase tracking-wide text-text-dim">
            Desired timeline (optional)
          </label>
          <input
            name="timeline"
            placeholder="e.g. within 2 weeks"
            className="mt-1.5 w-full bg-bg-3 border border-border rounded-lg px-3 py-2.5 text-sm text-text placeholder:text-text-dim/60 focus:border-violet transition-colors"
          />
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red text-sm mt-4">
          <FiAlertCircle size={14} />
          {error}
        </div>
      )}

      <Button type="submit" disabled={status === "loading"} className="mt-6">
        {status === "loading" ? "Submitting…" : "Submit project request"}
        <FiSend size={14} />
      </Button>
      <p className="text-xs text-text-dim mt-3">
        No account yet? You&apos;ll be asked to create one so you can track this project.
      </p>
    </form>
  );
}

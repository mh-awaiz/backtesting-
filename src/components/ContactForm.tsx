"use client";

import { useState, FormEvent } from "react";
import { FiSend, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

type Status = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          platform: data.get("platform"),
          pkg: data.get("pkg"),
          details: data.get("details"),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong.");
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
      <div className="border border-teal/40 bg-ink-2 p-10 text-center">
        <FiCheckCircle className="mx-auto text-teal" size={28} />
        <h3 className="font-display text-2xl text-paper mt-4">Request logged.</h3>
        <p className="text-paper-dim mt-2 text-sm max-w-sm mx-auto">
          Your strategy details are in the queue. Expect a reply by direct
          message with scope and timeline before anything is booked.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 font-mono text-xs text-brass-bright border-b border-brass-bright"
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-line bg-ink-2 p-7 sm:p-9">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="font-mono text-[10px] uppercase tracking-[0.14em] text-paper-dim">
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            className="mt-2 w-full bg-transparent border border-line px-3 py-2.5 text-sm text-paper placeholder:text-paper-dim/60 focus:border-brass transition-colors"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="font-mono text-[10px] uppercase tracking-[0.14em] text-paper-dim">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-2 w-full bg-transparent border border-line px-3 py-2.5 text-sm text-paper placeholder:text-paper-dim/60 focus:border-brass transition-colors"
            placeholder="you@email.com"
          />
        </div>
        <div>
          <label htmlFor="platform" className="font-mono text-[10px] uppercase tracking-[0.14em] text-paper-dim">
            Platform
          </label>
          <select
            id="platform"
            name="platform"
            className="mt-2 w-full bg-ink border border-line px-3 py-2.5 text-sm text-paper focus:border-brass transition-colors"
          >
            <option>TradingView</option>
            <option>MT4</option>
            <option>MT5</option>
            <option>Python</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="pkg" className="font-mono text-[10px] uppercase tracking-[0.14em] text-paper-dim">
            Package
          </label>
          <select
            id="pkg"
            name="pkg"
            className="mt-2 w-full bg-ink border border-line px-3 py-2.5 text-sm text-paper focus:border-brass transition-colors"
          >
            <option>Not sure yet</option>
            <option>Basic</option>
            <option>Standard</option>
            <option>Premium</option>
          </select>
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="details" className="font-mono text-[10px] uppercase tracking-[0.14em] text-paper-dim">
          Strategy details
        </label>
        <textarea
          id="details"
          name="details"
          required
          rows={5}
          className="mt-2 w-full bg-transparent border border-line px-3 py-2.5 text-sm text-paper placeholder:text-paper-dim/60 focus:border-brass transition-colors resize-none"
          placeholder="Entries, exits, indicators, or a link to an existing script..."
        />
      </div>

      {status === "error" && (
        <div className="mt-4 flex items-center gap-2 text-rust text-sm">
          <FiAlertCircle size={15} />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brass text-ink font-medium px-7 py-3 hover:bg-brass-bright transition-colors disabled:opacity-60"
      >
        {status === "loading" ? "Logging request…" : "Submit strategy request"}
        <FiSend size={14} />
      </button>
    </form>
  );
}

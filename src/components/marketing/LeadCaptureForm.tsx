"use client";

import { useState, FormEvent } from "react";
import { FiSend, FiCheck } from "react-icons/fi";

export default function LeadCaptureForm({
  source,
  compact = false,
}: {
  source: string;
  compact?: boolean;
}) {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
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
          message: data.get("message"),
          source,
        }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.error || "Something went wrong.");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    }
  }

  if (status === "success") {
    return (
      <div className="w-full max-w-md mx-auto flex items-center justify-center gap-2 rounded-lg border border-border bg-bg-3 px-5 py-4 text-sm text-text text-center">
        <FiCheck className="shrink-0" />
        <span>Thanks — we&apos;ll reach out by email shortly.</span>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full ${
        compact ? "max-w-md" : "max-w-lg"
      } mx-auto flex flex-col gap-3`}
    >
      {/* Name */}
      <input
        type="text"
        name="name"
        placeholder="Your name"
        required
        className="w-full rounded-lg border border-border bg-bg-3 px-4 py-3 text-sm text-text placeholder:text-text-dim outline-none transition-colors focus:border-text-dim"
      />

      {/* Email */}
      <input
        type="email"
        name="email"
        placeholder="Your email"
        required
        className="w-full rounded-lg border border-border bg-bg-3 px-4 py-3 text-sm text-text placeholder:text-text-dim outline-none transition-colors focus:border-text-dim"
      />

      {/* Message */}
      <textarea
        name="message"
        placeholder="Tell us briefly what you're building..."
        rows={4}
        className="w-full resize-none rounded-lg border border-border bg-bg-3 px-4 py-3 text-sm text-text placeholder:text-text-dim outline-none transition-colors focus:border-text-dim"
      />

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-text px-5 py-3 text-sm font-medium text-bg transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "loading" ? "Sending…" : "Notify me"}
        <FiSend className="text-sm" />
      </button>

      {/* Error */}
      {status === "error" && (
        <p className="text-center text-xs text-red-400">{error}</p>
      )}
    </form>
  );
}

"use client";

import { useState } from "react";
import { FiWifi, FiWifiOff } from "react-icons/fi";

export default function AvailabilityToggle({ initialAvailable }: { initialAvailable: boolean }) {
  const [available, setAvailable] = useState(initialAvailable);
  const [saving, setSaving] = useState(false);

  async function toggle() {
    const next = !available;
    setAvailable(next); // optimistic
    setSaving(true);
    try {
      const res = await fetch("/api/developers/availability", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: next }),
      });
      if (!res.ok) setAvailable(!next); // revert on failure
    } catch {
      setAvailable(!next);
    } finally {
      setSaving(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={saving}
      className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors disabled:opacity-60 ${
        available
          ? "bg-green/10 border-green/30 text-green"
          : "bg-bg-3 border-border text-text-dim"
      }`}
    >
      <span className="relative flex h-2.5 w-2.5">
        {available && (
          <span
            className="absolute inline-flex h-full w-full rounded-full bg-green opacity-75"
            style={{ animation: "pulse-dot 2s ease-in-out infinite" }}
          />
        )}
        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${available ? "bg-green" : "bg-text-dim"}`} />
      </span>
      {available ? <FiWifi size={15} /> : <FiWifiOff size={15} />}
      {available ? "Available for new projects" : "Offline"}
    </button>
  );
}

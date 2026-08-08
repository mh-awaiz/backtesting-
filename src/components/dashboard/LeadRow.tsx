"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiTrash2, FiMail } from "react-icons/fi";
import LeadStatusBadge from "@/components/ui/LeadStatusBadge";

const STATUSES = ["new", "contacted", "converted", "closed"];

interface Props {
  id: string;
  name: string;
  email: string;
  message: string;
  source: string;
  status: string;
  createdAt: string;
}

export default function LeadRow({ id, name, email, message, source, status, createdAt }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [current, setCurrent] = useState(status);

  async function updateStatus(next: string) {
    setBusy(true);
    setCurrent(next);
    try {
      await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!confirm(`Delete the lead from ${name}?`)) return;
    setBusy(true);
    try {
      await fetch(`/api/leads/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={`px-5 py-4 ${busy ? "opacity-50" : ""}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="font-display text-base text-text">{name}</div>
          <a href={`mailto:${email}`} className="flex items-center gap-1.5 text-xs text-text-dim hover:text-violet-bright mt-0.5">
            <FiMail size={12} /> {email}
          </a>
        </div>
        <div className="flex items-center gap-3">
          <LeadStatusBadge status={current} />
          <span className="font-mono text-[10px] text-text-dim">{new Date(createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <p className="text-sm text-text-dim mt-3 leading-relaxed">{message}</p>

      <div className="flex items-center justify-between mt-3">
        <span className="font-mono text-[10px] text-text-dim uppercase tracking-wide">Source: {source}</span>
        <div className="flex items-center gap-2">
          <select
            value={current}
            onChange={(e) => updateStatus(e.target.value)}
            disabled={busy}
            className="bg-bg-3 border border-border rounded-lg px-2 py-1.5 text-xs text-text focus:border-violet transition-colors"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button onClick={remove} disabled={busy} className="text-text-dim hover:text-red transition-colors" title="Delete lead">
            <FiTrash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

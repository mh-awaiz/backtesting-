"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

const STATUSES = [
  { value: "in_progress", label: "In progress" },
  { value: "testing", label: "Testing" },
  { value: "client_review", label: "Client review" },
  { value: "revision", label: "Revision" },
  { value: "completed", label: "Completed" },
];

export default function DevProjectControls({
  projectId,
  initialStatus,
  initialProgress,
}: {
  projectId: string;
  initialStatus: string;
  initialProgress: number;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [progress, setProgress] = useState(initialProgress);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, progress }),
      });
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-bg-2 border border-border rounded-xl p-5 space-y-4">
      <div className="font-mono text-[10px] uppercase tracking-wide text-text-dim">Update status</div>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full bg-bg-3 border border-border rounded-lg px-3 py-2.5 text-sm text-text focus:border-violet transition-colors"
      >
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      <div>
        <div className="flex justify-between font-mono text-[10px] text-text-dim mb-1.5">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
          className="w-full accent-violet"
        />
      </div>

      <Button onClick={save} disabled={saving} className="w-full">
        {saving ? "Saving…" : "Save changes"}
      </Button>
    </div>
  );
}

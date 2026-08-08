"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

interface Developer {
  _id: string;
  name: string;
}

const STATUSES = [
  "new", "under_review", "assigned", "in_progress", "testing",
  "client_review", "revision", "completed", "rejected", "cancelled",
];

export default function AdminProjectControls({
  projectId,
  initialStatus,
  initialProgress,
  initialDeveloperId,
  initialDeadline,
  initialPaymentAmount,
  initialPaymentStatus,
}: {
  projectId: string;
  initialStatus: string;
  initialProgress: number;
  initialDeveloperId?: string;
  initialDeadline?: string;
  initialPaymentAmount?: number;
  initialPaymentStatus: string;
}) {
  const router = useRouter();
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [status, setStatus] = useState(initialStatus);
  const [progress, setProgress] = useState(initialProgress);
  const [developerId, setDeveloperId] = useState(initialDeveloperId || "");
  const [deadline, setDeadline] = useState(initialDeadline || "");
  const [paymentAmount, setPaymentAmount] = useState(initialPaymentAmount || 0);
  const [paymentStatus, setPaymentStatus] = useState(initialPaymentStatus);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/developers")
      .then((r) => r.json())
      .then((d) => setDevelopers(d.developers || []));
  }, []);

  async function save() {
    setSaving(true);
    try {
      await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          progress,
          assignedDeveloper: developerId || undefined,
          deadline: deadline || undefined,
          paymentAmount: paymentAmount || undefined,
          paymentStatus,
        }),
      });
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-bg-2 border border-border rounded-xl p-5 space-y-4">
      <div className="font-mono text-[10px] uppercase tracking-wide text-text-dim">Admin controls</div>

      <div>
        <label className="text-xs text-text-dim">Assigned developer</label>
        <select
          value={developerId}
          onChange={(e) => setDeveloperId(e.target.value)}
          className="mt-1.5 w-full bg-bg-3 border border-border rounded-lg px-3 py-2.5 text-sm text-text focus:border-violet transition-colors"
        >
          <option value="">— Unassigned —</option>
          {developers.map((d) => (
            <option key={d._id} value={d._id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs text-text-dim">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="mt-1.5 w-full bg-bg-3 border border-border rounded-lg px-3 py-2.5 text-sm text-text focus:border-violet transition-colors"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="flex justify-between text-xs text-text-dim mb-1.5">
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

      <div>
        <label className="text-xs text-text-dim">Deadline</label>
        <input
          type="date"
          value={deadline ? deadline.slice(0, 10) : ""}
          onChange={(e) => setDeadline(e.target.value)}
          className="mt-1.5 w-full bg-bg-3 border border-border rounded-lg px-3 py-2.5 text-sm text-text focus:border-violet transition-colors"
        />
      </div>

      <div>
        <label className="text-xs text-text-dim">Payment amount (₹)</label>
        <input
          type="number"
          value={paymentAmount}
          onChange={(e) => setPaymentAmount(Number(e.target.value))}
          className="mt-1.5 w-full bg-bg-3 border border-border rounded-lg px-3 py-2.5 text-sm text-text focus:border-violet transition-colors"
        />
      </div>

      <div>
        <label className="text-xs text-text-dim">Payment status</label>
        <select
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
          className="mt-1.5 w-full bg-bg-3 border border-border rounded-lg px-3 py-2.5 text-sm text-text focus:border-violet transition-colors"
        >
          <option value="unpaid">Unpaid</option>
          <option value="claimed">Claimed</option>
          <option value="verified">Verified</option>
        </select>
      </div>

      <Button onClick={save} disabled={saving} className="w-full">
        {saving ? "Saving…" : "Save changes"}
      </Button>
    </div>
  );
}

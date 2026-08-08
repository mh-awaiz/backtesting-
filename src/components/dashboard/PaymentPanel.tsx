"use client";

import { useState } from "react";
import Image from "next/image";
import { FiCheck, FiClock } from "react-icons/fi";
import Button from "@/components/ui/Button";
import StatusBadge from "@/components/ui/StatusBadge";

export default function PaymentPanel({
  projectId,
  amount,
  initialStatus,
}: {
  projectId: string;
  amount?: number;
  initialStatus: string;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  async function markPaid() {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: "claimed" }),
      });
      if (res.ok) setStatus("claimed");
    } finally {
      setLoading(false);
    }
  }

  const upiId = process.env.NEXT_PUBLIC_UPI_ID || "yourbusiness@upi";

  return (
    <div className="bg-bg-2 border border-border rounded-xl p-5">
      <div className="flex items-center justify-between">
        <div className="font-mono text-[10px] uppercase tracking-wide text-text-dim">Payment</div>
        <StatusBadge status={status} />
      </div>

      {amount && <div className="font-display text-2xl text-text mt-2">₹{amount.toLocaleString()}</div>}

      {status === "verified" ? (
        <p className="text-sm text-green mt-3 flex items-center gap-2">
          <FiCheck /> Payment verified.
        </p>
      ) : status === "claimed" ? (
        <p className="text-sm text-amber mt-3 flex items-center gap-2">
          <FiClock /> Marked as paid — awaiting verification.
        </p>
      ) : (
        <>
          <div className="mt-4 flex justify-center">
            <div className="bg-white p-3 rounded-lg">
              <Image
                src="/payment-qr-placeholder.svg"
                alt="UPI payment QR code"
                width={160}
                height={160}
              />
            </div>
          </div>
          <p className="text-center font-mono text-xs text-text-dim mt-3">{upiId}</p>
          <p className="text-center text-xs text-text-dim mt-1">
            Scan with any UPI app, then confirm below once sent.
          </p>
          <Button onClick={markPaid} disabled={loading} className="w-full mt-4" variant="secondary">
            {loading ? "Marking…" : "I've sent the payment"}
          </Button>
        </>
      )}
    </div>
  );
}

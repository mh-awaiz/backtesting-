"use client";

import { useState } from "react";

interface Lead {
  _id: string;
  name: string;
  email: string;
  platform: string;
  package: string;
  details: string;
  status: string;
  createdAt: string;
}

export default function AdminLeadsPage() {
  const [key, setKey] = useState("");
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadLeads() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/leads?key=${encodeURIComponent(key)}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to load requests.");
      }
      const data = await res.json();
      setLeads(data.leads);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load requests.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-ink text-paper px-5 sm:px-8 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-3xl">Strategy requests</h1>
        <p className="text-paper-dim text-sm mt-2">
          Enter the admin key set in your environment (ADMIN_KEY) to view
          incoming requests stored in MongoDB.
        </p>

        <div className="flex gap-3 mt-6">
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Admin key"
            className="bg-ink-2 border border-line px-3 py-2 text-sm flex-1"
          />
          <button
            onClick={loadLeads}
            className="bg-brass text-ink font-mono text-sm px-5 py-2"
          >
            {loading ? "Loading…" : "Load"}
          </button>
        </div>

        {error && <div className="text-rust text-sm mt-4">{error}</div>}

        {leads && (
          <div className="mt-8 space-y-4">
            {leads.length === 0 && (
              <div className="text-paper-dim text-sm">No requests yet.</div>
            )}
            {leads.map((lead) => (
              <div key={lead._id} className="border border-line p-5 bg-ink-2">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <div className="font-medium">{lead.name}</div>
                    <div className="text-paper-dim text-xs font-mono">{lead.email}</div>
                  </div>
                  <div className="text-right font-mono text-xs text-paper-dim">
                    <div>{lead.platform} · {lead.package}</div>
                    <div>{new Date(lead.createdAt).toLocaleString()}</div>
                  </div>
                </div>
                <p className="mt-3 text-sm text-paper-dim">{lead.details}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

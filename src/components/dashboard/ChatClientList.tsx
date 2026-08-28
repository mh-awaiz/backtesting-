"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiUser, FiMessageSquare } from "react-icons/fi";
import EmptyState from "@/components/ui/EmptyState";

interface ClientEntry {
  _id: string;
  name: string;
  email: string;
  company?: string;
  lastMessage: { text: string; createdAt: string; senderRole: string } | null;
}

// Shared between /admin/chat and /developer/chats — the whole point of the
// uniform chat model is that any admin or developer sees the same list and
// can open any client's conversation, not just ones assigned to them.
export default function ChatClientList({ basePath }: { basePath: string }) {
  const [clients, setClients] = useState<ClientEntry[] | null>(null);

  useEffect(() => {
    fetch("/api/chat/clients")
      .then((r) => r.json())
      .then((d) => setClients(d.clients || []));
  }, []);

  if (clients === null) {
    return <div className="text-sm text-text-dim py-10 text-center">Loading…</div>;
  }

  if (clients.length === 0) {
    return <EmptyState icon={<FiUser />} title="No clients yet" body="Clients will appear here once they register." />;
  }

  return (
    <div className="bg-bg-2 border border-border rounded-xl divide-y divide-border">
      {clients.map((c) => (
        <Link
          key={c._id}
          href={`${basePath}/${c._id}`}
          className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-bg-3 transition-colors"
        >
          <div className="min-w-0">
            <div className="font-display text-base text-text">{c.name}</div>
            <div className="text-xs text-text-dim">{c.email}</div>
            {c.lastMessage ? (
              <p className="text-sm text-text-dim mt-1.5 truncate max-w-md">
                <span className="font-mono text-[10px] uppercase text-text-dim/70 mr-1.5">
                  {c.lastMessage.senderRole === "SYSTEM" ? "note" : c.lastMessage.senderRole.toLowerCase()}:
                </span>
                {c.lastMessage.text || "Sent an attachment"}
              </p>
            ) : (
              <p className="text-sm text-text-dim/60 mt-1.5 italic">No messages yet</p>
            )}
          </div>
          <div className="flex items-center gap-2 text-violet-bright shrink-0">
            <FiMessageSquare size={16} />
          </div>
        </Link>
      ))}
    </div>
  );
}

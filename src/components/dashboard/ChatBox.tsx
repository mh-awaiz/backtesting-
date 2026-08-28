"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { FiSend, FiPaperclip, FiAlertTriangle, FiFile, FiInfo } from "react-icons/fi";

interface Message {
  _id: string;
  text: string;
  fileUrl?: string;
  fileName?: string;
  senderRole: "ADMIN" | "DEVELOPER" | "CLIENT" | "SYSTEM";
  sender: { name: string; role?: string } | string | null;
  createdAt: string;
}

// Chat is scoped to the CLIENT, not a project — any developer or admin
// opening this component for a given clientId is looking at the same
// single conversation, matching the uniform chat model.
export default function ChatBox({ clientId, myRole }: { clientId: string; myRole: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/chat/${clientId}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
      }
    } catch {
      // silent — polling will retry
    }
  }, [clientId]);

  useEffect(() => {
    const interval = setInterval(loadMessages, 4000);
    // Kick off the first load async (rather than calling the state-setting
    // function synchronously in the effect body).
    const timeout = setTimeout(loadMessages, 0);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [loadMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function sendMessage(fileUrl?: string, fileName?: string) {
    if (!text.trim() && !fileUrl) return;
    setSending(true);
    setError("");
    try {
      const res = await fetch(`/api/chat/${clientId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim(), fileUrl, fileName }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Message could not be sent.");
        return;
      }
      setText("");
      await loadMessages();
    } catch {
      setError("Network error — message not sent.");
    } finally {
      setSending(false);
    }
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("clientId", clientId);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Upload failed.");
        return;
      }
      await sendMessage(data.url, data.fileName);
    } catch {
      setError("Upload failed.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col h-[560px] bg-bg-2 border border-border rounded-xl overflow-hidden">
      <div className="flex-1 overflow-y-auto thin-scroll p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-text-dim text-sm py-10">No messages yet — say hello.</div>
        )}
        {messages.map((m) => {
          if (m.senderRole === "SYSTEM") {
            return (
              <div key={m._id} className="flex justify-center">
                <div className="flex items-center gap-2 max-w-[85%] rounded-lg px-3.5 py-2 text-xs text-amber bg-amber/10 border border-amber/30">
                  <FiInfo size={13} className="shrink-0" />
                  {m.text}
                </div>
              </div>
            );
          }

          const mine = m.senderRole === myRole;
          const senderName = typeof m.sender === "object" && m.sender ? m.sender.name : "";
          return (
            <div key={m._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-lg px-3.5 py-2.5 text-sm ${
                  mine ? "bg-violet text-white" : "bg-bg-3 text-text border border-border"
                }`}
              >
                <div className={`font-mono text-[10px] mb-1 ${mine ? "text-white/70" : "text-text-dim"}`}>
                  {senderName} · {m.senderRole.toLowerCase()}
                </div>
                {m.text && <div className="whitespace-pre-wrap break-words">{m.text}</div>}
                {m.fileUrl && (
                  <a
                    href={m.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 mt-2 text-xs underline ${mine ? "text-white" : "text-violet-bright"}`}
                  >
                    <FiFile size={13} />
                    {m.fileName || "Attachment"}
                  </a>
                )}
                <div className={`font-mono text-[9px] mt-1 ${mine ? "text-white/50" : "text-text-dim"}`}>
                  {new Date(m.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {error && (
        <div className="flex items-center gap-2 px-4 py-2 bg-red/10 border-t border-red/30 text-red text-xs">
          <FiAlertTriangle size={14} />
          {error}
        </div>
      )}

      <div className="border-t border-border p-3 flex items-end gap-2">
        <input ref={fileInputRef} type="file" className="hidden" onChange={handleFile} />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="p-2.5 text-text-dim hover:text-text transition-colors disabled:opacity-50"
          title="Attach a file"
        >
          <FiPaperclip size={18} />
        </button>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          rows={1}
          placeholder="Write a message…"
          className="flex-1 bg-bg-3 border border-border rounded-lg px-3 py-2.5 text-sm text-text resize-none focus:border-violet transition-colors"
        />
        <button
          onClick={() => sendMessage()}
          disabled={sending || (!text.trim())}
          className="p-2.5 bg-violet text-white rounded-lg hover:bg-violet-bright transition-colors disabled:opacity-50"
        >
          <FiSend size={16} />
        </button>
      </div>
    </div>
  );
}

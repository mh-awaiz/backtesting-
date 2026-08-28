"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { FiMessageCircle, FiX, FiLogIn } from "react-icons/fi";
import ChatBox from "@/components/dashboard/ChatBox";

type SessionState =
  | { status: "loading" }
  | { status: "signed-out" }
  | { status: "client"; id: string; name: string }
  | { status: "other-role" };

declare global {
  interface Window {
    __openPinexChat?: () => void;
  }
}

export default function FloatingChatWidget() {
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<SessionState>({ status: "loading" });

  const loadSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      if (!data?.user) {
        setSession({ status: "signed-out" });
      } else if (data.user.role === "CLIENT") {
        setSession({ status: "client", id: data.user.id, name: data.user.name });
      } else {
        setSession({ status: "other-role" });
      }
    } catch {
      setSession({ status: "signed-out" });
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(loadSession, 0);
    return () => clearTimeout(timeout);
  }, [loadSession]);

  // Lets any "Chat with us" button elsewhere on the page open this widget
  // without prop-drilling — see FinalCTA / indicator pages.
  useEffect(() => {
    window.__openPinexChat = () => {
      loadSession();
      setOpen(true);
    };
    return () => {
      delete window.__openPinexChat;
    };
  }, [loadSession]);

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-5 z-50 w-[calc(100vw-2.5rem)] max-w-sm max-h-[80vh] overflow-hidden">
          <div className="bg-bg-2 border border-border rounded-xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] overflow-hidden max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <span className="font-display text-sm text-text">Chat with Pinex</span>
              <button onClick={() => setOpen(false)} className="text-text-dim hover:text-text">
                <FiX size={18} />
              </button>
            </div>

            {session.status === "loading" && (
              <div className="p-6 text-center text-sm text-text-dim">Loading…</div>
            )}

            {session.status === "signed-out" && (
              <div className="p-6 text-center">
                <p className="text-sm text-text-dim mb-4">
                  Sign in to chat directly with our team.
                </p>
                <Link
                  href={`/login?callbackUrl=${encodeURIComponent("/")}`}
                  className="inline-flex items-center gap-2 bg-violet text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-violet-bright transition-colors"
                >
                  <FiLogIn size={14} /> Sign in to chat
                </Link>
                <p className="text-xs text-text-dim mt-3">
                  No account?{" "}
                  <Link href="/register" className="text-violet-bright hover:underline">
                    Create one
                  </Link>
                </p>
              </div>
            )}

            {session.status === "other-role" && (
              <div className="p-6 text-center text-sm text-text-dim">
                Open your dashboard to view chats.
              </div>
            )}

            {session.status === "client" && (
              <div className="p-2">
                <ChatBox clientId={session.id} myRole="CLIENT" />
              </div>
            )}
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-violet text-white flex items-center justify-center shadow-[0_14px_30px_-10px_rgba(124,111,240,0.6)] hover:bg-violet-bright transition-all duration-300 hover:-translate-y-0.5"
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? <FiX size={22} /> : <FiMessageCircle size={22} />}
      </button>
    </>
  );
}

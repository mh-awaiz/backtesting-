"use client";

import { useEffect } from "react";

const HEARTBEAT_MS = 45_000;

// Mounted (no UI) in DashboardShell and in FloatingChatWidget whenever a
// client is signed in — pings /api/me/presence on load and every 45s so
// lastSeenAt / timezone / location stay fresh while someone's around.
export default function PresenceHeartbeat() {
  useEffect(() => {
    const ping = () => {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      fetch("/api/me/presence", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timezone }),
        keepalive: true,
      }).catch(() => {
        // best-effort — a missed heartbeat just means a slightly stale
        // "last seen" until the next tick
      });
    };

    ping();
    const interval = setInterval(ping, HEARTBEAT_MS);
    return () => clearInterval(interval);
  }, []);

  return null;
}

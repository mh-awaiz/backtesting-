"use client";

import { useEffect, useState } from "react";
import { FiUser, FiMail, FiClock, FiMapPin, FiGlobe } from "react-icons/fi";
import { getPresence } from "@/lib/presence";

interface Props {
  name: string;
  email: string;
  lastSeenAt?: string | null;
  timezone?: string | null;
  city?: string | null;
  country?: string | null;
}

function localTimeIn(timezone: string): string | null {
  try {
    return new Intl.DateTimeFormat(undefined, {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      weekday: "short",
    }).format(new Date());
  } catch {
    return null; // unknown/invalid zone string
  }
}

// Right-hand "Client" card on the admin/developer chat pages. Shows who
// they are plus where/when they are — handy for knowing whether it's the
// middle of the night for them before pinging about a call.
export default function ClientInfoPanel({ name, email, lastSeenAt, timezone, city, country }: Props) {
  // Re-render every 30s so "last seen" and the client's local clock stay current.
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(interval);
  }, []);

  const presence = getPresence(lastSeenAt);
  const localTime = timezone ? localTimeIn(timezone) : null;
  const location = [city, country].filter(Boolean).join(", ");

  return (
    <div className="bg-bg-2 border border-border rounded-xl p-5">
      <div className="font-mono text-[10px] uppercase tracking-wide text-text-dim mb-3">Client</div>
      <div className="space-y-2.5 text-sm text-text-dim">
        <div className="flex items-center gap-2">
          <FiUser size={14} /> {name}
        </div>
        <div className="flex items-center gap-2 break-all">
          <FiMail size={14} className="shrink-0" /> {email}
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full shrink-0 mx-[3px] ${presence.online ? "bg-green" : "bg-text-dim/50"}`}
          />
          {presence.label}
        </div>
        <div className="flex items-start gap-2">
          <FiClock size={14} className="shrink-0 mt-0.5" />
          <div>
            {timezone ? (
              <>
                {timezone}
                {localTime && <div className="text-xs text-text-dim/70">Local time: {localTime}</div>}
              </>
            ) : (
              <span className="text-text-dim/60">Timezone not available yet</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {location ? <FiMapPin size={14} /> : <FiGlobe size={14} />}
          {location || <span className="text-text-dim/60">Location not available yet</span>}
        </div>
      </div>
    </div>
  );
}

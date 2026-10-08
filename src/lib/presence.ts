// Shared "online / last seen" formatting, driven by User.lastSeenAt which
// PresenceHeartbeat refreshes every ~45s while someone has a dashboard or
// the chat widget open. Treat anyone active in the last 90s as online —
// comfortably covers a missed heartbeat tick without a network hiccup.
const ONLINE_WITHIN_MS = 90 * 1000;

export function getPresence(lastSeenAt?: string | Date | null): {
  online: boolean;
  label: string;
} {
  if (!lastSeenAt) return { online: false, label: "Never active" };

  const last = new Date(lastSeenAt).getTime();
  const diffMs = Date.now() - last;

  if (diffMs <= ONLINE_WITHIN_MS) {
    return { online: true, label: "Online now" };
  }

  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 60) return { online: false, label: `Last seen ${diffMin}m ago` };

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return { online: false, label: `Last seen ${diffHr}h ago` };

  const diffDay = Math.floor(diffHr / 24);
  return { online: false, label: `Last seen ${diffDay}d ago` };
}

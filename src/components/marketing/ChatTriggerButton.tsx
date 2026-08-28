"use client";

import { FiMessageCircle } from "react-icons/fi";

declare global {
  interface Window {
    __openPinexChat?: () => void;
  }
}

// Opens the floating chat widget from anywhere on the marketing site —
// see FloatingChatWidget, which registers window.__openPinexChat.
export default function ChatTriggerButton({
  label = "Chat with us now",
  variant = "solid",
}: {
  label?: string;
  variant?: "solid" | "outline";
}) {
  const base =
    "group inline-flex items-center gap-2 font-medium px-6 py-3 rounded-lg transition-all duration-300 hover:-translate-y-0.5";
  const styles =
    variant === "solid"
      ? "bg-violet text-white hover:bg-violet-bright hover:shadow-[0_14px_30px_-12px_rgba(124,111,240,0.5)]"
      : "border border-border text-text hover:border-text-dim";

  return (
    <button type="button" onClick={() => window.__openPinexChat?.()} className={`${base} ${styles}`}>
      <FiMessageCircle className="transition-transform duration-300 group-hover:scale-110" />
      {label}
    </button>
  );
}

import { ReactNode } from "react";

export default function EmptyState({ icon, title, body }: { icon?: ReactNode; title: string; body?: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      {icon && <div className="text-text-dim mb-4 text-3xl">{icon}</div>}
      <div className="font-display text-lg text-text">{title}</div>
      {body && <p className="text-sm text-text-dim mt-2 max-w-sm">{body}</p>}
    </div>
  );
}

import Link from "next/link";
import StatusBadge from "@/components/ui/StatusBadge";
import Card from "@/components/ui/Card";
import { FiArrowRight, FiUser, FiCode } from "react-icons/fi";

interface Props {
  id: string;
  title: string;
  status: string;
  progress: number;
  href: string;
  counterpart?: { label: string; name: string };
  updatedAt: string;
}

export default function ProjectCard({ id, title, status, progress, href, counterpart, updatedAt }: Props) {
  return (
    <Link href={href}>
      <Card className="p-5 hover:border-text-dim transition-colors group">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-mono text-[10px] text-text-dim">#{id.slice(-6).toUpperCase()}</div>
            <div className="font-display text-lg text-text mt-1">{title}</div>
          </div>
          <StatusBadge status={status} />
        </div>

        {counterpart && (
          <div className="flex items-center gap-2 mt-4 text-sm text-text-dim">
            {counterpart.label === "Developer" ? <FiCode size={13} /> : <FiUser size={13} />}
            {counterpart.label}: {counterpart.name}
          </div>
        )}

        <div className="mt-4">
          <div className="h-1.5 bg-bg-3 rounded-full overflow-hidden">
            <div className="h-full bg-violet rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between mt-1.5 font-mono text-[10px] text-text-dim">
            <span>{progress}% complete</span>
            <span>{new Date(updatedAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 mt-4 text-sm text-violet-bright opacity-0 group-hover:opacity-100 transition-opacity">
          Open project <FiArrowRight size={14} />
        </div>
      </Card>
    </Link>
  );
}

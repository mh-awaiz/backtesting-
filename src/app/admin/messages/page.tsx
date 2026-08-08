export const dynamic = "force-dynamic";

import { connectToDatabase } from "@/lib/mongodb";
import Violation from "@/models/Violation";
import Topbar from "@/components/dashboard/Topbar";
import EmptyState from "@/components/ui/EmptyState";
import Link from "next/link";
import { FiAlertTriangle } from "react-icons/fi";

export default async function AdminMessagesPage() {
  await connectToDatabase();
  const violations = await Violation.find()
    .sort({ createdAt: -1 })
    .populate("user", "name email")
    .populate("project", "title")
    .lean();

  return (
    <div className="pb-16">
      <Topbar title="Moderation log" />
      <div className="px-5 lg:px-8 mt-4">
        <p className="text-sm text-text-dim mb-5 max-w-2xl">
          Every blocked developer message is logged here — the original text, the reason it was flagged,
          and which project it happened on. Nothing blocked ever reaches the client.
        </p>

        {violations.length === 0 ? (
          <EmptyState icon={<FiAlertTriangle />} title="No violations logged" body="Blocked messages will appear here." />
        ) : (
          <div className="bg-bg-2 border border-border rounded-xl divide-y divide-border">
            {violations.map((v) => {
              const user = v.user as unknown as { name: string; email: string };
              const project = v.project as unknown as { _id: string; title: string };
              return (
                <div key={v._id.toString()} className="px-5 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-sm text-red">
                      <FiAlertTriangle size={13} />
                      {user?.name} ({user?.email})
                    </div>
                    <span className="font-mono text-[10px] text-text-dim">
                      {new Date(v.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs text-text-dim mt-2">
                    Reason: <span className="text-amber">{v.reason}</span>
                  </div>
                  <div className="text-xs text-text-dim mt-1 italic">&ldquo;{v.originalText}&rdquo;</div>
                  {project && (
                    <Link
                      href={`/admin/projects/${project._id}`}
                      className="text-xs text-violet-bright hover:underline mt-2 inline-block"
                    >
                      View project: {project.title}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

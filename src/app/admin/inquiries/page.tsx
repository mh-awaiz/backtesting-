export const dynamic = "force-dynamic";

import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import Topbar from "@/components/dashboard/Topbar";
import EmptyState from "@/components/ui/EmptyState";
import Link from "next/link";
import { FiInbox, FiArrowRight } from "react-icons/fi";

export default async function AdminInquiriesPage() {
  await connectToDatabase();
  const inquiries = await Project.find({ status: { $in: ["new", "under_review"] } })
    .sort({ createdAt: -1 })
    .populate("client", "name email company")
    .lean();

  return (
    <div className="pb-16">
      <Topbar title="Inquiries" />
      <div className="px-5 lg:px-8 mt-4">
        {inquiries.length === 0 ? (
          <EmptyState icon={<FiInbox />} title="No new inquiries" body="New project requests will show up here for review and assignment." />
        ) : (
          <div className="bg-bg-2 border border-border rounded-xl divide-y divide-border">
            {inquiries.map((inq) => {
              const client = inq.client as unknown as { name: string; email: string; company?: string };
              return (
                <Link
                  key={inq._id.toString()}
                  href={`/admin/projects/${inq._id}`}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-5 py-4 hover:bg-bg-3 transition-colors"
                >
                  <div>
                    <div className="font-mono text-[10px] text-text-dim">
                      #{inq._id.toString().slice(-6).toUpperCase()} · {new Date(inq.createdAt).toLocaleDateString()}
                    </div>
                    <div className="font-display text-base text-text mt-0.5">{inq.title}</div>
                    <div className="text-xs text-text-dim mt-0.5">
                      {client.name} · {client.email}
                      {inq.budget ? ` · Budget: ${inq.budget}` : ""}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-violet-bright">
                    Review &amp; assign <FiArrowRight size={14} />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

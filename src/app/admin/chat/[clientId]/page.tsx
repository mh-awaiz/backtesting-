export const dynamic = "force-dynamic";

import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Project from "@/models/Project";
import { notFound } from "next/navigation";
import Topbar from "@/components/dashboard/Topbar";
import ChatBox from "@/components/dashboard/ChatBox";
import StatusBadge from "@/components/ui/StatusBadge";
import Link from "next/link";
import { FiUser, FiMail, FiFolder } from "react-icons/fi";

export default async function AdminClientChatPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  await connectToDatabase();

  const client = await User.findOne({ _id: clientId, role: "CLIENT" }).lean();
  if (!client) notFound();

  const projects = await Project.find({ client: clientId })
    .sort({ updatedAt: -1 })
    .populate("assignedDeveloper", "name")
    .lean();

  return (
    <div className="pb-16">
      <Topbar title={`Chat with ${client.name}`} />

      <div className="px-5 lg:px-8 mt-4 grid lg:grid-cols-[1fr_300px] gap-6">
        <ChatBox clientId={clientId} myRole="ADMIN" />

        <div className="space-y-4">
          <div className="bg-bg-2 border border-border rounded-xl p-5">
            <div className="font-mono text-[10px] uppercase tracking-wide text-text-dim mb-3">Client</div>
            <div className="space-y-2 text-sm text-text-dim">
              <div className="flex items-center gap-2">
                <FiUser size={14} /> {client.name}
              </div>
              <div className="flex items-center gap-2">
                <FiMail size={14} /> {client.email}
              </div>
            </div>
          </div>

          <div className="bg-bg-2 border border-border rounded-xl p-5">
            <div className="font-mono text-[10px] uppercase tracking-wide text-text-dim mb-3 flex items-center gap-2">
              <FiFolder size={12} /> Projects
            </div>
            <div className="space-y-2">
              {projects.length === 0 && <p className="text-sm text-text-dim">No projects yet.</p>}
              {projects.map((p) => (
                <Link
                  key={p._id.toString()}
                  href={`/admin/projects/${p._id}`}
                  className="flex items-center justify-between gap-2 text-sm hover:text-violet-bright transition-colors"
                >
                  <span className="truncate">{p.title}</span>
                  <StatusBadge status={p.status} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

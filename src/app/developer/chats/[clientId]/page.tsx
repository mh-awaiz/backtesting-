export const dynamic = "force-dynamic";

import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Project from "@/models/Project";
import { notFound } from "next/navigation";
import Topbar from "@/components/dashboard/Topbar";
import ChatBox from "@/components/dashboard/ChatBox";
import StatusBadge from "@/components/ui/StatusBadge";
import { FiUser, FiMail, FiFolder, FiAlertTriangle } from "react-icons/fi";

export default async function DeveloperClientChatPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  await connectToDatabase();

  const client = await User.findOne({ _id: clientId, role: "CLIENT" }).lean();
  if (!client) notFound();

  const projects = await Project.find({ client: clientId }).sort({ updatedAt: -1 }).lean();

  return (
    <div className="pb-16">
      <Topbar title={`Chat with ${client.name}`} />

      <div className="px-5 lg:px-8 mt-4 grid lg:grid-cols-[1fr_300px] gap-6">
        <div className="space-y-4">
          <div className="flex items-start gap-2 bg-amber/10 border border-amber/30 rounded-xl p-4 text-xs text-amber">
            <FiAlertTriangle className="shrink-0 mt-0.5" />
            Messages are scanned for phone numbers, emails, and social/messaging handles. Google
            Meet links are allowed for calls — everything else off-platform stays inside this chat.
          </div>
          <ChatBox clientId={clientId} myRole="DEVELOPER" />
        </div>

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
                <div key={p._id.toString()} className="flex items-center justify-between gap-2 text-sm">
                  <span className="truncate">{p.title}</span>
                  <StatusBadge status={p.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

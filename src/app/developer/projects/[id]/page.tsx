export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import { notFound } from "next/navigation";
import Topbar from "@/components/dashboard/Topbar";
import StatusBadge from "@/components/ui/StatusBadge";
import ChatBox from "@/components/dashboard/ChatBox";
import DevProjectControls from "@/components/dashboard/DevProjectControls";
import { FiUser, FiMail, FiAlertTriangle } from "react-icons/fi";

export default async function DeveloperProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;
  await connectToDatabase();

  const project = await Project.findOne({ _id: id, assignedDeveloper: session!.user.id })
    .populate("client", "name email company")
    .lean();

  if (!project) notFound();

  const client = project.client as unknown as { _id: string; name: string; email: string; company?: string };

  return (
    <div className="pb-16">
      <Topbar title={project.title} right={<StatusBadge status={project.status} />} />

      <div className="px-5 lg:px-8 mt-4 grid lg:grid-cols-[1fr_300px] gap-6">
        <div className="space-y-6">
          <div className="bg-bg-2 border border-border rounded-xl p-5">
            <div className="font-mono text-[10px] uppercase tracking-wide text-text-dim mb-2">Requirements</div>
            <p className="text-sm text-text leading-relaxed whitespace-pre-wrap">{project.description}</p>
            {project.platformLink && (
              <p className="text-xs text-text-dim mt-3">
                Reference: <span className="text-violet-bright">{project.platformLink}</span>
              </p>
            )}
          </div>

          <div className="flex items-start gap-2 bg-amber/10 border border-amber/30 rounded-xl p-4 text-xs text-amber">
            <FiAlertTriangle className="shrink-0 mt-0.5" />
            Messages are automatically scanned for phone numbers, emails, and social/messaging handles.
            Google Meet links are allowed for calls — everything else off-platform stays inside this chat.
          </div>

          <div>
            <div className="font-mono text-[10px] uppercase tracking-wide text-text-dim mb-2 px-1">
              Chat with {client.name}
            </div>
            <ChatBox clientId={client._id} myRole="DEVELOPER" />
          </div>
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

          <DevProjectControls
            projectId={id}
            initialStatus={project.status}
            initialProgress={project.progress}
          />
        </div>
      </div>
    </div>
  );
}

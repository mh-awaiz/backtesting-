export const dynamic = "force-dynamic";

import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import { notFound } from "next/navigation";
import Topbar from "@/components/dashboard/Topbar";
import StatusBadge from "@/components/ui/StatusBadge";
import ChatBox from "@/components/dashboard/ChatBox";
import AdminProjectControls from "@/components/dashboard/AdminProjectControls";
import { FiUser, FiMail, FiCode } from "react-icons/fi";

export default async function AdminProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectToDatabase();

  const project = await Project.findById(id)
    .populate("client", "name email company")
    .populate("assignedDeveloper", "name email")
    .lean();

  if (!project) notFound();

  const client = project.client as unknown as { _id: string; name: string; email: string; company?: string };
  const developer = project.assignedDeveloper as unknown as { _id: string; name: string; email: string } | undefined;

  return (
    <div className="pb-16">
      <Topbar title={project.title} right={<StatusBadge status={project.status} />} />

      <div className="px-5 lg:px-8 mt-4 grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-6">
          <div className="bg-bg-2 border border-border rounded-xl p-5">
            <div className="font-mono text-[10px] uppercase tracking-wide text-text-dim mb-2">Requirements</div>
            <p className="text-sm text-text leading-relaxed whitespace-pre-wrap">{project.description}</p>
            <div className="grid sm:grid-cols-2 gap-3 mt-4 text-xs text-text-dim">
              {project.platformLink && <div>Reference: {project.platformLink}</div>}
              {project.budget && <div>Budget: {project.budget}</div>}
              {project.timeline && <div>Timeline: {project.timeline}</div>}
            </div>
          </div>

          <div>
            <div className="font-mono text-[10px] uppercase tracking-wide text-text-dim mb-2 px-1">
              Chat with {client.name}
            </div>
            <ChatBox clientId={client._id} myRole="ADMIN" />
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
              {client.company && <div className="text-xs">{client.company}</div>}
            </div>
          </div>

          {developer && (
            <div className="bg-bg-2 border border-border rounded-xl p-5">
              <div className="font-mono text-[10px] uppercase tracking-wide text-text-dim mb-3">Developer</div>
              <div className="flex items-center gap-2 text-sm text-text-dim">
                <FiCode size={14} /> {developer.name}
              </div>
            </div>
          )}

          <AdminProjectControls
            projectId={id}
            initialStatus={project.status}
            initialProgress={project.progress}
            initialDeveloperId={developer?._id?.toString()}
            initialDeadline={project.deadline?.toString()}
            initialPaymentAmount={project.paymentAmount}
            initialPaymentStatus={project.paymentStatus}
          />
        </div>
      </div>
    </div>
  );
}

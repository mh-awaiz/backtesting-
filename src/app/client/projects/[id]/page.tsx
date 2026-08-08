export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import { notFound } from "next/navigation";
import Topbar from "@/components/dashboard/Topbar";
import StatusBadge from "@/components/ui/StatusBadge";
import ChatBox from "@/components/dashboard/ChatBox";
import PaymentPanel from "@/components/dashboard/PaymentPanel";
import { FiUser, FiCalendar } from "react-icons/fi";

export default async function ClientProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;
  await connectToDatabase();

  const project = await Project.findOne({ _id: id, client: session!.user.id })
    .populate("assignedDeveloper", "name email")
    .lean();

  if (!project) notFound();

  const developer = project.assignedDeveloper as unknown as { name: string; email: string } | undefined;

  return (
    <div className="pb-16">
      <Topbar title={project.title} right={<StatusBadge status={project.status} />} />

      <div className="px-5 lg:px-8 mt-4 grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-6">
          <div className="bg-bg-2 border border-border rounded-xl p-5">
            <div className="font-mono text-[10px] uppercase tracking-wide text-text-dim mb-2">Description</div>
            <p className="text-sm text-text leading-relaxed whitespace-pre-wrap">{project.description}</p>

            <div className="mt-5">
              <div className="flex justify-between font-mono text-[10px] text-text-dim mb-1.5">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <div className="h-1.5 bg-bg-3 rounded-full overflow-hidden">
                <div className="h-full bg-violet rounded-full" style={{ width: `${project.progress}%` }} />
              </div>
            </div>
          </div>

          <div>
            <div className="font-mono text-[10px] uppercase tracking-wide text-text-dim mb-2 px-1">
              Project chat
            </div>
            <ChatBox projectId={id} myRole="CLIENT" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-bg-2 border border-border rounded-xl p-5">
            <div className="font-mono text-[10px] uppercase tracking-wide text-text-dim mb-3">Details</div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-text-dim">
                <FiUser size={14} />
                {developer ? `Developer: ${developer.name}` : "Not yet assigned"}
              </div>
              {project.deadline && (
                <div className="flex items-center gap-2 text-text-dim">
                  <FiCalendar size={14} />
                  Due {new Date(project.deadline).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>

          <PaymentPanel
            projectId={id}
            amount={project.paymentAmount}
            initialStatus={project.paymentStatus}
          />
        </div>
      </div>
    </div>
  );
}

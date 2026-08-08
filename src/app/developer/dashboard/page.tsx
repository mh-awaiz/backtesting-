export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import { daysFromNow } from "@/lib/dates";
import Topbar from "@/components/dashboard/Topbar";
import StatCard from "@/components/dashboard/StatCard";
import ProjectCard from "@/components/dashboard/ProjectCard";
import EmptyState from "@/components/ui/EmptyState";
import { FiFolder, FiCheckCircle, FiClock, FiInbox } from "react-icons/fi";

export default async function DeveloperDashboard() {
  const session = await auth();
  await connectToDatabase();

  const soonThreshold = daysFromNow(3);

  const [projects, dueSoonCount] = await Promise.all([
    Project.find({ assignedDeveloper: session!.user.id })
      .sort({ updatedAt: -1 })
      .populate("client", "name")
      .lean(),
    Project.countDocuments({
      assignedDeveloper: session!.user.id,
      deadline: { $lt: soonThreshold },
      status: { $ne: "completed" },
    }),
  ]);

  const active = projects.filter((p) => !["completed", "rejected", "cancelled"].includes(p.status));
  const completed = projects.filter((p) => p.status === "completed");

  return (
    <div className="pb-16">
      <Topbar title={`Welcome back, ${session!.user.name?.split(" ")[0]}`} />

      <div className="px-5 lg:px-8 mt-4 grid sm:grid-cols-3 gap-4">
        <StatCard label="Active projects" value={active.length} icon={<FiFolder />} />
        <StatCard label="Due soon" value={dueSoonCount} icon={<FiClock />} accent="text-amber" />
        <StatCard label="Completed" value={completed.length} icon={<FiCheckCircle />} accent="text-green" />
      </div>

      <div className="px-5 lg:px-8 mt-8">
        <h2 className="font-display text-lg text-text mb-4">Assigned to you</h2>
        {projects.length === 0 ? (
          <EmptyState icon={<FiInbox />} title="No projects assigned yet" body="Admin will assign inquiries to you as they come in." />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p) => (
              <ProjectCard
                key={p._id.toString()}
                id={p._id.toString()}
                title={p.title}
                status={p.status}
                progress={p.progress}
                href={`/developer/projects/${p._id}`}
                counterpart={{ label: "Client", name: (p.client as unknown as { name: string }).name }}
                updatedAt={p.updatedAt.toString()}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

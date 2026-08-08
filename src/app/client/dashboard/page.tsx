export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import Topbar from "@/components/dashboard/Topbar";
import StatCard from "@/components/dashboard/StatCard";
import ProjectCard from "@/components/dashboard/ProjectCard";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { FiFolder, FiCheckCircle, FiClock, FiPlus, FiInbox } from "react-icons/fi";

export default async function ClientDashboard() {
  const session = await auth();
  await connectToDatabase();

  const projects = await Project.find({ client: session!.user.id })
    .sort({ updatedAt: -1 })
    .populate("assignedDeveloper", "name")
    .lean();

  const active = projects.filter((p) => !["completed", "rejected", "cancelled"].includes(p.status));
  const completed = projects.filter((p) => p.status === "completed");
  const pending = projects.filter((p) => p.status === "new" || p.status === "under_review");

  return (
    <div className="pb-16">
      <Topbar
        title={`Welcome back, ${session!.user.name?.split(" ")[0]}`}
        right={
          <Link href="/client/projects/new">
            <Button>
              <FiPlus size={15} /> New project
            </Button>
          </Link>
        }
      />

      <div className="px-5 lg:px-8 mt-4 grid sm:grid-cols-3 gap-4">
        <StatCard label="Active projects" value={active.length} icon={<FiFolder />} />
        <StatCard label="Pending review" value={pending.length} icon={<FiClock />} accent="text-amber" />
        <StatCard label="Completed" value={completed.length} icon={<FiCheckCircle />} accent="text-green" />
      </div>

      <div className="px-5 lg:px-8 mt-8">
        <h2 className="font-display text-lg text-text mb-4">Your projects</h2>
        {projects.length === 0 ? (
          <EmptyState
            icon={<FiInbox />}
            title="No projects yet"
            body="Submit your first PineScript project and it'll show up here."
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p) => (
              <ProjectCard
                key={p._id.toString()}
                id={p._id.toString()}
                title={p.title}
                status={p.status}
                progress={p.progress}
                href={`/client/projects/${p._id}`}
                counterpart={
                  p.assignedDeveloper
                    ? { label: "Developer", name: (p.assignedDeveloper as unknown as { name: string }).name }
                    : undefined
                }
                updatedAt={p.updatedAt.toString()}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

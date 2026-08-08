export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import Topbar from "@/components/dashboard/Topbar";
import ProjectCard from "@/components/dashboard/ProjectCard";
import EmptyState from "@/components/ui/EmptyState";
import { FiInbox } from "react-icons/fi";

export default async function ClientProjectsPage() {
  const session = await auth();
  await connectToDatabase();

  const projects = await Project.find({ client: session!.user.id })
    .sort({ updatedAt: -1 })
    .populate("assignedDeveloper", "name")
    .lean();

  return (
    <div className="pb-16">
      <Topbar title="My projects" />
      <div className="px-5 lg:px-8 mt-4">
        {projects.length === 0 ? (
          <EmptyState icon={<FiInbox />} title="No projects yet" body="Submit a request from your dashboard to get started." />
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

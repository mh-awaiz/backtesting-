export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import Topbar from "@/components/dashboard/Topbar";
import ProjectCard from "@/components/dashboard/ProjectCard";
import EmptyState from "@/components/ui/EmptyState";
import { FiInbox } from "react-icons/fi";

export default async function DeveloperProjectsPage() {
  const session = await auth();
  await connectToDatabase();

  const projects = await Project.find({ assignedDeveloper: session!.user.id })
    .sort({ updatedAt: -1 })
    .populate("client", "name")
    .lean();

  return (
    <div className="pb-16">
      <Topbar title="My projects" />
      <div className="px-5 lg:px-8 mt-4">
        {projects.length === 0 ? (
          <EmptyState icon={<FiInbox />} title="No projects assigned yet" />
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

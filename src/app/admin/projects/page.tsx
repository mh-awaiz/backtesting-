export const dynamic = "force-dynamic";

import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import Topbar from "@/components/dashboard/Topbar";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import Link from "next/link";
import { FiFolder } from "react-icons/fi";

export default async function AdminProjectsPage() {
  await connectToDatabase();
  const projects = await Project.find()
    .sort({ updatedAt: -1 })
    .populate("client", "name")
    .populate("assignedDeveloper", "name")
    .lean();

  return (
    <div className="pb-16">
      <Topbar title="All projects" />
      <div className="px-5 lg:px-8 mt-4">
        {projects.length === 0 ? (
          <EmptyState icon={<FiFolder />} title="No projects yet" />
        ) : (
          <div className="bg-bg-2 border border-border rounded-xl overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="text-left font-mono text-[10px] uppercase tracking-wide text-text-dim border-b border-border">
                  <th className="px-5 py-3 font-normal">Project</th>
                  <th className="px-5 py-3 font-normal">Client</th>
                  <th className="px-5 py-3 font-normal">Developer</th>
                  <th className="px-5 py-3 font-normal">Status</th>
                  <th className="px-5 py-3 font-normal">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {projects.map((p) => (
                  <tr key={p._id.toString()} className="hover:bg-bg-3 transition-colors">
                    <td className="px-5 py-3.5">
                      <Link href={`/admin/projects/${p._id}`} className="text-text hover:text-violet-bright">
                        {p.title}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 text-text-dim">{(p.client as unknown as { name: string })?.name}</td>
                    <td className="px-5 py-3.5 text-text-dim">
                      {(p.assignedDeveloper as unknown as { name: string })?.name || "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-5 py-3.5 text-text-dim">{p.progress}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

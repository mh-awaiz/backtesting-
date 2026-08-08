export const dynamic = "force-dynamic";

import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Project from "@/models/Project";
import Topbar from "@/components/dashboard/Topbar";
import EmptyState from "@/components/ui/EmptyState";
import { FiUsers } from "react-icons/fi";

export default async function AdminClientsPage() {
  await connectToDatabase();
  const clients = await User.find({ role: "CLIENT" }).sort({ createdAt: -1 }).lean();

  const withCounts = await Promise.all(
    clients.map(async (c) => {
      const projectCount = await Project.countDocuments({ client: c._id });
      return { ...c, projectCount };
    })
  );

  return (
    <div className="pb-16">
      <Topbar title="Clients" />
      <div className="px-5 lg:px-8 mt-4">
        {withCounts.length === 0 ? (
          <EmptyState icon={<FiUsers />} title="No clients yet" />
        ) : (
          <div className="bg-bg-2 border border-border rounded-xl overflow-x-auto">
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="text-left font-mono text-[10px] uppercase tracking-wide text-text-dim border-b border-border">
                  <th className="px-5 py-3 font-normal">Name</th>
                  <th className="px-5 py-3 font-normal">Email</th>
                  <th className="px-5 py-3 font-normal">Company</th>
                  <th className="px-5 py-3 font-normal">Projects</th>
                  <th className="px-5 py-3 font-normal">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {withCounts.map((c) => (
                  <tr key={c._id.toString()}>
                    <td className="px-5 py-3.5 text-text">{c.name}</td>
                    <td className="px-5 py-3.5 text-text-dim">{c.email}</td>
                    <td className="px-5 py-3.5 text-text-dim">{c.company || "—"}</td>
                    <td className="px-5 py-3.5 text-text-dim">{c.projectCount}</td>
                    <td className="px-5 py-3.5 text-text-dim">{new Date(c.createdAt).toLocaleDateString()}</td>
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

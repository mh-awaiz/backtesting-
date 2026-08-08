export const dynamic = "force-dynamic";

import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import User from "@/models/User";
import Violation from "@/models/Violation";
import Lead from "@/models/Lead";
import Topbar from "@/components/dashboard/Topbar";
import StatCard from "@/components/dashboard/StatCard";
import Link from "next/link";
import StatusBadge from "@/components/ui/StatusBadge";
import { FiInbox, FiFolder, FiUsers, FiUserCheck, FiAlertTriangle, FiUserPlus } from "react-icons/fi";

export default async function AdminDashboard() {
  await connectToDatabase();

  const [newInquiries, newLeads, activeProjects, completedProjects, clientCount, developerCount, recentViolations, recentProjects] =
    await Promise.all([
      Project.countDocuments({ status: { $in: ["new", "under_review"] } }),
      Lead.countDocuments({ status: "new" }),
      Project.countDocuments({ status: { $nin: ["new", "completed", "rejected", "cancelled"] } }),
      Project.countDocuments({ status: "completed" }),
      User.countDocuments({ role: "CLIENT" }),
      User.countDocuments({ role: "DEVELOPER" }),
      Violation.find().sort({ createdAt: -1 }).limit(5).populate("user", "name").lean(),
      Project.find().sort({ updatedAt: -1 }).limit(6).populate("client", "name").lean(),
    ]);

  return (
    <div className="pb-16">
      <Topbar title="Admin overview" />

      <div className="px-5 lg:px-8 mt-4 grid sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard label="New leads" value={newLeads} icon={<FiUserPlus />} accent="text-amber" />
        <StatCard label="New inquiries" value={newInquiries} icon={<FiInbox />} accent="text-amber" />
        <StatCard label="Active projects" value={activeProjects} icon={<FiFolder />} />
        <StatCard label="Completed" value={completedProjects} icon={<FiFolder />} accent="text-green" />
        <StatCard label="Clients" value={clientCount} icon={<FiUsers />} />
        <StatCard label="Developers" value={developerCount} icon={<FiUserCheck />} />
      </div>

      <div className="px-5 lg:px-8 mt-8 grid lg:grid-cols-[1fr_360px] gap-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg text-text">Recent activity</h2>
            <Link href="/admin/projects" className="text-xs text-violet-bright hover:underline">
              View all
            </Link>
          </div>
          <div className="bg-bg-2 border border-border rounded-xl divide-y divide-border">
            {recentProjects.map((p) => (
              <Link
                key={p._id.toString()}
                href={`/admin/projects/${p._id}`}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-bg-3 transition-colors"
              >
                <div>
                  <div className="text-sm text-text">{p.title}</div>
                  <div className="text-xs text-text-dim">{(p.client as unknown as { name: string })?.name}</div>
                </div>
                <StatusBadge status={p.status} />
              </Link>
            ))}
            {recentProjects.length === 0 && (
              <div className="px-5 py-6 text-sm text-text-dim">No projects yet.</div>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg text-text">Moderation alerts</h2>
            <Link href="/admin/messages" className="text-xs text-violet-bright hover:underline">
              View log
            </Link>
          </div>
          <div className="bg-bg-2 border border-border rounded-xl divide-y divide-border">
            {recentViolations.map((v) => (
              <div key={v._id.toString()} className="px-5 py-3.5">
                <div className="flex items-center gap-2 text-sm text-red">
                  <FiAlertTriangle size={13} />
                  {(v.user as unknown as { name: string })?.name}
                </div>
                <div className="text-xs text-text-dim mt-1">{v.reason}</div>
              </div>
            ))}
            {recentViolations.length === 0 && (
              <div className="px-5 py-6 text-sm text-text-dim">No violations logged.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";

import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Project from "@/models/Project";
import Topbar from "@/components/dashboard/Topbar";
import CreateDeveloperForm from "@/components/dashboard/CreateDeveloperForm";
import EmptyState from "@/components/ui/EmptyState";
import { FiUserCheck, FiAlertTriangle } from "react-icons/fi";

export default async function AdminDevelopersPage() {
  await connectToDatabase();
  const developers = await User.find({ role: "DEVELOPER" }).sort({ createdAt: -1 }).lean();

  const withCounts = await Promise.all(
    developers.map(async (d) => {
      const activeCount = await Project.countDocuments({
        assignedDeveloper: d._id,
        status: { $nin: ["completed", "rejected", "cancelled"] },
      });
      const completedCount = await Project.countDocuments({ assignedDeveloper: d._id, status: "completed" });
      return { ...d, activeCount, completedCount };
    })
  );

  return (
    <div className="pb-16">
      <Topbar title="Developers" right={<CreateDeveloperForm />} />
      <div className="px-5 lg:px-8 mt-4">
        {withCounts.length === 0 ? (
          <EmptyState icon={<FiUserCheck />} title="No developers yet" body="Add your team so you can assign inquiries to them." />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {withCounts.map((d) => (
              <div key={d._id.toString()} className="bg-bg-2 border border-border rounded-xl p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-display text-base text-text">{d.name}</div>
                    <div className="text-xs text-text-dim mt-0.5">{d.email}</div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wide px-2 py-1 rounded-full border shrink-0 ${
                      d.available
                        ? "text-green bg-green/10 border-green/30"
                        : "text-text-dim bg-bg-3 border-border"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${d.available ? "bg-green" : "bg-text-dim"}`} />
                    {d.available ? "Online" : "Offline"}
                  </span>
                </div>
                <div className="flex gap-4 mt-4 text-xs text-text-dim">
                  <span>{d.activeCount} active</span>
                  <span>{d.completedCount} completed</span>
                </div>
                {d.messagingRestricted && (
                  <div className="flex items-center gap-1.5 mt-3 text-xs text-red">
                    <FiAlertTriangle size={12} /> Messaging restricted ({d.violationCount} violations)
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

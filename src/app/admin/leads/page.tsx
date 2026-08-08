export const dynamic = "force-dynamic";

import { connectToDatabase } from "@/lib/mongodb";
import Lead from "@/models/Lead";
import Topbar from "@/components/dashboard/Topbar";
import StatCard from "@/components/dashboard/StatCard";
import LeadRow from "@/components/dashboard/LeadRow";
import EmptyState from "@/components/ui/EmptyState";
import { FiUserPlus, FiCheckCircle, FiTrendingUp } from "react-icons/fi";

export default async function AdminLeadsPage() {
  await connectToDatabase();
  const leads = await Lead.find().sort({ createdAt: -1 }).lean();

  const newCount = leads.filter((l) => l.status === "new").length;
  const convertedCount = leads.filter((l) => l.status === "converted").length;

  return (
    <div className="pb-16">
      <Topbar title="Leads" />

      <div className="px-5 lg:px-8 mt-4 grid sm:grid-cols-3 gap-4">
        <StatCard label="Total leads" value={leads.length} icon={<FiUserPlus />} />
        <StatCard label="New" value={newCount} icon={<FiTrendingUp />} accent="text-amber" />
        <StatCard label="Converted" value={convertedCount} icon={<FiCheckCircle />} accent="text-green" />
      </div>

      <div className="px-5 lg:px-8 mt-4">
        <p className="text-sm text-text-dim mb-5 max-w-2xl">
          Quick-capture interest from site visitors who aren&apos;t ready to submit a full project
          brief yet. Reach out directly, then mark them converted once they submit an inquiry.
        </p>

        {leads.length === 0 ? (
          <EmptyState
            icon={<FiUserPlus />}
            title="No leads yet"
            body="Quick-contact submissions from the site will show up here."
          />
        ) : (
          <div className="bg-bg-2 border border-border rounded-xl divide-y divide-border">
            {leads.map((lead) => (
              <LeadRow
                key={lead._id.toString()}
                id={lead._id.toString()}
                name={lead.name}
                email={lead.email}
                message={lead.message}
                source={lead.source}
                status={lead.status}
                createdAt={lead.createdAt.toString()}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

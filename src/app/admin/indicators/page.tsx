export const dynamic = "force-dynamic";

import { connectToDatabase } from "@/lib/mongodb";
import Indicator from "@/models/Indicator";
import Topbar from "@/components/dashboard/Topbar";
import IndicatorForm from "@/components/dashboard/IndicatorForm";
import IndicatorRow from "@/components/dashboard/IndicatorRow";
import EmptyState from "@/components/ui/EmptyState";
import { FiTrendingUp } from "react-icons/fi";

export default async function AdminIndicatorsPage() {
  await connectToDatabase();
  const indicators = await Indicator.find().sort({ createdAt: -1 }).lean();

  return (
    <div className="pb-16">
      <Topbar title="Indicators" />
      <div className="px-5 lg:px-8 mt-4">
        <IndicatorForm />

        {indicators.length === 0 ? (
          <EmptyState icon={<FiTrendingUp />} title="No indicators yet" body="Publish your first indicator to show it on the homepage." />
        ) : (
          <div className="bg-bg-2 border border-border rounded-xl overflow-x-auto">
            <table className="w-full text-sm min-w-[520px]">
              <thead>
                <tr className="text-left font-mono text-[10px] uppercase tracking-wide text-text-dim border-b border-border">
                  <th className="px-5 py-3 font-normal">Name</th>
                  <th className="px-5 py-3 font-normal">Category</th>
                  <th className="px-5 py-3 font-normal">Published</th>
                  <th className="px-5 py-3 font-normal">Featured</th>
                  <th className="px-5 py-3 font-normal"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {indicators.map((ind) => (
                  <IndicatorRow
                    key={ind._id.toString()}
                    id={ind._id.toString()}
                    name={ind.name}
                    category={ind.category}
                    published={ind.published}
                    featured={ind.featured}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

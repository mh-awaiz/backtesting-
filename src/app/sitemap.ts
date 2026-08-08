import type { MetadataRoute } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import Indicator from "@/models/Indicator";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

  let indicatorUrls: MetadataRoute.Sitemap = [];
  try {
    await connectToDatabase();
    const indicators = await Indicator.find({ published: true }).select("slug").lean();
    indicatorUrls = indicators.map((i) => ({
      url: `${base}/indicators/${i.slug}`,
      lastModified: new Date(),
    }));
  } catch {
    // DB not reachable at build time — sitemap still returns static routes.
  }

  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/indicators`, lastModified: new Date() },
    ...indicatorUrls,
  ];
}

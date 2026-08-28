export const dynamic = "force-dynamic";

import { connectToDatabase } from "@/lib/mongodb";
import Indicator from "@/models/Indicator";
import Nav from "@/components/marketing/Nav";
import Hero from "@/components/marketing/Hero";
import ScrollChart from "@/components/marketing/ScrollChart";
import TrustBar from "@/components/marketing/TrustBar";
import Services from "@/components/marketing/Services";
import IndicatorShowcase from "@/components/marketing/IndicatorShowcase";
import Process from "@/components/marketing/Process";
import WhyUs from "@/components/marketing/WhyUs";
import Testimonials from "@/components/marketing/Testimonials";
import FAQ from "@/components/marketing/FAQ";
import FinalCTA from "@/components/marketing/FinalCTA";
import Footer from "@/components/marketing/Footer";
import ContactSection from "@/components/marketing/ContactSection";
import FloatingChatWidget from "@/components/marketing/FloatingChatWidget";

export default async function Home() {
  await connectToDatabase();
  const indicators = await Indicator.find({ published: true, featured: true })
    .sort({ createdAt: -1 })
    .limit(6)
    .lean();

  const indicatorProps = indicators.map((i) => ({
    _id: i._id.toString(),
    name: i.name,
    slug: i.slug,
    category: i.category,
    shortDescription: i.shortDescription,
    features: i.features,
  }));

  return (
    <main className="min-h-screen bg-bg">
      <Nav />
      <Hero />
      <ScrollChart />
      <TrustBar />
      <Services />
      <IndicatorShowcase indicators={indicatorProps} />
      <Process />
      <WhyUs />
      <Testimonials />
      <FAQ />
      {/* <FinalCTA /> */}
      <ContactSection />
      <Footer />
      <FloatingChatWidget />
    </main>
  );
}

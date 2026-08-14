import Reveal from "./Reveal";
import LeadCaptureForm from "./LeadCaptureForm";

export default function ContactSection() {
  return (
    <section id="contact" className="py-24 sm:py-28 bg-bg-2 border-t border-border">
      <div className="max-w-2xl mx-auto px-5 sm:px-8">
        <Reveal className="text-center">
          <div className="font-mono text-xs text-violet-bright mb-3">START A PROJECT</div>
          <h2 className="font-display text-3xl sm:text-4xl text-text">Tell us what you need built.</h2>
          <p className="mt-4 text-text-dim leading-relaxed">
            Leave your email and a quick note — we&apos;ll follow up to scope it out.
          </p>
        </Reveal>

        <Reveal delay={120} className="mt-12 flex justify-center">
          <LeadCaptureForm source="homepage-contact-section" />
        </Reveal>
      </div>
    </section>
  );
}

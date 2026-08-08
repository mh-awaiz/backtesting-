import Reveal from "./Reveal";
import InquiryForm from "./InquiryForm";

export default function ContactSection() {
  return (
    <section id="contact" className="py-24 sm:py-28 bg-bg-2 border-t border-border">
      <div className="max-w-2xl mx-auto px-5 sm:px-8">
        <Reveal className="text-center">
          <div className="font-mono text-xs text-violet-bright mb-3">START A PROJECT</div>
          <h2 className="font-display text-3xl sm:text-4xl text-text">Tell us what you need built.</h2>
          <p className="mt-4 text-text-dim leading-relaxed">
            A quote comes back after review — nothing is charged until you accept it.
          </p>
        </Reveal>

        <Reveal delay={120} className="mt-12">
          <InquiryForm />
        </Reveal>
      </div>
    </section>
  );
}

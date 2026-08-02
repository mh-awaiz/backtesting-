import ContactForm from "./ContactForm";
import Reveal from "./Reveal";

export default function ContactSection() {
  return (
    <section id="contact" className="py-24 sm:py-28 bg-ink-2 border-t border-line">
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        <Reveal className="text-center max-w-xl mx-auto">
          <div className="font-mono text-xs text-brass mb-3">05 · OPEN A REQUEST</div>
          <h2 className="font-display text-3xl sm:text-4xl text-paper">
            Put your strategy on the desk.
          </h2>
          <p className="mt-4 text-paper-dim leading-relaxed">
            No account needed to start. Fill in what you have — scope and a
            quote come back by message before anything is billed.
          </p>
        </Reveal>

        <Reveal delay={120} className="mt-12">
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}

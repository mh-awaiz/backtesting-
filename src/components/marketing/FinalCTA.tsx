import Reveal from "./Reveal";
import LeadCaptureForm from "./LeadCaptureForm";

export default function FinalCTA() {
  return (
    <section className="py-20">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        <Reveal>
          <div className="text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Have a TradingView idea?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-text-dim sm:text-base">
              Tell us what you&apos;re trying to build. Most inquiries get reviewed
              within a day.
            </p>

            <div className="mx-auto mt-10 max-w-lg border-t border-border pt-8">
              <p className="mb-3 text-center text-xs text-text-dim">
                Not ready for a full brief? Just leave your email.
              </p>

              <div className="flex justify-center">
                <LeadCaptureForm
                  source="homepage-final-cta"
                  compact
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

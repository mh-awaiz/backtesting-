import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import CodePanel from "./CodePanel";

export default function Hero() {
  return (
    <section
      id="top"
      className="
        relative
        min-h-[100svh]
        overflow-hidden
        grid-fade
        flex
        items-center
        pt-24
        pb-16
        sm:pt-28
        sm:pb-20
      "
    >
      {/* =====================================================
          BACKGROUND GLOW
      ====================================================== */}
      <div
        className="
          pointer-events-none
          absolute
          -top-48
          left-1/2
          -translate-x-1/2
          w-[500px]
          h-[500px]
          sm:w-[650px]
          sm:h-[650px]
          lg:w-[750px]
          lg:h-[750px]
          rounded-full
          opacity-[0.10]
          blur-3xl
        "
        style={{
          background: "var(--violet)",
        }}
        aria-hidden="true"
      />

      {/* Secondary subtle glow */}
      <div
        className="
          pointer-events-none
          absolute
          right-[-15%]
          bottom-[-20%]
          w-[350px]
          h-[350px]
          sm:w-[500px]
          sm:h-[500px]
          rounded-full
          opacity-[0.05]
          blur-3xl
        "
        style={{
          background: "var(--violet)",
        }}
        aria-hidden="true"
      />

      {/* =====================================================
          MAIN CONTAINER
      ====================================================== */}
      <div
        className="
          relative
          z-10
          w-full
          max-w-7xl
          mx-auto
          px-5
          sm:px-8
          lg:px-10
        "
      >
        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-[1.05fr_0.95fr]
            items-center
            gap-12
            sm:gap-14
            lg:gap-16
          "
        >
          {/* =================================================
              LEFT — HERO CONTENT
          ================================================== */}
          <div
            className="
              flex
              flex-col
              items-center
              text-center
              lg:items-start
              lg:text-left
            "
            style={{
              animation:
                "fade-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.05s backwards",
            }}
          >
            {/* Eyebrow */}
            <div
              className="
                flex
                items-center
                justify-center
                lg:justify-start
                gap-2
                font-mono
                text-[10px]
                sm:text-xs
                tracking-[0.12em]
                sm:tracking-normal
                text-violet-bright
                mb-5
              "
            >
              <span
                className="
                  w-1.5
                  h-1.5
                  shrink-0
                  rounded-full
                  bg-green
                "
                style={{
                  animation: "pulse-dot 2s ease-in-out infinite",
                }}
              />
              TEAM OF PINESCRIPT DEVELOPERS
            </div>

            {/* Heading */}
            <h1
              className="
                font-display
                font-semibold
                tracking-tight
                text-text
                text-[2.35rem]
                leading-[1.08]
                max-w-[650px]
                sm:text-5xl
                sm:leading-[1.05]
                lg:text-6xl
                xl:text-[4.2rem]
              "
            >
              PineScript development for serious traders.
            </h1>

            {/* Description */}
            <p
              className="
                mt-6
                text-text-dim
                text-base
                sm:text-lg
                leading-relaxed
                max-w-xl
              "
            >
              Indicators, strategies, and automation built by a dedicated team —
              not a single freelancer juggling ten inboxes. Every project gets
              its own dashboard, its own developer, and a direct line to them.
            </p>

            {/* Buttons */}
            <div
              className="
                mt-8
                sm:mt-9
                flex
                flex-col
                w-full
                sm:w-auto
                sm:flex-row
                items-center
                justify-center
                lg:justify-start
                gap-4
              "
            >
              <Link
                href="/#contact"
                className="
                  group
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  w-full
                  sm:w-auto
                  bg-violet
                  text-white
                  font-medium
                  px-6
                  py-3
                  rounded-lg
                  transition-all
                  duration-300
                  hover:bg-violet-bright
                  hover:-translate-y-0.5
                  hover:shadow-[0_14px_30px_-12px_rgba(124,111,240,0.5)]
                "
              >
                Start your project
                <FiArrowRight
                  className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                />
              </Link>

              <Link
                href="/indicators"
                className="
                  font-mono
                  text-sm
                  text-text-dim
                  hover:text-text
                  border-b
                  border-transparent
                  hover:border-text-dim
                  transition-colors
                  pb-0.5
                "
              >
                View our indicators
              </Link>
            </div>
          </div>

          {/* =================================================
              RIGHT — CODE PANEL
          ================================================== */}
          <div
            className="
              w-full
              flex
              items-center
              justify-center
              lg:justify-end
            "
            style={{
              animation:
                "fade-up 0.8s cubic-bezier(0.22,1,0.36,1) 0.3s backwards",
            }}
          >
            <div
              className="
                w-full
                max-w-[520px]
                lg:max-w-[560px]
              "
            >
              <CodePanel />
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          BOTTOM FADE
      ====================================================== */}
      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          right-0
          h-24
          bg-gradient-to-t
          from-black/20
          to-transparent
        "
        aria-hidden="true"
      />
    </section>
  );
}

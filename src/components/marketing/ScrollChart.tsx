// "use client";

// import { useEffect, useRef, useState } from "react";

// // Deterministic pseudo-random generator (fixed seed) so the candle layout
// // is identical on server and client renders — no hydration mismatch, no
// // Math.random() at render time.
// function mulberry32(seed: number) {
//   return function () {
//     seed |= 0;
//     seed = (seed + 0x6d2b79f5) | 0;
//     let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
//     t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
//     return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
//   };
// }

// const CANDLE_COUNT = 42;
// const rand = mulberry32(1337);

// // Shape an up / down / up wave (like a real price swing) and scatter
// // candles around it, closely mirroring a typical TradingView price reel.
// function buildCandles() {
//   const candles: { x: number; top: number; bottom: number; color: "up" | "down" }[] = [];
//   const width = 1200;
//   const spacing = width / CANDLE_COUNT;

//   for (let i = 0; i < CANDLE_COUNT; i++) {
//     const t = i / (CANDLE_COUNT - 1);
//     // Base wave: rises, dips hard in the middle third, recovers.
//     const wave =
//       Math.sin(t * Math.PI * 1.15) * 70 -
//       Math.max(0, Math.sin((t - 0.15) * Math.PI * 1.6)) * 55;
//     const base = 190 - wave;
//     const jitter = (rand() - 0.5) * 26;
//     const bodyHeight = 14 + rand() * 22;
//     const top = base + jitter - bodyHeight / 2;
//     const bottom = top + bodyHeight;
//     const color: "up" | "down" = rand() > 0.46 ? "up" : "down";
//     candles.push({ x: 20 + i * spacing, top, bottom, color });
//   }
//   return candles;
// }

// const candles = buildCandles();

// // A smooth trend line loosely tracing the swing above, used for the
// // scroll-drawn white line (same visual idea as the reference clip).
// const TREND_PATH =
//   "M20,205 C120,175 200,120 300,110 C400,100 460,150 520,230 " +
//   "C580,300 640,320 700,270 C780,205 860,150 940,145 " +
//   "C1020,140 1100,120 1180,95";

// function clamp01(n: number) {
//   return Math.min(1, Math.max(0, n));
// }

// export default function ScrollChart() {
//   const sectionRef = useRef<HTMLDivElement>(null);
//   const [progress, setProgress] = useState(0);

//   useEffect(() => {
//     let frame: number | null = null;

//     const measure = () => {
//       frame = null;
//       const el = sectionRef.current;
//       if (!el) return;
//       const rect = el.getBoundingClientRect();
//       const viewport = window.innerHeight;
//       // 0 when the section is just entering the bottom of the viewport,
//       // 1 once its bottom has scrolled up to ~35% of the viewport height —
//       // so the whole animation is "drawn" by the time you're reading it.
//       const total = rect.height + viewport * 0.65;
//       const traveled = viewport - rect.top;
//       setProgress(clamp01(traveled / total));
//     };

//     const onScroll = () => {
//       if (frame === null) frame = requestAnimationFrame(measure);
//     };

//     measure();
//     window.addEventListener("scroll", onScroll, { passive: true });
//     window.addEventListener("resize", onScroll);
//     return () => {
//       window.removeEventListener("scroll", onScroll);
//       window.removeEventListener("resize", onScroll);
//       if (frame !== null) cancelAnimationFrame(frame);
//     };
//   }, []);

//   return (
//     <section ref={sectionRef} className="relative py-20 sm:py-28 overflow-hidden grid-fade">
//       <div className="max-w-6xl mx-auto px-5 sm:px-8">
//         <div className="text-center mb-10">
//           <div className="font-mono text-xs text-violet-bright mb-3">LIVE ON EVERY CHART</div>
//           <h2 className="font-display text-2xl sm:text-3xl text-text max-w-lg mx-auto">
//             Built for real price action, not just demos.
//           </h2>
//         </div>

//         <div className="code-window rounded-xl p-3 sm:p-6">
//           <svg viewBox="0 0 1200 300" className="w-full h-[220px] sm:h-[300px]" aria-hidden="true">
//             {/* baseline grid */}
//             {[60, 120, 180, 240].map((y) => (
//               <line key={y} x1="0" y1={y} x2="1200" y2={y} stroke="var(--border)" strokeWidth="1" />
//             ))}

//             {/* candles reveal progressively as you scroll */}
//             {candles.map((c, i) => {
//               const threshold = i / candles.length;
//               const local = clamp01((progress - threshold) * candles.length * 1.4);
//               if (local <= 0) return null;
//               const color = c.color === "up" ? "var(--green)" : "var(--red)";
//               const height = Math.max(2, c.bottom - c.top);
//               const midY = c.top + height / 2;
//               return (
//                 <rect
//                   key={i}
//                   x={c.x - 3.5}
//                   y={c.top}
//                   width={7}
//                   height={height}
//                   rx="1"
//                   fill={color}
//                   opacity={local}
//                   style={{
//                     transform: `scaleY(${local})`,
//                     transformOrigin: `${c.x}px ${midY}px`,
//                   }}
//                 />
//               );
//             })}

//             {/* trend line draws left-to-right with scroll */}
//             <path
//               d={TREND_PATH}
//               fill="none"
//               stroke="var(--text)"
//               strokeOpacity="0.9"
//               strokeWidth="2.5"
//               strokeLinecap="round"
//               pathLength={1}
//               style={{
//                 strokeDasharray: 1,
//                 strokeDashoffset: 1 - progress,
//               }}
//             />
//           </svg>
//         </div>
//       </div>
//     </section>
//   );
// }

// V2

// "use client";

// import { useEffect, useRef, useState } from "react";

// // Deterministic pseudo-random generator (fixed seed) so the candle layout
// // is identical on server and client renders — no hydration mismatch, no
// // Math.random() at render time.
// function mulberry32(seed: number) {
//   return function () {
//     seed |= 0;
//     seed = (seed + 0x6d2b79f5) | 0;
//     let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
//     t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
//     return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
//   };
// }

// const CANDLE_COUNT = 42;
// const rand = mulberry32(1337);

// // Shape an up / down / up wave (like a real price swing) and scatter
// // candles around it, closely mirroring a typical TradingView price reel.
// // Vertical scale bumped ~1.4x over the original so the whole chart reads
// // as a much bigger, more prominent section (viewBox height 300 -> 420).
// function buildCandles() {
//   const candles: { x: number; top: number; bottom: number; color: "up" | "down" }[] = [];
//   const width = 1200;
//   const spacing = width / CANDLE_COUNT;

//   for (let i = 0; i < CANDLE_COUNT; i++) {
//     const t = i / (CANDLE_COUNT - 1);
//     // Base wave: rises, dips hard in the middle third, recovers.
//     const wave =
//       Math.sin(t * Math.PI * 1.15) * 98 -
//       Math.max(0, Math.sin((t - 0.15) * Math.PI * 1.6)) * 77;
//     const base = 266 - wave;
//     const jitter = (rand() - 0.5) * 36;
//     const bodyHeight = 20 + rand() * 31;
//     const top = base + jitter - bodyHeight / 2;
//     const bottom = top + bodyHeight;
//     const color: "up" | "down" = rand() > 0.46 ? "up" : "down";
//     candles.push({ x: 20 + i * spacing, top, bottom, color });
//   }
//   return candles;
// }

// const candles = buildCandles();

// // A smooth trend line loosely tracing the swing above, used for the
// // scroll-drawn white line (same visual idea as the reference clip),
// // scaled to match the taller viewBox.
// const TREND_PATH =
//   "M20,287 C120,245 200,168 300,154 C400,140 460,210 520,322 " +
//   "C580,420 640,448 700,378 C780,287 860,210 940,203 " +
//   "C1020,196 1100,168 1180,133";

// function clamp01(n: number) {
//   return Math.min(1, Math.max(0, n));
// }

// export default function ScrollChart() {
//   const sectionRef = useRef<HTMLDivElement>(null);
//   const [progress, setProgress] = useState(0);

//   useEffect(() => {
//     let frame: number | null = null;

//     const measure = () => {
//       frame = null;
//       const el = sectionRef.current;
//       if (!el) return;
//       const rect = el.getBoundingClientRect();
//       const viewport = window.innerHeight;
//       // Progress 0 when the section is just entering the bottom of the
//       // viewport, progress 1 once it's half scrolled past the top — tuned
//       // so that by the time the section is centered in the viewport the
//       // animation is already well past the halfway point (~0.55-0.6).
//       const start = viewport * 0.9;
//       const end = -rect.height * 0.5;
//       setProgress(clamp01((start - rect.top) / (start - end)));
//     };

//     const onScroll = () => {
//       if (frame === null) frame = requestAnimationFrame(measure);
//     };

//     measure();
//     window.addEventListener("scroll", onScroll, { passive: true });
//     window.addEventListener("resize", onScroll);
//     return () => {
//       window.removeEventListener("scroll", onScroll);
//       window.removeEventListener("resize", onScroll);
//       if (frame !== null) cancelAnimationFrame(frame);
//     };
//   }, []);

//   return (
//     <section ref={sectionRef} className="relative py-24 sm:py-32 overflow-hidden grid-fade">
//       <div className="max-w-7xl mx-auto px-5 sm:px-8">
//         <div className="text-center mb-10">
//           <div className="font-mono text-xs text-violet-bright mb-3">LIVE ON EVERY CHART</div>
//           <h2 className="font-display text-2xl sm:text-3xl text-text max-w-lg mx-auto">
//             Built for real price action, not just demos.
//           </h2>
//         </div>

//         <div className="relative">
//           {/* ambient color bleeding in behind the glass */}
//           <div
//             className="pointer-events-none absolute -inset-10 -z-10 blur-3xl opacity-40"
//             style={{
//               background:
//                 "radial-gradient(circle at 25% 20%, var(--violet), transparent 55%), radial-gradient(circle at 75% 80%, var(--green), transparent 55%)",
//             }}
//             aria-hidden="true"
//           />

//           {/* glass panel */}
//           <div className="relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[0_20px_70px_-20px_rgba(0,0,0,0.5)] p-4 sm:p-8 lg:p-10 overflow-hidden">
//             <div
//               className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
//               aria-hidden="true"
//             />

//             <svg
//               viewBox="0 0 1200 420"
//               className="w-full h-[280px] sm:h-[360px] lg:h-[440px]"
//               aria-hidden="true"
//             >
//               {/* baseline grid */}
//               {[70, 140, 210, 280, 350].map((y) => (
//                 <line key={y} x1="0" y1={y} x2="1200" y2={y} stroke="var(--border)" strokeWidth="1" />
//               ))}

//               {/* candles reveal progressively as you scroll */}
//               {candles.map((c, i) => {
//                 const threshold = i / candles.length;
//                 const local = clamp01((progress - threshold) * candles.length * 1.4);
//                 if (local <= 0) return null;
//                 const color = c.color === "up" ? "var(--green)" : "var(--red)";
//                 const height = Math.max(2, c.bottom - c.top);
//                 const midY = c.top + height / 2;
//                 return (
//                   <rect
//                     key={i}
//                     x={c.x - 3.5}
//                     y={c.top}
//                     width={7}
//                     height={height}
//                     rx="1"
//                     fill={color}
//                     opacity={local}
//                     style={{
//                       transform: `scaleY(${local})`,
//                       transformOrigin: `${c.x}px ${midY}px`,
//                     }}
//                   />
//                 );
//               })}

//               {/* trend line draws left-to-right with scroll */}
//               <path
//                 d={TREND_PATH}
//                 fill="none"
//                 stroke="var(--text)"
//                 strokeOpacity="0.9"
//                 strokeWidth="3"
//                 strokeLinecap="round"
//                 pathLength={1}
//                 style={{
//                   strokeDasharray: 1,
//                   strokeDashoffset: 1 - progress,
//                 }}
//               />
//             </svg>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// V3

// "use client";

// import { useEffect, useRef, useState } from "react";

// // Deterministic pseudo-random generator (fixed seed) so the candle layout
// // is identical on server and client renders — no hydration mismatch, no
// // Math.random() at render time.
// function mulberry32(seed: number) {
//   return function () {
//     seed |= 0;
//     seed = (seed + 0x6d2b79f5) | 0;
//     let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
//     t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
//     return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
//   };
// }

// const CANDLE_COUNT = 42;
// const rand = mulberry32(1337);

// // Shape an up / down / up wave (like a real price swing) and scatter
// // candles around it, closely mirroring a typical TradingView price reel.
// // Vertical scale bumped ~1.4x over the original so the whole chart reads
// // as a much bigger, more prominent section (viewBox height 300 -> 420).
// function buildCandles() {
//   const candles: { x: number; top: number; bottom: number; color: "up" | "down" }[] = [];
//   const width = 1200;
//   const spacing = width / CANDLE_COUNT;

//   for (let i = 0; i < CANDLE_COUNT; i++) {
//     const t = i / (CANDLE_COUNT - 1);
//     // Base wave: rises, dips hard in the middle third, recovers.
//     const wave =
//       Math.sin(t * Math.PI * 1.15) * 98 -
//       Math.max(0, Math.sin((t - 0.15) * Math.PI * 1.6)) * 77;
//     const base = 266 - wave;
//     const jitter = (rand() - 0.5) * 36;
//     const bodyHeight = 20 + rand() * 31;
//     const top = base + jitter - bodyHeight / 2;
//     const bottom = top + bodyHeight;
//     const color: "up" | "down" = rand() > 0.46 ? "up" : "down";
//     candles.push({ x: 20 + i * spacing, top, bottom, color });
//   }
//   return candles;
// }

// const candles = buildCandles();

// // A smooth trend line loosely tracing the swing above, used for the
// // scroll-drawn white line (same visual idea as the reference clip),
// // scaled to match the taller viewBox.
// const TREND_PATH =
//   "M20,287 C120,245 200,168 300,154 C400,140 460,210 520,322 " +
//   "C580,420 640,448 700,378 C780,287 860,210 940,203 " +
//   "C1020,196 1100,168 1180,133";

// function clamp01(n: number) {
//   return Math.min(1, Math.max(0, n));
// }

// export default function ScrollChart() {
//   const sectionRef = useRef<HTMLDivElement>(null);
//   const [progress, setProgress] = useState(0);

//   useEffect(() => {
//     let frame: number | null = null;

//     const measure = () => {
//       frame = null;
//       const el = sectionRef.current;
//       if (!el) return;
//       const rect = el.getBoundingClientRect();
//       const viewport = window.innerHeight;
//       // Progress 0 when the section is just entering the bottom of the
//       // viewport, progress 1 exactly when the section is centered in the
//       // viewport — so the whole animation is finished by the time it's
//       // squarely in view.
//       const start = viewport * 0.9;
//       // Progress hits 1.0 exactly when the section's own center lines up
//       // with the center of the viewport (rect.top + height/2 == viewport/2).
//       const end = viewport / 2 - rect.height / 2;
//       setProgress(clamp01((start - rect.top) / (start - end)));
//     };

//     const onScroll = () => {
//       if (frame === null) frame = requestAnimationFrame(measure);
//     };

//     measure();
//     window.addEventListener("scroll", onScroll, { passive: true });
//     window.addEventListener("resize", onScroll);
//     return () => {
//       window.removeEventListener("scroll", onScroll);
//       window.removeEventListener("resize", onScroll);
//       if (frame !== null) cancelAnimationFrame(frame);
//     };
//   }, []);

//   return (
//     <section ref={sectionRef} className="relative py-24 sm:py-32 overflow-hidden grid-fade">
//       <div className="max-w-7xl mx-auto px-5 sm:px-8">
//         <div className="text-center mb-10">
//           <div className="font-mono text-xs text-violet-bright mb-3">LIVE ON EVERY CHART</div>
//           <h2 className="font-display text-2xl sm:text-3xl text-text max-w-lg mx-auto">
//             Built for real price action, not just demos.
//           </h2>
//         </div>

//         <div className="relative">
//           {/* ambient color bleeding in behind the glass */}
//           <div
//             className="pointer-events-none absolute -inset-10 -z-10 blur-3xl opacity-40"
//             style={{
//               background:
//                 "radial-gradient(circle at 25% 20%, var(--violet), transparent 55%), radial-gradient(circle at 75% 80%, var(--green), transparent 55%)",
//             }}
//             aria-hidden="true"
//           />

//           {/* glass panel */}
//           <div className="relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[0_20px_70px_-20px_rgba(0,0,0,0.5)] p-4 sm:p-8 lg:p-10 overflow-hidden">
//             <div
//               className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
//               aria-hidden="true"
//             />

//             <svg
//               viewBox="0 0 1200 420"
//               className="w-full h-[280px] sm:h-[360px] lg:h-[440px]"
//               aria-hidden="true"
//             >
//               {/* baseline grid */}
//               {[70, 140, 210, 280, 350].map((y) => (
//                 <line key={y} x1="0" y1={y} x2="1200" y2={y} stroke="var(--border)" strokeWidth="1" />
//               ))}

//               {/* candles reveal progressively as you scroll */}
//               {candles.map((c, i) => {
//                 const threshold = i / candles.length;
//                 const local = clamp01((progress - threshold) * candles.length * 1.4);
//                 if (local <= 0) return null;
//                 const color = c.color === "up" ? "var(--green)" : "var(--red)";
//                 const height = Math.max(2, c.bottom - c.top);
//                 const midY = c.top + height / 2;
//                 return (
//                   <rect
//                     key={i}
//                     x={c.x - 3.5}
//                     y={c.top}
//                     width={7}
//                     height={height}
//                     rx="1"
//                     fill={color}
//                     opacity={local}
//                     style={{
//                       transform: `scaleY(${local})`,
//                       transformOrigin: `${c.x}px ${midY}px`,
//                     }}
//                   />
//                 );
//               })}

//               {/* trend line draws left-to-right with scroll */}
//               <path
//                 d={TREND_PATH}
//                 fill="none"
//                 stroke="var(--text)"
//                 strokeOpacity="0.9"
//                 strokeWidth="3"
//                 strokeLinecap="round"
//                 pathLength={1}
//                 style={{
//                   strokeDasharray: 1,
//                   strokeDashoffset: 1 - progress,
//                 }}
//               />
//             </svg>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// V4
"use client";

import { useEffect, useRef, useState } from "react";

/* =========================================================
   RANDOM GENERATOR
========================================================= */

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;

    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);

    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CANDLE_COUNT = 42;

const rand = mulberry32(1337);

/* =========================================================
   BUILD CANDLES
========================================================= */

function buildCandles() {
  const candles: {
    x: number;
    top: number;
    bottom: number;
    wickTop: number;
    wickBottom: number;
    color: "up" | "down";
  }[] = [];

  const width = 1200;

  const spacing = width / CANDLE_COUNT;

  for (let i = 0; i < CANDLE_COUNT; i++) {
    const t = i / (CANDLE_COUNT - 1);

    const wave =
      Math.sin(t * Math.PI * 1.15) * 98 -
      Math.max(
        0,
        Math.sin((t - 0.15) * Math.PI * 1.6)
      ) * 77;

    const base = 266 - wave;

    const jitter = (rand() - 0.5) * 36;

    const bodyHeight = 20 + rand() * 31;

    const top = base + jitter - bodyHeight / 2;

    const bottom = top + bodyHeight;

    const wickTop = top - (8 + rand() * 18);

    const wickBottom = bottom + (8 + rand() * 18);

    candles.push({
      x: 20 + i * spacing,
      top,
      bottom,
      wickTop,
      wickBottom,
      color: rand() > 0.46 ? "up" : "down",
    });
  }

  return candles;
}

const candles = buildCandles();

/* =========================================================
   TREND LINE
========================================================= */

const TREND_PATH =
  "M20,287 C120,245 200,168 300,154 C400,140 460,210 520,322 C580,420 640,448 700,378 C780,287 860,210 940,203 C1020,196 1100,168 1180,133";

/* =========================================================
   SIGNALS
========================================================= */

const SIGNALS: {
  index: number;
  type: "BUY" | "SELL";
}[] = [
  { index: 7, type: "BUY" },
  { index: 16, type: "SELL" },
  { index: 24, type: "BUY" },
  { index: 32, type: "SELL" },
  { index: 38, type: "BUY" },
];

/* =========================================================
   HELPERS
========================================================= */

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

/* =========================================================
   COMPONENT
========================================================= */

export default function ScrollChart() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const [progress, setProgress] = useState(0);

  const [parallax, setParallax] = useState(0);

  /* =======================================================
     SCROLL ANIMATION
  ======================================================= */

  useEffect(() => {
    let frame: number | null = null;

    const measure = () => {
      frame = null;

      const section = sectionRef.current;

      if (!section) return;

      const rect = section.getBoundingClientRect();

      const viewportHeight = window.innerHeight;

      const scrollDistance =
        section.offsetHeight - viewportHeight;

      if (scrollDistance <= 0) {
        setProgress(1);
        return;
      }

      const travelled = -rect.top;

      const rawProgress =
        travelled / scrollDistance;

      const nextProgress =
        clamp01(rawProgress);

      setProgress(nextProgress);

      const centerOffset =
        nextProgress - 0.5;

      setParallax(
        Math.max(
          -8,
          Math.min(
            8,
            -centerOffset * 16
          )
        )
      );
    };

    const handleScroll = () => {
      if (frame === null) {
        frame = requestAnimationFrame(
          measure
        );
      }
    };

    measure();

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );

    window.addEventListener(
      "resize",
      handleScroll
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );

      window.removeEventListener(
        "resize",
        handleScroll
      );

      if (frame !== null) {
        cancelAnimationFrame(frame);
      }
    };
  }, []);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section
      ref={sectionRef}
      className="
        relative
        h-[280vh]
        overflow-visible
        sm:h-[300vh]
      "
    >
      {/* =====================================================
          FULL SCREEN STICKY VIEW
      ===================================================== */}

      <div
        className="
          sticky
          top-0
          h-[100svh]
          min-h-[560px]
          w-full
          overflow-hidden
        "
      >
        {/* ===================================================
            BACKGROUND
        =================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            overflow-hidden
          "
          aria-hidden="true"
        >
          {/* Violet glow */}

          <div
            className="
              absolute
              -left-[25vw]
              top-[8%]
              h-[45vw]
              w-[45vw]
              max-h-[650px]
              max-w-[650px]
              rounded-full
              blur-[100px]
              opacity-[0.15]
              sm:blur-[140px]
            "
            style={{
              background:
                "var(--violet)",
            }}
          />

          {/* Green glow */}

          <div
            className="
              absolute
              -right-[20vw]
              bottom-[-5%]
              h-[42vw]
              w-[42vw]
              max-h-[600px]
              max-w-[600px]
              rounded-full
              blur-[100px]
              opacity-[0.11]
              sm:blur-[140px]
            "
            style={{
              background:
                "var(--green)",
            }}
          />

          {/* Center glow */}

          <div
            className="
              absolute
              left-1/2
              top-1/2
              h-[40vh]
              w-[80vw]
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              blur-[100px]
              opacity-[0.045]
              sm:blur-[150px]
            "
            style={{
              background:
                "var(--text)",
            }}
          />

          {/* Grid */}

          <div
            className="
              absolute
              inset-0
              opacity-[0.035]
              sm:opacity-[0.05]
            "
            style={{
              backgroundImage: `
                linear-gradient(
                  var(--text) 1px,
                  transparent 1px
                ),
                linear-gradient(
                  90deg,
                  var(--text) 1px,
                  transparent 1px
                )
              `,
              backgroundSize:
                "55px 55px",
              maskImage:
                "radial-gradient(circle at center, black 0%, transparent 78%)",
              WebkitMaskImage:
                "radial-gradient(circle at center, black 0%, transparent 78%)",
            }}
          />

          {/* Horizon */}

          <div
            className="
              absolute
              left-1/2
              top-[58%]
              h-px
              w-full
              -translate-x-1/2
              opacity-20
              blur-[2px]
            "
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--violet), transparent)",
            }}
          />
        </div>

        {/* ===================================================
            MAIN CONTENT
        =================================================== */}

        <div
          className="
            relative
            z-10
            flex
            h-full
            w-full
            flex-col
            justify-start
            overflow-visible
          "
        >
          {/* =================================================
              HEADING
          ================================================= */}

          <div
            className="
              relative
              z-30
              mx-auto
              w-full
              max-w-6xl
              shrink-0
              px-5
              pt-[100px]
              text-center
              sm:px-8
              sm:pt-[112px]
              lg:pt-[118px]
              xl:pt-[122px]
            "
          >
            <div
              className="
                mb-2
                font-mono
                text-[8px]
                tracking-[0.22em]
                text-violet-bright
                sm:mb-4
                sm:text-xs
                sm:tracking-[0.28em]
              "
            >
              LIVE ON EVERY CHART
            </div>

            <h2
              className="
                mx-auto
                max-w-[950px]
                font-display
                text-[clamp(2rem,5.1vw,4.6rem)]
                leading-[1.03]
                tracking-tight
                text-text
              "
            >
              Built for real price action,
              <br />

              <span className="opacity-45">
                not just demos.
              </span>
            </h2>
          </div>

          {/* =================================================
              CHART AREA
          ================================================= */}

          <div
            className="
              relative
              mt-2
              flex
              min-h-0
              w-full
              flex-1
              items-center
              justify-center
              overflow-visible
              sm:mt-0
              lg:mt-[-15px]
            "
            style={{
              perspective:
                "1400px",
            }}
          >
            {/* Chart glow */}

            <div
              className="
                pointer-events-none
                absolute
                left-1/2
                top-[55%]
                h-[55%]
                w-[100%]
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                blur-[70px]
                opacity-[0.18]
                sm:blur-[110px]
              "
              style={{
                background:
                  "radial-gradient(circle, var(--violet), transparent 65%)",
              }}
            />

            {/* =================================================
                PERSPECTIVE FLOOR
            ================================================= */}

            <div
              className="
                pointer-events-none
                absolute
                bottom-[-8%]
                left-1/2
                h-[30%]
                w-full
                -translate-x-1/2
                rotate-x-[65deg]
                opacity-[0.045]
                sm:opacity-[0.07]
              "
              style={{
                backgroundImage: `
                  linear-gradient(
                    var(--violet) 1px,
                    transparent 1px
                  ),
                  linear-gradient(
                    90deg,
                    var(--violet) 1px,
                    transparent 1px
                  )
                `,
                backgroundSize:
                  "40px 40px",
                maskImage:
                  "linear-gradient(to bottom, black, transparent)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, black, transparent)",
              }}
            />

            {/* =================================================
                RESPONSIVE CHART

                MOBILE:
                190vw

                TABLET:
                145vw

                DESKTOP:
                103vw
            ================================================= */}

            <div
              className="
                relative
                left-1/2
                w-[190vw]
                max-w-none
                -translate-x-1/2
                translate-y-2
                sm:w-[145vw]
                sm:translate-y-0
                md:w-[120vw]
                lg:left-0
                lg:w-[103vw]
                lg:translate-x-0
              "
              style={{
                transform:
                  `translateY(${parallax}px)`,
              }}
            >
              {/* =================================================
                  SVG
              ================================================= */}

              <svg
                viewBox="0 0 1200 420"
                preserveAspectRatio="xMidYMid meet"
                className="
                  block
                  h-auto
                  w-full
                  overflow-visible
                "
                aria-hidden="true"
              >
                {/* =================================================
                    SVG DEFINITIONS
                ================================================= */}

                <defs>
                  {/* Green glow */}

                  <filter
                    id="greenGlow"
                    x="-100%"
                    y="-100%"
                    width="300%"
                    height="300%"
                  >
                    <feGaussianBlur
                      stdDeviation="5"
                      result="blur"
                    />

                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  {/* Red glow */}

                  <filter
                    id="redGlow"
                    x="-100%"
                    y="-100%"
                    width="300%"
                    height="300%"
                  >
                    <feGaussianBlur
                      stdDeviation="6"
                      result="blur"
                    />

                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  {/* Signal glow */}

                  <filter
                    id="signalGlow"
                    x="-100%"
                    y="-100%"
                    width="300%"
                    height="300%"
                  >
                    <feGaussianBlur
                      stdDeviation="4"
                      result="blur"
                    />

                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  {/* Signal shadow */}

                  <filter
                    id="signalShadow"
                    x="-100%"
                    y="-100%"
                    width="300%"
                    height="300%"
                  >
                    <feDropShadow
                      dx="0"
                      dy="5"
                      stdDeviation="5"
                      floodOpacity="0.4"
                    />
                  </filter>

                  {/* BUY gradient */}

                  <linearGradient
                    id="buyGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="var(--green)"
                      stopOpacity="1"
                    />

                    <stop
                      offset="100%"
                      stopColor="var(--green)"
                      stopOpacity="0.45"
                    />
                  </linearGradient>

                  {/* SELL gradient */}

                  <linearGradient
                    id="sellGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="var(--red)"
                      stopOpacity="1"
                    />

                    <stop
                      offset="100%"
                      stopColor="var(--red)"
                      stopOpacity="0.45"
                    />
                  </linearGradient>

                  {/* Trend gradient */}

                  <linearGradient
                    id="trendGradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop
                      offset="0%"
                      stopColor="var(--text)"
                      stopOpacity="0.15"
                    />

                    <stop
                      offset="45%"
                      stopColor="var(--text)"
                      stopOpacity="0.85"
                    />

                    <stop
                      offset="100%"
                      stopColor="var(--violet)"
                      stopOpacity="1"
                    />
                  </linearGradient>
                </defs>

                {/* =================================================
                    HORIZONTAL GRID
                ================================================= */}

                {[70, 140, 210, 280, 350].map(
                  (y) => (
                    <line
                      key={`h-${y}`}
                      x1="0"
                      y1={y}
                      x2="1200"
                      y2={y}
                      stroke="var(--border)"
                      strokeWidth="1"
                      opacity="0.55"
                    />
                  )
                )}

                {/* =================================================
                    VERTICAL GRID
                ================================================= */}

                {[
                  100,
                  250,
                  400,
                  550,
                  700,
                  850,
                  1000,
                  1150,
                ].map((x) => (
                  <line
                    key={`v-${x}`}
                    x1={x}
                    y1="0"
                    x2={x}
                    y2="420"
                    stroke="var(--border)"
                    strokeWidth="1"
                    opacity="0.25"
                  />
                ))}

                {/* =================================================
                    CANDLES
                ================================================= */}

                {candles.map(
                  (candle, index) => {
                    const threshold =
                      index /
                      candles.length;

                    const localProgress =
                      clamp01(
                        (progress -
                          threshold) *
                          3.2
                      );

                    if (
                      localProgress <= 0
                    ) {
                      return null;
                    }

                    const eased =
                      easeOutCubic(
                        localProgress
                      );

                    const color =
                      candle.color ===
                      "up"
                        ? "var(--green)"
                        : "var(--red)";

                    const height =
                      Math.max(
                        2,
                        candle.bottom -
                          candle.top
                      );

                    const middle =
                      candle.top +
                      height / 2;

                    return (
                      <g
                        key={index}
                      >
                        {/* Wick */}

                        <line
                          x1={candle.x}
                          y1={
                            candle.wickTop
                          }
                          x2={candle.x}
                          y2={
                            candle.wickBottom
                          }
                          stroke={color}
                          strokeWidth="2"
                          opacity={
                            eased * 0.7
                          }
                          style={{
                            transform:
                              `scaleY(${eased})`,
                            transformOrigin:
                              `${candle.x}px ${middle}px`,
                          }}
                        />

                        {/* Candle glow */}

                        <rect
                          x={
                            candle.x - 5
                          }
                          y={
                            candle.top
                          }
                          width="10"
                          height={height}
                          rx="2"
                          fill={color}
                          opacity={
                            eased * 0.18
                          }
                          filter={
                            candle.color ===
                            "up"
                              ? "url(#greenGlow)"
                              : "url(#redGlow)"
                          }
                        />

                        {/* Candle body */}

                        <rect
                          x={
                            candle.x - 4
                          }
                          y={
                            candle.top
                          }
                          width="8"
                          height={height}
                          rx="1.5"
                          fill={color}
                          opacity={eased}
                          style={{
                            transform:
                              `scaleY(${eased})`,
                            transformOrigin:
                              `${candle.x}px ${middle}px`,
                          }}
                        />
                      </g>
                    );
                  }
                )}

                {/* =================================================
                    BUY / SELL SIGNALS
                ================================================= */}

                {SIGNALS.map(
                  (
                    signal,
                    signalIndex
                  ) => {
                    const candle =
                      candles[
                        signal.index
                      ];

                    if (!candle)
                      return null;

                    const threshold =
                      signal.index /
                      candles.length;

                    const signalProgress =
                      clamp01(
                        (progress -
                          threshold) *
                          4
                      );

                    if (
                      signalProgress <=
                      0
                    ) {
                      return null;
                    }

                    const easedSignal =
                      easeOutCubic(
                        signalProgress
                      );

                    const isBuy =
                      signal.type ===
                      "BUY";

                    const signalY =
                      isBuy
                        ? Math.min(
                            390,
                            candle.wickBottom +
                              32
                          )
                        : Math.max(
                            30,
                            candle.wickTop -
                              32
                          );

                    const offset =
                      signalIndex %
                        2 ===
                      0
                        ? -2
                        : 2;

                    const y =
                      signalY + offset;

                    const boxWidth =
                      76;

                    const boxHeight =
                      31;

                    const boxX =
                      candle.x -
                      boxWidth / 2;

                    const translateY =
                      isBuy
                        ? (1 -
                            easedSignal) *
                          14
                        : -(
                            (1 -
                              easedSignal) *
                            14
                          );

                    return (
                      <g
                        key={`${signal.type}-${signal.index}`}
                        style={{
                          opacity:
                            easedSignal,

                          transform: `
                            translateY(${translateY}px)
                            scale(${0.82 + easedSignal * 0.18})
                          `,

                          transformOrigin:
                            `${candle.x}px ${y}px`,
                        }}
                      >
                        {/* Connector */}

                        <line
                          x1={candle.x}
                          y1={
                            isBuy
                              ? candle.wickBottom
                              : candle.wickTop
                          }
                          x2={candle.x}
                          y2={
                            isBuy
                              ? y -
                                boxHeight /
                                  2
                              : y +
                                boxHeight /
                                  2
                          }
                          stroke={
                            isBuy
                              ? "var(--green)"
                              : "var(--red)"
                          }
                          strokeWidth="1"
                          strokeDasharray="3 4"
                          opacity="0.65"
                        />

                        {/* Signal glow */}

                        <rect
                          x={
                            boxX - 4
                          }
                          y={
                            y -
                            boxHeight /
                              2 -
                            4
                          }
                          width={
                            boxWidth + 8
                          }
                          height={
                            boxHeight + 8
                          }
                          rx="9"
                          fill={
                            isBuy
                              ? "var(--green)"
                              : "var(--red)"
                          }
                          opacity="0.12"
                          filter="url(#signalGlow)"
                        />

                        {/* Signal box */}

                        <rect
                          x={boxX}
                          y={
                            y -
                            boxHeight /
                              2
                          }
                          width={
                            boxWidth
                          }
                          height={
                            boxHeight
                          }
                          rx="7"
                          fill={
                            isBuy
                              ? "url(#buyGradient)"
                              : "url(#sellGradient)"
                          }
                          fillOpacity="0.9"
                          stroke={
                            isBuy
                              ? "var(--green)"
                              : "var(--red)"
                          }
                          strokeOpacity="0.7"
                          strokeWidth="1"
                          filter="url(#signalShadow)"
                        />

                        {/* Highlight */}

                        <rect
                          x={
                            boxX + 1
                          }
                          y={
                            y -
                            boxHeight /
                              2 +
                            1
                          }
                          width={
                            boxWidth - 2
                          }
                          height="9"
                          rx="6"
                          fill="white"
                          opacity="0.08"
                        />

                        {/* BUY arrow */}

                        {isBuy ? (
                          <path
                            d={`
                              M ${candle.x - 24} ${y + 5}
                              L ${candle.x - 18} ${y - 3}
                              L ${candle.x - 12} ${y + 5}
                            `}
                            fill="none"
                            stroke="white"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            opacity="0.9"
                          />
                        ) : (
                          <path
                            d={`
                              M ${candle.x - 24} ${y - 5}
                              L ${candle.x - 18} ${y + 3}
                              L ${candle.x - 12} ${y - 5}
                            `}
                            fill="none"
                            stroke="white"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            opacity="0.9"
                          />
                        )}

                        {/* Text */}

                        <text
                          x={
                            candle.x + 7
                          }
                          y={y + 4}
                          textAnchor="middle"
                          fill="white"
                          fontSize="11"
                          fontWeight="700"
                          fontFamily="monospace"
                          letterSpacing="1"
                        >
                          {signal.type}
                        </text>

                        {/* Status dot */}

                        <circle
                          cx={
                            boxX +
                            boxWidth -
                            9
                          }
                          cy={
                            y -
                            boxHeight /
                              2 +
                            9
                          }
                          r="2"
                          fill="white"
                          opacity="0.8"
                          style={{
                            filter:
                              "drop-shadow(0 0 4px white)",
                          }}
                        />
                      </g>
                    );
                  }
                )}

                {/* =================================================
                    TREND GLOW
                ================================================= */}

                <path
                  d={TREND_PATH}
                  fill="none"
                  stroke="var(--violet)"
                  strokeOpacity="0.22"
                  strokeWidth="12"
                  strokeLinecap="round"
                  pathLength={1}
                  style={{
                    strokeDasharray: 1,
                    strokeDashoffset:
                      1 - progress,
                    filter:
                      "blur(7px)",
                  }}
                />

                {/* =================================================
                    MAIN TREND
                ================================================= */}

                <path
                  d={TREND_PATH}
                  fill="none"
                  stroke="url(#trendGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  pathLength={1}
                  style={{
                    strokeDasharray: 1,
                    strokeDashoffset:
                      1 - progress,
                  }}
                />

                {/* =================================================
                    CURRENT PRICE POINT
                ================================================= */}

                <circle
                  cx="1180"
                  cy="133"
                  r="5"
                  fill="var(--violet)"
                  opacity={progress}
                  style={{
                    filter:
                      "drop-shadow(0 0 10px var(--violet))",
                  }}
                />

                <circle
                  cx="1180"
                  cy="133"
                  r="11"
                  fill="none"
                  stroke="var(--violet)"
                  strokeWidth="1"
                  opacity={
                    progress * 0.35
                  }
                />
              </svg>

              {/* =================================================
                  PRICE LABEL
              ================================================= */}

              <div
                className="
                  pointer-events-none
                  absolute
                  right-[3vw]
                  top-[31%]
                  rounded-md
                  border
                  border-white/10
                  bg-black/10
                  px-1.5
                  py-1
                  font-mono
                  text-[7px]
                  text-white/35
                  backdrop-blur-md
                  sm:right-[4vw]
                  sm:px-3
                  sm:py-2
                  sm:text-[9px]
                "
              >
                +24.82%
              </div>
            </div>
          </div>

          {/* =================================================
              TIME AXIS
          ================================================= */}

          <div
            className="
              pointer-events-none
              relative
              z-20
              mx-auto
              mb-4
              flex
              w-[92vw]
              max-w-[1400px]
              shrink-0
              items-center
              justify-between
              px-2
              font-mono
              text-[7px]
              tracking-wider
              text-white/20
              sm:mb-7
              sm:text-[9px]
            "
          >
            <span>09:30</span>

            <span>12:00</span>

            <span>14:30</span>

            <span>16:00</span>
          </div>
        </div>

        {/* =====================================================
            DECORATIVE LIGHTS
        ===================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            left-[2vw]
            top-[27%]
            h-2
            w-2
            rounded-full
            opacity-60
            blur-[1px]
            sm:h-3
            sm:w-3
          "
          style={{
            background:
              "var(--violet)",

            boxShadow:
              "0 0 20px 6px var(--violet)",
          }}
        />

        <div
          className="
            pointer-events-none
            absolute
            right-[2vw]
            top-[58%]
            h-1.5
            w-1.5
            rounded-full
            opacity-60
            sm:h-2
            sm:w-2
          "
          style={{
            background:
              "var(--green)",

            boxShadow:
              "0 0 20px 6px var(--green)",
          }}
        />

        {/* =====================================================
            BOTTOM FADE
        ===================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            bottom-0
            h-20
            bg-gradient-to-t
            from-black/20
            to-transparent
            sm:h-32
          "
        />
      </div>
    </section>
  );
}

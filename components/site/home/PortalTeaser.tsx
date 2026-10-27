"use client";

// "Know where things stand" — a live-feeling preview of the client portal.

import Link from "next/link";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useEffect, useRef, useState } from "react";
import { StageTracker } from "@/components/app/StageTracker";
import { EXPO, Lines, Reveal } from "@/components/motion/primitives";
import { Arrow, Label } from "@/components/ui/bits";
import { serviceTypes } from "@/data/service-types";

const audit = serviceTypes["external-audit"];

const events = [
  { at: 4, text: "Fieldwork complete — 3 queries raised" },
  { at: 5, text: "Your draft audit report is ready for review" },
  { at: 6, text: "Representation letter sent for signature" },
];

export function PortalTeaser() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px 0px -20% 0px" });
  const reduce = useReducedMotion();
  const [stage, setStage] = useState(4);

  // Gently advance the demo card while it's on screen.
  useEffect(() => {
    if (!inView || reduce) return;
    const id = setInterval(() => setStage((s) => (s >= 6 ? 4 : s + 1)), 3200);
    return () => clearInterval(id);
  }, [inView, reduce]);

  const event = events.find((e) => e.at === stage)!;

  return (
    <section aria-labelledby="portal-title" className="on-ink overflow-hidden bg-ink py-24 text-paper md:py-36">
      <div className="frame grid-12 items-center gap-y-14">
        <div className="col-span-6 lg:col-span-5">
          <Label className="text-mist">The FinApt client portal</Label>
          <Lines as="h2" className="t-h1 mt-5">
            <span id="portal-title">Know where</span>
            <span>
              things <span className="t-serif text-blue-tint">stand.</span>
            </span>
          </Lines>
          <Reveal delay={0.2}>
            <p className="t-lead mt-8 max-w-[30rem] text-mist-2">
              Every engagement gets a live tracker, a named partner, a document centre and a message thread. No more “just checking in” emails — and no surprises at the end.
            </p>
            <ul className="mt-8 grid gap-3 text-[0.95rem] text-mist-2 sm:grid-cols-2">
              {["Stage-by-stage progress", "Documents requested & delivered", "VAT, CT & licence calendar", "Messages with your accountant"].map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-blue-tint" /> {f}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/login" className="btn btn-paper">
                Try the portal <Arrow />
              </Link>
              <Link href="/start" className="btn btn-line">
                Start with FinApt
              </Link>
            </div>
          </Reveal>
        </div>

        <div ref={ref} className="col-span-6 lg:col-span-6 lg:col-start-7">
          <Reveal y={60}>
            <div className="relative rounded-[14px] border border-ink-line bg-ink-2 p-5 shadow-2xl md:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="t-label text-mist">[ External audit · FY2025 ]</p>
                  <p className="mt-2 text-2xl font-medium tracking-[-0.02em]">Gulfstone Logistics LLC</p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-ink-3 px-3 py-1.5 text-xs">
                  <span className="h-2 w-2 rounded-full bg-signal" aria-hidden /> Live
                </span>
              </div>
              <div className="mt-8">
                <StageTracker stages={audit.stages} current={stage} tone="ink" showLabels />
              </div>
              <div className="mt-8 flex items-center justify-between border-t border-ink-line pt-5 text-sm">
                <span className="text-mist">
                  Stage {stage + 1} of {audit.stages.length} · {audit.stages[stage].label}
                </span>
                <span className="t-num text-blue-tint">{Math.round((stage / audit.stages.length) * 100)}%</span>
              </div>

              <div className="pointer-events-none absolute -bottom-6 end-4 start-4 md:-bottom-8 md:end-8 md:start-auto md:w-[22rem]" aria-live="polite">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={event.text}
                    initial={{ opacity: 0, y: reduce ? 0 : 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: reduce ? 0 : -8 }}
                    transition={{ duration: 0.6, ease: EXPO }}
                    className="flex items-start gap-3 rounded-xl bg-paper p-4 text-ink shadow-xl"
                  >
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-signal" aria-hidden />
                    <span>
                      <span className="block text-sm font-medium">{event.text}</span>
                      <span className="block text-xs text-muted">Abdulla Alhashmi · just now</span>
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

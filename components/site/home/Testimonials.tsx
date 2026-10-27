"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useState } from "react";
import { EXPO } from "@/components/motion/primitives";
import { Arrow, Label } from "@/components/ui/bits";
import { testimonials } from "@/data/site";

export function Testimonials() {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  const t = testimonials[i];
  const go = (d: number) => setI((v) => (v + d + testimonials.length) % testimonials.length);

  return (
    <section aria-labelledby="testimonials-title" className="bg-paper py-24 md:py-36">
      <div className="frame grid-12 gap-y-10">
        <div className="col-span-6 lg:col-span-3">
          <Label className="text-muted">Client words</Label>
          <h2 id="testimonials-title" className="sr-only">What our clients say</h2>
          <p className="t-num mt-6 text-sm text-muted" aria-live="polite">
            {String(i + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
          </p>
          <div className="mt-6 flex gap-2">
            <button type="button" onClick={() => go(-1)} className="btn btn-line btn-sm !w-11 !px-0" aria-label="Previous testimonial">
              <Arrow className="h-4 w-4 rotate-180" />
            </button>
            <button type="button" onClick={() => go(1)} className="btn btn-line btn-sm !w-11 !px-0" aria-label="Next testimonial">
              <Arrow />
            </button>
          </div>
        </div>
        <div className="col-span-6 min-h-[22rem] lg:col-span-9">
          <AnimatePresence mode="wait">
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: reduce ? 0 : 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduce ? 0 : -12 }}
              transition={{ duration: 0.8, ease: EXPO }}
            >
              <blockquote className="text-[clamp(1.4rem,1rem+1.5vw,2.4rem)] leading-[1.25] tracking-[-0.02em]">
                <span className="t-serif text-blue">“</span>
                {t.quote}
                <span className="t-serif text-blue">”</span>
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4">
                <span aria-hidden className="h-px w-10 bg-ink" />
                <span>
                  <span className="block font-medium">{t.name}</span>
                  <span className="block text-sm text-muted">{t.title}</span>
                </span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

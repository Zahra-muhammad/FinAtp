"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useRef } from "react";
import { Counter, EXPO, Lines, Magnetic } from "@/components/motion/primitives";
import { Arrow } from "@/components/ui/bits";
import { Photo } from "@/components/visual/Photo";
import { photos } from "@/data/images";
import { site } from "@/data/site";

export function HomeHero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "14%"]);

  return (
    <section ref={ref} className="on-ink relative overflow-hidden bg-ink text-paper">
      <div className="frame grid-12 min-h-[92svh] gap-y-10 pb-12 pt-28 md:pt-32 lg:items-end">
        {/* Copy */}
        <motion.div className="order-2 col-span-6 lg:order-1 lg:col-span-8" style={{ y: textY }}>
          <motion.p className="t-label text-mist" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.1 }}>
            [ Chartered accountants · Corporate services · Advisory — Dubai, est. {site.founded} ]
          </motion.p>
          <Lines as="h1" trigger="mount" delay={0.25} className="t-display mt-6">
            <span>Numbers you</span>
            <span>
              can <span className="t-serif text-blue-tint">stand behind.</span>
            </span>
          </Lines>
          <motion.div
            className="mt-10 flex flex-col gap-8"
            initial={{ opacity: 0, y: reduce ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EXPO, delay: 0.8 }}
          >
            <p className="t-lead max-w-[34rem] text-mist-2">
              Partner-led audit, tax, accounting and corporate services for UAE businesses — and a client portal that shows exactly where every engagement stands.
            </p>
            <div className="flex flex-wrap gap-3">
              <Magnetic>
                <Link href="/start" className="btn btn-paper">
                  Start with FinApt <Arrow />
                </Link>
              </Magnetic>
              <Link href="/services" className="btn btn-line">
                Explore services
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Photo */}
        <motion.div
          className="order-1 col-span-6 h-[38svh] lg:order-2 lg:col-span-4 lg:h-[68svh] lg:self-stretch"
          // Starts partly open so the photo paints from the server HTML (fast LCP).
          initial={{ clipPath: reduce ? "inset(0 0 0 0)" : "inset(18% 0 0 0)" }}
          animate={{ clipPath: "inset(0 0 0 0)" }}
          transition={{ duration: 1.6, ease: EXPO, delay: 0.2 }}
        >
          <Photo photo={photos.nightTowers} className="h-full w-full rounded-md" priority parallax={8} sizes="(min-width: 1024px) 34vw, 100vw" />
        </motion.div>
      </div>

      <div className="frame">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-8 border-t border-ink-line py-8 md:grid-cols-4 md:py-10">
          {site.stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse gap-2">
              <dt className="t-label text-mist">{s.label}</dt>
              <dd className="text-4xl font-medium tracking-[-0.03em] md:text-5xl">
                <Counter value={s.value} suffix={s.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

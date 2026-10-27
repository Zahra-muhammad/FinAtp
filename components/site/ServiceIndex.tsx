"use client";

// Editorial index of practices. On desktop a duotone photo follows the
// pointer while hovering a row; touch devices just get the list.

import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useState } from "react";
import { EXPO, Reveal } from "@/components/motion/primitives";
import { Arrow } from "@/components/ui/bits";
import { Photo } from "@/components/visual/Photo";
import { categories } from "@/data/services";

export function ServiceIndex() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 26 });
  const sy = useSpring(y, { stiffness: 220, damping: 26 });

  return (
    <div
      className="relative"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        x.set(e.clientX + 24);
        y.set(e.clientY - 140);
      }}
      onPointerLeave={() => setActive(null)}
    >
      <ol className="border-t border-line">
        {categories.map((c, i) => (
          <Reveal key={c.slug} as="li" delay={i * 0.05} className="border-b border-line">
            <Link
              href={`/services/${c.slug}`}
              onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
              onFocus={() => setActive(null)}
              className="group grid grid-cols-[3rem_1fr_auto] items-center gap-4 py-7 md:grid-cols-[6rem_1fr_16rem_auto] md:py-10"
            >
              <span className="t-num text-sm text-muted">{c.number}</span>
              <span className="text-[clamp(1.8rem,1.2rem+2.6vw,4rem)] font-medium leading-none tracking-[-0.04em] transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-x-3">
                {c.name}
              </span>
              <span className="hidden text-[0.95rem] text-muted-2 md:block">{c.short}</span>
              <span className="grid h-11 w-11 place-items-center rounded-full border border-line transition-colors duration-500 group-hover:border-ink group-hover:bg-ink group-hover:text-paper">
                <Arrow />
              </span>
            </Link>
          </Reveal>
        ))}
      </ol>

      {!reduce ? (
        <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-30 hidden h-[280px] w-[220px] lg:block" style={{ x: sx, y: sy }}>
          <AnimatePresence>
            {active !== null ? (
              <motion.div
                key={active}
                className="absolute inset-0 overflow-hidden rounded-md"
                initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, ease: EXPO }}
              >
                <Photo photo={categories[active].photo} className="h-full w-full" sizes="220px" />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      ) : null}
    </div>
  );
}

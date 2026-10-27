"use client";

// Service panels that stack on top of each other as you scroll
// (CSS sticky — works with Lenis and without JS). Earlier panels shrink
// slightly as the next one covers them.

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useRef } from "react";
import { Lines } from "@/components/motion/primitives";
import { Arrow, Label } from "@/components/ui/bits";
import { Photo } from "@/components/visual/Photo";
import { categories, type ServiceCategory } from "@/data/services";

export function ServicesStack() {
  return (
    <section aria-labelledby="services-title" className="bg-paper pb-24 pt-24 md:pt-36">
      <div className="frame grid-12 mb-14 gap-y-6 md:mb-20">
        <div className="col-span-6 lg:col-span-7">
          <Label className="text-muted">{`What we do — 0${categories.length} practices`}</Label>
          <Lines as="h2" className="t-h1 mt-5">
            <span id="services-title">One firm for the</span>
            <span>
              whole <span className="t-serif text-blue">financial picture.</span>
            </span>
          </Lines>
        </div>
        <p className="t-lead col-span-6 self-end text-muted-2 lg:col-span-4 lg:col-start-9">
          Seven practices, one partner group. Start with one service and add the next when you need it — your portal grows with you.
        </p>
      </div>

      <div className="frame">
        <ol className="relative">
          {categories.map((c, i) => (
            <StackCard key={c.slug} category={c} index={i} total={categories.length} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function StackCard({ category: c, index, total }: { category: ServiceCategory; index: number; total: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduce || index === total - 1 ? 1 : 0.92]);
  const dark = index % 2 === 0;

  return (
    <li ref={ref} className="sticky mb-6 md:mb-10" style={{ top: `calc(88px + ${index * 12}px)` }}>
      <motion.article
        style={{ scale, transformOrigin: "top center" }}
        className={`grid min-h-[min(78svh,720px)] overflow-hidden rounded-[14px] md:grid-cols-12 ${
          dark ? "on-ink bg-ink text-paper" : "border border-line bg-white text-ink"
        }`}
      >
        <div className="flex flex-col p-6 md:col-span-7 md:p-10 lg:p-14">
          <div className="flex items-baseline justify-between">
            <span className={`t-num text-sm ${dark ? "text-mist" : "text-muted"}`}>
              {c.number} / 0{total}
            </span>
            <span className={`t-label ${dark ? "text-mist" : "text-muted"}`}>{c.subServices.length} services</span>
          </div>
          <h3 className="t-h2 mt-8 max-w-[12ch] md:mt-auto">{c.name}</h3>
          <p className={`t-lead mt-5 max-w-[36rem] ${dark ? "text-mist-2" : "text-muted-2"}`}>{c.short}</p>
          <ul className={`mt-8 flex flex-wrap gap-2 text-sm ${dark ? "text-mist-2" : "text-muted-2"}`}>
            {c.subServices.slice(0, 6).map((s) => (
              <li key={s.name} className={`rounded-full border px-3 py-1.5 ${dark ? "border-ink-line" : "border-line"}`}>
                {s.name}
              </li>
            ))}
          </ul>
          <Link href={`/services/${c.slug}`} className={`group mt-10 inline-flex items-center gap-3 self-start text-base font-medium`}>
            <span className="link-draw">Explore {c.name}</span>
            <Arrow className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="relative hidden md:col-span-5 md:block">
          <Photo photo={c.photo} className="absolute inset-0" sizes="40vw" parallax={6} />
        </div>
      </motion.article>
    </li>
  );
}

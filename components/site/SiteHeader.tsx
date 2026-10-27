"use client";

// Site navigation, mirroring the original finaptgroup.com menu:
// Home · About Us (team) · Services (all 7 groups and every sub-service) ·
// News · Contact Us. Desktop uses dropdown panels; mobile a full-screen menu
// with expandable sections.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useEffect, useRef, useState } from "react";
import { EXPO, Magnetic } from "@/components/motion/primitives";
import { Arrow, Logo, Portrait } from "@/components/ui/bits";
import { categories, subHref, totalSubServices } from "@/data/services";
import { site } from "@/data/site";
import { team } from "@/data/team";

type Panel = "about" | "services" | null;

// Pages whose hero is ink; the header starts light-on-dark there.
const darkHeroes = ["/", "/about"];

export function SiteHeader() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false); // mobile menu
  const [panel, setPanel] = useState<Panel>(null); // desktop dropdown
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(!open && !panel && y > 400 && y > prev + 4);
    if (y < prev - 4) setHidden(false);
  });

  useEffect(() => {
    setOpen(false);
    setPanel(null);
  }, [pathname]);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);
  useEffect(() => {
    if (!panel) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPanel(null);
    };
    const onDown = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setPanel(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [panel]);

  const openPanel = (p: Panel) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setPanel(p);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setPanel(null), 180);
  };

  // A dropdown always shows on the light header for legibility.
  const dark = ((darkHeroes.includes(pathname) && !scrolled) || open) && !panel;
  const solid = (scrolled && !open) || !!panel;
  const isCurrent = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const linkCls = (active: boolean) => `link-draw py-1 ${active ? "bg-[length:100%_1px]" : ""}`;

  return (
    <>
      <motion.header
        ref={headerRef}
        initial={false}
        animate={{ y: hidden && !reduce ? "-100%" : "0%" }}
        transition={{ duration: 0.6, ease: EXPO }}
        onPointerLeave={(e) => e.pointerType === "mouse" && scheduleClose()}
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${dark ? "on-ink text-paper" : "text-ink"} ${
          solid ? "border-b border-line/70 bg-paper/95 backdrop-blur-md" : ""
        }`}
      >
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:rounded focus:bg-paper focus:px-3 focus:py-2 focus:text-ink">
          Skip to content
        </a>
        <div className="frame flex h-[72px] items-center justify-between gap-6">
          {/* Both logo versions are rendered and cross-faded with the header colour. */}
          <Link href="/" aria-label="FinApt Group — home" className="relative block h-9 w-[138px] shrink-0 md:h-10 md:w-[153px]">
            <Logo tone="white" className={`absolute inset-0 h-full w-auto transition-opacity duration-500 ${dark ? "opacity-100" : "opacity-0"}`} />
            <Logo tone="blue" className={`absolute inset-0 h-full w-auto transition-opacity duration-500 ${dark ? "opacity-0" : "opacity-100"}`} />
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-8 text-[0.95rem] lg:flex">
            <Link href="/" aria-current={isCurrent("/") ? "page" : undefined} className={linkCls(isCurrent("/"))} onPointerEnter={scheduleClose}>
              Home
            </Link>
            <PanelTrigger label="About Us" id="about" panel={panel} active={pathname.startsWith("/about")} onOpen={openPanel} onToggle={() => setPanel(panel === "about" ? null : "about")} />
            <PanelTrigger label="Services" id="services" panel={panel} active={pathname.startsWith("/services")} onOpen={openPanel} onToggle={() => setPanel(panel === "services" ? null : "services")} />
            <Link href="/insights" aria-current={isCurrent("/insights") ? "page" : undefined} className={linkCls(isCurrent("/insights"))} onPointerEnter={scheduleClose}>
              News
            </Link>
            <Link href="/contact" aria-current={isCurrent("/contact") ? "page" : undefined} className={linkCls(isCurrent("/contact"))} onPointerEnter={scheduleClose}>
              Contact Us
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden px-2 text-[0.95rem] link-draw sm:inline">
              Client login
            </Link>
            <Magnetic className="hidden sm:inline-block">
              <Link href="/start" className={`btn btn-sm ${dark ? "btn-paper" : "btn-ink"}`}>
                Start with FinApt
              </Link>
            </Magnetic>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="relative grid h-11 w-11 place-items-center rounded-full border border-current/25 lg:hidden"
            >
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
              <span aria-hidden className={`absolute h-px w-5 bg-current transition-transform duration-500 ${open ? "rotate-45" : "-translate-y-[4px]"}`} />
              <span aria-hidden className={`absolute h-px w-5 bg-current transition-transform duration-500 ${open ? "-rotate-45" : "translate-y-[4px]"}`} />
            </button>
          </div>
        </div>

        {/* Desktop dropdown panels */}
        <AnimatePresence>
          {panel ? (
            <motion.div
              key={panel}
              id={`panel-${panel}`}
              className="absolute inset-x-0 top-full hidden max-h-[calc(100dvh-72px)] overflow-y-auto border-b border-line bg-paper text-ink shadow-[0_30px_60px_-30px_rgba(12,15,20,0.35)] lg:block"
              initial={{ opacity: 0, y: reduce ? 0 : -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduce ? 0 : -6 }}
              transition={{ duration: 0.35, ease: EXPO }}
              onPointerEnter={() => openPanel(panel)}
            >
              {panel === "services" ? <ServicesPanel /> : <AboutPanel />}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            className="on-ink fixed inset-0 z-40 flex flex-col overflow-y-auto bg-ink px-[var(--margin)] pb-10 pt-28 text-paper lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: reduce ? 0.01 : 0.8, ease: EXPO }}
          >
            <nav aria-label="Mobile">
              <ul className="divide-y divide-ink-line border-y border-ink-line">
                <MobileItem i={0}>
                  <Link href="/" className="block py-4 text-4xl font-medium tracking-[-0.04em]">Home</Link>
                </MobileItem>
                <MobileItem i={1}>
                  <MobileGroup title="About Us">
                    <ul className="space-y-1 pb-5">
                      <li><Link href="/about" className="block py-2 text-lg">About FinApt</Link></li>
                      {team.map((m) => (
                        <li key={m.id} className="flex items-center justify-between gap-3">
                          <Link href={`/about#${m.id}`} className="block py-2 text-mist-2">
                            {m.name} <span className="text-sm text-mist">· {m.role}</span>
                          </Link>
                          {m.linkedin ? (
                            <a href={m.linkedin} target="_blank" rel="noopener" className="t-label shrink-0 text-blue-tint" aria-label={`${m.name} on LinkedIn`}>in</a>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </MobileGroup>
                </MobileItem>
                <MobileItem i={2}>
                  <MobileGroup title="Services">
                    <div className="pb-5">
                      <Link href="/services" className="block py-2 text-lg">All services</Link>
                      {categories.map((c) => (
                        <details key={c.slug} className="group/cat border-t border-ink-line">
                          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-3 [&::-webkit-details-marker]:hidden">
                            <span className="flex gap-3">
                              <span className="t-num pt-0.5 text-sm text-mist">{c.number}</span>
                              <span className="text-lg">{c.menuName}</span>
                            </span>
                            <span aria-hidden className="text-xl text-mist transition-transform duration-300 group-open/cat:rotate-45">+</span>
                          </summary>
                          <ul className="space-y-0.5 pb-3 ps-8">
                            <li><Link href={`/services/${c.slug}`} className="block py-1.5 text-mist-2">Overview</Link></li>
                            {c.subServices.map((s) => (
                              <li key={s.slug}>
                                <Link href={subHref(c, s)} className="block py-1.5 text-mist-2">{s.name}</Link>
                                {s.sections ? (
                                  <ul className="ps-4">
                                    {s.sections.map((sec) => (
                                      <li key={sec.anchor}>
                                        <Link href={`${subHref(c, s)}#${sec.anchor}`} className="block py-1 text-sm text-mist">{sec.label}</Link>
                                      </li>
                                    ))}
                                  </ul>
                                ) : null}
                              </li>
                            ))}
                          </ul>
                        </details>
                      ))}
                    </div>
                  </MobileGroup>
                </MobileItem>
                <MobileItem i={3}>
                  <Link href="/insights" className="block py-4 text-4xl font-medium tracking-[-0.04em]">News</Link>
                </MobileItem>
                <MobileItem i={4}>
                  <Link href="/contact" className="block py-4 text-4xl font-medium tracking-[-0.04em]">Contact Us</Link>
                </MobileItem>
              </ul>
            </nav>
            <div className="mt-auto flex flex-col gap-3 pt-10">
              <Link href="/start" className="btn btn-paper w-full">
                Start with FinApt <Arrow />
              </Link>
              <Link href="/login" className="btn btn-line w-full">
                Client login
              </Link>
              <p className="t-label mt-4 text-mist">
                {site.phone} · <a href={site.whatsapp} className="underline">WhatsApp</a>
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function PanelTrigger({
  label,
  id,
  panel,
  active,
  onOpen,
  onToggle,
}: {
  label: string;
  id: Exclude<Panel, null>;
  panel: Panel;
  active: boolean;
  onOpen: (p: Panel) => void;
  onToggle: () => void;
}) {
  const isOpen = panel === id;
  return (
    <button
      type="button"
      aria-expanded={isOpen}
      aria-controls={`panel-${id}`}
      onClick={onToggle}
      onPointerEnter={(e) => e.pointerType === "mouse" && onOpen(id)}
      className={`flex items-center gap-1.5 py-1 ${active || isOpen ? "link-draw bg-[length:100%_1px]" : "link-draw"}`}
    >
      {label}
      <svg viewBox="0 0 12 12" aria-hidden className={`h-2.5 w-2.5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M2 4.5 6 8l4-3.5" />
      </svg>
    </button>
  );
}

function ServicesPanel() {
  return (
    <div className="frame grid grid-cols-4 gap-x-8 gap-y-10 py-10">
      {categories.map((c) => (
        <div key={c.slug} className="min-w-0">
          <Link href={`/services/${c.slug}`} className="group flex items-baseline gap-2">
            <span className="t-num text-xs text-muted">{c.number}</span>
            <span className="font-medium tracking-[-0.01em] group-hover:text-blue">{c.menuName}</span>
          </Link>
          <ul className="mt-3 space-y-1.5 border-s border-line ps-3 text-sm">
            {c.subServices.map((s) => (
              <li key={s.slug}>
                <Link href={subHref(c, s)} className="text-muted-2 transition-colors hover:text-ink">
                  {s.name}
                </Link>
                {s.sections ? (
                  <ul className="mt-1.5 space-y-1 ps-3 text-[0.8rem]">
                    {s.sections.map((sec) => (
                      <li key={sec.anchor}>
                        <Link href={`${subHref(c, s)}#${sec.anchor}`} className="text-muted transition-colors hover:text-ink">
                          {sec.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div className="on-ink flex flex-col justify-between rounded-md bg-ink p-6 text-paper">
        <div>
          <p className="t-label text-mist">[ {categories.length} practices · {totalSubServices} services ]</p>
          <p className="mt-3 text-xl font-medium leading-tight tracking-[-0.02em]">
            Not sure where to <span className="t-serif text-blue-tint">start?</span>
          </p>
        </div>
        <div className="mt-6 flex flex-col gap-2">
          <Link href="/start" className="btn btn-paper btn-sm">Start with FinApt <Arrow /></Link>
          <Link href="/services" className="btn btn-line btn-sm">All services</Link>
        </div>
      </div>
    </div>
  );
}

function AboutPanel() {
  return (
    <div className="frame grid grid-cols-12 gap-8 py-10">
      <div className="col-span-4">
        <p className="t-label text-muted">[ About FinApt — est. {site.founded} ]</p>
        <p className="mt-3 text-2xl font-medium leading-tight tracking-[-0.02em]">
          Partner-led, <span className="t-serif text-blue">by design.</span>
        </p>
        <p className="mt-3 text-sm text-muted-2">Who we are, our history, values, governance and the team behind every engagement.</p>
        <Link href="/about" className="btn btn-ink btn-sm mt-5">About FinApt <Arrow /></Link>
      </div>
      <ul className="col-span-8 grid grid-cols-5 gap-4">
        {team.map((m) => (
          <li key={m.id} className="group">
            <Link href={`/about#${m.id}`} className="block">
              <Portrait member={m} className="rounded-md" sizes="160px" />
              <span className="mt-3 block text-sm font-medium leading-tight group-hover:text-blue">{m.name}</span>
              <span className="mt-0.5 block text-xs text-muted">{m.role}</span>
            </Link>
            {m.linkedin ? (
              <a href={m.linkedin} target="_blank" rel="noopener" className="mt-1 inline-block text-xs text-blue link-draw">
                LinkedIn ↗
              </a>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

function MobileItem({ i, children }: { i: number; children: React.ReactNode }) {
  return (
    <li className="overflow-hidden">
      <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ duration: 0.9, ease: EXPO, delay: 0.15 + i * 0.05 }}>
        {children}
      </motion.div>
    </li>
  );
}

function MobileGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="group">
      <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-4xl font-medium tracking-[-0.04em] [&::-webkit-details-marker]:hidden">
        {title}
        <span aria-hidden className="text-3xl font-light text-mist transition-transform duration-300 group-open:rotate-45">+</span>
      </summary>
      {children}
    </details>
  );
}

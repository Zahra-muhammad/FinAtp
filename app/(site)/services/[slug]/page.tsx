import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Lines, Reveal } from "@/components/motion/primitives";
import { StartBand } from "@/components/site/shared";
import { Arrow, Label, Portrait } from "@/components/ui/bits";
import { Photo } from "@/components/visual/Photo";
import { OgContent } from "@/components/site/OgContent";
import { getOgPage, outline } from "@/data/og";
import { serviceTypes } from "@/data/service-types";
import { categories, getCategory, subHref } from "@/data/services";
import { leadFor } from "@/data/team";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = getCategory((await params).slug);
  return c ? { title: c.name, description: c.short } : {};
}

export default async function ServiceDetail({ params }: { params: Promise<{ slug: string }> }) {
  const c = getCategory((await params).slug);
  if (!c) notFound();
  const lead = leadFor(c.slug);
  const process = serviceTypes[c.defaultEngagement];
  const og = getOgPage(c.og);
  const toc = og ? outline(og) : [];
  // AML/CFT: the group's only service *is* the group page.
  const singlePage = c.subServices.length === 1 && c.subServices[0].og === c.og;
  const idx = categories.findIndex((x) => x.slug === c.slug);
  const next = categories[(idx + 1) % categories.length];
  // Columns for the process grid; the last stage stretches to fill its row.
  const n = process.stages.length;
  const cols = n <= 5 ? n : n % 3 === 0 ? 3 : 4;
  const last = cols - ((n - 1) % cols);

  return (
    <>
      {/* Hero */}
      <section className="bg-paper pt-32 md:pt-44">
        <div className="frame grid-12 gap-y-10">
          <div className="col-span-6 lg:col-span-8">
            <nav aria-label="Breadcrumb" className="t-label text-muted">
              <Link href="/services" className="link-draw">Services</Link> <span aria-hidden>/</span> {c.number}
            </nav>
            <Lines as="h1" trigger="mount" className="t-display mt-8">
              <span>{c.headline[0]}</span>
              <span className="t-serif text-blue">{c.headline[1]}</span>
            </Lines>
          </div>
          <Reveal className="col-span-6 self-end lg:col-span-4" delay={0.4}>
            <p className="t-label text-muted">{c.name}</p>
            <p className="t-lead mt-4 text-muted-2">{c.intro}</p>
          </Reveal>
        </div>
        <div className="frame mt-14 md:mt-20">
          <Photo photo={c.photo} className="aspect-[16/9] rounded-md md:aspect-[21/9]" priority parallax={10} />
        </div>
      </section>

      {/* Sub-services (each opens its own page with the full original copy) */}
      {!singlePage ? (
        <section aria-labelledby="what-title" className="bg-paper py-24 md:py-32">
          <div className="frame grid-12 gap-y-12">
            <div className="col-span-6 lg:col-span-4">
              <Label className="text-muted">What&apos;s included</Label>
              <h2 id="what-title" className="t-h2 mt-5 lg:sticky lg:top-32">
                {c.subServices.length} services, <span className="t-serif text-blue">one team.</span>
              </h2>
            </div>
            <ol className="col-span-6 lg:col-span-7 lg:col-start-6">
              {c.subServices.map((s, i) => (
                <Reveal key={s.slug} as="li" delay={i * 0.04} className="border-t border-line">
                  <Link href={subHref(c, s)} className="group grid grid-cols-[3rem_1fr_auto] items-start gap-4 py-7">
                    <span className="t-num pt-1 text-sm text-muted">{String(i + 1).padStart(2, "0")}</span>
                    <span>
                      <span className="block text-2xl font-medium tracking-[-0.02em] transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-x-2">{s.name}</span>
                      <span className="mt-2 block text-muted-2">{s.blurb}</span>
                    </span>
                    <span className="mt-1 grid h-10 w-10 place-items-center rounded-full border border-line transition-colors duration-500 group-hover:border-ink group-hover:bg-ink group-hover:text-paper">
                      <Arrow />
                    </span>
                  </Link>
                  {s.sections ? (
                    <ul className="-mt-3 mb-7 flex flex-wrap gap-2 ps-16">
                      {s.sections.map((sec) => (
                        <li key={sec.anchor}>
                          <Link href={`${subHref(c, s)}#${sec.anchor}`} className="block rounded-full border border-line px-3 py-1.5 text-sm text-muted-2 transition-colors hover:border-ink hover:text-ink">
                            {sec.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {/* The group's own page copy from finaptgroup.com */}
      {og ? (
        <section aria-label={`About ${c.name}`} className={`bg-paper pb-24 md:pb-32 ${singlePage ? "pt-24 md:pt-32" : "border-t border-line pt-24 md:pt-32"}`}>
          <div className="frame grid-12 gap-y-12">
            <aside className="col-span-6 lg:col-span-3">
              <div className="lg:sticky lg:top-28">
                <Label className="text-muted">{singlePage ? c.subServices[0].name : `About ${c.name}`}</Label>
                {toc.length > 1 ? (
                  <nav aria-label="On this page" className="mt-5">
                    <ol className="space-y-2 border-s border-line ps-4 text-sm">
                      {toc.map((t) => (
                        <li key={t.id}>
                          <a href={`#${t.id}`} className="block text-muted-2 transition-colors hover:text-ink">
                            {t.text}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </nav>
                ) : null}
              </div>
            </aside>
            <article className="col-span-6 min-w-0 lg:col-span-8 lg:col-start-5">
              {og.h1 ? <p className="t-lead mb-10 text-muted-2">{og.h1}</p> : null}
              <OgContent blocks={og.blocks} />
            </article>
          </div>
        </section>
      ) : null}

      {/* Process */}
      <section aria-labelledby="process-title" className="on-ink bg-ink py-24 text-paper md:py-32">
        <div className="frame">
          <div className="grid-12 mb-14 gap-y-6">
            <div className="col-span-6 lg:col-span-7">
              <Label className="text-mist">How a {process.name.toLowerCase()} runs</Label>
              <h2 id="process-title" className="t-h2 mt-5">
                Every stage, <span className="t-serif text-blue-tint">in your portal.</span>
              </h2>
            </div>
            <p className="col-span-6 self-end text-mist-2 lg:col-span-4 lg:col-start-9">
              Typical timing: {process.typicalDuration}. You&apos;ll see each stage move in real time, with anything we need from you flagged clearly.
            </p>
          </div>
          <ol
            className="grid gap-px overflow-hidden rounded-md bg-ink-line sm:grid-cols-2 lg:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))]"
            style={{ ["--cols" as string]: cols, ["--last" as string]: last }}
          >
            {process.stages.map((s, i) => (
              <Reveal
                key={s.id}
                as="li"
                delay={i * 0.05}
                className={`flex min-h-52 flex-col bg-ink p-6 ${i === process.stages.length - 1 ? "lg:[grid-column:span_var(--last)]" : ""}`}
              >
                <span className="t-num text-sm text-mist">{String(i + 1).padStart(2, "0")}</span>
                <span className="mt-auto pt-10 text-xl font-medium tracking-[-0.01em]">{s.label}</span>
                <span className="mt-2 text-sm text-mist-2">{s.detail}</span>
                {s.clientAction ? <span className="t-label mt-4 text-blue-tint">Your input</span> : null}
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Partner */}
      <section className="bg-paper py-24 md:py-32">
        <div className="frame grid-12 items-center gap-y-10">
          <div className="col-span-3 lg:col-span-3">
            <Portrait member={lead} className="rounded-md" />
          </div>
          <div className="col-span-6 lg:col-span-6 lg:col-start-5">
            <Label className="text-muted">Partner responsible</Label>
            <p className="t-h2 mt-5">{lead.name}</p>
            <p className="mt-2 text-muted">
              {lead.role}, {lead.practice}
            </p>
            <p className="t-lead mt-6 text-muted-2">{lead.bio}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`/start?service=${encodeURIComponent(c.slug)}`} className="btn btn-ink">
                Start with {c.name} <Arrow />
              </Link>
              <Link href="/contact" className="btn btn-line">
                Ask a question
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Next practice */}
      <Link href={`/services/${next.slug}`} className="group block border-t border-line bg-paper">
        <div className="frame flex items-center justify-between gap-6 py-14 md:py-20">
          <span>
            <span className="t-label block text-muted">Next practice — {next.number}</span>
            <span className="mt-3 block text-[clamp(2rem,1.2rem+3vw,4.5rem)] font-medium leading-none tracking-[-0.04em] transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-x-3">
              {next.name}
            </span>
          </span>
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-line transition-colors duration-500 group-hover:bg-ink group-hover:text-paper">
            <Arrow className="h-5 w-5" />
          </span>
        </div>
      </Link>
      <StartBand />
    </>
  );
}

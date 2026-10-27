import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Lines, Reveal } from "@/components/motion/primitives";
import { OgContent } from "@/components/site/OgContent";
import { StartBand } from "@/components/site/shared";
import { Arrow, Label, Portrait } from "@/components/ui/bits";
import { Photo } from "@/components/visual/Photo";
import { getOgPage, outline } from "@/data/og";
import { categories, getSubService, subHref } from "@/data/services";
import { leadFor } from "@/data/team";

// Every sub-service with its own original page (AML/CFT's single service is
// its group page, so it isn't generated here).
export function generateStaticParams() {
  return categories.flatMap((c) => c.subServices.filter((s) => s.og !== c.og).map((s) => ({ slug: c.slug, sub: s.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; sub: string }> }): Promise<Metadata> {
  const { slug, sub } = await params;
  const found = getSubService(slug, sub);
  if (!found) return {};
  const og = getOgPage(found.sub.og);
  return { title: found.sub.name, description: og?.blocks.find((b) => b.type === "paragraph")?.text.slice(0, 160) ?? found.sub.blurb };
}

export default async function SubServicePage({ params }: { params: Promise<{ slug: string; sub: string }> }) {
  const { slug, sub: subSlug } = await params;
  const found = getSubService(slug, subSlug);
  if (!found || found.sub.og === found.category.og) notFound();
  const { category: c, sub } = found;
  const og = getOgPage(sub.og);
  if (!og) notFound();
  const toc = outline(og);
  const lead = leadFor(c.slug);
  const idx = c.subServices.findIndex((s) => s.slug === sub.slug);
  const next = c.subServices[(idx + 1) % c.subServices.length];
  // Split the name so the last word gets the serif accent, as on group pages.
  const words = sub.name.split(" ");
  const [plain, accent] = words.length > 1 ? [words.slice(0, -1).join(" "), words[words.length - 1]] : ["", sub.name];

  return (
    <>
      {/* Hero */}
      <section className="bg-paper pt-32 md:pt-44">
        <div className="frame grid-12 gap-y-10">
          <div className="col-span-6 lg:col-span-9">
            <nav aria-label="Breadcrumb" className="t-label text-muted">
              <Link href="/services" className="link-draw">Services</Link> <span aria-hidden>/</span>{" "}
              <Link href={`/services/${c.slug}`} className="link-draw">{c.name}</Link> <span aria-hidden>/</span> {String(idx + 1).padStart(2, "0")}
            </nav>
            <Lines as="h1" trigger="mount" className="t-h1 mt-8">
              {plain ? <span>{plain}</span> : null}
              <span className="t-serif text-blue">{accent}</span>
            </Lines>
          </div>
          {og.h1 ? (
            <Reveal className="col-span-6 lg:col-span-7" delay={0.35}>
              <p className="t-lead text-muted-2">{og.h1}</p>
            </Reveal>
          ) : null}
        </div>
        <div className="frame mt-12 md:mt-16">
          <Photo photo={c.photo} className="aspect-[16/7] rounded-md md:aspect-[21/7]" priority parallax={8} />
        </div>
      </section>

      {/* Body: sidebar + original copy */}
      <section className="bg-paper py-20 md:py-28">
        <div className="frame grid-12 gap-y-14">
          <aside className="col-span-6 lg:col-span-3">
            <div className="space-y-10 lg:sticky lg:top-28">
              {toc.length > 1 ? (
                <nav aria-label="On this page">
                  <Label className="text-muted">On this page</Label>
                  <ol className="mt-4 space-y-2 border-s border-line ps-4 text-sm">
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
              <nav aria-label={`${c.name} services`}>
                <Label className="text-muted">{c.name}</Label>
                <ul className="mt-4 space-y-1 text-sm">
                  {c.subServices.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={subHref(c, s)}
                        aria-current={s.slug === sub.slug ? "page" : undefined}
                        className={`block rounded-md px-3 py-2 transition-colors ${s.slug === sub.slug ? "bg-ink text-paper" : "text-muted-2 hover:bg-bone/60 hover:text-ink"}`}
                      >
                        {s.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="hidden rounded-md border border-line bg-white p-4 lg:block">
                <div className="flex items-center gap-3">
                  <Portrait member={lead} className="w-14 shrink-0 rounded" sizes="56px" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{lead.name}</p>
                    <p className="text-xs text-muted">{lead.role}, {lead.practice}</p>
                  </div>
                </div>
                <Link href={`/start?service=${c.slug}`} className="btn btn-ink btn-sm mt-4 w-full">
                  Start with FinApt <Arrow />
                </Link>
              </div>
            </div>
          </aside>

          <article className="col-span-6 min-w-0 lg:col-span-8 lg:col-start-5">
            <OgContent blocks={og.blocks} />
          </article>
        </div>
      </section>

      {/* Next service in this group */}
      {next.slug !== sub.slug ? (
        <Link href={subHref(c, next)} className="group block border-t border-line bg-paper">
          <div className="frame flex items-center justify-between gap-6 py-14 md:py-20">
            <span>
              <span className="t-label block text-muted">Next in {c.name}</span>
              <span className="mt-3 block text-[clamp(1.8rem,1.1rem+2.6vw,4rem)] font-medium leading-none tracking-[-0.04em] transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-x-3">
                {next.name}
              </span>
            </span>
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-line transition-colors duration-500 group-hover:bg-ink group-hover:text-paper">
              <Arrow className="h-5 w-5" />
            </span>
          </div>
        </Link>
      ) : null}
      <StartBand />
    </>
  );
}

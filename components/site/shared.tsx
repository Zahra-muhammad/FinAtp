// Sections reused across marketing pages.

import Link from "next/link";
import { Lines, Magnetic, Marquee, Reveal } from "@/components/motion/primitives";
import { Arrow, Label, Portrait } from "@/components/ui/bits";
import { Photo } from "@/components/visual/Photo";
import { photos } from "@/data/images";
import type { Article } from "@/data/insights";
import { accreditations } from "@/data/site";
import type { TeamMember } from "@/data/team";

export function AccreditationStrip() {
  return (
    <section aria-labelledby="acc-title" className="border-y border-line bg-paper py-12 md:py-16">
      <div className="frame mb-8 flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <Label className="text-muted">Registered with the authorities you deal with</Label>
        <h2 id="acc-title" className="sr-only">Accreditations</h2>
      </div>
      <Marquee items={accreditations} speed={45} className="text-[clamp(2rem,1.2rem+3vw,4.25rem)] font-medium tracking-[-0.04em] text-ink" />
    </section>
  );
}

export function TeamCard({ member, index = 0, showBio = false }: { member: TeamMember; index?: number; showBio?: boolean }) {
  return (
    <Reveal delay={index * 0.06} as="li" className="group">
      <span id={member.id} className="block scroll-mt-28" aria-hidden />
      <Portrait member={member} className="rounded-md" />
      <p className="mt-4 text-lg font-medium tracking-[-0.01em]">{member.name}</p>
      <p className="text-sm text-muted">
        {member.role} · {member.practice}
      </p>
      {showBio ? <p className="mt-3 border-t border-line pt-3 text-sm leading-relaxed text-muted-2">{member.bio}</p> : null}
      {showBio && member.linkedin ? (
        <a href={member.linkedin} target="_blank" rel="noopener" className="mt-2 inline-block text-sm text-blue link-draw">
          LinkedIn ↗
        </a>
      ) : null}
    </Reveal>
  );
}

export function ArticleCard({ article, index = 0 }: { article: Article; index?: number }) {
  const date = new Date(article.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  return (
    <Reveal delay={index * 0.08} as="li">
      <Link href={`/insights/${article.slug}`} className="group block">
        <div className="overflow-hidden rounded-md">
          <Photo photo={article.photo} className="aspect-[4/3] transition-transform duration-[1.2s] ease-[var(--ease-expo)] group-hover:scale-[1.03]" sizes="(min-width: 1024px) 33vw, 100vw" tone="light" />
        </div>
        <p className="t-label mt-5 text-muted">
          {article.category} · {date} · {article.readTime}
        </p>
        <h3 className="t-h3 mt-3 max-w-[24ch]">
          <span className="link-draw">{article.title}</span>
        </h3>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-2">{article.excerpt}</p>
      </Link>
    </Reveal>
  );
}

export function StartBand() {
  return (
    <section aria-labelledby="start-title" className="on-ink relative overflow-hidden bg-ink text-paper">
      <Photo photo={photos.stormSkyline} className="absolute inset-0 opacity-60" parallax={10} />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/30" />
      <div className="frame relative flex min-h-[80svh] flex-col justify-end pb-16 pt-40 md:pb-24">
        <Label className="text-mist">New client? It takes about four minutes</Label>
        <Lines as="h2" className="t-display mt-6">
          <span id="start-title">Start with</span>
          <span className="t-serif text-blue-tint">FinApt.</span>
        </Lines>
        <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p className="t-lead max-w-[34rem] text-mist-2">
            Choose your services, tell us about your company, upload KYC and book a consultation. You&apos;ll land in your portal with everything tracked from day one.
          </p>
          <Magnetic>
            <Link href="/start" className="btn btn-paper min-h-14 px-8 text-base">
              Start with FinApt <Arrow />
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}

export function PageIntro({ label, children, lead }: { label: string; children: React.ReactNode; lead?: string }) {
  return (
    <section className="bg-paper pb-14 pt-36 md:pb-20 md:pt-48">
      <div className="frame grid-12 gap-y-8">
        <div className="col-span-6 lg:col-span-9">
          <Label className="text-muted">{label}</Label>
          <Lines as="h1" trigger="mount" className="t-h1 mt-6">
            {children}
          </Lines>
        </div>
        {lead ? (
          <Reveal className="col-span-6 lg:col-span-5" delay={0.3}>
            <p className="t-lead text-muted-2">{lead}</p>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}

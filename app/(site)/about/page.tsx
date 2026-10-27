import type { Metadata } from "next";
import { Lines, Reveal, ScrollWords } from "@/components/motion/primitives";
import { StartBand, TeamCard } from "@/components/site/shared";
import { Label } from "@/components/ui/bits";
import { Panel } from "@/components/visual/Panel";
import { Photo } from "@/components/visual/Photo";
import { photos } from "@/data/images";
import { site } from "@/data/site";
import { team } from "@/data/team";

export const metadata: Metadata = { title: "About & team" };

export default function AboutPage() {
  return (
    <>
      <section className="on-ink relative overflow-hidden bg-ink text-paper">
        <div className="frame grid-12 items-end gap-y-10 pb-16 pt-36 md:pt-48">
          <div className="col-span-6 lg:col-span-8">
            <Label className="text-mist">About FinApt — est. {site.founded}</Label>
            <Lines as="h1" trigger="mount" className="t-display mt-8">
              <span>Partner-led,</span>
              <span>
                <span className="t-serif text-blue-tint">by design.</span>
              </span>
            </Lines>
          </div>
          <Reveal className="col-span-6 lg:col-span-4" delay={0.5}>
            <p className="t-lead text-mist-2">
              FinApt Group is a partner-led audit, tax and advisory firm headquartered in the UAE, delivering integrated professional services across assurance, taxation, accounting, risk and compliance, corporate services, and financial and transaction advisory.
            </p>
          </Reveal>
        </div>
        <div className="frame pb-20">
          <Photo photo={photos.perforatedTower} className="aspect-[16/8] rounded-md" parallax={10} sizes="100vw" />
        </div>
      </section>

      <section className="bg-paper py-24 md:py-36">
        <div className="frame grid-12 gap-y-10">
          <div className="col-span-6 lg:col-span-3">
            <Label className="text-muted">Our history</Label>
          </div>
          <div className="col-span-6 lg:col-span-8">
            <ScrollWords
              className="text-[clamp(1.5rem,1rem+2vw,3rem)] font-medium leading-[1.15] tracking-[-0.03em]"
              text="FinApt was established in 2018 by senior professionals across audit, accounting, taxation and advisory — to build a partner-led practice grounded in technical excellence, strong governance and professional integrity."
            />
            <p className="t-lead mt-10 max-w-[44rem] text-muted-2">
              Since then the firm has grown into a multi-disciplinary audit and advisory practice across the UAE, expanding its capabilities in line with evolving regulatory requirements. Responsibility for every engagement rests with a Partner: planned, executed and reviewed under senior leadership.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="values-title" className="bg-paper pb-24 md:pb-36">
        <div className="frame">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <h2 id="values-title" className="t-h2">
              Five values, <span className="t-serif text-blue">one standard.</span>
            </h2>
            <p className="max-w-[28rem] text-muted-2">{site.vision}</p>
          </div>
          <ol className="grid gap-px overflow-hidden rounded-md border border-line bg-line md:grid-cols-5">
            {site.values.map((v, i) => (
              <Reveal key={v.name} as="li" delay={i * 0.06} className="flex flex-col bg-paper p-6 md:min-h-64">
                <span className="t-num text-sm text-muted">0{i + 1}</span>
                <span className="mt-6 text-2xl font-medium tracking-[-0.02em] md:mt-auto md:pt-12">{v.name}</span>
                <span className="mt-2 text-[0.95rem] text-muted-2">{v.text}</span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="team-title" className="bg-bone/50 py-24 md:py-36">
        <div className="frame">
          <div className="grid-12 mb-14 gap-y-6">
            <div className="col-span-6 lg:col-span-7">
              <Label className="text-muted">Leadership & team</Label>
              <Lines as="h2" className="t-h1 mt-5">
                <span id="team-title">Our strength</span>
                <span>
                  is <span className="t-serif text-blue">our people.</span>
                </span>
              </Lines>
            </div>
            <p className="col-span-6 self-end text-muted-2 lg:col-span-4 lg:col-start-9">
              A collaborative, partner-led firm where senior professionals remain actively involved in client engagements.
            </p>
          </div>
          <ul className="grid gap-x-5 gap-y-14 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {team.map((m, i) => (
              <TeamCard key={m.id} member={m} index={i} showBio />
            ))}
          </ul>
        </div>
      </section>

      <section className="on-ink bg-ink py-24 text-paper md:py-32">
        <div className="frame grid-12 items-center gap-y-12">
          <div className="col-span-6 lg:col-span-6">
            <Label className="text-mist">Governance, ethics & independence</Label>
            <h2 className="t-h2 mt-5">
              Independent <span className="t-serif text-blue-tint">judgement.</span>
            </h2>
            <p className="t-lead mt-8 text-mist-2">
              Internal frameworks uphold objectivity, professional integrity and accountability across every service line. Safeguards manage conflicts of interest and protect confidentiality, and senior-level review is built into every engagement.
            </p>
            <ul className="mt-10 space-y-3 text-mist-2">
              {site.entities.map((e) => (
                <li key={e} className="flex items-center gap-3 border-t border-ink-line pt-3">
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-blue-tint" /> {e}
                </li>
              ))}
            </ul>
          </div>
          <Panel variant="ledger" className="col-span-6 aspect-[4/5] rounded-md lg:col-span-5 lg:col-start-8" />
        </div>
      </section>
      <StartBand />
    </>
  );
}

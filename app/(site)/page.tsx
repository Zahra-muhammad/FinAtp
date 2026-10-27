import Link from "next/link";
import { Lines, ScrollWords } from "@/components/motion/primitives";
import { HomeHero } from "@/components/site/home/HomeHero";
import { PortalTeaser } from "@/components/site/home/PortalTeaser";
import { ServicesStack } from "@/components/site/home/ServicesStack";
import { Testimonials } from "@/components/site/home/Testimonials";
import { AccreditationStrip, ArticleCard, StartBand, TeamCard } from "@/components/site/shared";
import { Arrow, Label } from "@/components/ui/bits";
import { articles } from "@/data/insights";
import { team } from "@/data/team";

export default function HomePage() {
  return (
    <>
      <HomeHero />

      {/* Statement */}
      <section className="bg-paper py-24 md:py-40">
        <div className="frame grid-12 gap-y-10">
          <div className="col-span-6 lg:col-span-3">
            <Label className="text-muted">Who we are</Label>
          </div>
          <div className="col-span-6 lg:col-span-8">
            <ScrollWords
              className="text-[clamp(1.6rem,1rem+2.4vw,3.4rem)] font-medium leading-[1.12] tracking-[-0.03em]"
              text="FinApt is a partner-led audit, tax and advisory firm. Every engagement is planned, executed and reviewed by a Partner — so the judgement on your file is never delegated away."
            />
            <div className="mt-12 grid gap-8 sm:grid-cols-3">
              {[
                ["2018", "Founded in Dubai by senior audit, tax and advisory professionals"],
                ["3", "Licensed entities: chartered accountants, corporate services, consultancies"],
                ["1", "Partner accountable for every engagement, start to finish"],
              ].map(([n, t]) => (
                <div key={t} className="border-t border-line pt-5">
                  <p className="text-4xl font-medium tracking-[-0.03em]">{n}</p>
                  <p className="mt-2 text-[0.95rem] text-muted-2">{t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ServicesStack />
      <PortalTeaser />
      <AccreditationStrip />
      <Testimonials />

      {/* Team preview */}
      <section aria-labelledby="team-title" className="bg-bone/50 py-24 md:py-36">
        <div className="frame">
          <div className="grid-12 mb-12 gap-y-6">
            <div className="col-span-6 lg:col-span-7">
              <Label className="text-muted">The partner group</Label>
              <Lines as="h2" className="t-h1 mt-5">
                <span id="team-title">Senior people,</span>
                <span>
                  <span className="t-serif text-blue">on your file.</span>
                </span>
              </Lines>
            </div>
            <div className="col-span-6 flex items-end lg:col-span-4 lg:col-start-9">
              <Link href="/about" className="group inline-flex items-center gap-3 whitespace-nowrap font-medium">
                <span className="link-draw">Meet the team</span> <Arrow className="transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-5">
            {team.map((m, i) => (
              <TeamCard key={m.id} member={m} index={i} />
            ))}
          </ul>
        </div>
      </section>

      {/* Insights */}
      <section aria-labelledby="insights-title" className="bg-paper py-24 md:py-36">
        <div className="frame">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <Label className="text-muted">News</Label>
              <h2 id="insights-title" className="t-h2 mt-5">
                Notes from the <span className="t-serif text-blue">field.</span>
              </h2>
            </div>
            <Link href="/insights" className="group inline-flex items-center gap-3 font-medium">
              <span className="link-draw">All news</span> <Arrow />
            </Link>
          </div>
          <ul className="grid gap-12 md:grid-cols-3 md:gap-6">
            {articles.map((a, i) => (
              <ArticleCard key={a.slug} article={a} index={i} />
            ))}
          </ul>
        </div>
      </section>

      <StartBand />
    </>
  );
}

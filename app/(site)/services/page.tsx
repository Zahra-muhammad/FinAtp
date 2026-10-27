import type { Metadata } from "next";
import { ServiceIndex } from "@/components/site/ServiceIndex";
import { PageIntro, StartBand } from "@/components/site/shared";
import { Label } from "@/components/ui/bits";
import { Panel } from "@/components/visual/Panel";
import { categories, totalSubServices } from "@/data/services";

export const metadata: Metadata = { title: "Services" };

export default function ServicesPage() {
  return (
    <>
      <PageIntro
        label={`Services — 0${categories.length} practices · ${totalSubServices} services`}
        lead="Audit, accounting, tax, risk, transactions, corporate services and AML/CFT compliance under one partner group. Most clients start with one and add the rest as they grow."
      >
        <span>Everything your</span>
        <span>
          finances <span className="t-serif text-blue">answer to.</span>
        </span>
      </PageIntro>

      <section className="bg-paper pb-24 md:pb-36">
        <div className="frame">
          <ServiceIndex />
        </div>
      </section>

      <section className="on-ink bg-ink py-24 text-paper md:py-32">
        <div className="frame grid-12 items-center gap-y-12">
          <div className="col-span-6 lg:col-span-5">
            <Label className="text-mist">How every engagement runs</Label>
            <ol className="mt-10 space-y-8">
              {[
                ["Scope", "A Partner agrees scope, timing and fees with you up front."],
                ["Track", "Your engagement appears in the portal with every stage laid out."],
                ["Deliver", "Drafts come to you for review; finals are signed off by the Partner."],
                ["Remind", "Recurring work and deadlines roll forward automatically."],
              ].map(([t, d], i) => (
                <li key={t} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-ink-line pt-6">
                  <span className="t-num text-mist">0{i + 1}</span>
                  <span>
                    <span className="block text-2xl font-medium tracking-[-0.02em]">{t}</span>
                    <span className="mt-1 block text-mist-2">{d}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <Panel variant="orbit" className="col-span-6 aspect-[4/5] rounded-md lg:col-span-6 lg:col-start-7" />
        </div>
      </section>
      <StartBand />
    </>
  );
}

"use client";

import Link from "next/link";
import { EngagementCard, PageHeader } from "@/components/app/ui";
import { Reveal } from "@/components/motion/primitives";
import { useClientData } from "@/lib/demo/hooks";

export default function ServicesPage() {
  const { engagements } = useClientData();
  const active = engagements.filter((e) => e.status === "active");
  const done = engagements.filter((e) => e.status === "completed");
  return (
    <>
      <PageHeader eyebrow="Your engagements" title="Services">
        <Link href="/portal/add" className="btn btn-ink btn-sm">+ Add a service</Link>
      </PageHeader>
      <h2 className="mb-4 text-lg font-medium">Active ({active.length})</h2>
      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {active.map((e, i) => (
          <Reveal key={e.id} as="li" delay={i * 0.04}>
            <EngagementCard e={e} href={`/portal/services/${e.id}`} />
          </Reveal>
        ))}
      </ul>
      {done.length ? (
        <>
          <h2 className="mb-4 mt-12 text-lg font-medium">Completed ({done.length})</h2>
          <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {done.map((e) => (
              <li key={e.id}>
                <EngagementCard e={e} href={`/portal/services/${e.id}`} />
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </>
  );
}

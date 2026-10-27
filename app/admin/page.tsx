"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { engagementState, PageHeader, Pill } from "@/components/app/ui";
import { Reveal } from "@/components/motion/primitives";
import { getMember } from "@/data/team";
import { timeAgo } from "@/lib/demo/format";
import { useDemo } from "@/lib/demo/store";

export default function AdminHome() {
  const clients = useDemo((s) => s.clients);
  const engagements = useDemo((s) => s.engagements);
  const docs = useDemo((s) => s.docs);
  const notifications = useDemo((s) => s.notifications);
  const [q, setQ] = useState("");

  const rows = useMemo(
    () =>
      clients
        .filter((c) => c.name.toLowerCase().includes(q.toLowerCase()))
        .map((c) => {
          const active = engagements.filter((e) => e.clientId === c.id && e.status === "active");
          return {
            c,
            active,
            waitingOnClient: active.filter((e) => engagementState(e).needsClient).length,
            toReview: docs.filter((d) => d.clientId === c.id && d.status === "uploaded").length,
          };
        })
        .sort((a, b) => b.toReview - a.toReview || b.active.length - a.active.length),
    [clients, engagements, docs, q],
  );
  const feed = notifications.filter((n) => n.audience === "staff").slice(0, 10);
  const totals = {
    active: engagements.filter((e) => e.status === "active").length,
    review: docs.filter((d) => d.status === "uploaded").length,
    waiting: engagements.filter((e) => e.status === "active" && engagementState(e).needsClient).length,
  };

  return (
    <>
      <PageHeader eyebrow="Staff admin" title="Clients" />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {[
          ["Active engagements", totals.active],
          ["Uploads to review", totals.review],
          ["Waiting on clients", totals.waiting],
        ].map(([k, v]) => (
          <div key={k as string} className="card p-5">
            <p className="t-label text-muted">{k}</p>
            <p className="t-num mt-2 text-3xl font-medium">{v}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.7fr_1fr]">
        <section aria-labelledby="clients-title" className="min-w-0">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 id="clients-title" className="shrink-0 text-lg font-medium">All clients ({clients.length})</h2>
            <label className="sr-only" htmlFor="client-search">Search clients</label>
            <input id="client-search" className="field min-w-0 max-w-xs flex-1 !min-h-10 !py-2" placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <ul className="space-y-3">
            {rows.map(({ c, active, waitingOnClient, toReview }, i) => (
              <Reveal key={c.id} as="li" delay={i * 0.04}>
                <Link href={`/admin/clients/${c.id}`} className="card group flex flex-col gap-4 p-5 transition-colors hover:border-ink md:flex-row md:items-center">
                  <div className="min-w-0 flex-1">
                    <p className="text-lg font-medium tracking-[-0.01em]">{c.name}</p>
                    <p className="text-sm text-muted">
                      {c.authority} · {c.industry} · {getMember(c.primaryStaffId)?.name}
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {active.map((e) => {
                        const s = engagementState(e);
                        return (
                          <li key={e.id}>
                            <Pill tone={s.needsClient ? "signal" : "neutral"}>
                              {e.type === "advisory" ? e.title : s.type.name}: {s.stage.label}
                            </Pill>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    {toReview ? <Pill tone="blue">{toReview} to review</Pill> : null}
                    {waitingOnClient ? <Pill>{waitingOnClient} waiting on client</Pill> : null}
                    <span className="text-blue opacity-0 transition-opacity group-hover:opacity-100">Open →</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        </section>

        <section aria-labelledby="activity-title" className="card h-fit p-5">
          <h2 id="activity-title" className="mb-4 text-lg font-medium">Client activity</h2>
          <ul className="divide-y divide-line-soft">
            {feed.map((n) => (
              <li key={n.id}>
                <Link href={n.href} className="flex gap-3 py-3 hover:opacity-80">
                  <span aria-hidden className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? "bg-line" : "bg-signal"}`} />
                  <span>
                    <span className="block text-sm">{n.text}</span>
                    <span className="block text-xs text-muted">{timeAgo(n.at)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}

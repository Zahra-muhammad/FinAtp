"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { Icon } from "@/components/app/AppShell";
import { EngagementCard, engagementState, PageHeader, Pill, Timeline } from "@/components/app/ui";
import { Reveal } from "@/components/motion/primitives";
import { Arrow, Portrait } from "@/components/ui/bits";
import { getMember } from "@/data/team";
import { aed, dueLabel, fmtDate } from "@/lib/demo/format";
import { useClientData } from "@/lib/demo/hooks";

function Dashboard() {
  const welcome = useSearchParams().get("welcome") === "1";
  const { user, client, engagements, docs, deadlines, bookings, invoices } = useClientData();

  const active = engagements.filter((e) => e.status === "active");
  const actions = useMemo(
    () => [
      ...active
        .map((e) => ({ e, s: engagementState(e) }))
        .filter((x) => x.s.needsClient && x.s.stage.clientAction?.kind !== "upload")
        .map((x) => ({ key: x.e.id, text: x.s.stage.clientAction!.label, sub: x.e.title, href: `/portal/services/${x.e.id}` })),
      ...docs.filter((d) => d.status === "requested").map((d) => ({ key: d.id, text: `Upload: ${d.title}`, sub: "Requested by FinApt", href: "/portal/documents" })),
      ...invoices.filter((i) => i.status === "overdue").map((i) => ({ key: i.id, text: `Invoice ${i.number} is overdue`, sub: aed(i.items.reduce((a, b) => a + b.amount, 0) * 1.05), href: "/portal/invoices" })),
    ],
    [active, docs, invoices],
  );

  const feed = useMemo(
    () =>
      engagements
        .flatMap((e) => e.updates.map((u) => ({ ...u, engagementTitle: e.title, href: `/portal/services/${e.id}` })))
        .sort((a, b) => b.at.localeCompare(a.at)),
    [engagements],
  );
  const upcoming = useMemo(
    () => [...deadlines.map((d) => ({ id: d.id, title: d.title, date: d.date })), ...bookings.map((b) => ({ id: b.id, title: `Consultation — ${getMember(b.staffId)?.name}`, date: b.at }))]
      .filter((d) => new Date(d.date).getTime() > Date.now() - 86_400_000)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 5),
    [deadlines, bookings],
  );
  const contact = getMember(client!.primaryStaffId)!;
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <>
      {welcome ? (
        <Reveal className="on-ink mb-8 overflow-hidden rounded-2xl bg-ink p-6 text-paper md:p-8">
          <p className="t-label text-blue-tint">[ Welcome to FinApt ]</p>
          <p className="mt-3 text-2xl font-medium tracking-[-0.02em] md:text-3xl">Your portal is live. Here&apos;s how it works:</p>
          <ol className="mt-6 grid gap-4 text-sm text-mist-2 md:grid-cols-3">
            <li><span className="t-num text-paper">01 </span>Every service you chose is tracked below, stage by stage.</li>
            <li><span className="t-num text-paper">02 </span>Anything we need from you shows up as “Action needed”.</li>
            <li><span className="t-num text-paper">03 </span>Your partner confirms scope at your consultation.</li>
          </ol>
        </Reveal>
      ) : null}

      <PageHeader eyebrow={new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })} title={<>{greet}, <span className="t-serif">{user!.name.split(" ")[0]}.</span></>}>
        <Link href="/portal/add" className="btn btn-ink btn-sm">
          + Add a service
        </Link>
      </PageHeader>

      {/* Needs your attention */}
      {actions.length ? (
        <section aria-labelledby="actions-title" className="mb-10">
          <h2 id="actions-title" className="mb-3 flex items-center gap-2 text-sm font-medium">
            <span className="h-2 w-2 animate-pulse rounded-full bg-signal" aria-hidden /> Needs your attention ({actions.length})
          </h2>
          <ul className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
            {actions.map((a) => (
              <li key={a.key} className="min-w-0">
                <Link href={a.href} className="card group flex items-center justify-between gap-4 border-signal/30 p-4 hover:border-signal">
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{a.text}</span>
                    <span className="block truncate text-sm text-muted">{a.sub}</span>
                  </span>
                  <Arrow className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Active services */}
      <section aria-labelledby="active-title">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 id="active-title" className="text-xl font-medium tracking-[-0.02em]">Active services <span className="text-muted">({active.length})</span></h2>
          <Link href="/portal/services" className="text-sm text-blue link-draw">All services</Link>
        </div>
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {active.map((e, i) => (
            <Reveal key={e.id} as="li" delay={i * 0.05}>
              <EngagementCard e={e} href={`/portal/services/${e.id}`} />
            </Reveal>
          ))}
        </ul>
      </section>

      <div className="mt-10 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <section aria-labelledby="feed-title" className="card p-5 md:p-6">
          <h2 id="feed-title" className="mb-6 text-lg font-medium">Activity</h2>
          <Timeline updates={feed} limit={8} />
        </section>

        <div className="space-y-6">
          <section aria-labelledby="cal-title" className="on-ink rounded-xl bg-ink p-5 text-paper md:p-6">
            <div className="mb-4 flex items-baseline justify-between">
              <h2 id="cal-title" className="text-lg font-medium">Coming up</h2>
              <Link href="/portal/calendar" className="text-sm text-blue-tint link-draw">Calendar</Link>
            </div>
            <ul>
              {upcoming.map((d) => (
                <li key={d.id} className="flex items-center justify-between gap-4 border-t border-ink-line py-3 text-[0.95rem]">
                  <span className="min-w-0 truncate">{d.title}</span>
                  <span className="shrink-0 text-end">
                    <span className="t-num block text-sm text-blue-tint">{fmtDate(d.date, { day: "numeric", month: "short" }).toUpperCase()}</span>
                    <span className="block text-xs text-mist">{dueLabel(d.date)}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="contact-title" className="card flex gap-4 p-5">
            <Portrait member={contact} className="w-20 shrink-0 rounded-md" sizes="80px" />
            <div className="min-w-0">
              <h2 id="contact-title" className="t-label text-muted">Your FinApt contact</h2>
              <p className="mt-1 font-medium">{contact.name}</p>
              <p className="text-sm text-muted">{contact.role} · {contact.practice}</p>
              <Link href="/portal/messages" className="mt-3 inline-flex items-center gap-2 text-sm text-blue">
                <Icon name="chat" className="h-4 w-4" /> Send a message
              </Link>
            </div>
          </section>

          <section className="card p-5">
            <p className="t-label text-muted">Documents</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Pill tone={docs.some((d) => d.status === "requested") ? "signal" : "neutral"}>{docs.filter((d) => d.status === "requested").length} requested from you</Pill>
              <Pill tone="blue">{docs.filter((d) => d.direction === "from-finapt").length} from FinApt</Pill>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default function Page() {
  return (
    <Suspense>
      <Dashboard />
    </Suspense>
  );
}

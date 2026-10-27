"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { FileDrop } from "@/components/app/FileDrop";
import { Icon } from "@/components/app/AppShell";
import { StageTracker } from "@/components/app/StageTracker";
import { Empty, engagementState, PageHeader, Pill, Timeline } from "@/components/app/ui";
import { EXPO } from "@/components/motion/primitives";
import { Portrait } from "@/components/ui/bits";
import { site } from "@/data/site";
import { getMember } from "@/data/team";
import { dueLabel, fmtDate } from "@/lib/demo/format";
import { useClientData } from "@/lib/demo/hooks";
import { useDemo } from "@/lib/demo/store";

export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { engagements, docs } = useClientData();
  const clientUpload = useDemo((s) => s.clientUpload);
  const completeAction = useDemo((s) => s.clientCompleteAction);
  const e = engagements.find((x) => x.id === id);

  if (!e) return <Empty>That service isn&apos;t in your portal. <Link href="/portal/services" className="text-blue underline">Back to services</Link></Empty>;

  const { type, stage, completed, needsClient, progress } = engagementState(e);
  const owner = getMember(e.staffId)!;
  const myDocs = docs.filter((d) => d.engagementId === e.id);
  const requested = myDocs.filter((d) => d.status === "requested");
  const action = stage.clientAction;

  return (
    <>
      <nav aria-label="Breadcrumb" className="t-label mb-4 text-muted">
        <Link href="/portal/services" className="link-draw">Services</Link> / {type.name}
      </nav>
      <PageHeader eyebrow={`${type.name}${e.period ? ` · ${e.period}` : ""}`} title={e.title}>
        {completed ? <Pill tone="success">Complete</Pill> : needsClient ? <Pill tone="signal">Action needed</Pill> : <Pill tone="blue">In progress</Pill>}
        {e.dueDate && !completed ? <Pill>Target {fmtDate(e.dueDate)} · {dueLabel(e.dueDate)}</Pill> : null}
      </PageHeader>

      {/* Tracker */}
      <section className="card p-5 md:p-8" aria-labelledby="progress-title">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="progress-title" className="t-label text-muted">Progress</h2>
            <p className="mt-2 text-2xl font-medium tracking-[-0.02em] md:text-3xl">{completed ? "All stages complete" : stage.label}</p>
            {!completed ? <p className="mt-1 max-w-xl text-muted-2">{stage.detail}</p> : null}
          </div>
          <motion.p key={progress} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EXPO }} className="t-num text-5xl font-medium tracking-[-0.04em] text-blue md:text-6xl">
            {progress}%
          </motion.p>
        </div>
        <StageTracker key={`${e.stageIndex}-${e.status}`} stages={type.stages} current={e.stageIndex} completed={completed} showLabels />
      </section>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="min-w-0 space-y-6">
          {/* Next action */}
          {!completed ? (
            <section aria-labelledby="next-title" className={`rounded-xl p-5 md:p-6 ${needsClient ? "on-ink bg-ink text-paper" : "card"}`}>
              <h2 id="next-title" className={`t-label ${needsClient ? "text-blue-tint" : "text-muted"}`}>Next action</h2>
              {needsClient && action ? (
                <>
                  <p className="mt-2 text-xl font-medium">{action.label}</p>
                  <p className="mt-1 text-sm text-mist-2">{stage.detail}</p>
                  {action.kind === "upload" ? (
                    requested.length ? (
                      <div className="mt-5 space-y-2 text-ink">
                        {requested.map((d) => (
                          <FileDrop key={d.id} label={d.title} hint={d.note} compact onDone={(f, s) => clientUpload(d.id, f, s)} />
                        ))}
                      </div>
                    ) : (
                      <p className="mt-4 text-sm text-mist-2">Your team will list exactly what's needed here. Anything uploaded is reviewed within one business day.</p>
                    )
                  ) : action.kind === "attend" ? (
                    <p className="mt-4 text-sm text-mist-2">{owner.name.split(" ")[0]} will confirm the appointment time with you by message.</p>
                  ) : (
                    <button type="button" onClick={() => completeAction(e.id)} className="btn btn-paper mt-5">
                      <Icon name="check" className="h-4 w-4" /> {action.kind === "sign" ? "Sign electronically" : "Approve"}
                    </button>
                  )}
                </>
              ) : (
                <>
                  <p className="mt-2 text-xl font-medium">Nothing needed from you right now</p>
                  <p className="mt-1 text-sm text-muted-2">{owner.name} is working on “{stage.label}”. You&apos;ll be notified the moment it moves.</p>
                </>
              )}
            </section>
          ) : null}

          {/* Stages */}
          <section aria-labelledby="stages-title" className="card p-5 md:p-6">
            <h2 id="stages-title" className="mb-5 text-lg font-medium">How this runs</h2>
            <ol className="space-y-1">
              {type.stages.map((s, i) => {
                const st = completed || i < e.stageIndex ? "done" : i === e.stageIndex ? "now" : "todo";
                return (
                  <li key={s.id} className={`grid grid-cols-[2rem_1fr] gap-3 rounded-lg p-3 ${st === "now" ? "bg-blue-wash" : ""}`}>
                    <span className={`grid h-7 w-7 place-items-center rounded-full text-xs font-semibold ${st === "done" ? "bg-blue text-white" : st === "now" ? "bg-ink text-paper" : "border border-line text-muted"}`}>
                      {st === "done" ? <Icon name="check" className="h-3.5 w-3.5" /> : i + 1}
                    </span>
                    <span>
                      <span className={`block font-medium ${st === "todo" ? "text-muted-2" : ""}`}>{s.label}</span>
                      <span className="block text-sm text-muted">{s.detail}</span>
                      {s.clientAction ? <span className="t-label mt-1 block text-blue">Your input: {s.clientAction.label}</span> : null}
                    </span>
                  </li>
                );
              })}
            </ol>
          </section>

          {/* Timeline */}
          <section aria-labelledby="timeline-title" className="card p-5 md:p-6">
            <h2 id="timeline-title" className="mb-6 text-lg font-medium">Updates</h2>
            <Timeline updates={e.updates} />
          </section>
        </div>

        <div className="min-w-0 space-y-6">
          <section aria-labelledby="owner-title" className="card p-5">
            <h2 id="owner-title" className="t-label text-muted">Responsible partner</h2>
            <div className="mt-4 flex gap-4">
              <Portrait member={owner} className="w-24 shrink-0 rounded-md" sizes="96px" />
              <div>
                <p className="font-medium">{owner.name}</p>
                <p className="text-sm text-muted">{owner.role} · {owner.practice}</p>
                <a href={`mailto:${site.email}`} className="mt-2 block text-sm text-blue link-draw">{site.email}</a>
                <Link href="/portal/messages" className="btn btn-line btn-sm mt-3">Message</Link>
              </div>
            </div>
          </section>

          <section aria-labelledby="docs-title" className="card p-5">
            <div className="mb-4 flex items-baseline justify-between">
              <h2 id="docs-title" className="text-lg font-medium">Documents</h2>
              <Link href="/portal/documents" className="text-sm text-blue link-draw">All</Link>
            </div>
            {myDocs.length ? (
              <ul className="divide-y divide-line-soft">
                {myDocs.map((d) => (
                  <li key={d.id} className="flex items-center justify-between gap-3 py-3">
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{d.title}</span>
                      <span className="block truncate text-xs text-muted">{d.fileName ?? d.note ?? "Waiting for upload"}</span>
                    </span>
                    {d.status === "requested" ? <Pill tone="signal">Requested</Pill> : d.direction === "from-finapt" ? <Pill tone="blue">From FinApt</Pill> : d.status === "accepted" ? <Pill tone="success">Checked</Pill> : <Pill>Uploaded</Pill>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted">No documents yet.</p>
            )}
          </section>

          <section className="card p-5 text-sm text-muted-2">
            <p className="t-label text-muted">About this service</p>
            <p className="mt-2">Typical timing: {type.typicalDuration}.{type.recurring ? ` Repeats ${type.recurring} — the next period opens automatically.` : ""}</p>
            <p className="mt-2">Started {fmtDate(e.startedAt)}.</p>
          </section>
        </div>
      </div>
    </>
  );
}

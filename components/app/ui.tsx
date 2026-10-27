"use client";

// Small portal/admin building blocks.

import Link from "next/link";
import { serviceTypes } from "@/data/service-types";
import { getMember } from "@/data/team";
import { StageTracker } from "./StageTracker";
import { dueLabel, fmtDate } from "@/lib/demo/format";
import type { Engagement, Update } from "@/lib/demo/types";

export function PageHeader({ eyebrow, title, children }: { eyebrow?: string; title: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow ? <p className="t-label text-muted">[ {eyebrow} ]</p> : null}
        <h1 className="mt-2 text-[clamp(2rem,1.5rem+2vw,3rem)] font-medium leading-[1.05] tracking-[-0.035em]">{title}</h1>
      </div>
      {children ? <div className="flex flex-wrap gap-2">{children}</div> : null}
    </div>
  );
}

export function Pill({ tone = "neutral", children }: { tone?: "neutral" | "blue" | "signal" | "success" | "ink"; children: React.ReactNode }) {
  const tones = {
    neutral: "bg-bone/70 text-muted-2",
    blue: "bg-blue-wash text-blue",
    signal: "bg-[#fdecea] text-signal-text",
    success: "bg-success-wash text-success",
    ink: "bg-ink text-paper",
  };
  return <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}

export function engagementState(e: Engagement) {
  const type = serviceTypes[e.type];
  const stage = type.stages[e.stageIndex];
  const completed = e.status === "completed";
  const needsClient = !completed && !!stage.clientAction;
  const progress = completed ? 100 : Math.round((e.stageIndex / type.stages.length) * 100);
  return { type, stage, completed, needsClient, progress };
}

export function EngagementCard({ e, href }: { e: Engagement; href: string }) {
  const { type, stage, completed, needsClient, progress } = engagementState(e);
  const owner = getMember(e.staffId);
  return (
    <Link href={href} className="card group flex flex-col gap-5 p-5 transition-[border-color,box-shadow] duration-500 hover:border-ink hover:shadow-lg md:p-6">
      <div className="flex items-start justify-between gap-3">
        <p className="t-label text-muted">[ {type.name}{e.period ? ` · ${e.period}` : ""} ]</p>
        {completed ? <Pill tone="success">Complete</Pill> : needsClient ? <Pill tone="signal"><span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden />Action needed</Pill> : <Pill tone="blue">In progress</Pill>}
      </div>
      <div>
        <p className="text-xl font-medium leading-tight tracking-[-0.02em]">{completed ? e.title : stage.label}</p>
        <p className="mt-1 text-sm text-muted">{completed ? `Completed ${e.completedAt ? fmtDate(e.completedAt) : ""}` : e.title}</p>
      </div>
      <div>
        <div className="t-num mb-2 flex justify-between text-xs text-muted">
          <span>{completed ? "All stages" : `Stage ${e.stageIndex + 1} of ${type.stages.length}`}</span>
          <span>{progress}%</span>
        </div>
        <StageTracker stages={type.stages} current={e.stageIndex} completed={completed} size="sm" />
      </div>
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-line-soft pt-4 text-sm">
        <span className="text-muted-2">{owner?.name ?? "FinApt"}</span>
        {e.dueDate && !completed ? <span className="text-muted">{dueLabel(e.dueDate)}</span> : <span className="text-blue opacity-0 transition-opacity group-hover:opacity-100">Open →</span>}
      </div>
    </Link>
  );
}

export function Timeline({ updates, limit, clientLabel = "You" }: { updates: (Update & { engagementTitle?: string; href?: string })[]; limit?: number; clientLabel?: string }) {
  const list = limit ? updates.slice(0, limit) : updates;
  return (
    <ol className="relative">
      {list.map((u, i) => {
        const who = u.by.kind === "staff" ? getMember(u.by.staffId)?.name ?? "FinApt" : u.by.kind === "client" ? clientLabel : "FinApt";
        const dot = u.kind === "deliverable" || u.kind === "completed" ? "bg-success" : u.kind === "request" ? "bg-signal" : u.by.kind === "client" ? "bg-ink" : "bg-blue";
        return (
          <li key={u.id} className="relative grid grid-cols-[1.25rem_1fr] gap-3 pb-6 last:pb-0">
            {i < list.length - 1 ? <span aria-hidden className="absolute start-[0.31rem] top-4 h-full w-px bg-line" /> : null}
            <span aria-hidden className={`relative mt-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-white ${dot}`} />
            <div>
              <p className="text-[0.95rem] leading-snug">
                {u.href ? (
                  <Link href={u.href} className="hover:underline">
                    {u.text}
                  </Link>
                ) : (
                  u.text
                )}
              </p>
              <p className="mt-1 text-xs text-muted">
                {who}
                {u.engagementTitle ? ` · ${u.engagementTitle}` : ""} · {fmtDate(u.at, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="rounded-xl border border-dashed border-line p-8 text-center text-sm text-muted">{children}</p>;
}

export function Loading() {
  return (
    <div className="grid min-h-dvh place-items-center bg-paper" aria-busy="true">
      <span className="t-label animate-pulse text-muted">Loading your portal…</span>
    </div>
  );
}

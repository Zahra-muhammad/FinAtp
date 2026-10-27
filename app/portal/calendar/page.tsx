"use client";

import { PageHeader, Pill } from "@/components/app/ui";
import { getMember } from "@/data/team";
import { daysUntil, dueLabel, fmtDate } from "@/lib/demo/format";
import { useClientData } from "@/lib/demo/hooks";

const kindLabel: Record<string, string> = { vat: "VAT", ct: "Corporate tax", licence: "Licence", audit: "Audit", visa: "Visas", other: "Other", meeting: "Meeting" };

export default function CalendarPage() {
  const { deadlines, bookings } = useClientData();
  const items = [
    ...deadlines.map((d) => ({ id: d.id, title: d.title, date: d.date, kind: d.kind as string })),
    ...bookings.map((b) => ({ id: b.id, title: `${b.topic} — ${getMember(b.staffId)?.name}`, date: b.at, kind: "meeting" })),
  ].sort((a, b) => a.date.localeCompare(b.date));

  const groups = new Map<string, typeof items>();
  for (const it of items) {
    const key = fmtDate(it.date, { month: "long", year: "numeric" });
    groups.set(key, [...(groups.get(key) ?? []), it]);
  }

  return (
    <>
      <PageHeader eyebrow="Compliance calendar" title="Calendar" />
      <p className="-mt-4 mb-8 max-w-2xl text-muted-2">VAT, corporate tax, licence renewals and audit milestones in one place. Your team watches these too — you&apos;ll get a reminder before each one.</p>
      <div className="space-y-10">
        {[...groups.entries()].map(([month, list]) => (
          <section key={month} aria-label={month}>
            <h2 className="t-label mb-3 text-muted">{month}</h2>
            <ul className="card divide-y divide-line-soft">
              {list.map((it) => {
                const d = daysUntil(it.date);
                return (
                  <li key={it.id} className={`grid grid-cols-[4rem_1fr] items-center gap-4 p-4 sm:grid-cols-[4rem_1fr_auto] ${d < 0 ? "opacity-55" : ""}`}>
                    <span className="text-center">
                      <span className="t-num block text-2xl font-medium leading-none">{new Date(it.date).getDate()}</span>
                      <span className="t-label mt-1 block text-muted">{fmtDate(it.date, { weekday: "short" })}</span>
                    </span>
                    <span>
                      <span className="block font-medium">{it.title}</span>
                      <span className="mt-1 block text-xs text-muted">{kindLabel[it.kind]}</span>
                    </span>
                    <span className="col-start-2 sm:col-start-auto">
                      <Pill tone={d < 0 ? "neutral" : d <= 7 ? "signal" : d <= 30 ? "blue" : "neutral"}>{d < 0 ? "Passed" : dueLabel(it.date)}</Pill>
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PageHeader } from "@/components/app/ui";
import { Arrow } from "@/components/ui/bits";
import { categories } from "@/data/services";
import type { ServiceTypeId } from "@/data/service-types";
import { useClientData } from "@/lib/demo/hooks";
import { useDemo } from "@/lib/demo/store";

export default function AddServicePage() {
  const router = useRouter();
  const { client, engagements } = useClientData();
  const addServices = useDemo((s) => s.addServices);
  const [picked, setPicked] = useState<Record<string, ServiceTypeId>>({});
  const [note, setNote] = useState("");
  const activeTitles = new Set(engagements.filter((e) => e.status === "active").map((e) => e.title));

  return (
    <>
      <PageHeader eyebrow="Grow with FinApt" title={<>Add a <span className="t-serif">service.</span></>} />
      <p className="-mt-4 mb-8 max-w-2xl text-muted-2">Pick what you need. Each one appears on your dashboard straight away, and your partner confirms scope and fees before work starts.</p>
      <div className="grid gap-4 lg:grid-cols-2">
        {categories.map((c) => (
          <section key={c.slug} className="card p-5" aria-labelledby={`cat-${c.slug}`}>
            <p className="t-num text-xs text-muted">{c.number}</p>
            <h2 id={`cat-${c.slug}`} className="mt-1 text-lg font-medium">{c.name}</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {c.subServices.map((s) => {
                const on = !!picked[s.name];
                const running = activeTitles.has(s.name);
                return (
                  <button
                    key={s.name}
                    type="button"
                    disabled={running}
                    aria-pressed={on}
                    onClick={() =>
                      setPicked((p) => {
                        const n = { ...p };
                        if (n[s.name]) delete n[s.name];
                        else n[s.name] = s.engagement;
                        return n;
                      })
                    }
                    className={`min-h-10 rounded-full border px-3.5 text-sm transition-colors ${on ? "border-ink bg-ink text-paper" : running ? "border-line-soft text-muted" : "border-line hover:border-ink"}`}
                  >
                    {on ? "✓ " : ""}
                    {s.name}
                    {running ? " · active" : ""}
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
      <div className="sticky bottom-4 mt-8 rounded-2xl border border-line bg-white/95 p-4 shadow-xl backdrop-blur md:flex md:items-center md:gap-4">
        <input aria-label="Anything we should know?" className="field md:flex-1" placeholder="Anything we should know? (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
        <button
          type="button"
          className="btn btn-ink mt-3 w-full md:mt-0 md:w-auto"
          disabled={!Object.keys(picked).length}
          onClick={() => {
            addServices(
              client!.id,
              Object.entries(picked).map(([title, type]) => ({ type, title })),
              note ? `Requested from the portal: “${note}”` : undefined,
            );
            router.push("/portal");
          }}
        >
          Add {Object.keys(picked).length || ""} service{Object.keys(picked).length === 1 ? "" : "s"} <Arrow />
        </button>
      </div>
    </>
  );
}

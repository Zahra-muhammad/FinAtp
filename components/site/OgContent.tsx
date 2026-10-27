// Renders the original finaptgroup.com copy (data/og) in the site's design
// system: same type scale, labels, cards, pills and FAQ style as the rest of
// the rebrand. Server component — the copy never ships as JS.

import { headingIds, type OgBlock } from "@/data/og";

export function OgContent({ blocks, compact = false }: { blocks: OgBlock[]; compact?: boolean }) {
  const ids = headingIds(blocks);
  return (
    <div className="[&>*:first-child]:mt-0">
      {blocks.map((b, i) => (
        <Block key={i} block={b} id={ids.get(i)} compact={compact} />
      ))}
    </div>
  );
}

function Block({ block: b, id, compact }: { block: OgBlock; id?: string; compact: boolean }) {
  switch (b.type) {
    case "heading":
      if (b.level <= 2)
        return (
          <h2 id={id} className={`scroll-mt-28 font-medium leading-[1.1] tracking-[-0.03em] text-ink ${compact ? "mb-3 mt-8 text-xl" : "mb-5 mt-16 text-[clamp(1.6rem,1.2rem+1.3vw,2.25rem)]"}`}>
            {b.text}
          </h2>
        );
      if (b.level === 3)
        return (
          <h3 id={id} className={`scroll-mt-28 font-medium tracking-[-0.02em] ${compact ? "mb-2 mt-6 text-lg" : "mb-3 mt-10 text-xl md:text-2xl"}`}>
            {b.text}
          </h3>
        );
      return (
        <h4 id={id} className="mb-2 mt-8 scroll-mt-28 text-lg font-medium">
          {b.text}
        </h4>
      );
    case "label":
      return <p className="t-label mb-3 mt-14 text-blue">[ {b.text} ]</p>;
    case "paragraph":
      return <p className={`max-w-[70ch] leading-[1.75] text-ink/85 ${compact ? "mb-3 text-[0.95rem]" : "mb-5 text-[1.0625rem]"}`}>{b.text}</p>;
    case "list":
      return b.ordered ? (
        <ol className="my-6 max-w-[70ch] space-y-3">
          {b.items.map((it, i) => (
            <li key={i} className="grid grid-cols-[2rem_1fr] gap-2 leading-[1.65] text-ink/85">
              <span className="t-num pt-0.5 text-sm text-blue">{String(i + 1).padStart(2, "0")}</span>
              <span>{it}</span>
            </li>
          ))}
        </ol>
      ) : (
        <ul className={`max-w-[70ch] space-y-2.5 ${compact ? "my-3" : "my-6"}`}>
          {b.items.map((it, i) => (
            <li key={i} className="grid grid-cols-[1.25rem_1fr] gap-2 leading-[1.65] text-ink/85">
              <span aria-hidden className="mt-[0.7em] h-px w-3 bg-blue" />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      );
    case "tags":
      return (
        <ul className="my-5 flex flex-wrap gap-2">
          {b.items.map((it, i) => (
            <li key={i} className="rounded-full border border-line bg-white px-3.5 py-1.5 text-sm text-muted-2">
              {it}
            </li>
          ))}
        </ul>
      );
    case "cards":
      return (
        <ul className={`my-8 grid gap-px overflow-hidden rounded-md border border-line bg-line ${b.items.length > 2 ? "sm:grid-cols-2 lg:grid-cols-3" : b.items.length === 2 ? "sm:grid-cols-2" : ""}`}>
          {b.items.map((card, i) => {
            const parts = "parts" in card ? card.parts : [card.title, card.text].filter(Boolean);
            const [first, ...rest] = parts;
            // Short leading figures (stats, step numbers) get the big numeric style.
            const isFigure = first && first.length <= 8 && rest.length > 0;
            return (
              <li key={i} className="flex flex-col gap-2 bg-paper p-5 md:p-6">
                {isFigure ? (
                  <span className="t-num text-3xl font-medium tracking-[-0.03em] text-blue">{first}</span>
                ) : (
                  <span className="font-medium leading-snug">{first}</span>
                )}
                {rest.map((r, j) => (
                  <span key={j} className="text-[0.95rem] leading-relaxed text-muted-2">
                    {r}
                  </span>
                ))}
              </li>
            );
          })}
        </ul>
      );
    case "table":
      return (
        <div className="my-8 overflow-x-auto rounded-md border border-line">
          <table className="w-full min-w-[520px] text-sm">
            <tbody className="divide-y divide-line-soft">
              {b.rows.map((row, r) => (
                <tr key={r} className={r === 0 ? "bg-bone/50 font-medium" : "bg-white"}>
                  {row.map((cell, c) => (
                    <td key={c} className="p-3 align-top">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "faq":
      return (
        <div className="my-8 border-t border-line">
          {b.items.map((item, i) => (
            <details key={i} className="group border-b border-line">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-lg font-medium leading-snug tracking-[-0.01em] [&::-webkit-details-marker]:hidden">
                {item.q}
                <span aria-hidden className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line text-base transition-transform duration-500 ease-[var(--ease-expo)] group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="pb-6 pe-10">
                <OgContent blocks={item.a} compact />
              </div>
            </details>
          ))}
        </div>
      );
    case "testimonials":
      return (
        <ul className="my-10 grid gap-4 md:grid-cols-2">
          {b.items.map((t, i) => (
            <li key={i}>
              <figure className="card h-full p-6">
                <blockquote className="leading-relaxed">
                  <span className="t-serif text-2xl text-blue">“</span>
                  {t.quote}
                  <span className="t-serif text-2xl text-blue">”</span>
                </blockquote>
                {t.name || t.title ? (
                  <figcaption className="mt-4 text-sm">
                    <span className="font-medium">{t.name}</span>
                    {t.title ? <span className="block text-muted">{t.title}</span> : null}
                  </figcaption>
                ) : null}
              </figure>
            </li>
          ))}
        </ul>
      );
  }
}

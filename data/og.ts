// Full copy of the original finaptgroup.com service pages and blog posts,
// extracted word for word (October 2026) into structured blocks. Sidebars,
// contact boxes, forms and buttons were left out; everything else is here.
// Server-only: imported by server components, never shipped to the browser.

import "server-only";
import raw from "./og/pages.json";

export type OgBlock =
  | { type: "heading"; level: number; text: string }
  | { type: "paragraph"; text: string }
  | { type: "label"; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "tags"; items: string[] }
  | { type: "cards"; items: ({ parts: string[] } | { title: string; text: string })[] }
  | { type: "table"; rows: string[][] }
  | { type: "faq"; items: { q: string; a: OgBlock[] }[] }
  | { type: "testimonials"; items: { quote: string; name: string; title: string }[] };

export type OgPage = { title: string; h1: string | null; blocks: OgBlock[] };

const pages = raw as unknown as Record<string, OgPage>;

export function getOgPage(path: string | undefined): OgPage | undefined {
  return path ? pages[path] : undefined;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .replace(/-and-/g, "-")
    .slice(0, 80);
}

/** Unique id for every heading block (by index), shared by the renderer and the outline. */
export function headingIds(blocks: OgBlock[]): Map<number, string> {
  const ids = new Map<number, string>();
  const seen = new Map<string, number>();
  blocks.forEach((b, i) => {
    if (b.type !== "heading") return;
    const base = slugify(b.text) || "section";
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    ids.set(i, n ? `${base}-${n + 1}` : base);
  });
  return ids;
}

/** Level-2 headings, for an "On this page" list. */
export function outline(page: OgPage): { id: string; text: string }[] {
  const ids = headingIds(page.blocks);
  return page.blocks.flatMap((b, i) => (b.type === "heading" && b.level === 2 ? [{ id: ids.get(i)!, text: b.text }] : []));
}

export function wordCount(page: OgPage): number {
  return JSON.stringify(page.blocks).split(/\s+/).length;
}

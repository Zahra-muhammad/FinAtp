// News — the three posts published on finaptgroup.com/blog, with their
// original titles, dates and full text (from data/og). Photos are the
// concept's own duotone imagery. Server-only (reads the original copy).

import "server-only";
import { getOgPage, type OgBlock } from "./og";
import { photos, type Photo } from "./images";

export type Article = {
  slug: string;
  title: string;
  category: string;
  date: string; // ISO, as published
  readTime: string;
  excerpt: string;
  photo: Photo;
  blocks: OgBlock[];
  // The gratuity post is an interactive calculator on the original site.
  calculator?: "gratuity";
};

const sources = [
  { slug: "gratuity-calculation-in-uae", og: "/gratuity-calculation-in-uae/", title: "Gratuity Calculation in UAE – Updated Version 2024", category: "Accounting", date: "2024-01-18", photo: photos.szrTowers, calculator: "gratuity" as const },
  { slug: "how-to-get-icv-certificate-in-uae", og: "/how-to-get-icv-certificate-in-uae/", title: "How to Get an ICV Certificate in UAE – Detailed Guide", category: "Compliance", date: "2024-01-14", photo: photos.futureMuseum },
  { slug: "9-best-accounting-software-in-uae", og: "/9-best-accounting-software-in-uae/", title: "9 Best Accounting Software in UAE | Experts’ Recommendation", category: "Technology", date: "2024-01-06", photo: photos.dawnSkyline },
];

function readTime(blocks: OgBlock[]): string {
  const words = JSON.stringify(blocks).split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 220))} min`;
}

export const articles: Article[] = sources.map((s) => {
  const blocks = getOgPage(s.og)?.blocks ?? [];
  const first = blocks.find((b) => b.type === "paragraph");
  return {
    slug: s.slug,
    title: s.title,
    category: s.category,
    date: s.date,
    readTime: s.calculator ? "Tool" : readTime(blocks),
    excerpt: first && first.type === "paragraph" ? first.text : "",
    photo: s.photo,
    blocks,
    calculator: s.calculator,
  };
});

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

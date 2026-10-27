import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Lines } from "@/components/motion/primitives";
import { GratuityCalculator } from "@/components/site/GratuityCalculator";
import { OgContent } from "@/components/site/OgContent";
import { StartBand } from "@/components/site/shared";
import { Label } from "@/components/ui/bits";
import { Photo } from "@/components/visual/Photo";
import { articles, getArticle } from "@/data/insights";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const a = getArticle((await params).slug);
  return a ? { title: a.title, description: a.excerpt } : {};
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const a = getArticle((await params).slug);
  if (!a) notFound();
  const date = new Date(a.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  return (
    <>
      <article className="bg-paper pb-24 pt-36 md:pt-44">
        <div className="frame grid-12 gap-y-8">
          <div className="col-span-6 lg:col-span-9">
            <nav aria-label="Breadcrumb" className="t-label text-muted">
              <Link href="/insights" className="link-draw">News</Link> <span aria-hidden>/</span> {a.category}
            </nav>
            <Lines as="h1" trigger="mount" className="t-h1 mt-8">
              <span>{a.title}</span>
            </Lines>
            <p className="t-label mt-8 text-muted">
              {date} · {a.calculator ? "Interactive tool" : `${a.readTime} read`} · FinApt Group
            </p>
          </div>
        </div>
        <div className="frame mt-12">
          <Photo photo={a.photo} className="aspect-[16/8] rounded-md" priority parallax={8} tone="light" />
        </div>
        <div className="frame grid-12 mt-16 gap-y-10">
          <aside className="col-span-6 lg:col-span-3">
            <Label className="text-muted">Summary</Label>
            <p className="mt-4 text-muted-2">{a.excerpt}</p>
          </aside>
          <div className="col-span-6 lg:col-span-7 lg:col-start-5">
            <OgContent blocks={a.blocks} />
            {a.calculator === "gratuity" ? <GratuityCalculator /> : null}
          </div>
        </div>
      </article>
      <StartBand />
    </>
  );
}

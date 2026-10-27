import type { Metadata } from "next";
import { ArticleCard, PageIntro } from "@/components/site/shared";
import { articles } from "@/data/insights";

export const metadata: Metadata = { title: "News" };

export default function InsightsPage() {
  return (
    <>
      <PageIntro label="News" lead="Articles and tools from FinApt Group on UAE tax, audit, compliance and running a business here.">
        <span>Notes from</span>
        <span>
          the <span className="t-serif text-blue">field.</span>
        </span>
      </PageIntro>
      <section className="bg-paper pb-28 md:pb-40">
        <div className="frame">
          <ul className="grid gap-14 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {articles.map((a, i) => (
              <ArticleCard key={a.slug} article={a} index={i} />
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

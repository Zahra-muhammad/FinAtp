import type { Metadata } from "next";
import { Reveal } from "@/components/motion/primitives";
import { ContactForm } from "@/components/site/ContactForm";
import { PageIntro } from "@/components/site/shared";
import { Arrow, Label } from "@/components/ui/bits";
import { Photo } from "@/components/visual/Photo";
import { photos } from "@/data/images";
import { site } from "@/data/site";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <PageIntro label="Contact" lead="Call, message or visit us in Oud Metha. New clients can also start online and book a consultation slot directly.">
        <span>Let&apos;s talk</span>
        <span>
          <span className="t-serif text-blue">numbers.</span>
        </span>
      </PageIntro>

      <section className="bg-paper pb-24 md:pb-36">
        <div className="frame grid-12 gap-y-14">
          <div className="col-span-6 lg:col-span-5">
            <dl className="divide-y divide-line border-y border-line">
              {[
                ["Hotline", <a key="p" href={site.phoneHref} className="link-draw">{site.phone}</a>],
                ["Mobile", <a key="m" href={site.mobileHref} className="link-draw">{site.mobile}</a>],
                ["WhatsApp", <a key="w" href={site.whatsapp} className="link-draw" target="_blank" rel="noopener">{site.whatsappNumber}</a>],
                ["Email", <a key="e" href={`mailto:${site.email}`} className="link-draw">{site.email}</a>],
                ["Working hours", site.hours],
                [
                  "Office",
                  <span key="a">
                    {site.addressLines.map((l) => (
                      <span key={l} className="block">{l}</span>
                    ))}
                  </span>,
                ],
              ].map(([k, v]) => (
                <Reveal key={k as string} className="grid grid-cols-[8rem_1fr] gap-4 py-6">
                  <dt className="t-label pt-1 text-muted">{k}</dt>
                  <dd className="text-lg">{v}</dd>
                </Reveal>
              ))}
            </dl>
            <a href={site.mapsUrl} target="_blank" rel="noopener" className="group mt-8 block">
              <Photo photo={photos.arches} className="aspect-[16/10] rounded-md" sizes="(min-width: 1024px) 40vw, 100vw" />
              <span className="mt-4 inline-flex items-center gap-2 font-medium">
                <span className="link-draw">Get directions — next to Lamcy Plaza</span> <Arrow />
              </span>
            </a>
          </div>
          <div className="col-span-6 lg:col-span-6 lg:col-start-7">
            <Label className="text-muted">Send a message</Label>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

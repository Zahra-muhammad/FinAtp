import Link from "next/link";
import { Reveal } from "@/components/motion/primitives";
import { Arrow, Label, Logo } from "@/components/ui/bits";
import { categories } from "@/data/services";
import { site } from "@/data/site";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="on-ink relative overflow-hidden bg-ink text-paper">
      <div className="frame grid-12 gap-y-14 pb-10 pt-24 md:pt-32">
        <div className="col-span-6 lg:col-span-6">
          <Link href="/" aria-label="FinApt Group — home" className="mb-12 inline-block">
            <Logo tone="white" className="h-11 w-auto md:h-12" />
          </Link>
          <Label className="text-mist">Start a conversation</Label>
          <Link href="/start" className="group mt-5 block t-h2 max-w-[14ch]">
            Ready when <span className="t-serif text-blue-tint">you are.</span>
            <span className="mt-6 flex items-center gap-3 text-lg tracking-normal text-mist-2 transition-colors group-hover:text-paper">
              Start with FinApt <Arrow className="h-5 w-5 transition-transform duration-500 group-hover:translate-x-1" />
            </span>
          </Link>
        </div>

        <div className="col-span-3 lg:col-span-2">
          <Label className="text-mist">Services</Label>
          <ul className="mt-5 space-y-2.5 text-[0.95rem] text-mist-2">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/services/${c.slug}`} className="link-draw hover:text-paper">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-3 lg:col-span-2">
          <Label className="text-mist">Firm</Label>
          <ul className="mt-5 space-y-2.5 text-[0.95rem] text-mist-2">
            <li><Link href="/" className="link-draw hover:text-paper">Home</Link></li>
            <li><Link href="/about" className="link-draw hover:text-paper">About & team</Link></li>
            <li><Link href="/insights" className="link-draw hover:text-paper">News</Link></li>
            <li><Link href="/contact" className="link-draw hover:text-paper">Contact</Link></li>
            <li><Link href="/login" className="link-draw hover:text-paper">Client login</Link></li>
          </ul>
        </div>

        <address className="col-span-6 not-italic lg:col-span-2">
          <Label className="text-mist">Visit</Label>
          <p className="mt-5 text-[0.95rem] leading-relaxed text-mist-2">
            {site.addressLines.map((l) => (
              <span key={l} className="block">{l}</span>
            ))}
          </p>
          <p className="mt-4 text-[0.95rem] text-mist-2">
            <a href={site.phoneHref} className="link-draw hover:text-paper">{site.phone}</a>
            <br />
            <a href={`mailto:${site.email}`} className="link-draw hover:text-paper">{site.email}</a>
            <br />
            <a href={site.whatsapp} target="_blank" rel="noopener" className="link-draw hover:text-paper">WhatsApp {site.whatsappNumber}</a>
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-mist-2">
            {site.social.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener" className="link-draw hover:text-paper">{s.label}</a>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-mist">{site.hours}</p>
        </address>
      </div>

      <Reveal className="frame" y={60}>
        <p aria-hidden className="select-none text-[clamp(5rem,23vw,26rem)] font-semibold leading-[0.78] tracking-[-0.07em] text-ink-3">
          FinApt
        </p>
      </Reveal>

      <div className="frame flex flex-col gap-3 border-t border-ink-line py-6 text-sm text-mist md:flex-row md:items-center md:justify-between">
        <p>
          © {year} FinApt Group — {site.entities.join(" · ")}
        </p>
        <p className="t-label">Dubai · United Arab Emirates</p>
      </div>
    </footer>
  );
}

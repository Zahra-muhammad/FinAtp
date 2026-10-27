"use client";

// "Start with FinApt" — six steps from choosing services to landing in the
// portal. Everything is mock: no data leaves the browser.

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useEffect, useMemo, useState } from "react";
import { FileDrop } from "@/components/app/FileDrop";
import { EXPO } from "@/components/motion/primitives";
import { Arrow, Logo, Portrait } from "@/components/ui/bits";
import { categories, type ServiceCategory } from "@/data/services";
import { leadFor } from "@/data/team";
import type { ServiceTypeId } from "@/data/service-types";
import { useDemoReady } from "@/lib/demo/hooks";
import { useDemo, useSession, type NewClientInput } from "@/lib/demo/store";
import type { Jurisdiction } from "@/lib/demo/types";

const steps = ["Services", "Company", "Account", "KYC", "Consultation", "Confirm"];

const authorities: Record<Jurisdiction, string[]> = {
  mainland: ["Dubai — DET", "Abu Dhabi — ADDED", "Sharjah — SEDD", "Ajman — DED", "Ras Al Khaimah — DED"],
  freezone: ["DMCC", "JAFZA", "DAFZA", "IFZA", "Meydan Free Zone", "RAKEZ", "Dubai Silicon Oasis", "DIFC", "Other free zone"],
  offshore: ["RAK ICC", "JAFZA Offshore", "Other registry"],
};
const industries = ["General trading", "Logistics & freight", "Construction & fit-out", "Healthcare", "Hospitality & F&B", "Technology & software", "Professional services", "Real estate", "Retail & e-commerce", "Manufacturing", "Investment holding", "Other"];
const sizes = ["Not yet incorporated", "1–10 employees", "11–50 employees", "51–200 employees", "200+ employees"];

type Selected = Record<string, { category: string; type: ServiceTypeId }>; // key: sub-service name

export function Onboarding() {
  const router = useRouter();
  const search = useSearchParams();
  const reduce = useReducedMotion();
  const ready = useDemoReady();
  const createClient = useDemo((s) => s.createClient);
  const signIn = useSession((s) => s.signIn);
  const users = useDemo((s) => s.users);

  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [error, setError] = useState<string | null>(null);

  // Step 1
  const [selected, setSelected] = useState<Selected>({});
  const [open, setOpen] = useState<string>(search.get("service") ?? categories[0].slug);
  // Step 2
  const [company, setCompany] = useState({ name: "", jurisdiction: "freezone" as Jurisdiction, authority: "DMCC", industry: industries[0], size: sizes[1], vat: false, trn: "" });
  // Step 3
  const [contact, setContact] = useState({ name: "", title: "", email: "", phone: "", password: "", agree: false });
  // Step 4
  const [kyc, setKyc] = useState<{ tradeLicence?: string; passport?: string; emiratesId?: string }>({});
  // Step 5
  const [slot, setSlot] = useState<string | null>(null);
  // Done
  const [done, setDone] = useState(false);

  const formingCompany = Object.values(selected).some((s) => s.type.startsWith("formation"));
  const firstCategory = Object.values(selected)[0]?.category ?? search.get("service") ?? "corporate-services";
  const partner = leadFor(firstCategory);

  useEffect(() => {
    if (formingCompany) setCompany((c) => ({ ...c, size: "Not yet incorporated" }));
  }, [formingCompany]);

  // Consultation slots: next six working days (Mon–Sat), 9:00–17:00.
  const days = useMemo(() => {
    const out: Date[] = [];
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    while (out.length < 6) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() !== 0) out.push(new Date(d));
    }
    return out;
  }, []);
  const [day, setDay] = useState(0);
  const times = ["09:30", "10:30", "11:30", "13:00", "14:00", "15:30", "16:30"];
  const taken = (di: number, ti: number) => (di * 7 + ti * 3) % 5 === 0;

  function toggle(cat: ServiceCategory, name: string, type: ServiceTypeId) {
    setSelected((s) => {
      const next = { ...s };
      if (next[name]) delete next[name];
      else next[name] = { category: cat.slug, type };
      return next;
    });
  }

  function validate(): string | null {
    if (step === 0 && Object.keys(selected).length === 0) return "Choose at least one service to continue.";
    if (step === 1) {
      if (company.name.trim().length < 2) return formingCompany ? "Enter the company name you'd like (you can change it later)." : "Enter your company name.";
      if (company.vat && !/^\d{15}$/.test(company.trn.replace(/\s/g, ""))) return "A TRN has 15 digits.";
    }
    if (step === 2) {
      if (contact.name.trim().length < 2) return "Enter your full name.";
      if (!/^\S+@\S+\.\S+$/.test(contact.email)) return "Enter a valid email address.";
      if (users.some((u) => u.email.toLowerCase() === contact.email.trim().toLowerCase())) return "That email already has an account — sign in instead, or use a different one.";
      if (contact.password.length < 8) return "Use at least 8 characters for your password.";
      if (!contact.agree) return "Please accept the terms to create your account.";
    }
    if (step === 3 && (!kyc.passport || (!formingCompany && !kyc.tradeLicence))) return formingCompany ? "Upload a passport copy to continue." : "Upload your trade licence and a passport copy to continue.";
    if (step === 4 && !slot) return "Pick a consultation slot.";
    return null;
  }

  function next() {
    const v = validate();
    setError(v);
    if (v) return;
    if (step === steps.length - 1) return finish();
    setDir(1);
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }
  function back() {
    setError(null);
    setDir(-1);
    setStep((s) => Math.max(0, s - 1));
  }

  function finish() {
    const input: NewClientInput = {
      services: Object.entries(selected).map(([name, s]) => ({
        type: s.type,
        title: s.type.startsWith("formation") ? `Company setup — ${company.authority}` : name,
      })),
      company: { name: company.name.trim(), jurisdiction: company.jurisdiction, authority: company.authority, industry: company.industry, size: company.size, trn: company.vat ? company.trn.replace(/\s/g, "") : undefined },
      contact: { name: contact.name.trim(), title: contact.title.trim() || "Owner", email: contact.email.trim(), phone: contact.phone.trim(), password: contact.password },
      kyc,
      booking: { at: slot!, staffId: partner.id, topic: "Introductory consultation" },
    };
    const user = createClient(input);
    signIn(user.id);
    setDone(true);
    setTimeout(() => router.push("/portal?welcome=1"), reduce ? 400 : 2600);
  }

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * 40 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * -40 }),
  };

  if (done) {
    return (
      <div className="on-ink grid min-h-dvh place-items-center bg-ink px-6 text-paper">
        <motion.div className="max-w-xl text-center" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: EXPO }}>
          <svg viewBox="0 0 80 80" className="mx-auto h-20 w-20" aria-hidden>
            <motion.circle cx="40" cy="40" r="36" fill="none" stroke="#8FA8FF" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, ease: EXPO }} />
            <motion.path d="M26 41l9 9 19-20" fill="none" stroke="#F2EFE8" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, ease: EXPO, delay: 0.5 }} />
          </svg>
          <h1 className="t-h2 mt-8">
            Welcome to <span className="t-serif text-blue-tint">FinApt.</span>
          </h1>
          <p className="t-lead mt-4 text-mist-2">Your portal is ready, with {Object.keys(selected).length} service{Object.keys(selected).length === 1 ? "" : "s"} tracked from day one. Taking you there now…</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-paper">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-5">
          <Link href="/" className="shrink-0" aria-label="FinApt — back to site">
            <Logo tone="blue" className="h-8 w-auto md:h-9" />
          </Link>
          <p className="t-label text-muted" aria-live="polite">
            Step {step + 1} of {steps.length} · {steps[step]}
          </p>
          <Link href="/" className="text-sm text-muted link-draw">
            Exit
          </Link>
        </div>
        <ol className="mx-auto grid max-w-5xl grid-cols-6 gap-1.5 px-5 pb-3" aria-hidden>
          {steps.map((s, i) => (
            <li key={s} className="h-1 overflow-hidden rounded-full bg-line-soft">
              <motion.span className="block h-full bg-ink" initial={false} animate={{ width: i <= step ? "100%" : "0%" }} transition={{ duration: 0.7, ease: EXPO }} />
            </li>
          ))}
        </ol>
      </header>

      <main id="main" className="mx-auto max-w-5xl px-5 pb-40 pt-10 md:pt-14">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.section key={step} custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.5, ease: EXPO }}>
            {step === 0 && (
              <>
                <StepTitle eyebrow="What can we help with?" title={<>Choose your <span className="t-serif text-blue">services.</span></>} lead="Pick as many as you like. Each becomes a tracked engagement in your portal." />
                <div className="mt-10 space-y-3">
                  {categories.map((c) => {
                    const count = c.subServices.filter((s) => selected[s.name]).length;
                    const isOpen = open === c.slug;
                    return (
                      <div key={c.slug} className={`card overflow-hidden transition-colors ${count ? "border-ink" : ""}`}>
                        <button type="button" onClick={() => setOpen(isOpen ? "" : c.slug)} aria-expanded={isOpen} className="flex w-full items-center gap-4 p-5 text-start">
                          <span className="t-num text-sm text-muted">{c.number}</span>
                          <span className="flex-1">
                            <span className="block text-xl font-medium tracking-[-0.02em]">{c.name}</span>
                            <span className="block text-sm text-muted">{c.short}</span>
                          </span>
                          {count ? <span className="rounded-full bg-ink px-2.5 py-1 text-xs font-medium text-paper">{count} selected</span> : null}
                          <span aria-hidden className={`text-2xl leading-none transition-transform duration-500 ${isOpen ? "rotate-45" : ""}`}>+</span>
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen ? (
                            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.5, ease: EXPO }} className="overflow-hidden">
                              <div className="flex flex-wrap gap-2 px-5 pb-5">
                                {c.subServices.map((s) => {
                                  const on = !!selected[s.name];
                                  return (
                                    <button
                                      key={s.name}
                                      type="button"
                                      aria-pressed={on}
                                      onClick={() => toggle(c, s.name, s.engagement)}
                                      title={s.blurb}
                                      className={`min-h-11 rounded-full border px-4 text-sm transition-colors duration-300 ${on ? "border-ink bg-ink text-paper" : "border-line bg-paper hover:border-ink"}`}
                                    >
                                      {on ? "✓ " : ""}
                                      {s.name}
                                    </button>
                                  );
                                })}
                              </div>
                            </motion.div>
                          ) : null}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <StepTitle eyebrow="About your company" title={<>Tell us about <span className="t-serif text-blue">the business.</span></>} lead={formingCompany ? "Setting up a new company? Give us the name you'd like and where — we'll check availability." : "This sets up your compliance calendar and the right team."} />
                <div className="mt-10 grid gap-5 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label htmlFor="co-name" className="field-label">{formingCompany ? "Proposed company name" : "Company name"}</label>
                    <input id="co-name" className="field" value={company.name} onChange={(e) => setCompany({ ...company, name: e.target.value })} placeholder="e.g. Al Noor Trading" />
                  </div>
                  <fieldset className="md:col-span-2">
                    <legend className="field-label">Jurisdiction</legend>
                    <div className="grid gap-2 sm:grid-cols-3">
                      {(["mainland", "freezone", "offshore"] as Jurisdiction[]).map((j) => (
                        <label key={j} className={`card flex cursor-pointer items-center gap-3 p-4 ${company.jurisdiction === j ? "border-ink" : ""}`}>
                          <input type="radio" name="jur" className="h-4 w-4 accent-[#0c0f14]" checked={company.jurisdiction === j} onChange={() => setCompany({ ...company, jurisdiction: j, authority: authorities[j][0] })} />
                          <span>
                            <span className="block font-medium">{j === "freezone" ? "Free zone" : j[0].toUpperCase() + j.slice(1)}</span>
                            <span className="block text-xs text-muted">{j === "mainland" ? "Trade anywhere in the UAE" : j === "freezone" ? "Inside a free zone" : "Holding & international"}</span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <div>
                    <label htmlFor="co-auth" className="field-label">Licensing authority</label>
                    <select id="co-auth" className="field" value={company.authority} onChange={(e) => setCompany({ ...company, authority: e.target.value })}>
                      {authorities[company.jurisdiction].map((a) => <option key={a}>{a}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="co-ind" className="field-label">Industry</label>
                    <select id="co-ind" className="field" value={company.industry} onChange={(e) => setCompany({ ...company, industry: e.target.value })}>
                      {industries.map((a) => <option key={a}>{a}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="co-size" className="field-label">Size</label>
                    <select id="co-size" className="field" value={company.size} onChange={(e) => setCompany({ ...company, size: e.target.value })}>
                      {sizes.map((a) => <option key={a}>{a}</option>)}
                    </select>
                  </div>
                  <div>
                    <span className="field-label">VAT registered?</span>
                    <div className="flex gap-2">
                      {[false, true].map((v) => (
                        <button key={String(v)} type="button" aria-pressed={company.vat === v} onClick={() => setCompany({ ...company, vat: v })} className={`btn btn-sm flex-1 ${company.vat === v ? "btn-ink" : "btn-line"}`}>
                          {v ? "Yes" : "No / not yet"}
                        </button>
                      ))}
                    </div>
                  </div>
                  <AnimatePresence>
                    {company.vat ? (
                      <motion.div className="md:col-span-2" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4, ease: EXPO }}>
                        <label htmlFor="co-trn" className="field-label">Tax Registration Number (TRN)</label>
                        <input id="co-trn" className="field t-num" inputMode="numeric" maxLength={18} value={company.trn} onChange={(e) => setCompany({ ...company, trn: e.target.value })} placeholder="15 digits, e.g. 100XXXXXXXXXXX3" />
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <StepTitle eyebrow="Your account" title={<>Who should we <span className="t-serif text-blue">talk to?</span></>} lead="You'll use this email to sign in to your portal." />
                <div className="mt-10 grid gap-5 md:grid-cols-2">
                  <Field id="p-name" label="Full name" value={contact.name} onChange={(v) => setContact({ ...contact, name: v })} autoComplete="name" />
                  <Field id="p-title" label="Job title" value={contact.title} onChange={(v) => setContact({ ...contact, title: v })} autoComplete="organization-title" placeholder="e.g. Founder" />
                  <Field id="p-email" label="Work email" type="email" value={contact.email} onChange={(v) => setContact({ ...contact, email: v })} autoComplete="email" />
                  <Field id="p-phone" label="Mobile / WhatsApp" type="tel" value={contact.phone} onChange={(v) => setContact({ ...contact, phone: v })} autoComplete="tel" placeholder="+971" />
                  <Field id="p-pass" label="Create a password" type="password" value={contact.password} onChange={(v) => setContact({ ...contact, password: v })} autoComplete="new-password" hint="At least 8 characters" />
                  <label className="flex items-start gap-3 self-end pb-2 text-sm md:col-span-2">
                    <input type="checkbox" className="mt-1 h-4 w-4 accent-[#0c0f14]" checked={contact.agree} onChange={(e) => setContact({ ...contact, agree: e.target.checked })} />
                    <span>I agree to FinApt&apos;s terms and privacy notice, and to be contacted about my enquiry.</span>
                  </label>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <StepTitle eyebrow="Know your customer" title={<>Upload your <span className="t-serif text-blue">KYC documents.</span></>} lead="UAE rules require us to verify who we work with. Files stay encrypted and are only seen by your engagement team." />
                <div className="mt-10 grid gap-3">
                  <FileDrop label={formingCompany ? "Trade licence (optional — not issued yet)" : "Trade licence"} value={kyc.tradeLicence} onDone={(f) => setKyc({ ...kyc, tradeLicence: f })} />
                  <FileDrop label="Passport copy — shareholder / signatory" value={kyc.passport} onDone={(f) => setKyc({ ...kyc, passport: f })} />
                  <FileDrop label="Emirates ID (if UAE resident)" value={kyc.emiratesId} onDone={(f) => setKyc({ ...kyc, emiratesId: f })} />
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <StepTitle eyebrow="Meet your partner" title={<>Book a <span className="t-serif text-blue">consultation.</span></>} lead="45 minutes, in our Oud Metha office or on video. We'll confirm scope and fees, and you'll see it all in your portal." />
                <div className="mt-10 grid gap-8 md:grid-cols-[14rem_1fr]">
                  <div className="flex gap-4 md:block">
                    <Portrait member={partner} className="w-28 shrink-0 rounded-md md:w-full" sizes="224px" />
                    <div className="md:mt-4">
                      <p className="t-label text-muted">Your partner</p>
                      <p className="mt-1 font-medium">{partner.name}</p>
                      <p className="text-sm text-muted">{partner.role}, {partner.practice}</p>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="field-label">Day</p>
                    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
                      {days.map((d, i) => (
                        <button key={d.toISOString()} type="button" aria-pressed={day === i} onClick={() => { setDay(i); setSlot(null); }} className={`min-w-[5.5rem] rounded-xl border px-3 py-3 text-center transition-colors ${day === i ? "border-ink bg-ink text-paper" : "border-line bg-white hover:border-ink"}`}>
                          <span className="t-label block opacity-70">{d.toLocaleDateString("en-GB", { weekday: "short" })}</span>
                          <span className="mt-1 block text-xl font-medium">{d.getDate()}</span>
                          <span className="block text-xs opacity-70">{d.toLocaleDateString("en-GB", { month: "short" })}</span>
                        </button>
                      ))}
                    </div>
                    <p className="field-label mt-6">Time (Dubai)</p>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {times.map((t, ti) => {
                        const iso = (() => {
                          const d = new Date(days[day]);
                          const [h, m] = t.split(":").map(Number);
                          d.setHours(h, m, 0, 0);
                          return d.toISOString();
                        })();
                        const isTaken = taken(day, ti);
                        return (
                          <button key={t} type="button" disabled={isTaken} aria-pressed={slot === iso} onClick={() => setSlot(iso)} className={`min-h-11 rounded-lg border text-sm transition-colors ${slot === iso ? "border-blue bg-blue text-white" : isTaken ? "border-line-soft bg-transparent text-muted line-through" : "border-line bg-white hover:border-ink"}`}>
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            )}

            {step === 5 && (
              <>
                <StepTitle eyebrow="Almost there" title={<>Check and <span className="t-serif text-blue">confirm.</span></>} lead="You can change anything later from your portal." />
                <dl className="card mt-10 divide-y divide-line-soft">
                  <Row k="Services" v={Object.keys(selected).join(", ")} onEdit={() => setStep(0)} />
                  <Row k="Company" v={`${company.name} · ${company.authority} · ${company.industry}${company.vat ? ` · TRN ${company.trn}` : ""}`} onEdit={() => setStep(1)} />
                  <Row k="Contact" v={`${contact.name} · ${contact.email}`} onEdit={() => setStep(2)} />
                  <Row k="KYC" v={[kyc.tradeLicence && "Trade licence", kyc.passport && "Passport", kyc.emiratesId && "Emirates ID"].filter(Boolean).join(", ")} onEdit={() => setStep(3)} />
                  <Row k="Consultation" v={slot ? `${new Date(slot).toLocaleString("en-GB", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })} with ${partner.name}` : ""} onEdit={() => setStep(4)} />
                </dl>
              </>
            )}
          </motion.section>
        </AnimatePresence>
      </main>

      {/* Footer actions */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p role="alert" className="min-h-5 text-sm text-signal-text">{error}</p>
          <div className="flex gap-3">
            {step > 0 ? (
              <button type="button" onClick={back} className="btn btn-line flex-1 sm:flex-none">
                Back
              </button>
            ) : null}
            <button type="button" onClick={next} disabled={!ready} className="btn btn-ink flex-1 sm:flex-none">
              {step === steps.length - 1 ? "Create my portal" : "Continue"} <Arrow />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepTitle({ eyebrow, title, lead }: { eyebrow: string; title: React.ReactNode; lead: string }) {
  return (
    <div className="max-w-2xl">
      <p className="t-label text-muted">[ {eyebrow} ]</p>
      <h1 className="t-h2 mt-4">{title}</h1>
      <p className="t-lead mt-4 text-muted-2">{lead}</p>
    </div>
  );
}

function Field({ id, label, value, onChange, type = "text", autoComplete, placeholder, hint }: { id: string; label: string; value: string; onChange: (v: string) => void; type?: string; autoComplete?: string; placeholder?: string; hint?: string }) {
  return (
    <div>
      <label htmlFor={id} className="field-label">{label}</label>
      <input id={id} type={type} className="field" value={value} onChange={(e) => onChange(e.target.value)} autoComplete={autoComplete} placeholder={placeholder} />
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

function Row({ k, v, onEdit }: { k: string; v: string; onEdit: () => void }) {
  return (
    <div className="grid grid-cols-[7rem_1fr_auto] items-start gap-4 p-5">
      <dt className="t-label pt-0.5 text-muted">{k}</dt>
      <dd className="text-[0.95rem]">{v || "—"}</dd>
      <button type="button" onClick={onEdit} className="text-sm text-blue link-draw">Edit</button>
    </div>
  );
}

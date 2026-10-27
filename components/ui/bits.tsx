// Small shared presentational pieces (server-safe).

import Image from "next/image";
import type { TeamMember } from "@/data/team";

export function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`t-label ${className}`}>[ {children} ]</p>;
}

export function Arrow({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`${className} rtl:rotate-180`} aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

// FinApt's own logo from finaptgroup.com: blue for light backgrounds,
// white for dark ones. Files in /public/brand (1200 × ~313, ratio ≈ 3.83:1).
export function Logo({ tone = "blue", className = "h-9 w-auto" }: { tone?: "blue" | "white"; className?: string }) {
  return (
    <Image
      src={tone === "white" ? "/brand/finapt-logo-white.png" : "/brand/finapt-logo.png"}
      alt="FinApt — Audit · Tax · Advisory · Compliance"
      width={1200}
      height={313}
      loading="eager"
      className={className}
    />
  );
}

// Team portrait, with a monogram fallback for anyone without a photo.
export function Portrait({ member, className = "", sizes = "(min-width: 1024px) 25vw, 50vw" }: { member: TeamMember; className?: string; sizes?: string }) {
  if (!member.photo) {
    return (
      <div className={`grain relative flex aspect-[4/5] items-end overflow-hidden bg-ink p-5 ${className}`}>
        <span aria-hidden className="absolute -end-4 -top-6 text-[11rem] font-medium leading-none tracking-[-0.06em] text-ink-3">
          {member.initials}
        </span>
        <span className="t-label relative text-mist">{member.role}</span>
        <span className="sr-only">{member.name}</span>
      </div>
    );
  }
  return (
    <div className={`relative aspect-[4/5] overflow-hidden bg-ink ${className}`}>
      <Image src={member.photo} alt={`${member.name}, ${member.role}`} fill sizes={sizes} className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-expo)] group-hover:scale-[1.04]" />
    </div>
  );
}

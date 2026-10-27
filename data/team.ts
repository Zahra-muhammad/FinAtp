// FinApt team — the ONE place to edit names, titles, bios and photos.
// Source: finaptgroup.com/about-us (October 2026). Photos are FinApt's own,
// re-processed to one ink/blue duotone treatment (see README).
// Anyone without `photo` falls back to the monogram card.

export type TeamMember = {
  id: string;
  name: string;
  role: "Partner" | "Director";
  practice: string;
  bio: string;
  photo?: string;
  initials: string;
  // Service categories this person leads (see data/services.ts).
  leads: string[];
  // Shown inside the client portal as the assigned contact.
  email: string;
  linkedin?: string;
};

export const team: TeamMember[] = [
  {
    id: "taha",
    name: "Taha Siddiqui",
    role: "Partner",
    practice: "Assurance, Taxation & Corporate Services",
    bio: "Over 14 years of experience advising on audit and assurance, corporate and indirect taxation, regulatory compliance, and corporate structuring across multiple sectors.",
    photo: "/team/taha.webp",
    initials: "TS",
    leads: ["tax", "accounting-bookkeeping", "corporate-services"],
    email: "taha@finapt.demo",
    linkedin: "https://www.linkedin.com/in/taha-siddiqui-aca-fcca-30945495/",
  },
  {
    id: "saqib",
    name: "Saqib Islam",
    role: "Partner",
    practice: "Financial & Transaction Advisory",
    bio: "Over 16 years of experience advising on transaction due diligence, valuation and financial modelling, strategic and business planning, and mergers and acquisitions advisory across diverse industries.",
    photo: "/team/saqib.webp",
    initials: "SI",
    leads: ["financial-transaction-advisory"],
    email: "saqib@finapt.demo",
    linkedin: "https://www.linkedin.com/in/saqibislam-partner/",
  },
  {
    id: "abdulla",
    name: "Abdulla Alhashmi",
    role: "Partner",
    practice: "Audit & Assurance",
    bio: "Experience in audit and assurance, internal audit, governance, risk management, and public sector financial oversight, with strong exposure to regulatory and compliance-driven environments.",
    photo: "/team/abdulla.webp",
    initials: "AA",
    leads: ["audit-assurance", "risk-compliance", "aml-cft-compliance"],
    email: "abdulla@finapt.demo",
    linkedin: "https://www.linkedin.com/in/abdulla-alhashmi2999/",
  },
  {
    id: "swati",
    name: "Swati Parashar",
    role: "Director",
    practice: "Financial & Transaction Advisory",
    bio: "Over 18 years of experience advising on strategic and transaction advisory, valuations, feasibility studies, business planning, and mergers and acquisitions across regional and cross-border engagements.",
    photo: "/team/swati.webp",
    initials: "SP",
    leads: [],
    email: "swati@finapt.demo",
    linkedin: "https://www.linkedin.com/in/swati-parashar-2846bb18/",
  },
  {
    id: "najeeb",
    name: "Najeeb Zaidi",
    role: "Director",
    practice: "Risk Management & Crypto DeFi",
    bio: "Extensive experience advising on enterprise risk management, regulatory risk frameworks, financial risk modelling, and risk governance across banking, fintech, and digital finance environments.",
    photo: "/team/najeeb.webp",
    initials: "NZ",
    leads: [],
    email: "najeeb@finapt.demo",
    linkedin: "https://www.linkedin.com/in/snajeebhasan/",
  },
];

export function getMember(id: string): TeamMember | undefined {
  return team.find((m) => m.id === id);
}

export function leadFor(categorySlug: string): TeamMember {
  return team.find((m) => m.leads.includes(categorySlug)) ?? team[0];
}

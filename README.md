# FinApt Group — rebrand concept & client portal demo

A clickable pitch demo for **FinApt Group** (Dubai — chartered accountants, corporate service providers, management consultants). It has four parts:

1. **Marketing site:** a rebrand in the “Quiet confidence” direction.
2. **“Start with FinApt” onboarding:** six steps that end in the portal.
3. **Client portal:** live stage tracking for every engagement.
4. **Staff admin:** a FinApt team member updates a client, and the change appears in the portal immediately.

> **Concept demo.** There is no backend. All data is mock data kept in your browser (localStorage), and nothing is sent anywhere. The site is set to `noindex`.

---

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
# or, for the smoothest demo:
npm run build && npm start
```

Requires Node 20+. Stack: Next.js 16 (App Router), TypeScript, Tailwind CSS 4, Framer Motion, Lenis, Zustand.

## Demo logins

The site and portal no longer mention "demo" anywhere a visitor can see it, and `/login` does not list these accounts, so keep this table to hand when presenting. The staff "Concept demo" label, the **Demo** reset button, the "Open … portal" shortcuts in admin and the "mock / nothing is sent" notes were removed.

| Account | Email | Password | What it shows |
|---|---|---|---|
| Established client | `rania@gulfstone.demo` | `demo123` | Gulfstone Logistics LLC: external audit (draft report ready), quarterly VAT, monthly bookkeeping, corporate tax history, invoices, messages |
| New client | `omar@alnoor.demo` | `demo123` | Al Noor Trading DMCC: free zone company formation in progress, documents waiting to be signed |
| FinApt staff (admin) | `staff@finapt.demo` | `demo123` | All six seeded clients; move stages, post updates, request documents, upload deliverables. Sidebar pages: **Messages** (every client conversation), **Documents** (every file — open, download, mark as checked) and **Invoices** (create, mark paid, send reminders) |

**Shortcut links**, useful when presenting:

- `/demo/client`: signs in as Gulfstone.
- `/demo/new`: signs in as Al Noor.
- `/demo/staff`: signs in as staff.
- Add `?reset=1` to any of them to restore the starting data first (e.g. `/demo/staff?reset=1`).

**Reset demo data:** open `/demo/staff?reset=1` (or any shortcut with `?reset=1`). It restores everything, and any other open windows update too. There is no reset button in the interface.

### How the live update works (read before presenting)

- Demo data is shared between all windows **in the same browser** through localStorage. Every window re-reads it the moment another window changes it.
- The sign-in is per tab (sessionStorage), so one window can be the client and another the staff member.
- Use two windows of the **same browser on the same computer**, side by side or on two displays.
- This won't sync across two different devices; that would need a real backend.
- Private windows keep their own separate storage, so don't mix private and normal windows.

---

## Suggested walkthrough (about 12 minutes)

**Before the meeting**

1. Run `npm run build && npm start`.
2. Open window A at `/` (the marketing site).
3. Open window B at `/demo/staff?reset=1` and keep it minimised.

**1. The rebrand (3 min) — window A, `/`**

- **Hero:** "Numbers you can stand behind." Point out the masked headline reveal, the duotone Dubai skyline and the stats counting up.
- **Statement:** scroll slowly through "Who we are". The paragraph reads itself as you scroll, and partner-led is the message.
- **Services:** the six practices stack on top of each other as you scroll. Click **Tax** to show the detail template:
  - sub-services
  - "How a VAT return runs" (the same stages the portal uses)
  - the responsible partner
- **Portal preview:** back on home, the stage tracker advances by itself and the notification changes.
- **About:** the team portraits are FinApt's own photos, given one consistent treatment.

**2. Onboarding (2 min) — window A, click "Start with FinApt"**

1. Pick *Free Zone Company Setup* and *Corporate Tax & VAT Filing*.
2. Enter a company name and choose the free zone (TRN appears only if VAT-registered).
3. Create an account with any email and password.
4. Upload a passport (any file; it's a mock upload).
5. Book a slot with the suggested partner.
6. Confirm. The success animation plays, and you land in the new client's portal with a welcome panel.

**3. The client portal (3 min) — window A, open `/demo/client` (Gulfstone)**

- **Dashboard:**
  - "Needs your attention": draft audit to approve, bank statements requested, an overdue invoice
  - active services with live trackers
  - activity feed and the "Coming up" compliance calendar
- **External audit:** the eight audit stages, the next action, the responsible partner (Abdulla Alhashmi), the documents and the timeline.
- Click **Approve** on the draft. It moves to the representation letter, and staff are notified.
- **Documents, Calendar, Messages, Invoices:** try **Pay now** (mock card) and **Add a service**.

**4. Updating the client live (3 min) — put windows A and B side by side**

1. In **window B** (staff), open *Gulfstone Logistics LLC*.
2. Select the audit, then **Move stage**: watch window A. A toast appears ("Your management representation letter is ready to sign") and the tracker moves.
3. **Request document:** type "Fixed asset register". It appears instantly under Documents → Requested in window A.
4. Upload it from window A. In window B it shows under "Client uploads to review" → **Mark as checked**.
5. **Post update / Upload deliverable / Messages:** each one lands in the client's timeline, documents or chat.
6. **Staff sidebar:**
   - **Messages** is one inbox for every client.
   - **Documents** opens any client file in a preview and marks uploads as checked.
   - **Invoices** raises an invoice; it appears in the client's Invoices page with a notification.
7. Optional: open *VAT return* and keep moving it to the end. It completes, and the next quarter opens automatically (recurring work).

**Close (1 min):** “Every client sees exactly where their engagement stands, and your team stops answering ‘any update?’ emails.”

---

## What's in the box

```
app/(site)/            Marketing site: home, services (+ [slug] template), about, insights (+ [slug]), contact
app/start/             "Start with FinApt" onboarding (6 steps)
app/login, app/demo/   Fake auth + one-click demo sign-in
app/portal/            Client portal: dashboard, services (+ [id]), documents, calendar, messages, invoices, add
app/admin/             Staff admin: clients, client detail (stages, documents, invoices, messages), messages inbox, documents, invoices
components/motion/     Reveal, masked Lines, ScrollWords, Counter, Marquee, Magnetic, parallax, Lenis
components/visual/     Duotone Photo (SVG filter + grain), abstract Panel graphics
components/site/       Header, footer, home sections, service index, shared sections
components/app/        App shell, stage tracker, onboarding, file drop, portal UI pieces
data/                  ← edit content here
  team.ts                Team members (names, titles, bios, photos) — one place to change names
  services.ts            The 7 service groups & 39 sub-services, exactly as in finaptgroup.com's menu
  og/pages.json          Full original copy of every service page and blog post (word for word)
  og.ts                  Loader for that copy (server-only, never shipped to the browser)
  service-types.ts       Stage models for each engagement type
  site.ts                Contact details, stats, values, accreditations, testimonials
  insights.ts            The three real blog posts (shown as "News")
  images.ts              Photography + credits
  seed.ts                Mock clients, engagements, documents, invoices, demo accounts
lib/demo/              Shared mock store (Zustand + localStorage sync), hooks, formatting
```

### Design system

| Element | Choice |
|---|---|
| Base colours | Ink `#0C0F14`, Paper `#F2EFE8`, Bone `#E4DFD4` |
| Brand blue | Gulf Blue `#1D46C8`; Blue Tint `#8FA8FF` on dark |
| Signal | `#E8432E`, used only for live/notification dots |
| Type | Geist (display/body), Instrument Serif italic (one accent phrase per headline), Geist Mono (bracketed labels, figures) |
| Motion | One expo-out ease (`cubic-bezier(.16,1,.3,1)`); masked line reveals; scroll-linked reading; sticky stacking panels; counters; slow marquee; magnetic primary button; Lenis smooth scroll |

- Tokens live in `app/globals.css`.
- **Reduced motion:** with `prefers-reduced-motion`, there is no smooth scroll and no marquee, reveals become short fades, counters show final values, and the portal toasts don't slide.
- **Lighthouse** (production build, local): desktop 99 performance / 97 accessibility / 100 best practices; mobile 94 / 97 / 100.
  - SEO scores lower only because of the deliberate `noindex`.
  - The one accessibility flag is the intentionally faded words in the scroll-reading statement, which reach full contrast as you scroll.

### Stage models

`data/service-types.ts` models how each service typically runs in the UAE:

- company formation (mainland via DET, free zone, offshore)
- external audit (ISA-style, through to management representation letter and sign-off)
- liquidation audit
- VAT and corporate tax returns (EmaraTax, recurring)
- monthly bookkeeping
- Golden Visa
- due diligence
- a generic advisory flow

**They're illustrative and should be confirmed with FinApt.** Stages marked with a client action ("sign", "approve", "upload", "attend") show as *Action needed* in the portal.

---

## Content sources & notes for FinApt

- **Services, team, contact details, values, history, testimonials:** taken from finaptgroup.com (October 2026). The four homepage testimonials are word for word.
- **Navigation:** mirrors the original menu — Home, About Us (team, with LinkedIn), Services (all 7 groups, 39 sub-services, the six due-diligence sections), News, Contact Us.
- **Service and blog copy:** every original service page, group overview and blog post is reproduced word for word (headings, paragraphs, lists, cards, FAQs, tables and page testimonials), extracted into `data/og/pages.json` and set in the new design.
  - Left out on purpose: each page's sidebar (links to sibling services, contact box), forms and button labels — the new design provides these.
  - The original "Risk and Compliances" group page duplicates the ERM page, and the "Financial and Transaction Advisory" page duplicates Due Diligence, so those two groups show their sub-services rather than repeat the copy.
  - Original wording is kept as published, typos included (e.g. "supper easy", "CV (In-Country Value)"). Two menu labels were tidied: "Corporate Governance Advisory_ Policies & process" → "Corporate Governance Advisory — Policies & Process", and "Internal Audit – Risk based…" uses an em dash.
  - The Liquidation Audit page includes a testimonial from "John Doe, Owner of EnvisionEmporium Retail", which looks like template filler on the live site — worth confirming with FinApt.
- **Gratuity calculator:** the gratuity post on the original site is a calculator; it's ported with the same formula (21 days' basic pay per year up to 5 years, 30 days per year above 5).
- **Phone numbers:** hotline +971 4 892 2937, mobile +971 55 969 0680 and WhatsApp +971 52 283 7331, all as published on finaptgroup.com.
- **Team names:**
  - Abdulla Alhashmi is spelled as on his LinkedIn. FinApt's site uses both "Abdullah Alhashmi" and "Abdulla Al Hashmi".
  - Najeeb Zaidi (Director, Risk Management & Crypto DeFi) appears on the current About page. His photo's file name and LinkedIn URL (`snajeebhasan`) both say "Hasan", so worth confirming.
  - Edit any of this in `data/team.ts`.
- **Team photos:** FinApt's own photos from their About page. Each was given the same treatment: 4:5 head-and-shoulders crop, greyscale, ink→paper duotone, vignette, light grain. Abdulla's and Najeeb's white studio backgrounds were replaced with the same dark backdrop. Abdulla's source photo is a tighter crop than the others. A monogram card is the fallback for anyone without a photo (remove `photo` in `data/team.ts` to see it).
- **Not on the live site:** the one-line service summaries on cards, the client companies in the portal, and the accreditation marquee (text instead of logos) are written for the demo.

### Photo credits (Unsplash License)

| Image | Photographer | Source |
|---|---|---|
| Downtown towers at night | Nejc Soklič | https://unsplash.com/photos/yFKBh1sC1ng |
| Burj Khalifa at night | Clay Banks | https://unsplash.com/photos/XFEJPXUqbYc |
| Skyline under storm clouds | Ahmed Aldaie | https://unsplash.com/photos/aKj9uDanF18 |
| Minimal tower facade | Victor Furtuna | https://unsplash.com/photos/_3asYXeACyo |
| Perforated white tower | Yusuf Mansoor | https://unsplash.com/photos/uLDoEsUpukw |
| Concrete arches | Ismail Merad | https://unsplash.com/photos/T9WWuoUwxjA |
| Sheikh Zayed Road towers | Drew McKechnie | https://unsplash.com/photos/5MVnYVqOt14 |
| Museum of the Future & Emirates Towers | Darcey Beau | https://unsplash.com/photos/q8D7WZc40eA |
| Skyline at dawn | David Rodrigo | https://unsplash.com/photos/Fr6zexbmjmc |
| Business district at dusk | paweldotio | https://unsplash.com/photos/ZyP4Apa8tvI |

Abstract graphic panels (arcs, ledger lines, orbit) are drawn in SVG, in `components/visual/Panel.tsx`.

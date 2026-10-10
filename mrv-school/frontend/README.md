# MRVPS School — Public Website (Phase 2)

Next.js 14 (App Router, JavaScript) + Tailwind CSS. Consumes the `mrvps-backend` API
and covers every section from the sitemap PDF — Home, About (+7 subpages), Academics
(+3 subpages), Admission (+FAQ/fees/scholarships), Facilities, Faculty, Gallery,
News & Events, Student Life, Parents Corner, Students Corner, Alumni, Careers,
Downloads, Contact, plus a real logged-in Parent/Student Portal. 35 routes total.

## Parent/Student Portal (`/portal`)
This is a fully working login, not a placeholder link. `/portal/login` authenticates
against the backend's separate portal-auth endpoints (its own JWT secrets, its own
httpOnly cookie — entirely independent from any staff session); `/portal/dashboard`
shows the logged-in account's linked student(s) — a parent with multiple children gets
a switcher — across tabs: Attendance (with a computed percentage), Homework, Exam
Schedule, Results (published only), Fee Status, PTM Schedule, and Study Materials.
`context/PortalAuthContext.js` and `lib/portalApi.js` handle the session (silent
refresh on load, one retry-after-refresh on a 401), mirroring the pattern used in
`mrvps-admin`. The Parents Corner and Students Corner marketing pages now link to
`/portal/login` instead of the "link to be added" placeholders from the first pass.

**Honest limitation**: the Fee Status tab shows records the school office has entered —
there's no online payment button. See the backend README for what a real payment
gateway integration would add.

## Design
- **Palette** (from the MRVPS logo — red/gold): `red` #A31621 (deep confident red,
  not stock Tailwind red), `gold` #E8A93B, `ink` #1C1B1F, `paper` #FBF8F3, warm
  `slate` for secondary text. Red and gold are used sparingly — accents, CTAs, small
  eyebrows — never as full-bleed backgrounds, per the "don't overuse red/yellow" brief.
- **Type**: Petrona (serif, display headings — carries the institutional/heritage
  feel), Manrope (body/UI), IBM Plex Mono (uppercase-tracked eyebrows/labels —
  used because a school genuinely has dated, list-like content: circulars,
  exam schedules, holiday notices).
- Premium cards, generous section padding, soft shadows with a warm-red tint on
  hover, mega-menu dropdowns in the nav — no AI-template tells (no rainbow boxes,
  sparkle badges, or bounce animations).

## Setup
```bash
cd mrvps-frontend
npm install
cp .env.example .env.local   # point NEXT_PUBLIC_API_BASE_URL at your backend
npm run dev                   # http://localhost:3000
```

Every data-fetching call in `lib/api.js` **fails soft** — if the backend is
unreachable or a collection is empty, pages render with sensible empty states
instead of crashing. That means this frontend runs and looks complete even before
the backend is seeded with real content; connect it to the live API (and run the
backend's `npm run seed`, which now seeds real MRVPS contact details pulled from
the current mrvps.org site) to see it fully dynamic.

## Verified this session
- `npm install` clean (Next pinned to `14.2.35`, the final patched 14.x release —
  Next 14 itself reached end-of-life Oct 2025, so budget for a Next 15 upgrade in
  a later phase; there is no in-place "just bump the version" fix for that beyond
  this patch).
- Full production build (`npm run build`) succeeds — all 35 routes compile and
  prerender, including with the backend completely unreachable (checked directly
  in this sandbox, which has no network path to the backend or to Google Fonts),
  and including the two new `/portal/*` routes.
- Every nav link (top-level + mega-menu) resolves to a real route — no dead links.

## Not done yet
- Not run against a live backend/browser yet — do that before sign-off (start
  `mrvps-backend` with `npm run dev`, seed it, then `npm run dev` here and click
  through, especially the three POST forms: Admission Enquiry, Contact, Alumni
  Registration).
- Real photography — every image slot is currently a labeled placeholder block;
  swap in real MRVPS photos before launch.
- The real MRVPS logo file (referenced in the brief but not attached) — currently
  a text-mark "M" in a circular seal; drop in the actual logo asset and the accent
  colors were already picked to match it from the brief's description.

## Phase 3 — Admin Panel
Not started. Will be a separate Next.js + Tailwind app, role-aware via the
backend's 5 RBAC roles, with CRUD screens for every CMS module and review queues
for Admission Enquiries / Contact Messages / Career Applications / Alumni
Registrations — see `mrvps-backend/README.md` for the full plan.

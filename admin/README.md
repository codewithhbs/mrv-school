# MRVPS School — Admin Panel (Phase 3)

Next.js 14 (App Router, JS) + Tailwind CSS. Role-aware CRUD admin for every
module in `mrvps-backend`, so content edited here is what the public website
(`mrvps-frontend`) reads via the API — no separate CMS, one source of truth.

## Architecture
Rather than hand-writing 18 near-identical CRUD screens, this app is
**config-driven**, mirroring the backend's own `crudFactory`/`buildCrudRouter`
pattern:
- `lib/resourceConfigs.js` — one entry per CMS module (endpoint, table columns,
  form fields, which roles may write/delete) and per review-queue module
  (endpoint, status options, detail fields).
- `components/ResourceAdmin.js` — generic list + search + pagination + create/edit
  slide-over + delete, driven entirely by a config object.
- `components/ReviewQueue.js` — generic list + status-update + detail view for
  the four publicly-submitted record types (no create/delete — those come from
  the public site's forms).
- `components/FormField.js` — renders the right input for each field `type`
  (text, textarea, number, boolean, select, datetime, list, json, image/document
  upload with drag-in preview).
- Every `app/dashboard/<resource>/page.js` is ~6 lines: pick a config, render
  the generic screen. Adding a 19th module is a config entry, not a new page.

**Auth**: `context/AuthContext.js` does a silent `POST /auth/refresh` on load
(using the backend's httpOnly cookie) so a page reload doesn't force re-login,
holds the short-lived access token in memory only (never localStorage — it's
lost on tab close by design, which is the point of the rotation model), and
`lib/api.js` retries once through a refresh on any 401.

**RBAC**: `hasRole()` mirrors the backend exactly — `superadmin` sees and can do
everything; the sidebar (`lib/navConfig.js`) and every screen's write/delete
buttons hide themselves per-role, but the real enforcement is server-side in
the backend, as it must be. A `teacher` role was added specifically for the
academic-data screens below (attendance, homework, results, etc.) — it does
not get CMS content or staff-user management access.

## Academics & Portal (new)
A dedicated nav group for everything that powers the Parent/Student Portal:
- **Students** — the academic roster (generic `ResourceAdmin` screen).
- **Portal Accounts** (`components/PortalAccountsAdmin.js`) — create parent/student
  logins, search-and-link one or more students, reset passwords. Since there's no
  email service wired into the backend, creating an account or resetting a password
  shows the generated temporary password **once**, in a copy-to-clipboard dialog — you
  relay it to the family directly. This mirrors exactly what the backend API returns
  and never retains it client-side after the dialog closes.
- **Mark Attendance** (`components/AttendanceMarker.js`) — a dedicated screen, not the
  generic CRUD pattern, because the real workflow is "load a class roster, tap each
  student's status, save all at once." Pick class + section + date, it pre-fills any
  already-marked statuses for that day, then calls the backend's bulk endpoint.
- **Homework, Study Materials, Exam Schedule, PTM Schedule** — standard generic
  `ResourceAdmin` screens via `academicResourceConfigs` in `lib/resourceConfigs.js`.
- **Results** (`components/ResultsAdmin.js`) — also dedicated, not generic, because a
  result has a nested array of subject-wise marks that the generic form's flat
  `FormField` set can't represent. Add/remove subject rows freely; totals, percentage,
  and overall grade are computed server-side on save. Results stay hidden from the
  portal until you toggle **Published** — draft results never leak to a parent early.
- **Fee Records** — generic screen, but its `student` field uses a new
  `studentSelect` field type (searchable dropdown backed by `/api/students`) instead
  of asking staff to paste a raw MongoDB ID.

All of these hit the backend's **staff-only** routes (`buildStaffCrudRouter`, not the
public `buildCrudRouter` used for banners/facilities/etc.) — GET requires staff auth
too, since this is student PII.

## Setup
```bash
cd mrvps-admin
npm install
cp .env.example .env.local     # point NEXT_PUBLIC_API_BASE_URL at your backend
npm run dev                     # http://localhost:3001 (backend should be on :5000)
```
Log in with the superadmin account created by the backend's `npm run seed`.

### Important: same-site requirement
The refresh token cookie is `httpOnly` + `sameSite=strict`. That's only sent by
the browser when this admin panel and the backend API **share the same
registrable domain** — e.g. `admin.mrvps.org` calling `api.mrvps.org` in
production, or both on `localhost` (any ports) in dev. If you deploy the admin
panel on a completely different domain than the API, silent refresh (and
therefore staying logged in across reloads) will not work — keep them on the
same domain.

## Verified this session
- `npm install` clean, no vulnerability warnings (Next pinned to `14.2.35`,
  same rationale as the frontend — see its README).
- Full production build succeeds — all 35 routes compile and prerender
  (checked with no network access to the backend or Google Fonts, same as the
  frontend check), including the 9 new Academics & Portal screens.
- Fixed two real bugs during this build: `lucide-react` doesn't export
  `FileUser` or `IdCard` in the installed version — swapped to `FileCheck2`
  and `Contact` respectively (verified against the actual installed package's
  exports, not guessed), and a missing closing brace in `FormField.js`'s new
  `StudentSelectField` component. Rebuilt clean after each fix.

## Not done yet
- Not clicked through against a live backend yet. To actually verify end to
  end: start `mrvps-backend` (seeded), start this app, log in, and walk
  through at minimum: create a Banner, edit Site Settings, upload an image,
  and update an Admission Enquiry's status — then confirm the public site
  reflects the change.
- The `Page` and `GalleryAlbum` "blocks"/"items" fields are edited as raw JSON
  textareas for now (see `lib/resourceConfigs.js`, type `'json'`). That's
  functional but not friendly — a proper drag-and-drop block editor / media
  picker is the natural next iteration once the core CRUD flow is confirmed
  working end-to-end.
- No audit-log viewer in this UI yet, even though the backend records one for
  every write (`AuditLog` collection) — worth adding as a read-only screen for
  `admin`/`superadmin` only.

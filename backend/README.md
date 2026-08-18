# MRVPS School — Backend (Phase 1)

Node.js + Express + MongoDB backend for M.R. Vivekananda Public School website.
Covers **all** modules in the provided sitemap PDF: Home content, About, Academics,
Admission, Facilities, Student Life, Faculty, Gallery, News & Events, Parents/Students
Corner content, Alumni, Career, Downloads, Contact.

Status: **Phase 1 complete and tested** (models load clean, app boots clean).
Phase 2 (Public Website) and Phase 3 (Admin Panel) are next — see bottom of this file.

## Stack
- Express 4, MongoDB/Mongoose 8
- JWT auth: short-lived access token (15m) + rotating refresh token stored **only as a
  SHA-256 hash** in `RefreshToken` collection (never plaintext), delivered via
  `httpOnly` + `sameSite=strict` cookie. Reuse of a revoked token revokes the whole
  token family (theft detection).
- RBAC: 5 roles — `superadmin`, `admin`, `content_editor`, `admissions_officer`, `viewer`.
  `superadmin` bypasses all role checks. Route-level `requireRole(...)`.
- Security: helmet, CORS allowlist, express-rate-limit (general/auth/form tiers),
  express-mongo-sanitize, xss-clean, hpp, bcrypt (cost 12), multer with type/size
  limits + randomized filenames (never trusts original filename), centralized error
  handler (no stack leaks in production), AuditLog collection on every write +
  every login attempt.

## Setup
```bash
cd mrvps-backend
npm install
cp .env.example .env      # then edit secrets — never commit .env
# start local MongoDB, then:
npm run seed               # creates the first superadmin using SEED_SUPERADMIN_* in .env
npm run seed:demo          # optional — fills every collection with realistic demo content
npm run dev                 # nodemon, http://localhost:5000
```
After seeding, remove `SEED_SUPERADMIN_EMAIL` / `SEED_SUPERADMIN_PASSWORD` from `.env`.

### `npm run seed:demo` — full realistic demo data
Run this after `npm run seed` to populate every collection with plausible, realistic
content in one shot — banners, About Us pages, all 5 academic program levels, 12
facilities, 10 faculty members, a mix of news/events/circulars/holidays/achievements,
gallery albums, testimonials, downloads, FAQs, fee structure, scholarships, alumni
stories, career openings, a couple of admission enquiries and contact messages, **5
students across different classes**, portal logins, 15 days of attendance history,
homework, study materials, an exam schedule, one fully-computed published Result, a PTM
date, and fee records (one paid, one pending) — so the site, admin panel, and portal all
look complete immediately instead of empty.

It's idempotent (safe to run more than once — matches each record by a natural key and
skips it if already present, never duplicates) and every demo record is clearly
labelled for easy cleanup later: student admission numbers start `MRV26-`, portal
login emails end `@demo.mrvps.org`. New portal logins created by this script:
- Parent: `deepak.sharma@demo.mrvps.org` / `ParentDemo#26`
- Student: `aarav.sharma@demo.mrvps.org` / `StudentDemo#26`

(These are separate from `demo.parent@mrvps.org` / `demo.student@mrvps.org` created by
the base `npm run seed` — both work, use whichever.) **Delete all of this before going
live** — it's realistic-looking placeholder content, not real student data.

## Folder structure
```
src/
  config/db.js            Mongo connection
  models/                 22 Mongoose models (see below)
  middleware/              auth, rbac, upload, rate limiters, validation, error handler
  controllers/              auth, user (admin accounts), admission, contact, career,
                             alumni, settings, upload
  routes/                   one file per domain + cms.routes.js (generic CRUD wiring)
  utils/                    tokens (JWT/hashing), AppError, audit log, crudFactory,
                             routeFactory, seed.js
  uploads/                  local file storage (swap for S3-compatible storage in
                             production by changing middleware/upload.js only)
```

## Models (32)
`User`, `RefreshToken`, `AuditLog`, `Banner`, `Page` (block-based, powers all About Us /
Academics / Admission static subpages), `AcademicProgram`, `Facility`, `FacultyMember`,
`NewsEvent` (news/event/circular/holiday/achievement — one model, `type` field),
`GalleryAlbum` (photo + video items, virtual tour flag), `Testimonial`, `DownloadItem`,
`CareerOpening`, `CareerApplication`, `AdmissionEnquiry`, `ContactMessage`, `FAQ`,
`FeeStructure`, `ScholarshipInfo`, `AlumniStory`, `AlumniRegistration`, `SchoolSettings`
(singleton — logo, address, phones, socials, map, SEO defaults), plus the Parent/Student
Portal models below.

## Parent/Student Portal (separate auth system)
`Student` (academic record), `PortalAccount` (parent/student login — a parent can link
multiple children, a student account links to exactly one), `PortalRefreshToken`,
`Attendance`, `Homework`, `StudyMaterial`, `ExamSchedule`, `Result` (auto-computes
totals/percentage/grade on save), `PTMSchedule`, `FeeRecord`.

This is a **completely separate auth system** from staff login — different JWT secrets
(`JWT_PORTAL_*` env vars), different httpOnly cookie (`mrvps_portal_refresh`, scoped to
`/api/portal/auth`), different refresh-token collection. A leaked staff token can never
be used as a portal token and vice versa.

**Portal auth**: `POST /api/portal/auth/login`, `/refresh`, `/logout`, `GET /me`,
`POST /change-password` — same rotation/theft-detection pattern as staff auth.

**Portal data** (`GET /api/portal/*`, requires portal login): `/student`, `/attendance`,
`/homework`, `/study-materials`, `/exam-schedule`, `/results`, `/ptm-schedule`,
`/fee-records` — every one takes `?studentId=` and verifies the logged-in account
actually owns that student (`middleware/portalAuth.js#assertOwnsStudent`) before
returning anything. This ownership check is the entire authorization model for portal
data and is worth reading directly if you're auditing this.

**Staff management of portal data** — all under `requireAuth` + role, and critically,
using `utils/routeFactory.js#buildStaffCrudRouter` rather than the public `buildCrudRouter`
used for CMS content: every verb, including `GET`, requires staff auth. Student records
must never be publicly listable the way banners/facilities are.
- `/api/portal-accounts` (admin only) — create/reset-password/deactivate parent & student
  logins. Passwords are generated server-side and returned once in the API response for
  staff to relay to the family directly — there's no email service wired up, so this is a
  manual handoff step, not an automated "forgot password" email flow.
- `/api/students`, `/api/homework`, `/api/study-materials`, `/api/exam-schedule`,
  `/api/results`, `/api/ptm-schedule`, `/api/fee-records` (admin/teacher, per-route as
  configured in `academic.routes.js`)
- `/api/attendance/class?class=&section=&date=` + `POST /api/attendance/bulk` — the
  actual teacher workflow: load a class roster with today's attendance pre-filled, mark
  everyone, save in one call.

**Honest limitation — Fee Records is not a payment gateway.** It's a ledger: admin
records what's owed and marks it paid when payment is received offline (cash, cheque,
bank transfer). There's no Razorpay/PayU checkout here. If online fee payment is wanted,
that's a real follow-up scope item — it needs a payment gateway integration, webhook
handling for payment confirmation, and receipt generation, none of which is in this
build.

## API surface
All routes are under `/api`.

**Auth** — `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`,
`GET /auth/me`, `POST /auth/change-password`

**Admin users** — `GET/POST /users`, `PUT/DELETE /users/:id` (admin+)

**Public forms** — `POST /admission/enquiries`, `POST /contact`,
`POST /careers/:openingId/apply`, `POST /alumni/register` (all rate-limited)

**Form review (staff)** — `GET/PUT /admission/enquiries[/:id]`, `GET/PUT /contact`,
`GET/PUT /careers/applications`, `GET/PUT /alumni/registrations`

**Settings** — `GET /settings` (public), `PUT /settings` (admin)

**Uploads** — `POST /uploads/image|document|media` (staff), `POST /uploads/resume` (public)

**CMS (generic REST pattern: `GET /` list+search+pagination, `GET /:id`, `POST /`,
`PUT /:id`, `DELETE /:id`; GET is public, writes need `admin`/`content_editor`, delete
needs `admin`)**:
`/banners`, `/pages`, `/academic-programs`, `/facilities`, `/faculty`, `/news-events`,
`/gallery`, `/testimonials`, `/downloads`, `/careers/openings`, `/faqs`,
`/fee-structure`, `/scholarships`, `/alumni/stories`

## What's verified in this session
- `npm install` succeeds (multer pinned to patched 2.x, not vulnerable 1.x).
- All 32 models `require()` cleanly (schema syntax valid).
- `app.js` boots and registers all routes without throwing (checked without a live
  Mongo connection — connect a real MongoDB and run `npm run dev` to fully verify).
- Full route table printed and manually checked: every student-PII route (students,
  attendance, homework, results, exam-schedule, ptm-schedule, fee-records,
  portal-accounts) requires staff auth on every verb including GET; every portal route
  requires portal login and is scoped to the account's own linked student(s).

`npm run seed` now also creates a demo student (Aarav Sharma, Class 6-A, admission no
`DEMO-0001`) and a demo parent portal login (`demo.parent@mrvps.org` /
`DemoParent#2026`) so the whole portal flow — parent login → view attendance/homework/
results/fees — can be exercised immediately without manually creating records first.
Delete both before going live.

## NOT done yet (be honest about scope)
This single session produced a complete, coherent **Phase 1 backend**. It has not been
run against a live MongoDB instance or hit with real HTTP requests/Postman — do that
before trusting it in production. Recommended next steps before Phase 2:
1. `npm run dev` against a real Mongo instance, `npm run seed`, then smoke-test each
   route group with curl/Postman/Thunder Client.
2. Add integration tests (Jest + supertest) for auth flow and at least one CRUD module.
3. Decide file storage for production (local disk works for dev; swap to S3/Cloud
   storage in `middleware/upload.js` + `controllers/upload.controller.js` before
   deploying — local disk won't persist across most PaaS deploys).

## Phase 2 — Public Website (Next.js + Tailwind)
Not started. Will consume this API for: Home, About Us (+7 subpages), Academics
(+5 levels), Admission (+FAQ/fees/scholarships), Facilities, Student Life, Faculty,
Gallery, News & Events, Parents/Students Corner, Alumni, Career, Downloads, Contact —
using the `Page` model's block renderer for static-ish subpages and dedicated
components for the collection-backed sections (news, gallery, faculty, etc.).

## Phase 3 — Admin Panel (Next.js + Tailwind)
Not started. Will be a role-aware dashboard: sidebar driven by `req.user.role`,
CRUD screens per module reusing the consistent `{data, pagination}` REST shape,
a rich block editor for `Page`, media library backed by `/uploads`, and dedicated
review queues for Admission Enquiries / Contact Messages / Career Applications /
Alumni Registrations.

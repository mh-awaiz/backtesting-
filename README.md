# Northbeam — PineScript Development Agency Platform

A Next.js + MongoDB platform for a PineScript/TradingView development team:
a premium public site for ads/lead-gen, and a private client/developer/admin
system for running projects.

## Quick start

1. `npm install`
2. `cp .env.local.example .env.local` and fill in:
   - `MONGODB_URI` — MongoDB Atlas (or self-hosted) connection string
   - `AUTH_SECRET` — generate with `npx auth secret`
   - `NEXT_PUBLIC_UPI_ID` — the UPI ID shown on the client payment panel
3. `npm run seed` — creates sample accounts, indicators, and projects
4. `npm run dev` — http://localhost:3000

**Seeded logins** (all password `password123`):
- `admin@northbeam.dev` — admin panel
- `dev@northbeam.dev` — developer workspace (has one project pre-assigned)
- `client@northbeam.dev` — client dashboard (has one project in progress, one pending)

## What's real vs. what's stubbed

This covers the workflow end-to-end and is genuinely functional, but a few
pieces are intentionally simplified for a first version — each is a known,
contained swap rather than a redesign:

| Area | Current state | To go to production |
|---|---|---|
| **Chat** | Polls every 4s via a normal API route | Fine as-is for a small team; swap to Pusher/Ably/socket.io if you want true push |
| **File storage** | Local disk (`public/uploads/`) | Move to S3 or Cloudflare R2 — required for serverless hosts (Vercel's filesystem is read-only/ephemeral in production) |
| **Payments** | Static QR + UPI ID, client self-reports "paid", admin verifies manually | Wire up Razorpay/Stripe when ready — `paymentStatus` (`unpaid`/`claimed`/`verified`) already models this |
| **Homepage stats, testimonials, FAQ, services** | Hardcoded in components | Move to a `Settings`/`Testimonial`/`FAQ` collection + admin CRUD, same pattern as `Indicator` |
| **Contact-info moderation** | Regex/heuristic filter (`lib/moderation.ts`) — catches phone numbers, emails (incl. "at"/"dot" obfuscation), URLs, @handles, spaced-out letters, platform keywords | Good first line of defense, not perfect. Expand the keyword list from real violation logs (`/admin/messages`); add OCR for image uploads later if it becomes a problem |
| **Blog, audit log, analytics/ad-pixel wiring** | Not built | Noted as "future-ready" in the original spec — the schema and routing conventions here extend cleanly to them |

Everything else — auth, roles, the inquiry → assignment → project → chat →
payment flow, the indicator showcase, and moderation blocking — is real and
working, not mocked.

## Leads vs. Inquiries

Two intentionally different capture paths, both feeding the same admin panel:

- **Leads** (`/admin/leads`) — a lightweight, no-account "just leave your
  email" form. It appears twice on the public site: at the bottom of the
  homepage final CTA, and on every indicator detail page (for visitors who
  are curious about one specific indicator but aren't ready to write a full
  brief). Statuses: `new → contacted → converted / closed`.
- **Inquiries** (`/admin/inquiries`) — the full project brief, which requires
  an account and becomes a `Project` record once submitted (see below).

Nudge a promising lead toward the full inquiry form when you follow up —
there's no automatic conversion between the two, it's a manual admin call.

## Roles & flow

1. A visitor fills out the inquiry form (public homepage or `/client/projects/new`
   once logged in). If they're not logged in, their answer is held in
   `sessionStorage` and they're sent to register — then it's submitted
   automatically.
2. It lands in **Admin → Inquiries**. Opening one goes to the project detail
   page, where you assign a developer, set status/deadline/payment amount.
3. The developer sees it in **My projects**, updates status/progress, and
   chats with the client — every developer message is scanned before it
   sends.
4. The client tracks progress, chats back, and pays via the QR panel, which
   flips to "awaiting verification" until you confirm it on the admin side.

## Where things live

- `src/models/` — Mongoose schemas. `Project` intentionally covers both the
  inquiry and the active-project stages of one record (see the comment in
  that file) rather than duplicating near-identical schemas.
- `src/lib/moderation.ts` — the contact-info filter, isolated so it's easy
  to tune independently of the message route.
- `src/auth.config.ts` / `src/auth.ts` — split so `middleware.ts` (which runs
  on the Edge runtime) never bundles `bcrypt`/`mongoose`.
- `src/components/marketing/` — the public site. `CodePanel.tsx` is the
  animated hero centerpiece.
- `src/components/dashboard/` — shared client/developer/admin UI
  (`ChatBox`, `ProjectCard`, `Sidebar`, the per-role control panels).
- `src/app/api/` — every private route re-checks the session and the
  requester's relationship to the project server-side; nothing trusts a
  role sent from the client.

## Notes

- Cleaned out a batch of unused top-level components in `src/components/`
  (`Hero.tsx`, `Nav.tsx`, `Footer.tsx`, `TrustBar.tsx`, `Process.tsx`,
  `Testimonials.tsx`, `Packages.tsx`, `StrategyReportCard.tsx`,
  `ContactForm.tsx`, `ContactSection.tsx`, `Reveal.tsx`) — these were
  leftovers from an earlier, different project that had gotten bundled into
  this repo and weren't imported anywhere. The live site only ever used
  `src/components/marketing/*`.

- You'll see a `"middleware" file convention is deprecated, use "proxy"`
  warning during build — that's Next.js previewing a future rename, current
  `middleware.ts` still works and is the documented approach as of this
  build.
- Replace `public/payment-qr-placeholder.svg` with your actual UPI QR code
  image before going live.

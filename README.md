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

- You'll see a `"middleware" file convention is deprecated, use "proxy"`
  warning during build — that's Next.js previewing a future rename, current
  `middleware.ts` still works and is the documented approach as of this
  build.
- Replace `public/payment-qr-placeholder.svg` with your actual UPI QR code
  image before going live.

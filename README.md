# Pinex — PineScript Development Agency Platform

A Next.js + MongoDB platform for a PineScript/TradingView development team:
a premium public site for ads/lead-gen, and a private client/developer/admin
system for running projects, with a uniform chat system any developer or
admin can use to talk to any client.

## Quick start

1. `npm install`
2. `cp .env.local.example .env.local` and fill in:
   - `MONGODB_URI` — MongoDB Atlas (or self-hosted) connection string
   - `AUTH_SECRET` — generate with `npx auth secret`
   - `NEXT_PUBLIC_UPI_ID` — the UPI ID shown on the client payment panel
3. `npm run seed` — creates sample accounts, indicators, a project, and a
   short sample chat thread
4. `npm run dev` — http://localhost:3000

**Seeded logins** (all password `password123`):
- `admin@pinex.dev` — admin panel
- `dev@pinex.dev` — developer workspace, seeded as **available** (so
  auto-assignment has someone to hand new inquiries to)
- `client@pinex.dev` — client dashboard (one project in progress, one
  pending, plus a short sample chat)

## How chat works

Chat is scoped to the **client**, not to an individual project. One
conversation per client, and any developer or admin can open it and reply —
a project's `assignedDeveloper` is just who's primarily handling it, it
doesn't gate who can talk to that client.

- **Clients** reach their own conversation from any project page, or via
  the floating chat bubble on the public site (bottom-right — prompts
  sign-in if you're logged out).
- **Developers** get a dedicated **Chats** section (`/developer/chats`)
  listing every client, not just their assigned ones.
- **Admins** get the same thing at `/admin/chat`.
- Developer messages are scanned for phone numbers, emails, social/messaging
  handles, and off-platform contact attempts (`lib/moderation.ts`) —
  **Google Meet links are specifically allowed through** so calls can still
  be scheduled; everything else off-platform still blocks. Three violations
  flags a developer's account (`messagingRestricted`). Admin and client
  messages aren't scanned.
- If a client sends a message while no developer is marked available, a
  one-time system note drops into the thread: *"Developers aren't available
  right now — they'll follow up by email shortly."*

## Auto-assignment & availability

New inquiries no longer wait for an admin to assign them. On submission,
`/api/inquiries` picks the currently-**available** developer with the
fewest active projects and assigns immediately (status jumps straight to
`assigned`). If nobody's online, it's left unassigned (status `new`) — an
admin can still assign it manually from `/admin/projects/[id]` the same way
as before, this is a fallback, not a removed feature.

Developers toggle their own availability from a switch on their dashboard
(`AvailabilityToggle` → `PATCH /api/developers/availability`). Admins can
see who's online at a glance on `/admin/developers` and in the "Developers
online" stat on the admin dashboard.

## What's real vs. what's stubbed

| Area | Current state | To go to production |
|---|---|---|
| **Chat** | Polls every 4s via a normal API route | Fine as-is for a small team; swap to Pusher/Ably/socket.io if you want true push |
| **File storage** | Local disk (`public/uploads/<clientId>/`) | Move to S3 or Cloudflare R2 — required for serverless hosts (Vercel's filesystem is read-only/ephemeral in production) |
| **Payments** | Static QR + UPI ID, client self-reports "paid", admin verifies manually | Wire up Razorpay/Stripe when ready — `paymentStatus` (`unpaid`/`claimed`/`verified`) already models this |
| **Homepage stats, testimonials, FAQ, services** | Hardcoded in components | Move to a `Settings`/`Testimonial`/`FAQ` collection + admin CRUD, same pattern as `Indicator` |
| **Contact-info moderation** | Regex/heuristic filter — catches phone numbers, emails (incl. "at"/"dot" obfuscation), URLs, @handles, spaced-out letters, platform keywords; Meet links allowed | Good first line of defense, not perfect. Expand from real violation logs (`/admin/messages`); add OCR for image uploads later if it becomes a problem |
| **Auto-assignment** | Least-busy available developer, simple round-robin-by-load | Fine for a small team; add skill-tags/weighting if the team grows |
| **Blog, audit log, analytics/ad-pixel wiring** | Not built | Noted as "future-ready" in the original spec — the schema and routing conventions here extend cleanly to them |

## Roles & flow

1. A visitor fills out the inquiry form (public homepage or
   `/client/projects/new` once logged in). If they're not logged in, their
   answer is held in `sessionStorage` and they're sent to register — then
   it's submitted automatically.
2. The inquiry is auto-assigned to an available developer (see above), or
   left for admin to assign manually if nobody's online.
3. The developer sees it in **My projects**, updates status/progress, and
   chats with the client from either the project page or `/developer/chats`.
4. The client tracks progress, chats back, and pays via the QR panel, which
   flips to "awaiting verification" until confirmed on the admin side.
5. Anyone stuck can use the floating chat bubble on the public site instead
   of writing a full brief — it opens the same client-scoped conversation
   once they're signed in.

## Where things live

- `src/models/` — Mongoose schemas. `Project` intentionally covers both the
  inquiry and the active-project stages of one record. `Message` and
  `Violation` are keyed by `client`, not `project` — see the comment in
  `Message.ts` for why.
- `src/lib/moderation.ts` — the contact-info filter, with the Google Meet
  exception, isolated so it's easy to tune independently of the message route.
- `src/auth.config.ts` / `src/auth.ts` — split so `middleware.ts` (Edge
  runtime) never bundles `bcrypt`/`mongoose`.
- `src/components/marketing/` — the public site. `CodePanel.tsx` is the
  hero's animated code editor; `ScrollChart.tsx` is the scroll-linked
  candlestick chart below it — a pure SVG animation (no video) driven by a
  scroll-position listener, kept deliberately lightweight for page speed.
  `FloatingChatWidget.tsx` is the bottom-right chat bubble; any
  `ChatTriggerButton` elsewhere on the site opens it via
  `window.__openPinexChat()`.
- `src/components/dashboard/ChatBox.tsx` — the shared conversation UI, keyed
  by `clientId`. `ChatClientList.tsx` is the shared "pick a client to chat
  with" list used by both `/admin/chat` and `/developer/chats`.
- `src/app/api/` — every private route re-checks the session and the
  requester's relationship to the client/project server-side; nothing trusts
  a role sent from the client.

## Notes

- Cleaned out a batch of unused top-level components in `src/components/`
  in an earlier pass (`Hero.tsx`, `Nav.tsx`, `Footer.tsx`, etc.) — leftovers
  from a different project that had gotten bundled in. A few have reappeared
  in later uploads; they're still unused dead code, harmless but not touched
  this round since it wasn't asked for.
- You'll see a `"middleware" file convention is deprecated, use "proxy"`
  warning during build — that's Next.js previewing a future rename, current
  `middleware.ts` still works and is the documented approach as of this build.
- Footer now credits **Webraft Studio** (webraftstudio.in).

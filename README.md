# Ledger & Line — Backtesting Desk

A Next.js + MongoDB landing site for a solo trading-strategy backtesting
service (Pine Script / MT4 / MT5 / Python), built to move clients off Fiverr
onto a self-owned platform.

## What's included

- **Landing page** (`/`) — hero with an animated "strategy report card,"
  a ticker-style trust bar, the three real pricing tiers (Basic / Standard /
  Premium), a 4-step process section, and three real client testimonials.
- **Strategy request form** — posts to `/api/leads`, which saves every
  submission to MongoDB via Mongoose (name, email, platform, package,
  strategy details, status).
- **Admin view** (`/admin/leads`) — a simple key-gated page to read incoming
  requests without needing a database GUI. Enter the `ADMIN_KEY` you set
  in your environment to load them.
- Fully responsive, dark "ledger/terminal" visual identity, icons via
  `react-icons`.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy the env example and fill in real values:
   ```bash
   cp .env.local.example .env.local
   ```
   - `MONGODB_URI` — a MongoDB Atlas (or self-hosted) connection string.
     A free Atlas cluster is enough to start.
   - `ADMIN_KEY` — any long random string; this gates `/admin/leads` and
     the `GET /api/leads` endpoint. Treat it like a password.

3. Run the dev server:
   ```bash
   npm run dev
   ```
   Visit http://localhost:3000

4. Build for production:
   ```bash
   npm run build && npm start
   ```

## Where things live

- `src/app/page.tsx` — assembles the landing page from `src/components/`.
- `src/components/StrategyReportCard.tsx` — the animated hero centerpiece.
- `src/app/api/leads/route.ts` — POST to save a request, GET (key-gated)
  to list them.
- `src/models/Lead.ts` — the Mongoose schema for a request.
- `src/lib/mongodb.ts` — cached MongoDB connection helper.
- `src/app/admin/leads/page.tsx` — the request inbox.

## Extending it

This currently covers the public-facing site and lead capture — the same
foundation the Webraft platform is built on. Natural next additions, if you
want the full client-management experience Webraft has:

- Real authentication (NextAuth) with admin/client roles, instead of the
  shared `ADMIN_KEY`.
- A client-facing dashboard so people can see their own request status.
- Payments (e.g. Razorpay) tied to a package selection.
- Direct messaging between client and admin per request.

None of that is wired up yet — this build is the landing page + intake
system, ready to layer those on top of.

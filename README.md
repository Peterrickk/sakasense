# SakaSense — Main Website + Dashboard

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind v4 · Drizzle + Postgres · Better Auth · PayMongo (+ optional Stripe) · Resend · MDX.
Built from `SAKASENSE_WEBSITE_PLAN.md`.

## Two apps, one system

| App                              | Folder                                                                       | Local URL                             | Role                                                           |
| -------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------- | -------------------------------------------------------------- |
| Main website                     | repo root                                                                    | http://localhost:3000                 | Company site, the SakaSense Device page, order checkout        |
| Web dashboard (`sakasense_main`) | `sakasense_main/web` (Next.js) and `sakasense_main/hello`, `mysite` (Django) | http://localhost:3001/app (API :8000) | Farmers with Wi-Fi: plots, history, alerts, reports, Guidebook |

The three products are the **SakaSense Device** (the only item sold in the shop), the **SakaSense App**, and the **SakaSense Web Dashboard**.

How they connect:

- Website → dashboard: `NEXT_PUBLIC_DASHBOARD_URL` (default `NEXT_PUBLIC_SITE_URL` + `/app`) feeds `siteConfig.links` (Open dashboard, Create account, Log in, Guidebook).
- Dashboard → website: `NEXT_PUBLIC_MAIN_SITE_URL` (default: same origin) feeds the "← SakaSense website" and "Get the SakaSense Device" links (`sakasense_main/web/src/lib/site.ts`).
- Shared brand: same logo and name. Django CORS allows both origins (see `sakasense_main/render.yaml`).
- Dashboard setup: `cd sakasense_main/web && npm install`. API: create a Python venv, `pip install -r sakasense_main/requirements.txt`, then `python manage.py migrate` inside `sakasense_main`.
- Run both: `npm run dev` (website), `npm run dev:dashboard`, and `npm run dev:api`. Or run all three together, routed like production, with `vercel dev`.
- Deploy: one Vercel project with services (`vercel.json`): `website` serves `/`, `dashboard` serves `/app` (Next.js `basePath`), and the Django `api` is internal-only. The dashboard's `/app/api/*` route handlers reach Django through the `SAKASENSE_API_URL` binding (`sakasense_main/web/src/lib/api.ts`).
- The dashboard's login is still its demo account (`maria@sakasense.demo` / `sakasense123`, stored in the browser). It is **not** linked to website accounts yet; real shared sign-in is the next step.

## Run it

```bash
npm install
cp .env.example .env.local      # fill in what you have
npm run dev                     # http://localhost:3000
```

**With no `DATABASE_URL`** the public site still works: products come from the placeholder
seed data (`src/db/seed-data.ts`). Checkout, accounts, admin, forms, and tracking need a database.

## Environment files

| File                              | Committed?           | Purpose                                                                                                       |
| --------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------- |
| `.env.example`                    | yes                  | Template for the website                                                                                      |
| `.env`                            | **no** (git-ignored) | Your local website values (`BETTER_AUTH_SECRET` already generated)                                            |
| `sakasense_main/web/.env.example` | yes                  | Template for the dashboard                                                                                    |
| `sakasense_main/web/.env.local`   | **no**               | Your local dashboard values (Google Maps key)                                                                 |
| `sakasense_main/.env.example`     | yes                  | Variables for the Django API (`SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS`, `DATABASE_URL`, `CORS_ALLOWED_ORIGINS`) |

In production, set the same variables in your host's dashboard (Vercel for the website, Render for the dashboard and API). Never commit real keys. The Django API refuses to start under gunicorn without a `SECRET_KEY`.

## Database

```bash
npm run db:generate   # after changing src/db/schema.ts (migrations live in ./drizzle)
npm run db:migrate    # apply migrations to DATABASE_URL
npm run db:seed       # 5 placeholder products + admin user (ADMIN_EMAIL, optional ADMIN_PASSWORD)
```

`SEED_DEMO_PRICES=true npm run db:seed` fills demo prices/stock so you can test checkout (never in production).
Products with price ₱0 show "Price coming soon" and cannot be bought.

## Test

```bash
npm test              # Vitest: money, pricing/tampering, cart, validators, webhook signatures, env
npm run test:e2e      # Playwright (builds and serves on :3100)
npm run lint && npm run typecheck && npm run build
```

## Where things live

| What                                                                  | Where                            |
| --------------------------------------------------------------------- | -------------------------------- |
| Company info, contact, ecosystem links, shipping rates, feature flags | `src/config/site.ts`             |
| Navigation                                                            | `src/config/nav.ts`              |
| Team / FAQ / metrics / solutions copy                                 | `src/content/*.ts`               |
| News & legal (MDX)                                                    | `content/news`, `content/legal`  |
| Design tokens (dark default + light)                                  | `src/app/globals.css`            |
| Component gallery (dev only)                                          | `/dev/styleguide`                |
| Payments (PayMongo, Stripe behind one interface)                      | `src/lib/payments`               |
| Order creation (server-side price recompute)                          | `src/server/actions/checkout.ts` |
| Webhooks (idempotent)                                                 | `src/app/api/webhooks/*`         |

## Setup you must do

1. **Postgres** (Neon/Supabase) → `DATABASE_URL`, then migrate and seed.
2. **PayMongo** keys, and a webhook for `checkout_session.payment.paid` → `https://<domain>/api/webhooks/paymongo`.
   (Stripe is off until `siteConfig.features.stripe = true`; webhook → `/api/webhooks/stripe`, event `checkout.session.completed`.)
3. **Resend** key + verified domain (SPF/DKIM) → `RESEND_API_KEY`, `EMAIL_FROM`.
4. `BETTER_AUTH_SECRET` (`openssl rand -base64 32`), `BETTER_AUTH_URL`, optional Google OAuth keys.
5. Replace every `[PLACEHOLDER]` (grep for it). In production they are hidden automatically, so
   legal pages will be empty until a lawyer-reviewed text is added to `content/legal/*.mdx`.
6. Add leadership photos at `public/images/team/*.webp` and set `hasPhoto: true` in `src/content/team.ts`.
7. Turn on `showStats` / `showTestimonials` / `showPartners` in `site.ts` only when the content is real.

## Notes & known limits

- Rate limiting is in-memory (per server instance). For strict limits on Vercel, back it with Redis/Upstash.
- Stock is decremented when payment is confirmed (per plan); two simultaneous buyers of the last unit can oversell. Add row locking if that matters.
- CSP allows inline scripts (needed by Next hydration and the theme snippet); move to nonces if every page can be dynamic.
- Order-confirmation page reads its summary from the browser's own cart, so order details are never exposed by URL.
- Admin access is checked in every admin page **and** every admin server action (`assertAdmin`).

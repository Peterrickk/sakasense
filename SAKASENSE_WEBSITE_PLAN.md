# SakaSense Venture Solutions — Main Website Implementation Plan

> **For the implementing AI:** Build this website **one phase at a time, in order**. Each step has a goal, the files to create, and an **acceptance check**. Do not start the next step until the current one passes its check. Wherever you see `[PLACEHOLDER]`, use the placeholder text as written and do not invent facts such as specs, prices, certifications, or customer names. The business owner will replace these later.

---

## 0. Project Overview

### 0.1 The company

- **Name:** SakaSense Venture Solutions (short brand: **SakaSense**)
- **What we sell:** An IoT soil-quality sensing device, plus a software ecosystem around it.
- **Leadership:**
  - **Peter Jade Talabucon** — Chief Executive Officer (CEO)
  - **Aliana Maria Akala** — Chief Financial Officer (CFO)
  - **Louigie B. Guillera** — Chief Technology Officer (CTO)

### 0.2 The SakaSense ecosystem (4 products — this plan builds #1 only)

| #   | Product                        | Purpose                                    | Suggested URL           | In this plan?   |
| --- | ------------------------------ | ------------------------------------------ | ----------------------- | --------------- |
| 1   | **Main website**               | Company info, product catalog, ordering    | `sakasense.com`         | ✅ **Build it** |
| 2   | Device web dashboard           | Live soil data from the user's devices     | `app.sakasense.com`     | ❌ Link only    |
| 3   | Mobile app (Bluetooth + Wi-Fi) | Pair and read devices in the field         | App Store / Google Play | ❌ Link only    |
| 4   | SakaSense Guidebook            | Help farmers understand and use the device | `guide.sakasense.com`   | ❌ Link only    |

The main website is the **front door**. It must clearly point visitors to the dashboard, the app, and the guidebook. Store those URLs in a single config file (Step 1.4) so they are easy to change later.

### 0.3 Goals of the main website

1. Explain what SakaSense is and why it matters to farmers, in plain language.
2. Show the products with clear descriptions, specs, and prices.
3. Let visitors **order online** (cart → checkout → payment → confirmation → tracking).
4. Build trust with the company story, the leadership team, and contact details.
5. Route users to the ecosystem (dashboard, app, guidebook).
6. Capture leads, including bulk or B2B quote requests from cooperatives, LGUs, and agribusinesses.

### 0.4 Market assumption

The plan assumes the company is **based in the Philippines** ("saka" means farming in Filipino). So:

- The default currency is **PHP (₱)**.
- The primary payment provider is **PayMongo** (GCash, Maya, cards, GrabPay), with **Stripe** as an optional second provider for international orders.
- Legal pages follow the **Data Privacy Act of 2012 (RA 10173)**.
- Content is English first, with the i18n structure ready for **Filipino (Tagalog)** later.

> If any of this is wrong, change it in `src/config/site.ts` and the payment provider module. The rest of the architecture stays the same.

---

## 1. Tech Stack (2026)

| Layer               | Choice                                                             | Why                                                            |
| ------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------- |
| Framework           | **Next.js 16 (App Router) + React 19 + TypeScript (strict)**       | SSR/SSG for SEO, Server Actions, one codebase for site and API |
| Styling             | **Tailwind CSS v4**                                                | Fast, design-token friendly                                    |
| UI primitives       | **shadcn/ui** (Radix-based)                                        | Accessible, fully owned components                             |
| Animation           | **Motion** (`motion/react`, formerly Framer Motion)                | Scroll reveals, micro-interactions                             |
| 3D / hero visual    | **React Three Fiber + drei** (lazy-loaded)                         | Futuristic device or soil-particle hero                        |
| Icons               | **lucide-react**                                                   | Clean line icons                                               |
| Database            | **PostgreSQL (Neon or Supabase)**                                  | Products, orders, customers                                    |
| ORM                 | **Drizzle ORM** + drizzle-kit migrations                           | Typed, light                                                   |
| Auth                | **Better Auth** (email + Google)                                   | Customer accounts and admin role                               |
| Cart state          | **Zustand** with `persist` (localStorage)                          | Simple client cart                                             |
| Validation          | **Zod**                                                            | Shared form and API validation                                 |
| Forms               | **react-hook-form** + Zod resolver                                 |                                                                |
| Payments            | **PayMongo** (primary), **Stripe** (optional) behind one interface | Local and international payments                               |
| Email               | **Resend + React Email**                                           | Order confirmations, contact notifications                     |
| Content (blog/news) | **MDX** files in repo (`content/`)                                 | No CMS needed at first                                         |
| Images              | `next/image` + `public/` (later: Cloudinary or Supabase Storage)   |                                                                |
| Analytics           | **Vercel Analytics** or **Plausible**                              | Privacy-friendly                                               |
| Hosting             | **Vercel**                                                         | Native Next.js hosting                                         |
| Testing             | **Vitest** (unit), **Playwright** (e2e)                            |                                                                |
| Lint/format         | ESLint (next config) + Prettier                                    |                                                                |

---

## 2. Design System — "Futuristic Agritech"

### 2.1 Visual concept

**"From soil to signal."** The site pairs living earth (soil, leaves, growth) with high-tech data (sensor readouts, grids, glowing lines). The look is dark and premium with **luminous green** accents, like a night-vision view of a healthy field.

Recurring motifs:

- Thin **grid lines** and **topographic contour lines** as section backgrounds
- **Glowing green data pulses** that travel along lines (the signal leaving the soil)
- **Glassmorphism cards**: translucent with a blurred backdrop and a 1px light border
- **Monospace sensor readouts** (`pH 6.4`, `N 42 mg/kg`, `Moisture 31%`) used as decoration
- Organic shapes such as leaf curves and soil layers, cut with precise geometric lines

### 2.2 Color tokens (define in `src/app/globals.css` with Tailwind v4 `@theme`)

Dark mode is the **default and hero** theme. A light theme is also required for readability and accessibility.

| Token                  | Dark (default)           | Light                | Use                         |
| ---------------------- | ------------------------ | -------------------- | --------------------------- |
| `--color-bg`           | `#050B08`                | `#F6FAF7`            | Page background             |
| `--color-surface`      | `#0B1611`                | `#FFFFFF`            | Cards                       |
| `--color-surface-2`    | `#11211A`                | `#EEF5F0`            | Raised and hover surfaces   |
| `--color-border`       | `rgba(134,239,172,0.12)` | `rgba(6,78,59,0.12)` | Hairlines                   |
| `--color-text`         | `#E8F5EC`                | `#0B1F15`            | Body text                   |
| `--color-text-muted`   | `#8FA89A`                | `#4B6357`            | Secondary text              |
| `--color-primary`      | `#22E07A`                | `#0E9F57`            | Brand green: buttons, links |
| `--color-primary-glow` | `#5BFFA6`                | `#22E07A`            | Glows, highlights           |
| `--color-accent`       | `#B8F35A`                | `#5E9E12`            | Lime accent: badges, data   |
| `--color-soil`         | `#8B5E3C`                | `#7A4F2E`            | Earth tone, used sparingly  |
| `--color-info`         | `#38BDF8`                | `#0284C7`            | Moisture and water data     |
| `--color-warning`      | `#FBBF24`                | `#B45309`            | Alerts                      |
| `--color-danger`       | `#F87171`                | `#DC2626`            | Errors                      |

- Signature gradient: `linear-gradient(135deg, #22E07A 0%, #B8F35A 100%)`. Use it for headline highlights and primary CTAs.
- Glow: `box-shadow: 0 0 40px -8px rgba(34,224,122,0.45)`. Use it on the primary CTA and featured cards only.
- **Contrast rule:** All body text must meet WCAG AA (4.5:1). Never put green text on a green surface.

### 2.3 Typography (via `next/font/google`)

- **Display/headings:** `Space Grotesk` (600–700). Futuristic and geometric.
- **Body:** `Inter` (400–600)
- **Data/readouts/labels:** `JetBrains Mono` (400–500)
- Scale: fluid with `clamp()`. H1 is `clamp(2.5rem, 6vw, 5rem)`; body is `1rem` to `1.125rem`.

### 2.4 Layout and components

- Max content width is `1280px`. Side gutter is 16px on mobile and 24–32px on desktop.
- Corner radius: `12px` for cards, `9999px` for pills and buttons.
- **Mobile-first.** Every page must work at 360px width with no horizontal scroll.
- Core components (build in Phase 2): `Button` (primary/glow, secondary/glass, ghost), `GlassCard`, `SectionHeading` (eyebrow + title + subtitle), `Badge`, `SensorReadout` (mono label + animated value), `GridBackground`, `ContourBackground`, `GlowOrb`, `ProductCard`, `TeamCard`, `StatCounter`, `Accordion` (FAQ), `Tabs`, `Toast`, `Dialog`, `Sheet` (mobile nav and cart drawer), `PriceTag`, `QuantityStepper`, `Breadcrumbs`, `EmptyState`.

### 2.5 Motion rules

- Fade-and-rise reveal on scroll: 16px, 400ms, ease-out, staggered by 60ms.
- Hover on cards: lift 4px and brighten the border.
- The hero may have a slow ambient animation (particles or a rotating device).
- **Respect `prefers-reduced-motion`.** Disable all non-essential motion and the 3D scene, and show a static image instead.
- Lazy-load the 3D hero. The page must be usable before it loads. Target LCP under 2.5s on 4G.

---

## 3. Sitemap and Page Specifications

```
/                         Home
/products                 Product catalog
/products/[slug]          Product detail
/how-it-works             How the device and ecosystem work
/solutions                Use cases (smallholders, co-ops, commercial farms, research/LGU)
/ecosystem                Dashboard, Mobile App, Guidebook hub
/about                    Company story, mission, vision, values
/about/leadership         CEO, CFO, CTO
/news                     News/blog list (MDX)
/news/[slug]              Article
/faq                      FAQ
/contact                  Contact form, map, details
/quote                    Bulk/B2B quote request
/cart                     Cart page (a drawer also exists)
/checkout                 Checkout
/checkout/success         Order confirmation
/orders/track             Track order (order no. + email)
/account                  Customer: profile and order history (auth)
/account/orders/[id]      Order detail (auth)
/login, /register         Auth
/admin                    Admin dashboard (role: admin)
/admin/products           CRUD products
/admin/orders             Manage orders and statuses
/admin/inquiries          Contact and quote submissions
/legal/privacy            Privacy Policy (RA 10173)
/legal/terms              Terms of Service
/legal/shipping-returns   Shipping and Returns
/legal/warranty           Warranty
not-found                 Custom 404
```

### 3.1 Global layout

- **Header (sticky, glass blur on scroll):** logo · Products · How it Works · Solutions · Ecosystem ▾ (Dashboard, Mobile App, Guidebook) · About ▾ (Our Story, Leadership, News) · Contact. On the right: theme toggle, account icon, **cart icon with count badge**, and a primary CTA "**Shop Now**".
- **Mobile:** a hamburger opens a full-height `Sheet` menu. Cart opens a cart `Sheet`.
- **Footer:** logo and tagline; columns for Products, Company, Ecosystem, Support, and Legal; newsletter signup; social links `[PLACEHOLDER]`; address, email, and phone `[PLACEHOLDER]`; "© {year} SakaSense Venture Solutions. All rights reserved."
- **Announcement bar (optional, config-driven):** for example, "Free shipping nationwide on orders over ₱X [PLACEHOLDER]".

### 3.2 Home (`/`)

Build these sections in order:

1. **Hero**
   - Eyebrow: `SMART SOIL INTELLIGENCE`
   - H1: "Know your soil. **Grow with confidence.**" (gradient on the second line)
   - Sub: "SakaSense is an IoT soil sensor that reads your field's health in real time and sends it to your phone over Bluetooth or Wi-Fi, so every planting decision is backed by data."
   - CTAs: **Shop SakaSense** → `/products`; secondary "See how it works" → `/how-it-works`
   - Visual: a 3D device model or stylized device render with floating `SensorReadout` chips (pH, Moisture, N-P-K, Temperature) that animate their values. Use a static image fallback.
2. **Trust strip:** "Built for Filipino farmers" with partner/pilot logos `[PLACEHOLDER — hide section if none]`.
3. **Problem → Solution:** Two columns. "Guesswork costs harvests" (overfertilizing, wasted water, low yields) vs. "SakaSense gives you answers."
4. **What it measures:** A grid of metric cards. Each card has an icon, a metric name, a one-line farmer-friendly explanation, and a sample readout. Metrics: soil moisture, pH, N, P, K, temperature, electrical conductivity. **`[PLACEHOLDER — confirm exact sensor capabilities]`**
5. **How it works (3 steps):** ① Insert into soil → ② Connect via Bluetooth or Wi-Fi → ③ Get insights in the app or dashboard. Connect the steps with an animated glowing line.
6. **Featured products:** 2–3 `ProductCard`s from the database, plus a "View all products" link.
7. **The Ecosystem:** Three glass cards for Web Dashboard, Mobile App (App Store and Google Play badges), and Guidebook, each linking out.
8. **Impact stats:** `StatCounter`s that animate on view, e.g. farms served, hectares monitored, readings collected. **`[PLACEHOLDER numbers — hide until real]`**
9. **Testimonials:** carousel. **`[PLACEHOLDER — hide section until real testimonials exist]`**
10. **Leadership teaser:** three small `TeamCard`s → `/about/leadership`
11. **FAQ preview:** 4 questions in an accordion → `/faq`
12. **Final CTA band:** "Ready to see what's beneath the surface?" with buttons [Shop Now] [Request a bulk quote]

### 3.3 Products (`/products`)

- Header with title and short intro.
- Filter chips by category (Devices, Bundles, Accessories, Subscriptions). Sort options: featured, price low→high, price high→low.
- Responsive grid of `ProductCard`s: image, name, short tagline, key spec chips, price, stock badge, and "Add to cart". Hover shows a glow border.
- A "Need 10+ units? **Request a bulk quote**" banner → `/quote`.

**Seed product lineup. All details are `[PLACEHOLDER]` and must be confirmed by the owner:**

| Slug                    | Name                  | Category      | Price (PHP) | Short description                                |
| ----------------------- | --------------------- | ------------- | ----------- | ------------------------------------------------ |
| `sakasense-core`        | SakaSense Core        | Devices       | ₱[TBD]      | Single-point soil sensor. Bluetooth + Wi-Fi.     |
| `sakasense-pro`         | SakaSense Pro         | Devices       | ₱[TBD]      | Multi-depth probe, longer battery, weatherproof. |
| `sakasense-farm-kit`    | SakaSense Farm Kit    | Bundles       | ₱[TBD]      | 5× Core + carrying case, for larger plots.       |
| `solar-charging-pack`   | Solar Charging Pack   | Accessories   | ₱[TBD]      | Keeps the sensor powered in the field.           |
| `sakasense-plus-annual` | SakaSense Plus (1 yr) | Subscriptions | ₱[TBD]      | Advanced dashboard analytics and history.        |

### 3.4 Product detail (`/products/[slug]`)

- Breadcrumbs.
- **Left:** image gallery with thumbnails and zoom. Optionally a 3D viewer tab.
- **Right:** name, rating `[hide if none]`, price, stock status, short description, variant selector (if any), `QuantityStepper`, **Add to cart** and **Buy now** buttons, and trust bullets (warranty, shipping, support).
- **Tabs below:** Overview (rich description) · Specifications (table from `specs` JSON) · What's in the box · Connectivity (Bluetooth/Wi-Fi details, app and dashboard links) · Guidebook (link to the relevant guide pages).
- "Works with" ecosystem strip, plus a related products row.
- SEO: `Product` JSON-LD (name, image, description, sku, offers, price, priceCurrency `PHP`, availability).

### 3.5 How it works (`/how-it-works`)

A scroll-driven story: device anatomy (labeled diagram) → placement in soil → data captured → transmission over **Bluetooth** (nearby, no internet needed) or **Wi-Fi** (continuous remote monitoring) → insights in the app and dashboard → action (fertilize, irrigate, plant). End with a comparison table of Bluetooth mode vs. Wi-Fi mode, then a CTA.

### 3.6 Solutions (`/solutions`)

Four use-case blocks. Each has an image, the pain point, how SakaSense helps, and a recommended product:

- Smallholder farmers
- Farmer cooperatives
- Commercial farms and plantations
- Research institutions, schools, and LGUs/agricultural offices

### 3.7 Ecosystem (`/ecosystem`)

A hub page with one large section per platform:

- **Web Dashboard:** screenshot mockup, features, "Open Dashboard" → `links.dashboard`
- **Mobile App:** phone mockup, Bluetooth and Wi-Fi pairing explained, store badges → `links.appStore`, `links.playStore`
- **SakaSense Guidebook:** "Learn to read your soil", topic cards, "Open Guidebook" → `links.guidebook`

### 3.8 About (`/about`)

- Hero: "Rooted in the field. Built with technology."
- Our story `[PLACEHOLDER — founding story, year, location]`
- **Mission** `[PLACEHOLDER]`. Suggested: "To give every Filipino farmer access to affordable, real-time soil intelligence."
- **Vision** `[PLACEHOLDER]`. Suggested: "A future where every harvest is grown on data, not guesswork."
- **Values** (4 cards): Farmer-first · Sustainability · Innovation · Integrity
- Timeline of milestones `[PLACEHOLDER]`
- Leadership teaser → `/about/leadership`

### 3.9 Leadership (`/about/leadership`)

Three large `TeamCard`s in a row on desktop and stacked on mobile. Each card has:

- Portrait in a rounded frame with a subtle green rim-light glow on hover
- Name, title, short bio `[PLACEHOLDER]`, LinkedIn/email icons `[PLACEHOLDER]`

| Name                     | Title                    | Bio placeholder focus                      |
| ------------------------ | ------------------------ | ------------------------------------------ |
| **Peter Jade Talabucon** | Chief Executive Officer  | Vision, strategy, and partnerships         |
| **Aliana Maria Akala**   | Chief Financial Officer  | Finance, operations, sustainable growth    |
| **Louigie B. Guillera**  | Chief Technology Officer | IoT hardware, firmware, software platforms |

- Photos go in `public/images/team/` as `peter-jade-talabucon.webp`, `aliana-maria-akala.webp`, and `louigie-guillera.webp`. Until real photos exist, show a stylized **initials avatar** (PT, AA, LG) on a gradient. Never use stock photos of other people.
- Store team data in `src/content/team.ts`, not hard-coded in JSX.
- Add `Organization` JSON-LD with `founder`/`employee` entries.

### 3.10 News (`/news`, `/news/[slug]`)

MDX files in `content/news/*.mdx` with frontmatter `title, date, excerpt, cover, author, tags`. The list page shows a card grid. The article page shows a reading layout with a table of contents and share links. Seed with one post: "Introducing SakaSense" `[PLACEHOLDER]`.

### 3.11 FAQ (`/faq`)

Accordion grouped by Product, Connectivity, Orders & Shipping, Warranty & Support. Store the FAQ data in `src/content/faq.ts` and emit `FAQPage` JSON-LD. Seed questions (answers `[PLACEHOLDER]` where they are facts):

- What does SakaSense measure?
- Do I need internet to use it? (Bluetooth works offline; Wi-Fi is needed for remote monitoring.)
- How long does the battery last?
- Is it waterproof?
- How do I learn to read the results? (link to Guidebook)
- Where do you ship, and how long does it take?
- What payment methods do you accept? (GCash, Maya, cards…)
- What is the warranty?

### 3.12 Contact (`/contact`) and Quote (`/quote`)

- **Contact form:** name, email, phone (optional), topic (General / Sales / Support / Partnership / Media), and message. Includes a honeypot and rate limit. On submit, save to `inquiries`, email the team, and email an auto-reply to the sender.
- Side panel: email, phone, address, office hours, social links `[PLACEHOLDER]`, and an embedded map `[PLACEHOLDER location]`.
- **Quote form:** organization name, type (Cooperative / LGU / Agribusiness / Research / Other), contact person, email, phone, region/province, number of units, hectares, message. Saved as `inquiries` with `type = 'quote'`.

### 3.13 Cart, Checkout, Orders

See **Phase 5** for the full flow.

### 3.14 Legal pages

Use MDX with a simple, readable layout. The content is `[PLACEHOLDER — must be reviewed by a lawyer]`. The Privacy Policy must reference RA 10173 and name a Data Protection Officer contact `[PLACEHOLDER]`.

---

## 4. Data Model (Drizzle schema in `src/db/schema.ts`)

```ts
// Money is always stored as integer centavos (₱1.00 = 100). Never use floats for money.

products {
  id            uuid pk
  slug          text unique not null
  name          text not null
  tagline       text
  description   text            // markdown
  category      enum('device','bundle','accessory','subscription')
  priceCentavos integer not null
  compareAtCentavos integer null // for sale display
  currency      text default 'PHP'
  sku           text unique
  stock         integer default 0
  isActive      boolean default true
  isFeatured    boolean default false
  images        jsonb           // [{url, alt}]
  specs         jsonb           // [{label, value}]
  inTheBox      jsonb           // string[]
  connectivity  jsonb           // {bluetooth: '…', wifi: '…'}
  guideUrl      text null
  sortOrder     integer default 0
  createdAt, updatedAt timestamptz
}

product_variants (optional, later) { id, productId fk, name, sku, priceCentavos, stock }

users           // managed by Better Auth + extra column:
  role          enum('customer','admin') default 'customer'

addresses { id, userId fk null, fullName, phone, line1, line2, barangay, city, province, region, postalCode, country default 'PH' }

orders {
  id             uuid pk
  orderNumber    text unique     // e.g. SKS-2026-000123
  userId         fk null          // null = guest checkout
  email          text not null
  status         enum('pending','paid','processing','shipped','delivered','cancelled','refunded')
  subtotalCentavos, shippingCentavos, discountCentavos, totalCentavos integer
  currency       text default 'PHP'
  shippingAddress jsonb          // snapshot at time of order
  paymentProvider enum('paymongo','stripe','cod')
  paymentRef     text null        // provider checkout/payment id
  trackingNumber text null
  courier        text null
  notes          text null
  createdAt, updatedAt, paidAt
}

order_items { id, orderId fk, productId fk, nameSnapshot, unitPriceCentavos, quantity, lineTotalCentavos }

inquiries { id, type enum('contact','quote'), name, email, phone, organization, orgType, topic, units, hectares, region, message, status enum('new','in_progress','closed'), createdAt }

newsletter_subscribers { id, email unique, confirmed boolean, createdAt }
```

Add a `seed.ts` script that inserts the 5 placeholder products from §3.3 and one admin user. Read the admin email from `ADMIN_EMAIL`.

---

## 5. Folder Structure

```
sakasense/
├─ content/
│  ├─ news/*.mdx
│  └─ legal/*.mdx
├─ public/
│  ├─ images/{products,team,hero,ecosystem}/
│  ├─ models/sakasense-device.glb        (optional 3D)
│  └─ og/                                (social share images)
├─ src/
│  ├─ app/
│  │  ├─ (site)/            layout.tsx + all public pages
│  │  ├─ (shop)/            cart, checkout, orders/track
│  │  ├─ (account)/         account, login, register
│  │  ├─ admin/             admin layout + pages (role-guarded)
│  │  ├─ api/
│  │  │  ├─ auth/[...all]/route.ts
│  │  │  ├─ webhooks/paymongo/route.ts
│  │  │  └─ webhooks/stripe/route.ts
│  │  ├─ globals.css
│  │  ├─ layout.tsx, not-found.tsx, sitemap.ts, robots.ts, opengraph-image.tsx
│  ├─ components/
│  │  ├─ ui/               shadcn primitives
│  │  ├─ brand/            GlowOrb, GridBackground, ContourBackground, SensorReadout, Logo
│  │  ├─ layout/           Header, Footer, MobileNav, CartSheet, AnnouncementBar
│  │  ├─ home/             one file per Home section
│  │  ├─ product/          ProductCard, Gallery, SpecsTable, AddToCart
│  │  └─ team/             TeamCard
│  ├─ config/
│  │  ├─ site.ts           name, tagline, contact, socials, currency, ecosystem links
│  │  └─ nav.ts            header and footer navigation
│  ├─ content/             team.ts, faq.ts, metrics.ts, solutions.ts
│  ├─ db/                  schema.ts, index.ts, seed.ts
│  ├─ lib/
│  │  ├─ auth.ts, auth-client.ts
│  │  ├─ money.ts          formatPHP(centavos)
│  │  ├─ payments/         index.ts (interface), paymongo.ts, stripe.ts
│  │  ├─ email/            send.ts + templates/*.tsx (React Email)
│  │  ├─ validators.ts     Zod schemas
│  │  └─ rate-limit.ts
│  ├─ server/              actions/ (server actions), queries/ (db reads)
│  └─ store/cart.ts        Zustand cart
├─ tests/                  unit + e2e
├─ drizzle.config.ts
├─ .env.example
└─ README.md
```

---

## 6. Implementation Phases (step by step)

### PHASE 1 — Foundation

**1.1 Scaffold.** `npx create-next-app@latest sakasense --ts --tailwind --eslint --app --src-dir --import-alias "@/*"`. Turn on TypeScript `strict`. Add Prettier.
✅ _Check:_ `npm run dev` serves the default page and `npm run build` passes.

**1.2 Install dependencies.** `shadcn` init (style: new-york, base color: neutral, CSS variables on), `motion`, `lucide-react`, `zustand`, `zod`, `react-hook-form`, `@hookform/resolvers`, `drizzle-orm`, `drizzle-kit`, `@neondatabase/serverless` (or `postgres`), `better-auth`, `resend`, `@react-email/components`, `next-mdx-remote` or `@next/mdx`, `@react-three/fiber`, `@react-three/drei`, `three`, `vitest`, `@playwright/test`.
✅ _Check:_ clean install, build passes.

**1.3 Environment.** Create `.env.example` with `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `PAYMONGO_SECRET_KEY`, `PAYMONGO_WEBHOOK_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `EMAIL_FROM`, `ADMIN_EMAIL`, `NEXT_PUBLIC_SITE_URL`. Validate env at startup with Zod in `src/lib/env.ts`.
✅ _Check:_ a missing required variable throws a clear error.

**1.4 Site config.** Create `src/config/site.ts` with company name, tagline ("Smart Soil Intelligence"), contact info `[PLACEHOLDER]`, socials, currency `PHP`, locale `en-PH`, and the ecosystem links object `{ dashboard, guidebook, appStore, playStore }`. Create `src/config/nav.ts`.
✅ _Check:_ nothing in the app hard-codes these values.

### PHASE 2 — Design system

**2.1 Tokens.** Add all §2.2 colors to `globals.css` via `@theme`, with dark as default and a `[data-theme="light"]` override. Add a theme toggle (store the choice in localStorage and respect `prefers-color-scheme` on first visit). Prevent flash of the wrong theme with an inline script in `<head>`.
**2.2 Fonts.** Load Space Grotesk, Inter, and JetBrains Mono via `next/font`. Expose them as `--font-display`, `--font-sans`, and `--font-mono`.
**2.3 Primitives.** Add shadcn: button, card, badge, input, textarea, select, label, form, dialog, sheet, tabs, accordion, toast/sonner, dropdown-menu, separator, skeleton, table. Restyle them with the tokens (glass surfaces, pill buttons, glow variant).
**2.4 Brand components.** Build every component listed in §2.4, plus a `Reveal` wrapper for scroll animation that respects reduced motion.
**2.5 Style guide page.** Create `/dev/styleguide` (excluded from the sitemap, 404 in production) that renders every component in both themes.
✅ _Check:_ the style guide looks right in dark and light, at 360px and 1440px. Contrast passes AA, verified with the axe DevTools extension or `@axe-core/playwright`.

### PHASE 3 — Layout and static pages

**3.1** Build the root layout: Header (sticky, glass on scroll, dropdowns, mobile Sheet), Footer, and AnnouncementBar. Add a skip-to-content link.
**3.2** Build the Home page sections 1–12 (§3.2) as separate components in `components/home/`. Use static placeholder data for featured products for now.
**3.3** Build How it Works, Solutions, Ecosystem, About, Leadership (from `content/team.ts`), FAQ (from `content/faq.ts`), and Legal (MDX).
**3.4** Build the News list and article pages with MDX, and add one seed post.
**3.5** Build a custom 404 with a "lost in the field" illustration and links home.
✅ _Check:_ all pages reachable from the nav, no console errors, responsive at 360/768/1024/1440, keyboard navigable, visible focus rings.

### PHASE 4 — Database and products

**4.1** Write the Drizzle schema (§4), `drizzle.config.ts`, and the first migration. Add the `db:generate`, `db:migrate`, and `db:seed` scripts.
**4.2** Write the seed script with the 5 placeholder products and the admin user.
**4.3** Write server queries: `getProducts({category, sort})`, `getProductBySlug`, `getFeaturedProducts`, `getRelatedProducts`.
**4.4** Build `/products` (filters via URL search params so they are shareable) and `/products/[slug]` (`generateStaticParams` + ISR `revalidate = 300`). Replace the Home placeholders with real featured products.
**4.5** Add `src/lib/money.ts` with `formatPHP(centavos)`, using `Intl.NumberFormat('en-PH', {style:'currency', currency:'PHP'})`.
✅ _Check:_ products render from the DB, filters and sort work, product JSON-LD validates in Google's Rich Results Test.

### PHASE 5 — Cart, checkout, payments

**5.1 Cart store** (`store/cart.ts`): items `{productId, slug, name, image, unitPriceCentavos, quantity}`, with actions add, remove, setQty, and clear, and selectors for count and subtotal. Persist to localStorage. Add a hydration guard to avoid SSR mismatch.
**5.2 Cart UI:** the CartSheet drawer opens on add-to-cart, plus a full `/cart` page. Include quantity steppers, remove, subtotal, a "Proceed to checkout" button, and an empty state.
**5.3 Checkout page** (`/checkout`), a single page with sections:

1.  Contact: email and phone. Offer "Log in for faster checkout" but allow guest checkout.
2.  Shipping address with PH fields (region → province → city → barangay; dropdowns can come later, text inputs are fine for v1).
3.  Shipping method (Standard / Express `[PLACEHOLDER rates]`; free over a threshold set in config).
4.  Payment method: GCash, Maya, Card (PayMongo), optional Stripe (international), optional COD `[owner decides]`.
5.  Order summary sidebar (sticky on desktop, collapsible on mobile).
    **5.4 Create-order server action**, which must:

- Validate input with Zod.
- **Re-fetch every product from the DB and recompute prices server-side.** Never trust client prices.
- Check stock.
- Create the `orders` row (`pending`) and `order_items` in a transaction. Generate `orderNumber`.
- Call the payment provider via `lib/payments` → create a checkout session → return the redirect URL.
  **5.5 Payments abstraction** (`lib/payments/index.ts`):

```ts
interface PaymentProvider {
  createCheckout(order: Order, items: OrderItem[]): Promise<{ url: string; ref: string }>;
  verifyWebhook(req: Request): Promise<{ ref: string; status: "paid" | "failed" } | null>;
}
```

Implement `paymongo.ts` (Checkout Sessions API) and `stripe.ts` (Checkout Sessions).
**5.6 Webhooks:** `/api/webhooks/paymongo` and `/api/webhooks/stripe` verify the signature, find the order by `paymentRef`, and on paid set `status = 'paid'` and `paidAt`, decrement stock, and send the confirmation email. Make the handler **idempotent**: if the order is already paid, return 200 and do nothing.
**5.7 Success page** `/checkout/success?order=…`: shows the order number, summary, next steps, and links to the Guidebook and app ("Get ready for your device"). Clear the cart.
**5.8 Order tracking** `/orders/track`: the user enters the order number and email and sees status on a timeline (Paid → Processing → Shipped → Delivered), with courier and tracking number.
**5.9 Emails** (React Email, dark-green branded): order confirmation, shipped notification (with tracking), contact auto-reply, and an internal new-order alert.
✅ _Check:_ the full purchase works in **PayMongo test mode** with GCash test and card test payments. The order becomes `paid` via webhook, stock decrements, and the email arrives. A tampered client price is ignored. Replaying the webhook does not double-decrement stock.

### PHASE 6 — Accounts and admin

**6.1** Configure Better Auth with email/password and Google. Add the `role` field. Build the login and register pages in the brand style.
**6.2** Build `/account`: profile, saved addresses, order history, and order detail. Link guest orders to the account when the email matches and is verified.
**6.3** Protect `/admin/*` by checking `role === 'admin'` server-side in the admin layout and in every admin server action (not only in middleware).
**6.4** Build the admin pages:

- **Dashboard:** today's orders, revenue (paid), low-stock alerts, new inquiries.
- **Products:** table, create/edit form (images as URLs for v1, specs as a key-value editor), toggle active/featured, set stock.
- **Orders:** table with status filter. The detail view can update status, add courier and tracking number (this triggers the shipped email), and add notes.
- **Inquiries:** list contact and quote submissions, and change their status.
  ✅ _Check:_ a non-admin gets 404/403 on `/admin` and on direct server-action calls. An admin can edit a product and see the change on the site after revalidation (`revalidatePath`).

### PHASE 7 — Forms and engagement

**7.1** Contact and quote forms: Zod validation, honeypot field, IP rate limit (5 per 10 minutes), saved to the DB, team notification email, and sender auto-reply. Toast on success.
**7.2** Newsletter signup in the footer with double opt-in email.
**7.3** Optional floating "Chat with us" button linking to Messenger or Viber `[PLACEHOLDER]`.
✅ _Check:_ spam submissions are blocked, valid submissions appear in the admin Inquiries page, and emails arrive.

### PHASE 8 — Hero 3D and polish

**8.1** Hero 3D scene with React Three Fiber: the device model (`public/models/sakasense-device.glb` `[PLACEHOLDER — use a stylized primitive-based model until a real one exists]`) slowly rotating above a field of green soil particles. Load it with `next/dynamic` (`ssr: false`), render it only on desktop with no reduced-motion preference, and pause it when off-screen. Use a static WebP fallback.
**8.2** Micro-interactions: animated `SensorReadout` numbers, the glowing line along the How-it-works steps, button glow on hover, and a cart badge bump on add.
**8.3** Loading states (`loading.tsx` skeletons) and error boundaries (`error.tsx`) for each route group.
✅ _Check:_ Lighthouse mobile Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.

### PHASE 9 — SEO, i18n readiness, analytics

**9.1** Per-page `metadata` (title template `%s | SakaSense`), canonical URLs, Open Graph and Twitter cards, and a dynamic OG image (`opengraph-image.tsx`) in brand style.
**9.2** `sitemap.ts` (including products and news), `robots.ts`, and JSON-LD for `Organization` (with leadership), `Product`, `FAQPage`, and `BreadcrumbList`.
**9.3** i18n readiness: move UI strings into `src/messages/en.json`, structured so `fil.json` can be added later with `next-intl`. Do not translate yet.
**9.4** Analytics: page views plus custom events for `add_to_cart`, `begin_checkout`, `purchase`, `quote_submitted`, and `ecosystem_link_click`. Add a cookie/consent notice if any non-essential tracking is used.
✅ _Check:_ Rich Results Test passes, and the sitemap lists all public URLs.

### PHASE 10 — Testing, security, launch

**10.1 Unit tests (Vitest):** money formatting, cart store, price recomputation, Zod validators, order number generation.
**10.2 E2E tests (Playwright):** browse → add to cart → checkout (test mode) → success; contact form; admin login → update order status; mobile viewport nav.
**10.3 Security checklist:**

- Security headers in `next.config` (CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy)
- All server actions validate input and check auth/role
- Webhook signature verification; secrets only in env
- Rate limiting on auth, forms, and checkout
- No PII in logs; addresses visible only to the owner and admins
- `npm audit` clean of high/critical issues
  **10.4 Deploy:** Vercel project, production env vars, Neon production DB with migrations run, PayMongo/Stripe **live** webhooks pointing to the production URLs, a custom domain `sakasense.com` `[PLACEHOLDER]` with HTTPS, and Resend domain verified (SPF/DKIM).
  **10.5 Launch QA:** real ₱ test purchase then refund, check every link (especially ecosystem links), check on a low-end Android phone over mobile data, and confirm every `[PLACEHOLDER]` is either replaced or hidden.
  ✅ _Check:_ the site is live, an order completes end to end, and no placeholder text is visible.

---

## 7. Content Checklist (owner must provide)

- [ ] Logo (SVG, light and dark versions) and favicon
- [ ] Real product names, specs, prices, stock, photos (white background + in-field)
- [ ] Exact sensor capabilities and accuracy ranges
- [ ] Battery life, waterproof rating, warranty terms
- [ ] Leadership photos and bios for Peter Jade Talabucon, Aliana Maria Akala, Louigie B. Guillera
- [ ] Company story, mission, vision, founding year, address
- [ ] Contact email, phone, social media links, office hours
- [ ] Shipping rates, couriers, free-shipping threshold, COD yes/no
- [ ] PayMongo and (optional) Stripe accounts
- [ ] Domain name and email domain
- [ ] URLs for the dashboard, guidebook, App Store and Play Store listings
- [ ] Testimonials and partner logos (with permission)
- [ ] Legal texts reviewed by a lawyer; DPO contact

---

## 8. Rules for the Implementing AI

1. Follow phases in order. Finish and verify each ✅ check before moving on.
2. Keep components small and typed. No `any`. Server code stays in `server/` and `lib/`, never in client components.
3. Store money as integer centavos. Prices are always computed on the server.
4. Every user-visible fact that is not in this plan is a `[PLACEHOLDER]`. Do not invent specs, prices, statistics, testimonials, partners, or certifications.
5. Never use photos of real people other than the provided leadership photos. Use initials avatars until those exist.
6. Accessibility is part of "done": semantic HTML, alt text, labels, focus states, reduced motion, AA contrast.
7. Mobile first. Many farmers will visit on low-end phones over mobile data, so keep pages light. Lazy-load heavy assets, compress images (WebP/AVIF), and keep first-load JS small.
8. After each phase, update `README.md` with how to run, seed, and test the project.

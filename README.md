# Readystore AI

Production validation product for scanning whether WooCommerce stores are readable for AI shoppers.

## Stack

- Next.js
- TypeScript
- React
- Cheerio for HTML parsing

## Run

```bash
npm install
npm run dev -- -H 0.0.0.0 -p 5180
```

Open:

```text
http://localhost:5180
```

## Current Scope

Readystore AI validation app:

- URL input.
- `POST /api/scan`.
- Homepage fetch.
- Sampled multi-page fetch:
  - product pages;
  - cart/checkout pages when discovered;
  - shipping/returns/contact/policy pages when discovered.
- Internal link extraction.
- WooCommerce/WordPress/ecommerce detection.
- Payment keyword detection.
- JSON-LD/schema extraction.
- Price/currency/availability signals.
- Shipping/returns/contact page discovery.
- `llms.txt`, `robots.txt`, sitemap checks.
- AI Readiness Score v0.
- AI visibility snapshot.
- Merchant-readable summary.
- Product-page summary ratios.
- Payment visibility levels.
- Priority fixes.
- Bottom conversion block explaining what the plugin adds after diagnosis:
  - AI storefront layer;
  - schema/policy/payment fixes;
  - before/after monitoring.
- Scanned page evidence.
- Report UI.
- Marketing landing page sections.
- Production validation flow foundation.
- Supabase scan/lead/report request persistence.
- Resend email delivery with a branded PDF attachment.

## Not in Scope Yet

- Localized routes.
- Outreach automation.
- Authentication.
- Billing.
- Plugin connection.

## Supabase Setup

Run the schema in Supabase SQL Editor:

```text
supabase/schema.sql
```

The initial schema creates:

- `scans`
- `leads`
- `report_requests`

RLS is enabled. The app should write through server-side Supabase client using the service role key only.

## Production Environment

Expected Vercel variables:

```text
NEXT_PUBLIC_SITE_URL=https://readystoreai.com
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
REPORT_FROM_EMAIL=reports@readystoreai.com
```

## Verification

Build:

```bash
npm run build
```

API smoke test:

```bash
node -e "fetch('http://localhost:5180/api/scan',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({url:'https://example.com'})}).then(async r=>{console.log(r.status); console.log((await r.text()).slice(0,1000));})"
```

## Notes

- Live scanning requires network access from the dev server process.
- Some target sites may block server-side fetches; this should be handled as a normal scanner error state.
- `npm audit --omit=dev` currently reports moderate PostCSS issues through Next's dependency tree. Do not run `npm audit fix --force` blindly because npm suggests a breaking dependency change.

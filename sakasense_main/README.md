# SakaSense Web Platform

Subscription companion website for the SakaSense ESP32 soil sensor kit — historical trends, multi-plot farms, fertilizer guidance, Guidebook lookup, and reports.

## Structure

| Path | Role |
|------|------|
| `web/` | Next.js 16 + Tailwind frontend (Phase 1–5 UI with demo data) |
| `hello/` + `mysite/` | Django API + data models for device sync / persistence |

## Quick start — website

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Demo login:** `maria@sakasense.demo` / `sakasense123`

## Quick start — Django API (device ingest)

```bash
# from repo root, with .venv activated
python manage.py makemigrations hello
python manage.py migrate
python manage.py runserver
```

- Health: `GET http://127.0.0.1:8000/api/health/`
- Ingest: `POST http://127.0.0.1:8000/api/device/ingest/`

Example body:

```json
{
  "serial_number": "KS-ESP32-004821",
  "battery_percent": 86,
  "readings": [
    {
      "timestamp": "2026-07-21T02:00:00Z",
      "pH": 6.4,
      "N": 72,
      "P": 38,
      "K": 68,
      "source": "live"
    }
  ],
  "recommendation": {
    "timestamp": "2026-07-21T02:00:00Z",
    "ranked_crops": [{ "crop": "Potato", "score": 92 }],
    "guidebook_code": "5001",
    "fertilizer_prescription": {
      "product": "Potato Boost 12-12-17",
      "amount": "2 bags / ha",
      "timing": "Within 7 days",
      "notes": ""
    },
    "insight": "Zone A looks good for potato.",
    "generated_on_device": true
  }
}
```

Register the device serial in Django admin after creating a user/farm/plot/device row.

## Routes implemented

- `/` Landing
- `/login`, `/register`, `/onboarding`
- `/dashboard` AgriVision-style overview
- `/farm/:farmId`, `/farm/:farmId/plot/:plotId` soil health + trends
- `/crop-health`, `/reports`, `/alerts`, `/guidebook`, `/account`, `/pricing`, `/help`

## Farm layout views

The dashboard **Farm layout** panel has two modes:

1. **Plots (default)** — rectangular crop plots with plant imagery and color-coded status borders (Healthy / Needs Attention / Action Required). Works offline with no API key.
2. **3D Map** — Google Maps `Map3DElement` (photorealistic / hybrid) centered on the farm, with labeled markers per zone.

To enable 3D Map:

1. Create a [Google Maps Platform](https://console.cloud.google.com/google/maps-apis) key and enable **Maps JavaScript API**.
2. Copy `web/.env.example` → `web/.env.local` and set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.
3. Restart `npm run dev`.

Google’s “free” tier is monthly credit against a billing-enabled project — not a forever unlimited free key.

## Open questions (from spec §13)

- Final pricing & PH payment gateway (GCash / PayMongo / Stripe)
- Cooperative multi-user: in-scope for defense vs future work
- Shared auth with mobile app (recommended; Django User is the shared identity)
- Exact crop list from the current on-device model

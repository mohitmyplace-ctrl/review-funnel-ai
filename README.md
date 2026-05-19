# ReviewFunnel AI

> Scan a QR code, pick a star rating, get a unique AI-drafted review in seconds, copy it, and land directly on Google Reviews.

**Problem**: Restaurants lose reviews because customers never bother writing them. The blank text box is too much friction.

**Solution**: A QR code on every table that opens a pre-loaded review page, generates a unique, human-sounding draft based on the star rating and tags the customer selects, and deep-links directly to the Google Reviews submission page.

---

## How it works

```
Customer scans QR  →  Venue pre-loaded  →  Pick stars (1–5)
→  Pick tags (Food / Service / Ambience / Value / Cleanliness / Speed)
→  Unique draft generated  →  Copy to clipboard  →  Google Reviews opens
```

Two entry points:

| Entry | URL | Venue context |
|---|---|---|
| Merchant QR | `/scan/[slug]` | Pre-loaded from DB — specific, credible reviews |
| Direct / search | `/` | Customer searches venue — Google Places lookup |

---

## Tech stack

| Layer | Technology | Why |
|---|---|---|
| Framework | Next.js 16 (App Router) | Server components, API routes, streaming — one repo for everything |
| Language | TypeScript (strict) | Catch bugs at compile time, not in production |
| Styling | Tailwind CSS | No build step overhead, consistent design tokens |
| Database | Supabase (Postgres) | Free tier, RLS out of the box, real-time capable |
| Auth | Supabase Auth | Merchant login — same client, zero extra setup |
| Venue search | Google Places API (New) | Best data for Indian restaurants, cities, addresses |
| Review engine | Hardcoded template matrix | Week 1–2. Persona × star × tag = unique output. No API cost. |
| AI drafts (Week 3) | OpenAI GPT-4o | Drop-in swap once templates are validated |
| Deployment | Vercel | Free tier, zero-config Next.js deploys |

---

## Architecture

```
review-funnel-ai/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── page.tsx                  # Entry Point 2: search → select venue → review
│   │   ├── scan/
│   │   │   └── [slug]/page.tsx       # Entry Point 1: QR scan → pre-loaded venue
│   │   └── api/
│   │       ├── review/draft/         # POST — generate review draft
│   │       └── venues/search/        # GET  — Google Places text search
│   │
│   ├── components/
│   │   ├── review/
│   │   │   ├── ReviewFlow.tsx        # 3-step wizard: stars → tags → draft
│   │   │   ├── StarPicker.tsx        # Animated 1–5 star selector
│   │   │   ├── TagPicker.tsx         # Multi-select tag chips
│   │   │   └── VenueSearch.tsx       # Debounced search input + results
│   │   └── ui/
│   │       └── button.tsx            # Base button component
│   │
│   ├── lib/
│   │   ├── review-engine/index.ts    # Persona × star × tag template matrix
│   │   ├── google-places/index.ts   # Places API wrapper + category inference
│   │   ├── supabase/
│   │   │   ├── client.ts             # Browser Supabase client
│   │   │   └── server.ts             # Server Supabase client (RSC + API routes)
│   │   └── utils.ts                  # cn() helper for Tailwind class merging
│   │
│   └── types/index.ts                # All shared TypeScript types
│
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql    # Full schema + RLS policies
│
└── env.example                       # Copy to .env.local and fill in values
```

### Review engine — how uniqueness works

The engine uses a **persona × star × tag matrix**:

- **5 personas**: casual, enthusiastic, measured, descriptive, brief
- **5 star bands**: each has distinct emphasis (1★ = failures, 3★ = balanced trade-offs, 5★ = specific praise)
- **6 tags**: Food, Service, Ambience, Value, Cleanliness, Speed — each maps to a star-aware phrase

Same customer, same restaurant, same star rating → different persona picked randomly → different opening, different emphasis, different sentence structure. Google's spam classifier sees diversity; the customer sees a real-sounding review.

### Database schema

```
merchants          — business owners (auth.uid = id)
  └── venues       — restaurants, cafes, hotels (owned by merchant)
        └── qr_campaigns   — one slug per table/location
review_sessions    — analytics: scans, copies, redirects, star distribution
```

Row-Level Security is enabled on all tables. Merchants can only access their own data. Review sessions can be inserted by anyone (no auth required), read only by the owning merchant.

---

## Environment variables

Copy `env.example` to `.env.local`:

```bash
cp env.example .env.local
```

| Variable | Where to get it | Required |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon/public key | Yes |
| `GOOGLE_PLACES_API_KEY` | Google Cloud Console → APIs & Services → Credentials | Yes |
| `OPENAI_API_KEY` | platform.openai.com → API Keys | No (Week 3 only) |

> `NEXT_PUBLIC_` prefix means the variable is exposed to the browser. Never put secret keys with this prefix.

---

## Local setup

### Prerequisites
- Node.js 20+
- A Supabase project (free at supabase.com)
- Google Cloud project with Places API (New) enabled (free credits, see below)

### Steps

```bash
# 1. Clone and install
git clone https://github.com/mohitmyplace-ctrl/review-funnel-ai.git
cd review-funnel-ai
npm install

# 2. Environment
cp env.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, GOOGLE_PLACES_API_KEY

# 3. Database — run this in Supabase SQL Editor
# Contents of supabase/migrations/001_initial_schema.sql

# 4. Run
npm run dev
```

Open:
- `http://localhost:3000` — search flow
- `http://localhost:3000/scan/demo-restaurant` — QR scan demo

---

## Free tier limits

| Service | Free allowance | Hits limit when... |
|---|---|---|
| Supabase | 500MB DB, 50k MAU, 2GB bandwidth/mo | ~5,000 active merchants |
| Google Places | $200/month credit (~11,700 searches) | Never at alpha scale |
| Vercel | 100GB bandwidth, unlimited deploys | Never at alpha scale |
| OpenAI (Week 3) | None — pay per token | Switch on when ready |

**Google Places billing note**: A credit card is required to enable the API but Google gives $200/month in free credits. Set a budget alert at ₹1 with billing auto-disable to ensure zero charges.

---

## API reference

### `POST /api/review/draft`

Generate a unique review draft.

**Request body**
```json
{
  "starRating": 4,
  "tags": ["food", "service"],
  "venueName": "The Demo Kitchen",
  "venueCategory": "restaurant",
  "venueId": "optional-uuid"
}
```

**Response**
```json
{
  "draft": "Had a great visit. The food was really good — so close to perfect.",
  "persona": "enthusiastic",
  "sessionId": "uuid"
}
```

### `GET /api/venues/search?q=<query>&city=<city>`

Search venues via Google Places.

**Response**
```json
{
  "places": [
    {
      "placeId": "ChIJ...",
      "name": "Meghana Foods",
      "address": "Residency Road, Bengaluru",
      "category": "restaurant",
      "rating": 4.4,
      "reviewUrl": "https://search.google.com/local/writereview?placeid=ChIJ..."
    }
  ]
}
```

---

## Roadmap

- [x] Review engine — persona × star × tag matrix
- [x] Customer flow — QR scan, star picker, tag picker, draft, copy + redirect
- [x] Venue search — Google Places API integration
- [x] Supabase schema — merchants, venues, QR campaigns, review sessions
- [ ] Wire Supabase — replace demo venue map with real DB lookup
- [ ] Analytics — scan count, copy rate, redirect rate per venue
- [ ] Merchant dashboard — five numbers, one screen
- [ ] QR code generator — downloadable SVG per venue
- [ ] OpenAI integration — replace template engine with GPT-4o (Week 3)
- [ ] Merchant auth — Supabase email + magic link
- [ ] Hindi / regional language review generation

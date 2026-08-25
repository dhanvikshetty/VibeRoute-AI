# Environment Setup — Accounts & API Keys Needed Before Building

Set these up first so the build doesn't stall waiting on signups.

## 1. Mapbox
- Sign up at mapbox.com (free tier available).
- Needed for: map rendering, Directions API, Geocoding API, Matrix API.
- Env var: `NEXT_PUBLIC_MAPBOX_TOKEN`

## 2. Google Cloud — Places API (New)
- Enable "Places API (New)" in Google Cloud Console; needs billing enabled
  (has a free monthly credit).
- Needed for: nearby search, text search, place details, place photos.
- Env var: `GOOGLE_PLACES_API_KEY`

## 3. OpenAI
- Sign up at platform.openai.com, add billing.
- Needed for: `gpt-4o-mini` (fast parsing/intent), `gpt-4o` (vision +
  complex generation), `text-embedding-3-small` (vector embeddings).
- Env var: `OPENAI_API_KEY`

## 4. Supabase
- Sign up at supabase.com, create a new project.
- Enable the `pgvector` extension in the database (Database → Extensions).
- Needed for: PostgreSQL hosting + vector search.
- Env vars: `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`

## 5. Auth provider (choose one)
- **Clerk**: sign up at clerk.com — env vars `CLERK_PUBLISHABLE_KEY`,
  `CLERK_SECRET_KEY`.
- **Supabase Auth**: no separate signup needed if already using Supabase;
  configure Google OAuth in the Supabase dashboard.

## Suggested `.env.local` skeleton

```
NEXT_PUBLIC_MAPBOX_TOKEN=
GOOGLE_PLACES_API_KEY=
OPENAI_API_KEY=
DATABASE_URL=
SUPABASE_URL=
SUPABASE_ANON_KEY=
CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

## Deployment

- Recommended host: **Vercel** (first-class Next.js support, free tier
  fine for a portfolio project).
- Make sure all env vars above are added to the Vercel project settings
  before the first deploy.

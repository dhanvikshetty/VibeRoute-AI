# Architecture Specification

## System Diagram

```
                  ┌────────────────────────┐
                  │   User Web Browser     │
                  │ (Next.js 15 SPA/PWA)   │
                  └───────────┬────────────┘
                              │ Live GPS / Preferences
                              ▼
                  ┌────────────────────────┐
                  │  Next.js API Routes    │
                  │  (Node.js Serverless)  │
                  └─────┬────────────┬─────┘
                        │            │
      ┌─────────────────┴─┐        ┌─┴────────────────┐
      │ Recommendation AI │        │ Places & Routing │
      │  (OpenAI + pgvector)│      │ (Mapbox/Google  │
      │                    │        │  Places API)     │
      └───────────────────┘        └──────────────────┘
                        │
                        ▼
              ┌──────────────────────┐
              │ PostgreSQL (Supabase)│
              │  + pgvector extension│
              └──────────────────────┘
```

## A. Frontend Framework & Design System

- **Framework**: React 19 / Next.js 15 (App Router, Server Components
  enabled).
- **Styling & UI**: Tailwind CSS v4, Shadcn/ui (Radix UI primitives),
  Lucide React (icons), Framer Motion (animations).
- **Map Engine**: Mapbox GL JS via `react-map-gl`, plus Mapbox Directions
  API for vector rendering, custom markers, animated polylines, dynamic
  camera control.
- **State Management**:
  - Global UI & route state: **Zustand**.
  - Server state / data fetching: **TanStack Query v5** with caching and
    background revalidation.
- **Audio & Speech**: Web Speech API (`SpeechRecognition` +
  `SpeechSynthesis`) for the hands-free voice co-pilot.

## B. Backend, Serverless & API Services

- **Backend runtime**: Node.js via Next.js Serverless API Routes (Route
  Handlers).
- **Database & vector search**: PostgreSQL on **Supabase**, with the
  `pgvector` extension enabled for semantic embeddings.
- **ORM**: **Prisma ORM** for schema migrations and type-safe DB access.
- **Authentication**: Clerk or Supabase Auth (Google OAuth + email/password).

## C. External Mapping & Data APIs

- **Mapbox**:
  - Navigation/Directions API — driving/walking/cycling routes, real-time
    ETA, polyline decoding.
  - Geocoding API — forward/reverse geocoding (lat/long ↔ address).
- **Google Places API (New)**: Nearby Search, Text Search, Place Details,
  Place Photos — returns metadata, hours, rating, price level, reviews.

## D. AI Models & Vector Pipeline

- **Primary LLM**: OpenAI API —
  - `gpt-4o-mini` for fast/cheap JSON parsing and intent extraction.
  - `gpt-4o` for more complex group itinerary generation.
- **Vector embeddings**: OpenAI `text-embedding-3-small`
  (1536-dimensional) for cosine similarity between trip theme vectors and
  candidate place vectors.

## Folder Structure (enforced — see `GUARDRAILS.md`)

```
/app                — Next.js routes & pages (App Router)
/app/api             — Serverless API route handlers
/components          — UI components, grouped by feature area
/lib                 — Business logic, API clients, algorithms (non-UI)
/lib/ai              — AI/embedding/ranking logic
/hooks               — Custom React hooks
/store               — Zustand stores
/types               — Shared TypeScript types/interfaces
/prisma              — schema.prisma and migrations
```

Database logic and heavy algorithms must live in `/lib`, never inline in
frontend components.

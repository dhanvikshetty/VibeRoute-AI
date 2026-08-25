# API Route Specification

All routes are Next.js Route Handlers under `/app/api`. All payloads must be
validated with Zod schemas (see `GUARDRAILS.md`).

## 1. `POST /api/trips/create`
**Payload**: `{ userId, originAddress, destAddress, originCoords, destCoords, theme }`

**Action**: Queries the Mapbox Directions API for the base route geometry,
saves the `Trip` and its origin/destination `Waypoint` records to the
database, and returns the full route payload.

## 2. `POST /api/recommendations/proactive`
**Payload**: `{ tripId, currentLat, currentLng, speed, theme }`

**Action**: Runs the velocity gate, fetches candidate places from Google
Places, applies the vector cosine-similarity theme filter, calculates
detour time via the Mapbox Matrix API, ranks candidates with the scoring
formula, and returns the top 3 ranked places. See `ALGORITHMS.md` →
Workflow 1 & 2.

## 3. `POST /api/ai/vibe-match`
**Payload**: Multipart form data — `imageFile` OR `textQuery` string, plus
`userCoords`.

**Action**: Sends the image/text to OpenAI Vision/text parsing, extracts
atmospheric/mood tags, queries Google Places + pgvector for matching
real-world spots, and returns candidates with a confidence match
percentage. See `ALGORITHMS.md` → Workflow 4.

## 4. `POST /api/ai/voice-agent`
**Payload**: `{ audioTranscript, currentCoords, activeRouteId }`

**Action**: Runs LLM function-calling on the transcript, queries the Places
API for the requested category, and returns a spoken-text response string
plus a structured execution action (e.g., `ADD_WAYPOINT`). See
`ALGORITHMS.md` → Workflow 5.

## 5. `POST /api/expenses/split`
**Payload**: `{ tripId, payerId, amount, description, rawReceiptText }`

**Action**: Uses LLM/OCR parsing on `rawReceiptText` to extract line items,
splits the total (equally or proportionally), and saves an `Expense`
record to PostgreSQL.

## Required behaviors for every route

- Zod validation on all inputs — reject malformed payloads with a clear
  400 response.
- Explicit handling of: no results found, upstream API failure/timeout,
  and empty/zero-coordinate input.
- No `any` typing on request/response shapes — see `GUARDRAILS.md`.

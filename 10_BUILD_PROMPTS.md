# Phased Build Prompts

Feed these to the AI coding agent **one at a time, in order**, only after
it has acknowledged `GUARDRAILS.md` and the rest of the spec files and
produced its own 6-phase roadmap. Test/verify each phase before sending the
next prompt.

## Prompt 0 — Kickoff (send right after the guardrails + spec docs)

> "You are an expert Principal Full-Stack Engineer. Build the application
> specified in the provided documents, called VibeRoute AI.
>
> - Set up a Next.js 15 project with TypeScript, Tailwind CSS, Shadcn/ui
>   components, and Lucide icons.
> - Create the complete PostgreSQL Prisma schema from `DATABASE_SCHEMA.md`,
>   including the pgvector model setup.
> - Implement the Mapbox GL JS map component on the main layout with custom
>   marker pins, dynamic polyline rendering, and dynamic camera bounds
>   fitting.
> - Implement all 5 logic workflows detailed in `ALGORITHMS.md` (Proactive
>   Radar, Cosine Similarity Filter, Dynamic Route Injection, Vibe Matcher,
>   and Voice Agent).
> - Implement all Next.js API route handlers from `API_SPEC.md` with full
>   TypeScript typing and input validation.
> - Ensure the application layout matches the 3-pane responsive structure
>   in `UI_UX_SPEC.md`, optimized for desktop and mobile web screens.
>
> First, acknowledge receipt and output a numbered 6-phase execution
> roadmap. Ask for my explicit approval before starting Phase 1."

## Prompt 1 — Database, Foundation & Mock Types

> "Let's start Phase 1: Database & Foundation Layer. Using the Prisma
> schema and tech stack defined in `DATABASE_SCHEMA.md` and
> `ARCHITECTURE.md`:
>
> - Write the full `schema.prisma` file with pgvector configuration, enums,
>   and models.
> - Create the TypeScript interface definitions under `@/types/index.ts`
>   for `User`, `Trip`, `Waypoint`, `PlaceEmbedding`, and `Expense`.
> - Create `@/lib/db.ts` to instantiate and export a singleton
>   `PrismaClient` instance.
> - Create mock JSON datasets for Google Places and vector embeddings under
>   `@/lib/mockData.ts` so we can test UI rendering before live API calls.
> - Write all files in full without truncating."

## Prompt 2 — Core Layout & Interactive Mapbox Setup

> "Now let's execute Phase 2: UI Frame & Mapbox Integration. Refer to
> `UI_UX_SPEC.md` and the Map Engine section of `ARCHITECTURE.md`:
>
> - Build the responsive 3-pane CSS grid layout in Next.js (`@/app/page.tsx`).
> - Create the top navigation bar with the search bar, Trip Theme
>   Selector, and user profile drawer.
> - Build `@/components/map/MapCanvas.tsx` using Mapbox GL JS
>   (`react-map-gl`). Include custom SVG marker pins for Waypoint A,
>   Waypoint B (detours), and Waypoint C, plus an animated polyline route
>   rendering engine.
> - Create a Zustand global store (`@/store/useTripStore.ts`) to manage
>   active coordinates, route GeoJSON, selected themes, and panel toggle
>   states.
> - Ensure the map fills the right panel cleanly on desktop and handles
>   mobile screen toggles."

## Prompt 3 — Algorithmic Recommendation & Semantic Vibe Engines

> "Now let's execute Phase 3: AI Recommendation & Vibe Filtering Mechanics.
> Refer to `ALGORITHMS.md` (Workflows 1–3) and `API_SPEC.md`:
>
> - Create `@/lib/ai/cosineSimilarity.ts` to compute vector similarity math
>   (>0.75 cutoff).
> - Implement the Next.js API route
>   `/api/recommendations/proactive/route.ts`. It must:
>   - Enforce the velocity gate (<15 km/h).
>   - Fetch candidate spots from Google Places / mock data.
>   - Rank spots using the formula:
>     `Score = (0.5 × S_taste) + (0.3 × Rating) − (0.2 × Δt)`.
>   - Return the top 3 micro-cards.
> - Create the frontend component
>   `@/components/recommendations/MicroCardDeck.tsx` with a one-tap
>   `[+ Add as X-min Detour]` button that dynamically calls the Mapbox
>   Directions API and redraws the polyline route (A→B→C)."

## Prompt 4 — Multimodal Vibe Matcher & Hands-Free Voice Agent

> "Now let's execute Phase 4: Multimodal & Voice Features. Refer to
> Workflows 4 and 5 in `ALGORITHMS.md`:
>
> - Create the API route `/api/ai/vibe-match/route.ts` using OpenAI GPT-4o
>   Vision to parse user-uploaded images or mood descriptions into tags,
>   matching them against candidate GPS spots.
> - Create the modal component `@/components/vibe/VibeMatchModal.tsx`
>   allowing drag-and-drop image uploads or prompt input, with
>   loading/match % animations.
> - Create the Web Speech API voice co-pilot component
>   `@/components/voice/VoiceCoPilot.tsx`. It must listen for prompts,
>   execute tool calling via `/api/ai/voice-agent/route.ts`, speak
>   responses back via `window.speechSynthesis`, and trigger automatic
>   route insertion upon verbal confirmation ('Lock it in')."

## Prompt 5 — Real-World Utility Tools (Expense & Group Splitter)

> "Now let's execute Phase 5: Real-World Utilities & Group Tools. Refer to
> `API_SPEC.md` and `MVP_SCOPE.md`:
>
> - Create the receipt parser and group bill splitter component
>   `@/components/expenses/ExpenseTracker.tsx` and API route
>   `/api/expenses/split/route.ts` using Zod for expense validation.
> - Create the Group Vibe Sync component with swipeable cards to resolve
>   conflicting travel preferences."

## Prompt 6 — Edge-Case Handling, Testing & Polish

> "Now let's execute Phase 6: Final Polish & Production Hardening.
>
> - Audit the entire codebase for TypeScript errors, unhandled promises, or
>   missing imports.
> - Add loading skeletons for map cards, error boundary fallbacks for
>   failed map loads, and empty states.
> - Add Framer Motion transitions to the micro-card drawer and modal
>   openings.
> - Provide a final summary of all implemented files."

## If the agent stops mid-file

> "You truncated the code in [Filename]. Rewrite the entire file from line
> 1 to the end without leaving out any logic."

## Workflow note (Bolt.new / Lovable vs. Cursor / VS Code)

- **Bolt.new / Lovable.dev**: paste the prompts directly — the tool builds
  files, runs installs, and renders a live preview in-browser. No manual
  copy-paste needed.
- **Cursor (Composer/Agent mode)**: paste prompts into the Composer panel
  (Cmd/Ctrl + I) — it edits files directly in your project folder; you
  just review and accept.
- **Plain chat AI (ChatGPT/Claude/Copilot web chat)**: it will output code
  blocks — you manually create each file in VS Code and paste the content
  in.

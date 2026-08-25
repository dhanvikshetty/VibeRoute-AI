# MVP Scope — Version 1.0

The full catalog in `FEATURES.md` is the long-term vision. Building all of
it at once will cause an AI coding agent (or a human) to produce sloppy,
half-implemented code. Version 1.0 ships a **tight core loop** that proves
the concept end-to-end.

## ✅ In Scope for MVP (Version 1.0)

These map directly to the workflows detailed in `ALGORITHMS.md` and the
routes in `API_SPEC.md`:

1. **Core Mapping & Navigation** — live map, origin→destination routing,
   route rendering (feature #6 foundation).
2. **Trip Theme Selection** — user picks a trip theme at creation
   (Spiritual, Heritage, Road Trip, Foodie Crawl, Unwind, Nightlife)
   (feature #2).
3. **Proactive "For You" Discovery Engine** — geofence + velocity-gated
   recommendation popups (feature #1).
4. **Theme-Aware Semantic Filtering** — cosine-similarity filter so
   recommendations always match trip theme (feature #2).
5. **Dynamic Waypoint Injection** — one-tap "add to route" that recalculates
   the live route (feature #6).
6. **Multimodal Vibe Check Matcher** — image/text mood → GPS match
   (feature #4) — included because it's a strong visual/demo feature.
7. **Hands-Free Voice Co-Pilot** — basic voice request → suggestion → verbal
   confirmation loop (feature #11).
8. **Group Vibe Sync (lightweight)** + **Expense Splitter** — simplified
   versions of features #15 and #16, since they're self-contained and don't
   block the core loop.

## ⏸️ Explicitly Deferred (Post-MVP / V2+)

- Social Radar & Trend Engine (#3) — needs real social API access; mock
  data only for now.
- Real-Time Chaos Adapter (#7) — needs live weather/traffic feeds; stub for
  V2.
- Multi-Transport Stitcher (#8) — needs transit + local fare data sources.
- Offline Micro-AI (#9) — infra-heavy, not needed to prove the concept.
- Crowd & Wait-Time Predictor (#10) — needs live density data sources.
- Local Safety & Vernacular Assistant (#12) — camera/OCR translation layer.
- Dietary & Emergency Safeguard (#13) — needs verified medical/dietary data
  sources.
- AI Pit-Stop Optimizer (#14) — depends on EV charger + facility data feeds.
- Storytelling Mode (#17) — nice-to-have audio layer, add once core loop
  works.

## 📋 Phased Build Roadmap

This is the order used in `BUILD_PROMPTS.md`:

- **Phase 1 — Database & Foundation**: Prisma schema, TypeScript types,
  DB client, mock data.
- **Phase 2 — UI Frame & Map**: 3-pane layout, Mapbox canvas, Zustand
  store.
- **Phase 3 — AI Recommendation Engine**: cosine similarity, velocity gate,
  ranking formula, micro-card deck, dynamic waypoint injection.
- **Phase 4 — Multimodal & Voice**: vibe-match modal, voice co-pilot.
- **Phase 5 — Group & Expense Utilities**: expense tracker, group vibe
  sync.
- **Phase 6 — Polish & Hardening**: edge cases, loading/error states,
  animations, final QA pass.

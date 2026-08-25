# Application UI/UX Architecture

## Layout Structure — 3-Pane Responsive Grid

```
+-------------------------------------------------------------------------------+
| TOP NAVBAR: Search Bar | Trip Theme Selector Badge | Profile | Voice FAB       |
+------------------------------------+------------------------------------------+
| LEFT PANEL (35% Desktop / Overlay) | RIGHT PANEL (65% Desktop / Full Screen)  |
|                                    |                                          |
|  1. Active Route Summary          |                                          |
|     - ETA, Distance, Detour Mins  |          MAPBOX GL JS CANVAS            |
|                                    |                                          |
|  2. Trip Theme Indicator          |  - Animated Polyline Route              |
|     [Spiritual / Heritage Tag]    |  - Custom Marker Pin Icons              |
|                                    |  - Dynamic Micro-Card Overlay (Top)     |
|  3. Itinerary Waypoints Timeline  |  - Floating Action Controls (3D, Layers)|
|     (A -> B [Detour] -> C)        |                                          |
|                                    |                                          |
|  4. Proactive Recommendation Deck |                                          |
|     (2-3 Swipeable Micro-Cards)   |                                          |
|                                    |                                          |
|  5. Expense Logger & Group Tab    |                                          |
+------------------------------------+------------------------------------------+
```

## Behavior notes

- **Desktop**: left panel is a fixed 35% sidebar; right panel (map) fills
  the remaining 65%.
- **Mobile**: left panel collapses into an overlay/bottom-sheet that the
  user can toggle; the map is full-screen by default.
- **Top navbar** is persistent across all views: search bar for
  destination entry, a badge showing the currently active trip theme, the
  user's profile drawer, and a floating voice-activation button (FAB) for
  the hands-free co-pilot.
- **Micro-card overlay** on the map appears when a proactive recommendation
  triggers (Workflow 1) — it should not block the map interaction and
  should be dismissible.
- **Itinerary timeline** always reflects the current waypoint order
  (A → B [Detour] → C, etc.) and updates live when a detour is added.

## Component map (see `ARCHITECTURE.md` for folder structure)

- `MapCanvas` — Mapbox GL JS wrapper, markers, polyline rendering.
- `TripThemeSelector` — theme picker badge/dropdown.
- `MicroCardDeck` — the 2–3 ranked recommendation cards with match score,
  detour time, and the "Add to Route" action.
- `ItineraryTimeline` — left-panel waypoint list.
- `VibeMatchModal` — multimodal upload/search modal.
- `VoiceCoPilot` — mic FAB + voice interaction UI.
- `ExpenseTracker` — group expense logger/splitter panel.

# Core Logic & Algorithmic Workflows

## Workflow 1: Proactive "For You" Geofence & Taste Engine

**Trigger**: Client browser sends active GPS coordinates (lat, lng),
current velocity, and the selected `TripTheme` every 30 seconds via a
background Web Worker.

**Velocity gate**:
- If speed > 50 km/h → do **not** trigger food/spot popups (avoids
  dangerous notifications while cruising).
- If speed < 15 km/h, OR the user has entered a dwell state within 1–3 km
  of a commercial cluster → execute the recommendation query.

**Fetching places**: Backend issues a Google Places Nearby Search within a
2000m radius, targeting top-rated food/attraction categories.

**Ranking algorithm**:
- Detour delta: `Δt = t_detour − t_direct`, computed via the Mapbox Matrix
  API.
- Taste match score (`S_taste`): computed by matching the user's explicit
  taste tags against venue tags.
- **Final rank formula**:

  ```
  Score = (0.5 × S_taste) + (0.3 × Rating) − (0.2 × Δt)
  ```

**Output**: Top 2–3 interactive micro-cards rendered over the live Mapbox
map, each with a primary `[+ Add as N-min Detour]` button.

## Workflow 2: Semantic Vibe Filter (Cosine Similarity)

Enforces thematic sync so, e.g., bars never appear on a spiritual/temple
trip.

1. **Vector generation**: Convert the current `TripTheme` description +
   user intent into an embedding vector `A ∈ R^1536` using OpenAI
   `text-embedding-3-small`.
2. **Candidate vectorization**: Retrieve candidate venue vectors
   `B ∈ R^1536` stored in Supabase `pgvector`.
3. **Similarity calculation**:

   ```
   Similarity(A, B) = (A · B) / (‖A‖ × ‖B‖)
   ```

4. **Hard cutoff threshold**:
   - If `Similarity ≥ 0.75` → pass the candidate spot to the UI.
   - If `Similarity < 0.75` → silently discard the spot, regardless of its
     Google rating.

## Workflow 3: Dynamic Waypoint Injection Routing (A→B→C)

1. **Current state**: Active route = Waypoint A (origin) + Waypoint C
   (destination). Mapbox renders polyline `R_AC`.
2. **User interaction**: User clicks `[+ Add to Route]` on a recommended
   micro-card (this becomes Waypoint B).
3. **API request**: Frontend calls the Mapbox Directions API with an
   intermediate waypoints parameter:

   ```
   GET https://api.mapbox.com/directions/v5/mapbox/driving/
       {lngA},{latA};{lngB},{latB};{lngC},{latC}?geometries=geojson
   ```

4. **State mutation**:
   - Zustand store updates the active route geometry.
   - Waypoints array is re-indexed (0 → A, 1 → B, 2 → C).
   - Route polyline redraws on the Mapbox canvas with a smooth Framer
     Motion transition.

## Workflow 4: Multimodal "Vibe Check" Matcher

1. **Input**: User uploads an image (file or URL) or types a natural
   language mood phrase (e.g., "foggy hill view with outdoor aesthetic
   coffee").
2. **Vision/text parsing**: Pass the input to a `gpt-4o` vision prompt:
   *"Analyze this visual input and extract key atmospheric, spatial,
   geographic, and venue keywords. Return a clean JSON array of tags."*
3. **Geospatial & vector query**: Use extracted tags to query Google
   Places API + `pgvector` for real-world matching locations near the
   user's destination.
4. **Result UI**: Render candidate spots as horizontal swipe cards with a
   confidence match percentage (e.g., "94% Visual Match").

## Workflow 5: Hands-Free Voice Co-Pilot

1. **Activation**: User clicks the microphone FAB or says the hotword
   "Hey Co-Pilot."
2. **Web Speech API**: Initializes `SpeechRecognition`
   (`continuous = false`, `lang = 'en-US'`).
3. **Transcription to LLM**: The transcribed string (e.g., "Find me a
   filter coffee spot within 10 minutes") is sent to `gpt-4o-mini` along
   with the current lat/long.
4. **Function calling**: The LLM outputs a structured tool call —
   `search_nearby_places(category="filter_coffee", max_detour_mins=10)`.
5. **Speech synthesis**: Backend returns the venue result; the app uses
   `window.speechSynthesis` to speak it back, e.g.: *"Found Brahmin's
   Coffee Bar 1.8 kilometers ahead, adding a 4-minute detour. Should I
   lock it in?"*
6. **Voice confirmation**: User says "Lock it in" → triggers automatic
   route insertion (reuses Workflow 3).

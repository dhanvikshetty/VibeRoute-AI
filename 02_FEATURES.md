# Master Feature Catalog (16 Features)

This is the full, unfiltered list of every feature concept discussed for
VibeRoute AI. `MVP_SCOPE.md` defines which of these ship in Version 1.0 —
this file is the complete long-term vision so nothing gets lost.

## 🎯 Category: Discovery & Context Engines

1. **Proactive "For You" Spot Radar**
   Detects when the user slows down or walks near top-rated spots
   (1–3 km radius / geofence) and surfaces 2–3 ranked micro-card
   suggestions based on implicit + explicit taste profile. Shows match
   score, detour time (e.g. "+3 mins"), and live status ("Closing in 20
   mins").

2. **Theme-Aware Vibe & Intent Sync**
   Locks a trip to an intent/theme (Spiritual/Pilgrimage, Heritage &
   Culture, Road Trip/Adventure, Foodie Crawl, Unwind/Chill,
   Nightlife/Party). Uses semantic vector similarity to hard-filter out
   spots that don't match the theme — e.g., never a sports bar during a
   temple trip, even if it's 200m away and 4.8 stars.

3. **Social Radar & Trend Engine**
   Analyzes real-time social activity (short-form videos, check-ins, viral
   posts) to flag spots trending *today* rather than relying on static,
   years-old reviews.

4. **Multimodal "Vibe Check" Matcher**
   User uploads a screenshot/reel/photo or types a mood description
   ("quiet foggy hilltop coffee vibe") and the AI matches real-world GPS
   locations to that aesthetic/mood.

## 🚗 Category: Route & Transit Mechanics

5. **Dynamic Mood-Based Routing**
   Route choice based on energy/vibe, not just speed: Scenic/Chill
   (green routes, coastal roads), Foodie Crawl (auto-inject hidden-gem
   food stops), Night Owl/High Energy (vibrant, safety-verified night
   spots).

6. **Dynamic Waypoint Injection**
   One-tap button inserts an approved spot as an intermediate waypoint
   (A→B→C) into the live route without breaking the master
   origin-to-destination navigation.

7. **Real-Time Chaos Adapter ("Plan B" AI)**
   Automatically re-routes and swaps recommendations if rain, traffic
   spikes, or a venue closes — e.g., swapping an outdoor viewpoint for a
   cozy indoor café when it starts raining.

8. **Instant Multi-Transport Stitcher**
   Combines public transit + walking + local cabs into one itinerary,
   with fair local fare estimates for the messy first-mile/last-mile gaps
   (e.g., "get off at Platform 2, walk 50m to the official auto stand,
   expect ~₹150").

9. **Offline Micro-AI**
   Lightweight on-device models + cached offline maps so navigation,
   waypoint recalculation, and guidebook lookups still work in zero-signal
   zones (mountains, rural highways). *(Deferred post-MVP — see
   MVP_SCOPE.md)*

## 🛡️ Category: Real-World Problem Solvers

10. **Crowd & Wait-Time Predictor**
    Uses live cellular density trends + historic patterns to show capacity
    gauges ("85% full, 45-min wait") and suggests better visit windows to
    dodge overtourism.

11. **Hands-Free Voice Co-Pilot**
    Conversational voice assistant for driving/riding: user speaks a
    request ("find me filter coffee within 10 minutes"), AI responds
    verbally with an option, user confirms with a single word ("lock it
    in") to auto-add the detour — no screen interaction needed.

12. **Local Safety & Vernacular Assistant**
    Live camera translation of local menus/signs (with dietary flags like
    "contains peanuts"), plus flags routes that are poorly lit or low
    -traffic after dark.

13. **Dietary & Emergency Safeguard**
    Deep-scans dish ingredients for strict dietary compliance (Jain,
    Vegan, Gluten-Free, Halal). One-tap SOS surfaces nearby 24/7 medical
    help and translates emergency phrases into the local language.

14. **AI Pit-Stop Optimizer**
    Combines multiple needs into one efficient stop — e.g., "20% EV
    battery left + need a clean washroom in 45 minutes" → finds a single
    highway stop with both EV charging and clean facilities.

## 👥 Category: Group, Expense & Experience

15. **Group Trip "Vibe Sync" & Consensus Engine**
    Each group member does a 30-second swipe-card poll (budget, food
    taste, wake-up time). AI runs a consensus algorithm to build one
    itinerary that satisfies the overlap of everyone's preferences.

16. **Zero-Friction Expense Companion**
    OCR/text-based receipt logger ("Paid 1200 for lunch") that
    categorizes spend and auto-splits group balances in real time.

17. **Storytelling Mode & Local Lore Audio Guide**
    GPS-triggered 30-second audio narration of local history, architecture,
    or trivia as the user passes notable landmarks.

*(Note: the original brainstorm converged on "16 features" as a round
number, but a few extra sub-concepts like Storytelling Mode and the Pit-Stop
Optimizer were folded in along the way — this file lists all of them
individually so nothing is lost, even though the count reads as 17.)*

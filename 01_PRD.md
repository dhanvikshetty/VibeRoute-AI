# Product Requirements Document (PRD)

## Project Name
**VibeRoute AI** — Next-Gen Intelligent Journey Planner

## Application Type
Single Page Application (SPA) / Progressive Web App (PWA), built as a
responsive **web application** (desktop + mobile browser). Native mobile
apps are explicitly out of scope for now — this is a portfolio/resume
project first.

## Problem Statement
Existing travel and navigation apps (Google Maps, TripIt, etc.) are good at
raw navigation or static itinerary storage, but they are "dumb" in three
specific ways:

1. **No taste/context awareness** — they show you *every* restaurant near
   you, not the 2–3 that actually match your taste and mood.
2. **No vibe/theme consistency** — they'll suggest a nightclub next to a
   temple you're visiting on a pilgrimage, because they only optimize for
   distance and rating, not intent.
3. **No real-time adaptability** — if it rains, traffic spikes, or a venue
   closes, the user has to manually re-plan instead of the app doing it for
   them.

## Core Value Proposition
An AI-driven travel discovery and routing platform that converts user
intent, emotional "vibe," and real-time location telemetry into dynamic,
theme-consistent travel itineraries with one-tap route detours — behaving
less like a maps app and more like a smart travel companion that knows your
taste and the mood of your trip.

## Target User
- Primary: solo travelers, road-trippers, and day-trip planners who want
  smart, personalized stop suggestions without manual searching.
- Secondary: small groups (friends/family) trying to agree on an itinerary.
- Platform: desktop and mobile web browser. No native app in this phase.

## Goals for Version 1.0 (MVP)
See `MVP_SCOPE.md` for the exact feature cut. At a high level, V1 must prove
out the core loop:

> User sets a trip + theme → drives/walks → app proactively surfaces
> theme-matched, taste-matched spots nearby → user taps to add as a detour
> → route updates live.

## Non-Goals (for now)
- Native iOS/Android apps (planned for later, explicitly deferred by the
  project owner).
- Offline/zero-network AI (deferred — real-world infra problem, not core to
  proving the concept).
- Full social-media trend scraping (TikTok/Instagram APIs) — deferred due
  to API access complexity; can be mocked/faked for demo purposes later.

## Success Criteria
- A working deployed web app where a user can: create a trip with a theme,
  see a live map with a route, receive theme-matched proactive
  recommendations, and one-tap add a recommendation as a route detour.
- Recommendations are visibly and correctly filtered by theme (e.g., a
  spiritual/temple trip never surfaces nightlife spots).
- Clean, production-quality codebase suitable to showcase in a portfolio /
  resume context.

## Constraints
- Built solo (or with one friend) as a portfolio project — favor
  managed/serverless services (Supabase, Vercel, etc.) over infra the team
  would have to run themselves.
- Must be buildable by feeding specs to an AI coding agent in phases (see
  `BUILD_PROMPTS.md`) — this shapes how modular the architecture needs to
  be.

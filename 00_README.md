# VibeRoute AI — Project Docs Folder

This folder is a self-contained "context pack" for VibeRoute AI, an AI-powered
journey planner web app. It's built so you can hand the whole folder (or its
contents) to an AI coding agent in a **fresh chat with zero prior context**
and have it build the project correctly, in the right order, without
hallucinating missing pieces.

## Files in this folder

| # | File | What it's for |
|---|------|----------------|
| 01 | `PRD.md` | Product vision, problem statement, target user, success criteria |
| 02 | `FEATURES.md` | The full 16-feature master catalog (everything ever discussed) |
| 03 | `MVP_SCOPE.md` | What's actually in Version 1.0 vs. later phases |
| 04 | `ARCHITECTURE.md` | Tech stack, system diagram, folder structure |
| 05 | `DATABASE_SCHEMA.md` | Prisma/PostgreSQL schema (with pgvector) |
| 06 | `API_SPEC.md` | Every backend route, payload, and behavior |
| 07 | `ALGORITHMS.md` | The actual math/logic: ranking formula, cosine similarity, velocity gates |
| 08 | `UI_UX_SPEC.md` | Layout structure, panels, component map |
| 09 | `GUARDRAILS.md` | Master system directive — coding rules, no-hallucination rules |
| 10 | `BUILD_PROMPTS.md` | The exact phase-by-phase prompts to feed the AI agent, in order |
| 11 | `ENV_SETUP.md` | API keys / services you need to sign up for before building |

## How to actually use this

1. Sign up for the services in `ENV_SETUP.md` first (Mapbox, Google Places,
   OpenAI, Supabase) and grab your API keys — the agent will ask for these
   and you don't want to be scrambling mid-build.
2. Open a **fresh chat** in your AI coding tool (Cursor, Claude Code,
   Bolt.new, v0, etc.).
3. Paste `GUARDRAILS.md` first — this sets the rules of engagement.
4. Paste `PRD.md`, `FEATURES.md`, `MVP_SCOPE.md`, `ARCHITECTURE.md`,
   `DATABASE_SCHEMA.md`, `API_SPEC.md`, `ALGORITHMS.md`, and `UI_UX_SPEC.md`
   together as "the spec" (most tools let you attach multiple files, or you
   can concatenate them).
5. Wait for the agent to acknowledge and output its own roadmap.
6. Feed it the prompts in `BUILD_PROMPTS.md` **one at a time**, in order.
   Don't skip ahead — test each phase before moving to the next.
7. If it ever truncates a file, tell it: *"You truncated the code in
   [filename]. Rewrite the entire file from line 1 to the end without
   leaving out any logic."*

## What this folder deliberately does NOT contain

No actual code, no `package.json`, no repo. This is planning/spec material
only — the point is that an AI agent (or a human dev) reads these docs and
*generates* the project from them.

# Database Schema (PostgreSQL + Prisma + pgvector)

```prisma
datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")
  extensions = [pgvector(map: "vector")]
}

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

enum TripTheme {
  SPIRITUAL_PILGRIMAGE
  HERITAGE_CULTURE
  ROAD_TRIP_ADVENTURE
  FOODIE_CRAWL
  UNWIND_CHILL
  NIGHTLIFE_PARTY
}

model User {
  id              String      @id @default(uuid())
  email           String      @unique
  name            String
  avatarUrl       String?
  explicitTastes  String[]    // e.g., ["South Indian", "Filter Coffee", "Aesthetic Cafes"]
  createdAt       DateTime    @default(now())
  trips           Trip[]
  expenses        Expense[]
}

model Trip {
  id              String         @id @default(uuid())
  userId          String
  title           String
  theme           TripTheme      @default(ROAD_TRIP_ADVENTURE)
  originLat       Float
  originLng       Float
  destLat         Float
  destLng         Float
  originAddress   String
  destAddress     String
  waypoints       Waypoint[]
  expenses        Expense[]
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  user            User           @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Waypoint {
  id              String      @id @default(uuid())
  tripId          String
  placeId         String      // External Google Place ID
  name            String
  category        String
  lat             Float
  lng             Float
  orderIndex      Int         // 0 for Origin, N for Destination
  isDetour        Boolean     @default(false)
  detourDuration  Int?        // Detour time in minutes
  rating          Float?

  trip            Trip        @relation(fields: [tripId], references: [id], onDelete: Cascade)
}

model PlaceEmbedding {
  id          String                  @id @default(uuid())
  placeId     String                  @unique
  name        String
  category    String
  tags        String[]
  embedding   Unsupported("vector(1536)")
  createdAt   DateTime                @default(now())
}

model Expense {
  id          String   @id @default(uuid())
  tripId      String
  payerId     String
  amount      Float
  category    String
  description String
  splitWith   String[] // Array of user IDs/names
  createdAt   DateTime @default(now())

  trip        Trip     @relation(fields: [tripId], references: [id], onDelete: Cascade)
  payer       User     @relation(fields: [payerId], references: [id], onDelete: Cascade)
}
```

## Notes for implementation

- `PlaceEmbedding.embedding` is a 1536-dimensional vector produced by
  OpenAI's `text-embedding-3-small` model — used for the theme-compatibility
  cosine similarity filter described in `ALGORITHMS.md`.
- `Waypoint.orderIndex` defines route order; index 0 is always the origin
  and the highest index is always the final destination. Inserted detours
  get an index between the two endpoints they sit between.
- `Expense.splitWith` stores the user IDs (or guest names) sharing that
  cost — the split logic itself lives in application code, not the DB.

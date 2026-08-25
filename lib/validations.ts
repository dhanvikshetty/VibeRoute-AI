import { z } from 'zod';

export const TripThemeEnum = z.enum([
  'SPIRITUAL_PILGRIMAGE',
  'HERITAGE_CULTURE',
  'ROAD_TRIP_ADVENTURE',
  'FOODIE_CRAWL',
  'UNWIND_CHILL',
  'NIGHTLIFE_PARTY',
]);

export const CoordinatesSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const TripCreateSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  originAddress: z.string().min(1, 'Origin address is required'),
  destAddress: z.string().min(1, 'Destination address is required'),
  originCoords: CoordinatesSchema,
  destCoords: CoordinatesSchema,
  theme: TripThemeEnum.default('ROAD_TRIP_ADVENTURE'),
});

export const ProactiveRecommendationSchema = z.object({
  tripId: z.string().optional(),
  currentLat: z.number().min(-90).max(90),
  currentLng: z.number().min(-180).max(180),
  speed: z.number().min(0), // km/h
  theme: TripThemeEnum.default('ROAD_TRIP_ADVENTURE'),
  userTastes: z.array(z.string()).optional(),
});

export const VibeMatchSchema = z.object({
  imageFile: z.string().optional(), // base64 or URL
  textQuery: z.string().optional(),
  userCoords: CoordinatesSchema,
  theme: TripThemeEnum.optional(),
}).refine(data => data.imageFile || data.textQuery, {
  message: "Either imageFile or textQuery must be provided",
});

export const VoiceAgentSchema = z.object({
  audioTranscript: z.string().min(1, 'Transcript is required'),
  currentCoords: CoordinatesSchema,
  activeRouteId: z.string().optional(),
  theme: TripThemeEnum.optional(),
});

export const ExpenseSplitSchema = z.object({
  tripId: z.string().min(1, 'Trip ID is required'),
  payerId: z.string().min(1, 'Payer ID is required'),
  amount: z.number().positive('Amount must be greater than 0'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required'),
  rawReceiptText: z.string().optional(),
  splitWith: z.array(z.string()).default([]),
});

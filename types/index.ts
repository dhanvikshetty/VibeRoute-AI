export type TripTheme =
  | 'SPIRITUAL_PILGRIMAGE'
  | 'HERITAGE_CULTURE'
  | 'ROAD_TRIP_ADVENTURE'
  | 'FOODIE_CRAWL'
  | 'UNWIND_CHILL'
  | 'NIGHTLIFE_PARTY';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
  explicitTastes: string[];
  createdAt: Date | string;
}

export interface Waypoint {
  id: string;
  tripId: string;
  placeId: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  orderIndex: number;
  isDetour: boolean;
  detourDuration?: number | null; // in minutes
  rating?: number | null;
}

export interface Trip {
  id: string;
  userId: string;
  title: string;
  theme: TripTheme;
  originLat: number;
  originLng: number;
  destLat: number;
  destLng: number;
  originAddress: string;
  destAddress: string;
  waypoints?: Waypoint[];
  expenses?: Expense[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface PlaceEmbedding {
  id: string;
  placeId: string;
  name: string;
  category: string;
  tags: string[];
  embedding: number[]; // 1536-dimensional array
  createdAt: Date | string;
}

export interface Expense {
  id: string;
  tripId: string;
  payerId: string;
  amount: number;
  category: string;
  description: string;
  splitWith: string[];
  createdAt: Date | string;
  payer?: User;
}

export interface RankedPlace {
  placeId: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  rating: number;
  userRatingsTotal: number;
  priceLevel?: number;
  address: string;
  photoUrl?: string;
  tags: string[];
  detourDeltaMinutes: number; // Δt
  tasteMatchScore: number;    // S_taste (0.0 - 1.0)
  cosineSimilarity: number;   // Cosine similarity (0.0 - 1.0)
  finalScore: number;         // (0.5 * S_taste) + (0.3 * Rating/5) - (0.2 * Δt/30)
  matchReason?: string;
}

export interface RouteGeometry {
  type: 'LineString';
  coordinates: [number, number][]; // [lng, lat]
}

export interface RouteSummary {
  distanceKm: number;
  durationMinutes: number;
  eta: string;
  geometry: RouteGeometry;
}

// API Request and Response Types
export interface TripCreateRequest {
  userId: string;
  originAddress: string;
  destAddress: string;
  originCoords: Coordinates;
  destCoords: Coordinates;
  theme: TripTheme;
}

export interface TripCreateResponse {
  success: boolean;
  trip: Trip;
  route: RouteSummary;
}

export interface ProactiveRecommendationRequest {
  tripId?: string;
  currentLat: number;
  currentLng: number;
  speed: number; // in km/h
  theme: TripTheme;
  userTastes?: string[];
}

export interface ProactiveRecommendationResponse {
  triggered: boolean;
  reason?: string;
  recommendations: RankedPlace[];
}

export interface VibeMatchRequest {
  imageFile?: string; // base64 or URL
  textQuery?: string;
  userCoords: Coordinates;
  theme?: TripTheme;
}

export interface VibeMatchResult {
  placeId: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  photoUrl?: string;
  address: string;
  rating: number;
  matchPercentage: number;
  matchedTags: string[];
  vibeDescription: string;
  detourMinutes?: number;
}

export interface VibeMatchResponse {
  success: boolean;
  extractedTags: string[];
  atmosphereSummary: string;
  matches: VibeMatchResult[];
}

export interface VoiceAgentRequest {
  audioTranscript: string;
  currentCoords: Coordinates;
  activeRouteId?: string;
  theme?: TripTheme;
}

export type VoiceActionType = 'ADD_WAYPOINT' | 'SHOW_NEARBY' | 'EXPLAIN_VIBE' | 'NONE';

export interface VoiceAgentResponse {
  spokenResponse: string;
  action: {
    type: VoiceActionType;
    category?: string;
    payload?: RankedPlace | null;
  };
}

export interface ExpenseSplitItem {
  name: string;
  cost: number;
  assignedTo?: string[];
}

export interface ExpenseSplitRequest {
  tripId: string;
  payerId: string;
  amount: number;
  category: string;
  description: string;
  rawReceiptText?: string;
  splitWith?: string[];
}

export interface ExpenseSplitResponse {
  success: boolean;
  expense: Expense;
  parsedItems?: ExpenseSplitItem[];
  splitBreakdown: Record<string, number>;
}

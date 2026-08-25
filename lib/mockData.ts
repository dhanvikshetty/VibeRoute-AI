import { User, Trip, Waypoint, RankedPlace, TripTheme } from '@/types';

// Deterministic mock 1536-dimensional vector generator for tests & fallback
export function generateMockEmbedding(seed: string): number[] {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const vector: number[] = [];
  let sumSquares = 0;
  for (let i = 0; i < 1536; i++) {
    const val = Math.sin(hash + i * 0.1);
    vector.push(val);
    sumSquares += val * val;
  }
  // Normalize vector to unit length
  const norm = Math.sqrt(sumSquares);
  return vector.map(v => v / (norm || 1));
}

export const MOCK_USER: User = {
  id: 'user-001',
  email: 'explorer@viberoute.ai',
  name: 'Alex Rivera',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  explicitTastes: ['Specialty Coffee', 'Artisan Bakeries', 'Scenic Overlooks', 'Heritage Architecture', 'Quiet Courtyards'],
  createdAt: new Date().toISOString(),
};

export const MOCK_PLACES: (RankedPlace & { themeAffinity: TripTheme[] })[] = [
  {
    placeId: 'place-01',
    name: 'Brahmin\'s Coffee Bar',
    category: 'Traditional South Indian Cafe',
    lat: 12.9438,
    lng: 77.5746,
    rating: 4.8,
    userRatingsTotal: 1420,
    priceLevel: 1,
    address: 'Near Shankarpuram, Ranga Rao Rd, Shankar Puram',
    photoUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
    tags: ['Filter Coffee', 'Crispy Vada', 'South Indian', 'Quick Bite', 'Heritage Cafe'],
    detourDeltaMinutes: 4,
    tasteMatchScore: 0.96,
    cosineSimilarity: 0.91,
    finalScore: 0.92,
    matchReason: 'Matches your taste for Filter Coffee and Heritage vibes with only a 4-min detour.',
    themeAffinity: ['FOODIE_CRAWL', 'HERITAGE_CULTURE', 'UNWIND_CHILL'],
  },
  {
    placeId: 'place-02',
    name: 'Cloud Nine Overlook Cafe',
    category: 'Scenic Viewpoint & Espresso',
    lat: 12.9250,
    lng: 77.5890,
    rating: 4.7,
    userRatingsTotal: 840,
    priceLevel: 2,
    address: 'Hill View Ridge, Valley Rd',
    photoUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=80',
    tags: ['Scenic Overlook', 'Specialty Coffee', 'Sunset View', 'Outdoor Patio'],
    detourDeltaMinutes: 7,
    tasteMatchScore: 0.92,
    cosineSimilarity: 0.88,
    finalScore: 0.87,
    matchReason: 'Panoramic cliff views with artisanal brews, 7 minutes off highway route.',
    themeAffinity: ['ROAD_TRIP_ADVENTURE', 'UNWIND_CHILL', 'FOODIE_CRAWL'],
  },
  {
    placeId: 'place-03',
    name: 'Sri Someshwara Ancient Temple',
    category: 'Historical Sanctuary',
    lat: 12.9716,
    lng: 77.6200,
    rating: 4.9,
    userRatingsTotal: 2300,
    priceLevel: 0,
    address: 'Old Temple Street, Halasuru',
    photoUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&auto=format&fit=crop&q=80',
    tags: ['Ancient Temple', 'Spiritual', 'Chola Architecture', 'Peaceful', 'Heritage'],
    detourDeltaMinutes: 6,
    tasteMatchScore: 0.89,
    cosineSimilarity: 0.94,
    finalScore: 0.91,
    matchReason: '12th-century stone carvings with deep meditative serenity, 6-min detour.',
    themeAffinity: ['SPIRITUAL_PILGRIMAGE', 'HERITAGE_CULTURE'],
  },
  {
    placeId: 'place-04',
    name: 'Velvet Horizon Rooftop Lounge',
    category: 'Cocktails & Beats',
    lat: 12.9780,
    lng: 77.6405,
    rating: 4.6,
    userRatingsTotal: 1100,
    priceLevel: 3,
    address: '100ft Road, Indiranagar',
    photoUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80',
    tags: ['Rooftop', 'Craft Cocktails', 'DJ Music', 'Nightlife', 'Lively'],
    detourDeltaMinutes: 9,
    tasteMatchScore: 0.85,
    cosineSimilarity: 0.89,
    finalScore: 0.82,
    matchReason: 'High-energy rooftop with mixology and skyline views.',
    themeAffinity: ['NIGHTLIFE_PARTY', 'FOODIE_CRAWL'],
  },
  {
    placeId: 'place-05',
    name: 'Gilded Pagoda Meditation Grove',
    category: 'Zen Garden & Retreat',
    lat: 12.8900,
    lng: 77.5600,
    rating: 4.8,
    userRatingsTotal: 920,
    priceLevel: 1,
    address: 'Serenity Enclave, Bannerghatta Outer',
    photoUrl: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?w=600&auto=format&fit=crop&q=80',
    tags: ['Meditation', 'Spiritual', 'Lotus Pond', 'Silent Retreat', 'Zen Garden'],
    detourDeltaMinutes: 8,
    tasteMatchScore: 0.94,
    cosineSimilarity: 0.95,
    finalScore: 0.90,
    matchReason: 'Quiet bamboo grove with tranquil meditation pavilions.',
    themeAffinity: ['SPIRITUAL_PILGRIMAGE', 'UNWIND_CHILL'],
  },
  {
    placeId: 'place-06',
    name: 'Rustic Pine Bakery & Roastery',
    category: 'Artisanal Sourdough & Pastry',
    lat: 12.9340,
    lng: 77.6100,
    rating: 4.9,
    userRatingsTotal: 1680,
    priceLevel: 2,
    address: 'Koramangala 4th Block, 80ft Rd',
    photoUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    tags: ['Artisan Bakeries', 'Specialty Coffee', 'Sourdough', 'Croissant', 'Aesthetic Cafes'],
    detourDeltaMinutes: 3,
    tasteMatchScore: 0.98,
    cosineSimilarity: 0.93,
    finalScore: 0.95,
    matchReason: 'Warm cardamom buns and hand-poured single origins right on your route.',
    themeAffinity: ['FOODIE_CRAWL', 'ROAD_TRIP_ADVENTURE', 'UNWIND_CHILL'],
  }
];

export const MOCK_ROUTE_COORDINATES: [number, number][] = [
  [77.5946, 12.9716], // MG Road (Origin)
  [77.5890, 12.9600],
  [77.5800, 12.9500],
  [77.5746, 12.9438], // Brahmin's Detour nearby
  [77.5700, 12.9350],
  [77.5650, 12.9200],
  [77.5550, 12.8900],
  [76.6394, 12.2958], // Mysore Palace (Destination)
];

export const MOCK_INITIAL_TRIP: Trip = {
  id: 'trip-001',
  userId: 'user-001',
  title: 'Royal Heritage & Culinary Trail',
  theme: 'FOODIE_CRAWL',
  originLat: 12.9716,
  originLng: 77.5946,
  destLat: 12.2958,
  destLng: 76.6394,
  originAddress: 'Bengaluru City Center, Karnataka',
  destAddress: 'Mysore Palace, Mysuru, Karnataka',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  waypoints: [
    {
      id: 'wp-origin',
      tripId: 'trip-001',
      placeId: 'origin-spot',
      name: 'Bengaluru City Center',
      category: 'Trip Origin',
      lat: 12.9716,
      lng: 77.5946,
      orderIndex: 0,
      isDetour: false,
    },
    {
      id: 'wp-dest',
      tripId: 'trip-001',
      placeId: 'dest-spot',
      name: 'Mysore Palace',
      category: 'Trip Destination',
      lat: 12.2958,
      lng: 76.6394,
      orderIndex: 1,
      isDetour: false,
    },
  ],
};

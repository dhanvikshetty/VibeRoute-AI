import { create } from 'zustand';
import {
  TripTheme,
  Coordinates,
  Waypoint,
  Trip,
  RankedPlace,
  RouteGeometry,
  RouteSummary,
} from '@/types';
import { MOCK_INITIAL_TRIP, MOCK_PLACES, MOCK_ROUTE_COORDINATES } from '@/lib/mockData';

interface TripState {
  // Active Trip & Waypoints
  activeTrip: Trip | null;
  activeTheme: TripTheme;
  waypoints: Waypoint[];
  routeGeometry: RouteGeometry | null;
  routeSummary: {
    distanceKm: number;
    durationMinutes: number;
    eta: string;
  } | null;

  // Real-time Telemetry & Discovery
  currentCoords: Coordinates;
  velocityKmH: number;
  proactiveDeck: RankedPlace[];
  isSearching: boolean;

  // Modals & Panels
  isVibeModalOpen: boolean;
  isVoiceActive: boolean;
  isMobilePanelOpen: boolean;
  activeTab: 'itinerary' | 'vibematch' | 'expenses' | 'groupsync';
  mapBearing: number;
  mapPitch: number;

  // State Mutators
  setTheme: (theme: TripTheme) => void;
  setCurrentCoords: (coords: Coordinates) => void;
  setVelocity: (speed: number) => void;
  setWaypoints: (waypoints: Waypoint[]) => void;
  setRoute: (geometry: RouteGeometry, summary: { distanceKm: number; durationMinutes: number; eta: string }) => void;
  setProactiveDeck: (places: RankedPlace[]) => void;
  dismissProactivePlace: (placeId: string) => void;
  injectDetour: (place: RankedPlace) => void;
  removeWaypoint: (waypointId: string) => void;
  setVibeModalOpen: (open: boolean) => void;
  setVoiceActive: (active: boolean) => void;
  setMobilePanelOpen: (open: boolean) => void;
  setActiveTab: (tab: 'itinerary' | 'vibematch' | 'expenses' | 'groupsync') => void;
  setMapPitchBearing: (pitch: number, bearing: number) => void;
  resetTrip: () => void;
}

export const useTripStore = create<TripState>((set, get) => ({
  activeTrip: MOCK_INITIAL_TRIP,
  activeTheme: 'FOODIE_CRAWL',
  waypoints: MOCK_INITIAL_TRIP.waypoints || [],
  routeGeometry: {
    type: 'LineString',
    coordinates: MOCK_ROUTE_COORDINATES,
  },
  routeSummary: {
    distanceKm: 142.8,
    durationMinutes: 175,
    eta: '3h 15m',
  },
  currentCoords: {
    lat: 12.9716,
    lng: 77.5946,
  },
  velocityKmH: 12.5, // Initial speed under velocity gate threshold (<15 km/h)
  proactiveDeck: MOCK_PLACES.filter(p => p.themeAffinity.includes('FOODIE_CRAWL')).slice(0, 3),
  isSearching: false,
  isVibeModalOpen: false,
  isVoiceActive: false,
  isMobilePanelOpen: false,
  activeTab: 'itinerary',
  mapBearing: 0,
  mapPitch: 45,

  setTheme: (theme) => {
    set((state) => {
      const filtered = MOCK_PLACES.filter((p) => p.themeAffinity.includes(theme));
      return {
        activeTheme: theme,
        proactiveDeck: filtered.length > 0 ? filtered.slice(0, 3) : MOCK_PLACES.slice(0, 3),
      };
    });
  },

  setCurrentCoords: (coords) => set({ currentCoords: coords }),
  setVelocity: (speed) => set({ velocityKmH: speed }),
  setWaypoints: (waypoints) => set({ waypoints }),

  setRoute: (geometry, summary) =>
    set({
      routeGeometry: geometry,
      routeSummary: summary,
    }),

  setProactiveDeck: (places) => set({ proactiveDeck: places }),

  dismissProactivePlace: (placeId) =>
    set((state) => ({
      proactiveDeck: state.proactiveDeck.filter((p) => p.placeId !== placeId),
    })),

  injectDetour: (place) => {
    const { waypoints, routeGeometry, routeSummary } = get();
    const origin = waypoints.find((w) => w.orderIndex === 0) || waypoints[0];
    const destination = waypoints.find((w) => w.orderIndex === waypoints.length - 1) || waypoints[waypoints.length - 1];

    const newDetourWaypoint: Waypoint = {
      id: `wp-${Date.now()}`,
      tripId: origin?.tripId || 'trip-active',
      placeId: place.placeId,
      name: place.name,
      category: place.category,
      lat: place.lat,
      lng: place.lng,
      orderIndex: waypoints.length > 1 ? waypoints.length - 1 : 1,
      isDetour: true,
      detourDuration: place.detourDeltaMinutes,
      rating: place.rating,
    };

    // Insert detour between origin and destination
    const updatedWaypoints = [...waypoints];
    if (updatedWaypoints.length >= 2) {
      updatedWaypoints.splice(updatedWaypoints.length - 1, 0, newDetourWaypoint);
    } else {
      updatedWaypoints.push(newDetourWaypoint);
    }

    // Re-index all waypoints
    const reindexedWaypoints = updatedWaypoints.map((w, index) => ({
      ...w,
      orderIndex: index,
    }));

    // Generate updated route coordinates injecting detour point
    const detourCoord: [number, number] = [place.lng, place.lat];
    const oldCoords = routeGeometry?.coordinates || MOCK_ROUTE_COORDINATES;
    const midIndex = Math.floor(oldCoords.length / 2);
    const newCoordinates: [number, number][] = [
      ...oldCoords.slice(0, midIndex),
      detourCoord,
      ...oldCoords.slice(midIndex),
    ];

    const newDuration = (routeSummary?.durationMinutes || 120) + (place.detourDeltaMinutes || 5);
    const hours = Math.floor(newDuration / 60);
    const mins = Math.round(newDuration % 60);

    set({
      waypoints: reindexedWaypoints,
      routeGeometry: {
        type: 'LineString',
        coordinates: newCoordinates,
      },
      routeSummary: {
        distanceKm: (routeSummary?.distanceKm || 140) + 3.2,
        durationMinutes: newDuration,
        eta: `${hours > 0 ? `${hours}h ` : ''}${mins}m`,
      },
      proactiveDeck: get().proactiveDeck.filter((p) => p.placeId !== place.placeId),
    });
  },

  removeWaypoint: (waypointId) => {
    const { waypoints } = get();
    const filtered = waypoints.filter((w) => w.id !== waypointId);
    const reindexed = filtered.map((w, index) => ({ ...w, orderIndex: index }));
    set({ waypoints: reindexed });
  },

  setVibeModalOpen: (open) => set({ isVibeModalOpen: open }),
  setVoiceActive: (active) => set({ isVoiceActive: active }),
  setMobilePanelOpen: (open) => set({ isMobilePanelOpen: open }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setMapPitchBearing: (pitch, bearing) => set({ mapPitch: pitch, mapBearing: bearing }),

  resetTrip: () =>
    set({
      activeTrip: MOCK_INITIAL_TRIP,
      waypoints: MOCK_INITIAL_TRIP.waypoints || [],
      routeGeometry: { type: 'LineString', coordinates: MOCK_ROUTE_COORDINATES },
      routeSummary: { distanceKm: 142.8, durationMinutes: 175, eta: '3h 15m' },
    }),
}));

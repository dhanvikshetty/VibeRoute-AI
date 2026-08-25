'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useTripStore } from '@/store/useTripStore';
import { THEME_CONFIG } from '@/components/theme/TripThemeSelector';
import {
  Compass,
  Layers,
  Sparkles,
  Navigation2,
  Gauge,
  Maximize2,
  ZoomIn,
  ZoomOut,
  MapPin,
  Clock,
  Plus,
  X,
  Star,
  CheckCircle2,
  Car
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { RankedPlace } from '@/types';

export function MapCanvas() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapboxError, setMapboxError] = useState(false);
  const [activeMarkerPopup, setActiveMarkerPopup] = useState<RankedPlace | null>(null);

  const {
    waypoints,
    routeGeometry,
    activeTheme,
    proactiveDeck,
    injectDetour,
    dismissProactivePlace,
    velocityKmH,
    setVelocity,
    mapPitch,
    mapBearing,
    setMapPitchBearing,
  } = useTripStore();

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoidmliZXJvdXRlLWFpIiwiYSI6ImNtNzVleGFtcGxlMG1wczF2aWJlcm91dGUifQ.mock_token';
  const themeConfig = THEME_CONFIG[activeTheme];

  // Try initializing Mapbox GL JS if token and window available
  useEffect(() => {
    let mapboxgl: any;
    let isCancelled = false;

    async function initMap() {
      try {
        const mb = await import('mapbox-gl');
        mapboxgl = (mb as any).default || mb;

        if (!mapContainerRef.current) return;

        // Check if token is mock or invalid
        if (!token || token.includes('mock_token')) {
          setMapboxError(true);
          return;
        }

        mapboxgl.accessToken = token;

        const map = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: 'mapbox://styles/mapbox/dark-v11',
          center: [77.5946, 12.9716],
          zoom: 9.5,
          pitch: mapPitch,
          bearing: mapBearing,
          attributionControl: false,
        });

        mapInstanceRef.current = map;

        map.on('load', () => {
          if (isCancelled) return;
          setMapLoaded(true);

          // Add Route Source & Layer
          if (routeGeometry) {
            map.addSource('route', {
              type: 'geojson',
              data: {
                type: 'Feature',
                properties: {},
                geometry: routeGeometry,
              },
            });

            // Glowing casing line
            map.addLayer({
              id: 'route-glow',
              type: 'line',
              source: 'route',
              layout: { 'line-join': 'round', 'line-cap': 'round' },
              paint: {
                'line-color': '#8B5CF6',
                'line-width': 8,
                'line-opacity': 0.4,
                'line-blur': 4,
              },
            });

            // Core crisp line
            map.addLayer({
              id: 'route-line',
              type: 'line',
              source: 'route',
              layout: { 'line-join': 'round', 'line-cap': 'round' },
              paint: {
                'line-color': '#A855F7',
                'line-width': 4,
                'line-opacity': 0.95,
              },
            });
          }
        });

        map.on('error', () => {
          setMapboxError(true);
        });
      } catch (err) {
        console.warn('Mapbox initialization fallback mode activated:', err);
        setMapboxError(true);
      }
    }

    initMap();

    return () => {
      isCancelled = true;
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch {}
      }
    };
  }, [token]);

  // Update map polyline and bounds whenever routeGeometry changes
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current || !routeGeometry) return;
    const map = mapInstanceRef.current;
    const source = map.getSource('route');
    if (source) {
      source.setData({
        type: 'Feature',
        properties: {},
        geometry: routeGeometry,
      });

      // Fit bounds
      if (routeGeometry.coordinates.length > 0) {
        const bounds = routeGeometry.coordinates.reduce(
          (b: any, coord: [number, number]) => b.extend(coord),
          new (window as any).mapboxgl.LngLatBounds(
            routeGeometry.coordinates[0],
            routeGeometry.coordinates[0]
          )
        );
        map.fitBounds(bounds, { padding: 80, duration: 1200 });
      }
    }
  }, [routeGeometry, mapLoaded]);

  // Zoom controls
  const handleZoom = (delta: number) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomTo(mapInstanceRef.current.getZoom() + delta, { duration: 300 });
    }
  };

  const handleToggle3D = () => {
    const nextPitch = mapPitch > 0 ? 0 : 55;
    const nextBearing = mapBearing > 0 ? 0 : 25;
    setMapPitchBearing(nextPitch, nextBearing);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.easeTo({
        pitch: nextPitch,
        bearing: nextBearing,
        duration: 800,
      });
    }
  };

  const topCard = proactiveDeck[0];

  return (
    <div className="relative w-full h-full min-h-[500px] bg-slate-950 overflow-hidden select-none">
      {/* Real Mapbox Container or High-Tech Vector Canvas Fallback */}
      {!mapboxError ? (
        <div ref={mapContainerRef} className="w-full h-full absolute inset-0" />
      ) : (
        /* High-Tech Vector Radar View (Visual Interactive Simulation) */
        <div className="absolute inset-0 bg-radial-gradient flex items-center justify-center p-6 overflow-hidden">
          {/* Subtle Grid Lines */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          {/* SVG Vector Route Rendering */}
          <svg className="w-full h-full max-w-4xl max-h-[800px] overflow-visible pointer-events-auto">
            <defs>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Dynamic S-Curve connecting points */}
            <path
              d="M 120,480 Q 280,380 420,320 T 720,160"
              fill="none"
              stroke="url(#routeGradient)"
              strokeWidth="6"
              filter="url(#glow)"
              strokeDasharray="8 4"
              className="animate-pulse"
            />
            <path
              d="M 120,480 Q 280,380 420,320 T 720,160"
              fill="none"
              stroke="#A855F7"
              strokeWidth="3"
            />

            {/* Live GPS Vehicle Marker */}
            <g transform="translate(360, 345)" className="cursor-pointer">
              <circle r="18" fill="rgba(139, 92, 246, 0.25)" className="animate-ping" />
              <circle r="10" fill="#8B5CF6" stroke="#FFFFFF" strokeWidth="2.5" />
              <text x="16" y="4" fill="#E2E8F0" fontSize="11" fontWeight="bold">
                Live GPS ({velocityKmH.toFixed(0)} km/h)
              </text>
            </g>

            {/* Waypoint Markers */}
            {waypoints.map((wp, idx) => {
              const isOrigin = wp.orderIndex === 0;
              const isDest = wp.orderIndex === waypoints.length - 1 && waypoints.length > 1;
              const isDetour = wp.isDetour;

              // Node placement along curve
              let cx = 120;
              let cy = 480;
              if (isDest) {
                cx = 720;
                cy = 160;
              } else if (isDetour || idx > 0) {
                cx = 420;
                cy = 320;
              }

              let color = '#10B981';
              let badge = 'A';
              if (isDest) {
                color = '#8B5CF6';
                badge = 'C';
              } else if (isDetour || (idx > 0 && idx < waypoints.length - 1)) {
                color = '#F59E0B';
                badge = 'B';
              }

              return (
                <g
                  key={wp.id}
                  transform={`translate(${cx}, ${cy})`}
                  className="cursor-pointer group"
                  onClick={() => {
                    const place = proactiveDeck.find((p) => p.name === wp.name) || {
                      placeId: wp.placeId,
                      name: wp.name,
                      category: wp.category,
                      lat: wp.lat,
                      lng: wp.lng,
                      rating: wp.rating || 4.8,
                      userRatingsTotal: 1200,
                      address: 'Along Active Vibe Route',
                      tags: ['Scenic', 'Verified Spot'],
                      detourDeltaMinutes: wp.detourDuration || 4,
                      tasteMatchScore: 0.94,
                      cosineSimilarity: 0.92,
                      finalScore: 0.91,
                      matchReason: 'Currently active route waypoint stop.',
                    };
                    setActiveMarkerPopup(place);
                  }}
                >
                  <circle r="22" fill={color} fillOpacity="0.2" className="animate-pulse" />
                  <circle r="12" fill={color} stroke="#0F172A" strokeWidth="3" />
                  <text
                    x="0"
                    y="4"
                    fill="#0F172A"
                    fontSize="11"
                    fontWeight="900"
                    textAnchor="middle"
                  >
                    {badge}
                  </text>
                  <rect
                    x="-70"
                    y="-38"
                    width="140"
                    height="24"
                    rx="6"
                    fill="#0F172A"
                    fillOpacity="0.9"
                    stroke={color}
                    strokeWidth="1"
                    className="opacity-90 group-hover:opacity-100"
                  />
                  <text
                    x="0"
                    y="-22"
                    fill="#F1F5F9"
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {wp.name.slice(0, 18)}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      )}

      {/* Floating Micro-Card Overlay (Top 2-3 Ranked Proactive Recommendations) */}
      {topCard && (
        <div className="absolute top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-30 transition-all duration-300 animate-slide-down">
          <div className="glass-panel p-4 rounded-2xl shadow-2xl border border-purple-500/30 backdrop-blur-xl relative overflow-hidden group">
            {/* Ambient Background Aura */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-600/20 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start justify-between gap-3 relative z-10">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {Math.round(topCard.finalScore * 100)}% Vibe Match
                </span>
                <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400" />
                  {topCard.rating}
                </span>
              </div>

              <button
                onClick={() => dismissProactivePlace(topCard.placeId)}
                className="text-slate-400 hover:text-slate-200 p-1 rounded-full hover:bg-slate-800/80 transition-colors"
                title="Dismiss suggestion"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-2.5 relative z-10">
              <h4 className="text-sm font-bold text-slate-100 group-hover:text-purple-300 transition-colors">
                {topCard.name}
              </h4>
              <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                {topCard.category} • {topCard.address}
              </p>
              {topCard.matchReason && (
                <p className="text-[11px] text-purple-200/90 mt-2 bg-purple-950/40 p-2 rounded-lg border border-purple-500/20 leading-snug">
                  ✨ {topCard.matchReason}
                </p>
              )}
            </div>

            <div className="mt-3.5 flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80 relative z-10">
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                <Clock className="w-3.5 h-3.5" />
                <span>+{topCard.detourDeltaMinutes} min detour</span>
              </div>

              <button
                onClick={() => injectDetour(topCard)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 transition-all transform active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                Add to Route
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Marker Popup Modal */}
      {activeMarkerPopup && (
        <div className="absolute inset-0 z-40 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 p-5 rounded-2xl max-w-sm w-full shadow-2xl space-y-3 relative animate-scale-up">
            <button
              onClick={() => setActiveMarkerPopup(null)}
              className="absolute top-3 right-3 text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300">
                {activeMarkerPopup.category}
              </span>
              <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400" /> {activeMarkerPopup.rating}
              </span>
            </div>
            <h3 className="text-base font-bold text-white">{activeMarkerPopup.name}</h3>
            <p className="text-xs text-slate-400">{activeMarkerPopup.address}</p>
            <p className="text-xs text-slate-300 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
              {activeMarkerPopup.matchReason}
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  injectDetour(activeMarkerPopup);
                  setActiveMarkerPopup(null);
                }}
                className="w-full py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30"
              >
                Inject Waypoint (+{activeMarkerPopup.detourDeltaMinutes}m)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Map Navigation & Simulation Controls */}
      <div className="absolute bottom-6 right-6 z-30 flex flex-col gap-2">
        {/* Velocity Telemetry Gate Simulator */}
        <div className="glass-panel px-3 py-2 rounded-xl shadow-xl border border-slate-700/80 text-xs flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Gauge className="w-3.5 h-3.5 text-emerald-400" />
            <span>Speed:</span>
          </div>
          <input
            type="range"
            min="0"
            max="80"
            value={velocityKmH}
            onChange={(e) => setVelocity(parseFloat(e.target.value))}
            className="w-24 accent-purple-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
            title="Simulate Vehicle Speed (km/h)"
          />
          <span
            className={cn(
              "font-mono font-bold text-xs min-w-[50px]",
              velocityKmH > 50 ? "text-rose-400" : velocityKmH < 15 ? "text-emerald-400" : "text-amber-400"
            )}
          >
            {velocityKmH.toFixed(0)} km/h
          </span>
        </div>

        {/* Action Button Strip */}
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={handleToggle3D}
            className="glass-panel p-2.5 rounded-xl text-slate-300 hover:text-white hover:border-purple-500/50 shadow-xl transition-all"
            title="Toggle 3D Perspective Pitch"
          >
            <Compass className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom(1)}
            className="glass-panel p-2.5 rounded-xl text-slate-300 hover:text-white hover:border-purple-500/50 shadow-xl transition-all"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom(-1)}
            className="glass-panel p-2.5 rounded-xl text-slate-300 hover:text-white hover:border-purple-500/50 shadow-xl transition-all"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

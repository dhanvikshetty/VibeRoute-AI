'use client';

import React from 'react';
import { useTripStore } from '@/store/useTripStore';
import { MapPin, Navigation, Clock, Star, Trash2, ArrowDown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ItineraryTimeline() {
  const { waypoints, removeWaypoint, activeTheme, routeSummary } = useTripStore();

  const sortedWaypoints = [...waypoints].sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Navigation className="w-3.5 h-3.5 text-purple-400" />
          Active Route Itinerary
        </h3>
        <span className="text-[11px] text-slate-400 font-medium">
          {waypoints.length} {waypoints.length === 1 ? 'stop' : 'stops'}
        </span>
      </div>

      <div className="relative pl-6 space-y-4">
        {/* Continuous Route Line */}
        <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-emerald-500 via-amber-500 to-purple-500" />

        {sortedWaypoints.map((wp, index) => {
          const isOrigin = wp.orderIndex === 0;
          const isDestination = wp.orderIndex === sortedWaypoints.length - 1 && sortedWaypoints.length > 1;
          const isDetour = wp.isDetour;

          let badgeLetter = 'A';
          if (isDestination) badgeLetter = 'C';
          else if (isDetour || (index > 0 && index < sortedWaypoints.length - 1)) badgeLetter = 'B';

          return (
            <div key={wp.id} className="relative group">
              {/* Point Node Marker */}
              <div
                className={cn(
                  "absolute -left-6 top-1.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shadow-lg ring-4 ring-slate-950 transition-all",
                  isOrigin && "bg-emerald-500 text-slate-950",
                  isDestination && "bg-purple-500 text-white",
                  isDetour && "bg-amber-500 text-slate-950 animate-pulse"
                )}
              >
                {badgeLetter}
              </div>

              {/* Waypoint Card */}
              <div
                className={cn(
                  "p-3 rounded-xl border transition-all duration-200 backdrop-blur-md",
                  isDetour
                    ? "bg-amber-950/20 border-amber-500/30 hover:border-amber-500/50"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-slate-100 truncate">
                        {wp.name}
                      </span>
                      {isDetour && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          +{wp.detourDuration || 4}m detour
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{wp.category}</p>
                  </div>

                  {isDetour && (
                    <button
                      onClick={() => removeWaypoint(wp.id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                      title="Remove Detour"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {wp.rating && (
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span className="font-bold">{wp.rating}</span>
                    </div>
                    <span>•</span>
                    <span className="text-[10px] text-purple-300 flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> AI Recommended
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

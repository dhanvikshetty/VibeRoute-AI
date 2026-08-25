'use client';

import React from 'react';
import { useTripStore } from '@/store/useTripStore';
import { ItineraryTimeline } from '@/components/itinerary/ItineraryTimeline';
import { THEME_CONFIG } from '@/components/theme/TripThemeSelector';
import {
  Navigation,
  Clock,
  Gauge,
  Sparkles,
  Receipt,
  Users,
  MapPin,
  Flame,
  Layers,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const {
    activeTrip,
    activeTheme,
    routeSummary,
    waypoints,
    velocityKmH,
    proactiveDeck,
    injectDetour,
    activeTab,
    setActiveTab,
  } = useTripStore();

  const themeConfig = THEME_CONFIG[activeTheme];
  const detourCount = waypoints.filter((w) => w.isDetour).length;

  return (
    <aside className="w-full h-full flex flex-col bg-slate-950/90 backdrop-blur-2xl border-r border-slate-800/80 overflow-hidden">
      {/* 1. Active Route Hero Card */}
      <div className="p-4 border-b border-slate-800/80 bg-gradient-to-b from-slate-900/80 to-transparent">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[10px] font-bold tracking-wider uppercase text-purple-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Live Trajectory
          </span>
          <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold border", themeConfig.bgColor, themeConfig.borderColor, themeConfig.color)}>
            {themeConfig.label}
          </span>
        </div>

        <h2 className="text-sm font-extrabold text-white truncate">
          {activeTrip?.title || 'Bengaluru to Mysore Trail'}
        </h2>

        {/* Route Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">ETA</span>
            <span className="text-xs font-black text-slate-100">{routeSummary?.eta || '3h 15m'}</span>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Distance</span>
            <span className="text-xs font-black text-slate-100">{routeSummary?.distanceKm.toFixed(1) || '142.8'} km</span>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Detours</span>
            <span className="text-xs font-black text-amber-400">+{detourCount * 4}m ({detourCount})</span>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center px-4 py-2 border-b border-slate-800/60 bg-slate-950/40 gap-1">
        <button
          onClick={() => setActiveTab('itinerary')}
          className={cn(
            "flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5",
            activeTab === 'itinerary'
              ? "bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          )}
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Timeline</span>
        </button>

        <button
          onClick={() => setActiveTab('vibematch')}
          className={cn(
            "flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5",
            activeTab === 'vibematch'
              ? "bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          )}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Radar ({proactiveDeck.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('expenses')}
          className={cn(
            "flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5",
            activeTab === 'expenses'
              ? "bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          )}
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>Split</span>
        </button>

        <button
          onClick={() => setActiveTab('groupsync')}
          className={cn(
            "flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5",
            activeTab === 'groupsync'
              ? "bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          )}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Sync</span>
        </button>
      </div>

      {/* 3. Tab Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'itinerary' && <ItineraryTimeline />}

        {activeTab === 'vibematch' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Proactive Radar Matches
              </h3>
              <span className="text-[10px] text-emerald-400 font-semibold">
                Velocity Gate: Active
              </span>
            </div>

            {proactiveDeck.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                No new detour spots detected within current corridor. Keep driving!
              </div>
            ) : (
              proactiveDeck.map((place) => (
                <div
                  key={place.placeId}
                  className="glass-card p-3 rounded-xl border border-slate-800 hover:border-purple-500/40 transition-all space-y-2 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-100 group-hover:text-purple-300 transition-colors">
                        {place.name}
                      </h4>
                      <p className="text-[11px] text-slate-400">{place.category}</p>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {Math.round(place.finalScore * 100)}%
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 bg-slate-900/80 p-2 rounded-lg leading-tight">
                    {place.matchReason}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <span className="text-amber-400 font-medium">+{place.detourDeltaMinutes}m detour</span>
                    <button
                      onClick={() => injectDetour(place)}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-600/30 text-purple-200 hover:bg-purple-600 hover:text-white border border-purple-500/30 transition-all"
                    >
                      + Inject Detour
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Expenses & Group Sync tabs */}
        {activeTab === 'expenses' && (
          <ExpenseTracker />
        )}
        {activeTab === 'groupsync' && (
          <GroupVibeSync />
        )}
      </div>
    </aside>
  );
}

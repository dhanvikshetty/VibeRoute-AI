'use client';

import React from 'react';
import { useTripStore } from '@/store/useTripStore';
import { Sparkles, Star, Plus, Clock, X, ChevronRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RankedPlace } from '@/types';

export function MicroCardDeck() {
  const { proactiveDeck, injectDetour, dismissProactivePlace } = useTripStore();

  if (proactiveDeck.length === 0) {
    return (
      <div className="p-4 text-center rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-400 text-xs">
        No active detour suggestions within current GPS corridor.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
          Ranked Discoveries ({proactiveDeck.length})
        </span>
        <span className="text-[10px] text-purple-400 font-semibold">
          Cosine Sim ≥ 0.75
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {proactiveDeck.map((place) => {
          const matchPercent = Math.round(place.finalScore * 100);

          return (
            <div
              key={place.placeId}
              className="glass-card p-3.5 rounded-2xl border border-slate-800/80 hover:border-purple-500/50 shadow-xl transition-all duration-300 relative group overflow-hidden"
            >
              {/* Top Row: Category + Match % + Dismiss */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {matchPercent}% Vibe Match
                  </span>
                  <span className="text-[11px] font-semibold text-amber-400 flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-amber-400" />
                    {place.rating}
                  </span>
                </div>

                <button
                  onClick={() => dismissProactivePlace(place.placeId)}
                  className="text-slate-500 hover:text-slate-300 p-1 rounded-md transition-colors"
                  title="Dismiss place"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Title & Category */}
              <div className="mt-2">
                <h4 className="text-xs font-bold text-slate-100 group-hover:text-purple-300 transition-colors">
                  {place.name}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">{place.category}</p>
              </div>

              {/* Match Reason snippet */}
              <p className="text-[11px] text-slate-300 bg-slate-950/60 p-2 rounded-xl mt-2 border border-slate-800/60 leading-snug">
                {place.matchReason}
              </p>

              {/* Bottom Action Strip: Detour delta and Add button */}
              <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/60">
                <div className="flex items-center gap-1 text-[11px] text-amber-400 font-semibold">
                  <Clock className="w-3 h-3" />
                  <span>+{place.detourDeltaMinutes} min detour</span>
                </div>

                <button
                  onClick={() => injectDetour(place)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 transition-all active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add as Detour</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

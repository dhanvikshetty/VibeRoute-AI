'use client';

import React, { useState } from 'react';
import { TripTheme } from '@/types';
import { useTripStore } from '@/store/useTripStore';
import { Sparkles, Compass, Utensils, Coffee, Moon, Landmark, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export const THEME_CONFIG: Record<
  TripTheme,
  {
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
    borderColor: string;
    accentGlow: string;
  }
> = {
  SPIRITUAL_PILGRIMAGE: {
    label: 'Spiritual & Sacred',
    description: 'Ancient temples, meditation groves, sacred waters',
    icon: Sparkles,
    color: 'text-purple-400',
    bgColor: 'bg-purple-950/50',
    borderColor: 'border-purple-500/40',
    accentGlow: 'shadow-purple-500/20',
  },
  HERITAGE_CULTURE: {
    label: 'Heritage & Culture',
    description: 'Historic palaces, artisan guilds, monuments',
    icon: Landmark,
    color: 'text-amber-400',
    bgColor: 'bg-amber-950/50',
    borderColor: 'border-amber-500/40',
    accentGlow: 'shadow-amber-500/20',
  },
  ROAD_TRIP_ADVENTURE: {
    label: 'Road Trip Adventure',
    description: 'Scenic ridge curves, viewpoints, hidden waterfalls',
    icon: Compass,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-950/50',
    borderColor: 'border-emerald-500/40',
    accentGlow: 'shadow-emerald-500/20',
  },
  FOODIE_CRAWL: {
    label: 'Foodie Trail & Flavors',
    description: 'Cult heritage bakeries, filter coffee, local bites',
    icon: Utensils,
    color: 'text-rose-400',
    bgColor: 'bg-rose-950/50',
    borderColor: 'border-rose-500/40',
    accentGlow: 'shadow-rose-500/20',
  },
  UNWIND_CHILL: {
    label: 'Unwind & Serenity',
    description: 'Aesthetic lakeside cafes, quiet courtyards, hammocks',
    icon: Coffee,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-950/50',
    borderColor: 'border-cyan-500/40',
    accentGlow: 'shadow-cyan-500/20',
  },
  NIGHTLIFE_PARTY: {
    label: 'Nightlife & Beats',
    description: 'Neon rooftops, craft mixology, live vinyl sets',
    icon: Moon,
    color: 'text-pink-400',
    bgColor: 'bg-pink-950/50',
    borderColor: 'border-pink-500/40',
    accentGlow: 'shadow-pink-500/20',
  },
};

export function TripThemeSelector() {
  const { activeTheme, setTheme } = useTripStore();
  const [isOpen, setIsOpen] = useState(false);
  const currentConfig = THEME_CONFIG[activeTheme];
  const IconComponent = currentConfig.icon;

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 border shadow-lg",
          currentConfig.bgColor,
          currentConfig.borderColor,
          currentConfig.color,
          currentConfig.accentGlow
        )}
      >
        <IconComponent className="w-3.5 h-3.5" />
        <span>{currentConfig.label}</span>
        <ChevronDown className={cn("w-3 h-3 transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-72 origin-top-right rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 shadow-2xl z-50 p-2 space-y-1">
            <div className="px-3 py-2 text-[10px] uppercase font-bold tracking-wider text-slate-400 border-b border-slate-800">
              Trip Theme & Vibe Alignment
            </div>
            {(Object.keys(THEME_CONFIG) as TripTheme[]).map((themeKey) => {
              const item = THEME_CONFIG[themeKey];
              const ItemIcon = item.icon;
              const isSelected = activeTheme === themeKey;

              return (
                <button
                  key={themeKey}
                  onClick={() => {
                    setTheme(themeKey);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all text-xs group",
                    isSelected
                      ? `${item.bgColor} ${item.borderColor} border ${item.color}`
                      : "hover:bg-slate-800/80 text-slate-300"
                  )}
                >
                  <div className={cn("p-1.5 rounded-lg mt-0.5", isSelected ? item.bgColor : "bg-slate-800 group-hover:bg-slate-700")}>
                    <ItemIcon className={cn("w-4 h-4", item.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between font-semibold">
                      <span>{item.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-tight line-clamp-1">
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

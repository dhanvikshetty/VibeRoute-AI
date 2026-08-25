'use client';

import React, { useState } from 'react';
import { useTripStore } from '@/store/useTripStore';
import { TripThemeSelector } from '@/components/theme/TripThemeSelector';
import {
  Search,
  Mic,
  Sparkles,
  MapPin,
  Compass,
  User,
  Menu,
  X,
  Layers,
  Receipt,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const {
    activeTrip,
    isVoiceActive,
    setVoiceActive,
    setVibeModalOpen,
    isMobilePanelOpen,
    setMobilePanelOpen,
    activeTab,
    setActiveTab,
    resetTrip,
  } = useTripStore();

  const [searchQuery, setSearchQuery] = useState('Mysore Palace, Mysuru');

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-4 md:px-6 flex items-center justify-between gap-4 z-40 sticky top-0">
      {/* Brand & Mobile Hamburger */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobilePanelOpen(!isMobilePanelOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80"
          title="Toggle Navigation Menu"
        >
          {isMobilePanelOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-2.5 cursor-pointer" onClick={resetTrip}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-600/30 ring-2 ring-purple-500/20">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-tight bg-gradient-to-r from-white via-slate-200 to-purple-300 bg-clip-text text-transparent">
                VibeRoute
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-black tracking-widest uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              Dynamic Journey Synthesizer
            </p>
          </div>
        </div>
      </div>

      {/* Destination Search Bar with Autocomplete Feel */}
      <div className="hidden lg:flex items-center flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search destination or route (e.g. Indiranagar, Coorg, Hampi)..."
            className="w-full bg-slate-900/90 border border-slate-800 focus:border-purple-500/50 rounded-full pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
          />
          <button className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-600/30 text-purple-300 border border-purple-500/30">
            Route Active
          </button>
        </div>
      </div>

      {/* Top Navbar Actions */}
      <div className="flex items-center gap-2.5">
        {/* Multimodal Vibe Check Trigger Button */}
        <button
          onClick={() => setVibeModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-900/80 hover:bg-slate-800 text-purple-300 border border-purple-500/30 hover:border-purple-500/60 shadow-lg shadow-purple-950/40 transition-all transform active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
          <span className="hidden sm:inline">Vibe Check</span>
        </button>

        {/* Trip Theme Selector Badge & Dropdown */}
        <TripThemeSelector />

        {/* Hands-Free Voice Agent Trigger FAB */}
        <button
          onClick={() => setVoiceActive(!isVoiceActive)}
          className={cn(
            "p-2 rounded-full transition-all duration-300 relative shadow-lg transform active:scale-95",
            isVoiceActive
              ? "bg-rose-600 text-white shadow-rose-600/40 ring-4 ring-rose-500/30 animate-pulse"
              : "bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80"
          )}
          title="Hands-Free Voice Co-Pilot"
        >
          <Mic className="w-4 h-4" />
          {isVoiceActive && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-400 rounded-full animate-ping" />
          )}
        </button>

        {/* User Profile Avatar */}
        <div className="w-8 h-8 rounded-full ring-1 ring-slate-700 bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300 shadow-md">
          AR
        </div>
      </div>
    </header>
  );
}

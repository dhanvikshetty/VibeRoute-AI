'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { MapCanvas } from '@/components/map/MapCanvas';
import { VibeMatchModal } from '@/components/vibe/VibeMatchModal';
import { VoiceCoPilot } from '@/components/voice/VoiceCoPilot';
import { ExpenseTracker } from '@/components/expenses/ExpenseTracker';
import { GroupVibeSync } from '@/components/group/GroupVibeSync';
import { useTripStore } from '@/store/useTripStore';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export default function VibeRouteApp() {
  const {
    isMobilePanelOpen,
    setMobilePanelOpen,
    activeTab,
    isVibeModalOpen,
    isVoiceActive,
  } = useTripStore();

  return (
    <main className="h-screen w-screen flex flex-col bg-slate-950 overflow-hidden relative">
      {/* 1. Persistent Top Navigation Bar */}
      <Navbar />

      {/* 2. Responsive 3-Pane Work Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Desktop Left Sidebar (35% width, min 340px, max 460px) */}
        <div className="hidden md:block md:w-[35%] md:min-w-[360px] md:max-w-[460px] h-full z-20 shadow-2xl">
          <ErrorBoundary fallbackTitle="Sidebar Error">
            <Sidebar />
          </ErrorBoundary>
        </div>

        {/* Mobile Swipeable / Collapsible Bottom Drawer */}
        <div
          className={cn(
            "md:hidden fixed inset-x-0 bottom-0 top-16 z-30 bg-slate-950/95 backdrop-blur-2xl transition-transform duration-300 transform",
            isMobilePanelOpen ? "translate-y-0" : "translate-y-full pointer-events-none"
          )}
        >
          <div className="h-full flex flex-col relative">
            <div className="flex justify-between items-center p-3 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Trip Command Panel
              </span>
              <button
                onClick={() => setMobilePanelOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <ErrorBoundary fallbackTitle="Sidebar Error">
                <Sidebar />
              </ErrorBoundary>
            </div>
          </div>
        </div>

        {/* Right Panel: Mapbox GL Canvas (65% width on desktop, 100% on mobile) */}
        <div className="flex-1 h-full relative z-10">
          <ErrorBoundary fallbackTitle="Map Engine Error">
            <MapCanvas />
          </ErrorBoundary>
        </div>
      </div>

      {/* 3. Global Floating Modals & Overlays */}
      <VibeMatchModal />
      <VoiceCoPilot />
    </main>
  );
}

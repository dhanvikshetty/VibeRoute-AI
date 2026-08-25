'use client';

import React, { useState } from 'react';
import { useTripStore } from '@/store/useTripStore';
import {
  Users,
  Heart,
  X,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  ThumbsUp,
  ThumbsDown,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MOCK_PLACES } from '@/lib/mockData';

interface VibeSyncCard {
  id: string;
  title: string;
  category: string;
  description: string;
  detourMins: number;
  votesYes: number;
  votesNo: number;
  placeRef: any;
}

export function GroupVibeSync() {
  const { injectDetour } = useTripStore();
  const [cards, setCards] = useState<VibeSyncCard[]>([
    {
      id: 'c1',
      title: 'Cloud Nine Overlook Cafe',
      category: 'Scenic Viewpoint & Espresso',
      description: 'Panoramic cliff views with artisanal single origin brews.',
      detourMins: 7,
      votesYes: 3,
      votesNo: 0,
      placeRef: MOCK_PLACES[1],
    },
    {
      id: 'c2',
      title: 'Rustic Pine Bakery & Roastery',
      category: 'Artisanal Sourdough & Pastry',
      description: 'Warm cardamom buns and hand-poured single origins right on your route.',
      detourMins: 3,
      votesYes: 4,
      votesNo: 0,
      placeRef: MOCK_PLACES[5],
    },
    {
      id: 'c3',
      title: 'Sri Someshwara Ancient Temple',
      category: 'Historical Sanctuary',
      description: '12th-century stone carvings with deep meditative serenity.',
      detourMins: 6,
      votesYes: 2,
      votesNo: 1,
      placeRef: MOCK_PLACES[2],
    },
    {
      id: 'c4',
      title: 'Velvet Horizon Rooftop Lounge',
      category: 'Cocktails & Beats',
      description: 'High-energy rooftop with mixology and skyline views.',
      detourMins: 9,
      votesYes: 2,
      votesNo: 2,
      placeRef: MOCK_PLACES[3],
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [syncedDetour, setSyncedDetour] = useState<VibeSyncCard | null>(null);

  const activeCard = cards[currentIndex];

  const handleVote = (approve: boolean) => {
    if (!activeCard) return;

    const updated = [...cards];
    if (approve) {
      updated[currentIndex].votesYes += 1;
    } else {
      updated[currentIndex].votesNo += 1;
    }
    setCards(updated);

    if (currentIndex + 1 < cards.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Find highest consensus
      const winner = [...updated].sort((a, b) => b.votesYes - a.votesYes)[0];
      setSyncedDetour(winner);
    }
  };

  const handleInjectWinner = (card: VibeSyncCard) => {
    injectDetour(card.placeRef);
    setSyncedDetour(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-purple-400" />
          Group Vibe Consensus Engine
        </h3>
        <span className="text-[10px] text-purple-300 font-bold bg-purple-500/20 px-2 py-0.5 rounded-full border border-purple-500/30">
          4 Travelers Active
        </span>
      </div>

      {/* Consensus Notification */}
      {syncedDetour ? (
        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/60 to-slate-900 border border-purple-500/50 space-y-3 shadow-xl animate-scale-up">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-black">
            <CheckCircle2 className="w-4 h-4" />
            <span>Group Consensus Achieved (94% Alignment)!</span>
          </div>

          <div>
            <h4 className="text-sm font-extrabold text-white">{syncedDetour.title}</h4>
            <p className="text-xs text-slate-300 mt-1">{syncedDetour.description}</p>
            <span className="text-[11px] text-amber-400 font-semibold block mt-1.5">
              +{syncedDetour.detourMins} min detour • {syncedDetour.votesYes} Upvotes
            </span>
          </div>

          <button
            onClick={() => handleInjectWinner(syncedDetour)}
            className="w-full py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Inject Winning Stop Into Route
          </button>
        </div>
      ) : activeCard ? (
        /* Active Voting Card */
        <div className="glass-card p-4 rounded-3xl border border-slate-800 space-y-3 relative overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase">
            <span>Option {currentIndex + 1} of {cards.length}</span>
            <span className="text-purple-400">+{activeCard.detourMins}m Detour</span>
          </div>

          <div className="space-y-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {activeCard.category}
            </span>
            <h4 className="text-sm font-extrabold text-white pt-1">{activeCard.title}</h4>
            <p className="text-xs text-slate-300 leading-relaxed pt-1">{activeCard.description}</p>
          </div>

          {/* Voting Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-800">
            <button
              onClick={() => handleVote(false)}
              className="py-2.5 rounded-2xl font-bold text-xs bg-slate-900 hover:bg-rose-950/40 text-slate-300 hover:text-rose-400 border border-slate-700 hover:border-rose-500/40 transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
              Skip
            </button>
            <button
              onClick={() => handleVote(true)}
              className="py-2.5 rounded-2xl font-bold text-xs bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              Vote Yes
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 text-slate-400 text-xs">
          All group preference polls completed!
        </div>
      )}
    </div>
  );
}

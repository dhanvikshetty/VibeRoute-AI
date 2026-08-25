'use client';

import React, { useState } from 'react';
import { useTripStore } from '@/store/useTripStore';
import {
  Sparkles,
  Upload,
  Image as ImageIcon,
  Send,
  X,
  Star,
  Clock,
  Plus,
  Check,
  Flame,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { VibeMatchResult, RankedPlace } from '@/types';

export function VibeMatchModal() {
  const { isVibeModalOpen, setVibeModalOpen, currentCoords, activeTheme, injectDetour } = useTripStore();
  const [moodText, setMoodText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<VibeMatchResult[] | null>(null);
  const [extractedTags, setExtractedTags] = useState<string[]>([]);
  const [atmosphere, setAtmosphere] = useState<string>('');

  if (!isVibeModalOpen) return null;

  const handleRunVibeCheck = async (queryText?: string) => {
    const textToUse = queryText || moodText;
    if (!textToUse && !selectedImage) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/vibe-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          textQuery: textToUse,
          imageFile: selectedImage || undefined,
          userCoords: currentCoords,
          theme: activeTheme,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResults(data.matches || []);
        setExtractedTags(data.extractedTags || []);
        setAtmosphere(data.atmosphereSummary || '');
      }
    } catch (err) {
      console.error('Vibe check request error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSamplePrompt = (sample: string) => {
    setMoodText(sample);
    handleRunVibeCheck(sample);
  };

  const handleInject = (match: VibeMatchResult) => {
    const rankedPlace: RankedPlace = {
      placeId: match.placeId,
      name: match.name,
      category: match.category,
      lat: match.lat,
      lng: match.lng,
      rating: match.rating,
      userRatingsTotal: 950,
      address: match.address,
      tags: match.matchedTags,
      detourDeltaMinutes: match.detourMinutes || 5,
      tasteMatchScore: match.matchPercentage / 100,
      cosineSimilarity: match.matchPercentage / 100,
      finalScore: match.matchPercentage / 100,
      matchReason: match.vibeDescription,
    };

    injectDetour(rankedPlace);
    setVibeModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900/95 border border-purple-500/40 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl shadow-purple-950/60 overflow-hidden relative animate-slide-up">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between relative bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-300">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                Multimodal "Vibe Check" Matcher
              </h3>
              <p className="text-xs text-slate-400">
                Drop an aesthetic photo or describe a mood to discover real GPS spots on your route.
              </p>
            </div>
          </div>

          <button
            onClick={() => setVibeModalOpen(false)}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Preset Mood Inspirations */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Quick Mood Inspirations:
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                'Foggy hill view with outdoor aesthetic coffee',
                'Ancient tranquil temple with sacred stone courtyard',
                'Cozy heritage bakery with sourdough & cardamom buns',
                'Neon rooftop beats and signature craft cocktails',
              ].map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSamplePrompt(sample)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-800/80 hover:bg-purple-950/40 text-slate-300 hover:text-purple-300 border border-slate-700 hover:border-purple-500/40 transition-all text-left"
                >
                  ✨ {sample}
                </button>
              ))}
            </div>
          </div>

          {/* Natural Language Mood Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">
              Describe Your Vibe or Desired Atmosphere:
            </label>
            <div className="relative">
              <textarea
                value={moodText}
                onChange={(e) => setMoodText(e.target.value)}
                placeholder="e.g. Minimalist Japanese garden with matcha latte and reading nooks..."
                rows={2}
                className="w-full bg-slate-950/80 border border-slate-700 focus:border-purple-500 rounded-2xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-none transition-all"
              />
            </div>
          </div>

          {/* Drag and Drop Visual Upload Simulation */}
          <div className="border-2 border-dashed border-slate-700/80 hover:border-purple-500/50 rounded-2xl p-4 text-center cursor-pointer bg-slate-950/40 transition-all group">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="vibe-image-upload"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    setSelectedImage(event.target?.result as string);
                  };
                  reader.readAsDataURL(e.target.files[0]);
                }
              }}
            />
            <label htmlFor="vibe-image-upload" className="cursor-pointer block">
              <div className="flex flex-col items-center gap-2">
                <div className="p-3 rounded-full bg-purple-950/50 text-purple-400 group-hover:scale-110 transition-transform">
                  <Upload className="w-5 h-5" />
                </div>
                {selectedImage ? (
                  <div className="text-xs text-purple-300 font-semibold flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-400" />
                    Image loaded for Vision Analysis
                  </div>
                ) : (
                  <div>
                    <span className="text-xs font-bold text-slate-300 block">
                      Drop an aesthetic image or click to upload
                    </span>
                    <span className="text-[11px] text-slate-500">
                      GPT-4o Vision extracts lighting, textures, and ambiance tags
                    </span>
                  </div>
                )}
              </div>
            </label>
          </div>

          {/* Action Trigger */}
          <button
            onClick={() => handleRunVibeCheck()}
            disabled={isLoading || (!moodText && !selectedImage)}
            className="w-full py-3 rounded-2xl font-bold text-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-98"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Synthesizing Vibe Embeddings...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Run AI Vibe Matcher
              </>
            )}
          </button>

          {/* Results Display */}
          {results && (
            <div className="space-y-4 pt-3 border-t border-slate-800 animate-slide-up">
              {atmosphere && (
                <div className="p-3 rounded-2xl bg-purple-950/30 border border-purple-500/30">
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-300 block mb-1">
                    AI Visual & Atmospheric Synthesis:
                  </span>
                  <p className="text-xs text-slate-200">{atmosphere}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {extractedTags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.map((match) => (
                  <div
                    key={match.placeId}
                    className="glass-card p-3.5 rounded-2xl border border-slate-800 hover:border-purple-500/50 space-y-2.5 transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/40">
                          {match.matchPercentage}% Visual Match
                        </span>
                        <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                          <Star className="w-3 h-3 fill-amber-400" />
                          {match.rating}
                        </div>
                      </div>

                      <h4 className="text-xs font-bold text-white mt-2 group-hover:text-purple-300 transition-colors">
                        {match.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{match.category}</p>
                      <p className="text-[11px] text-slate-300 mt-1.5 bg-slate-950/60 p-2 rounded-xl">
                        {match.vibeDescription}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                      <span className="text-[11px] text-amber-400 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        +{match.detourMinutes}m detour
                      </span>
                      <button
                        onClick={() => handleInject(match)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/30 transition-all flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        Inject Stop
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

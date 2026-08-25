'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTripStore } from '@/store/useTripStore';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  CheckCircle2,
  X,
  Plus,
  Radio,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { RankedPlace } from '@/types';

export function VoiceCoPilot() {
  const {
    isVoiceActive,
    setVoiceActive,
    currentCoords,
    activeTheme,
    injectDetour,
  } = useTripStore();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [spokenFeedback, setSpokenFeedback] = useState<string | null>(null);
  const [candidateDetour, setCandidateDetour] = useState<RankedPlace | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        handleProcessVoiceTranscript(text);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn('Speech recognition already running', e);
      }
    } else {
      // Browser doesn't support Web Speech API - provide test fallback
      handleProcessVoiceTranscript('Find me a filter coffee spot within 10 minutes');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
  };

  const handleProcessVoiceTranscript = async (text: string) => {
    // Check if verbal confirmation "Lock it in" was spoken
    if (text.toLowerCase().includes('lock it in') && candidateDetour) {
      injectDetour(candidateDetour);
      speakText(`Locked in! Adding ${candidateDetour.name} as a detour to your route.`);
      setSpokenFeedback(`Locked in! Added ${candidateDetour.name} to route.`);
      setCandidateDetour(null);
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch('/api/ai/voice-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioTranscript: text,
          currentCoords,
          theme: activeTheme,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSpokenFeedback(data.spokenResponse);
        speakText(data.spokenResponse);

        if (data.action?.payload) {
          setCandidateDetour(data.action.payload);
        }
      }
    } catch (err) {
      console.error('Voice co-pilot error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isVoiceActive) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-lg w-[92vw] animate-slide-up">
      <div className="glass-panel p-4 rounded-3xl shadow-2xl border border-purple-500/50 bg-slate-950/90 backdrop-blur-2xl space-y-3">
        {/* Status Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn("p-2 rounded-xl flex items-center justify-center", isListening ? "bg-rose-500/20 text-rose-400 animate-pulse" : "bg-purple-500/20 text-purple-300")}>
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                Hands-Free Voice Co-Pilot
                <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  Live
                </span>
              </h4>
              <p className="text-[10px] text-slate-400">
                {isListening ? 'Listening for request...' : 'Say "Hey Co-Pilot" or click below'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
              }
              setVoiceActive(false);
            }}
            className="p-1 rounded-full text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Audio Visualizer Pulse */}
        <div className="flex items-center justify-center gap-1.5 py-1">
          {[...Array(9)].map((_, idx) => (
            <div
              key={idx}
              className={cn(
                "w-1 rounded-full bg-purple-500 transition-all duration-150",
                isListening ? "animate-pulse h-6 bg-rose-400" : "h-2 bg-slate-700"
              )}
              style={{ animationDelay: `${idx * 0.1}s` }}
            />
          ))}
        </div>

        {/* Transcription Readout */}
        {transcript && (
          <div className="bg-slate-900/90 p-2.5 rounded-xl text-xs text-slate-200 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Heard:
            </span>
            "{transcript}"
          </div>
        )}

        {/* Spoken Response Readout */}
        {spokenFeedback && (
          <div className="bg-purple-950/40 p-3 rounded-2xl text-xs text-purple-200 border border-purple-500/30 flex items-start gap-2">
            <Volume2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{spokenFeedback}</p>
          </div>
        )}

        {/* Candidate Detour Confirmation Action */}
        {candidateDetour && (
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/90 border border-amber-500/40 animate-scale-up">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                Suggested Detour (+{candidateDetour.detourDeltaMinutes}m)
              </span>
              <h5 className="text-xs font-bold text-white">{candidateDetour.name}</h5>
            </div>

            <button
              onClick={() => {
                injectDetour(candidateDetour);
                speakText(`Locked in! Adding ${candidateDetour.name} to route.`);
                setCandidateDetour(null);
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Lock It In
            </button>
          </div>
        )}

        {/* Microphone Action Control & Test Prompt Chips */}
        <div className="pt-1 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={isListening ? stopListening : startListening}
              className={cn(
                "flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95",
                isListening
                  ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30"
                  : "bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30"
              )}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4" />
                  Tap to Stop Listening
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  Tap to Speak Request
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            <button
              onClick={() => handleProcessVoiceTranscript('Find me a filter coffee spot within 10 minutes')}
              className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800"
            >
              "Find filter coffee ahead"
            </button>
            <button
              onClick={() => handleProcessVoiceTranscript('Any historic temple nearby?')}
              className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800"
            >
              "Find historic temple"
            </button>
            <button
              onClick={() => handleProcessVoiceTranscript('Lock it in')}
              className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-950/50 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-500/30"
            >
              "Lock it in"
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

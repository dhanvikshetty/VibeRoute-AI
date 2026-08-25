'use client';

import React, { useState } from 'react';
import { useTripStore } from '@/store/useTripStore';
import {
  Receipt,
  Plus,
  DollarSign,
  Users,
  CheckCircle2,
  FileText,
  Sparkles,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ExpenseSplitItem } from '@/types';

export function ExpenseTracker() {
  const { activeTrip } = useTripStore();
  const [description, setDescription] = useState('Filter Coffee & Crispy Vada');
  const [amount, setAmount] = useState('24.50');
  const [category, setCategory] = useState('Food & Drinks');
  const [rawReceiptText, setRawReceiptText] = useState('2x Special Filter Coffee - $6.00\n2x Crispy Medu Vada - $12.00\n1x Ghee Roast Dosa - $6.50');
  const [participants, setParticipants] = useState(['Alex (You)', 'Maya', 'Sam', 'Rohan']);
  const [isSplitting, setIsSplitting] = useState(false);
  const [splitResult, setSplitResult] = useState<{
    items: ExpenseSplitItem[];
    breakdown: Record<string, number>;
  } | null>(null);

  const [history, setHistory] = useState<Array<{ id: string; desc: string; amount: number; perPerson: number }>>([
    { id: '1', desc: 'Highway Toll Plaza Express', amount: 8.50, perPerson: 2.12 },
    { id: '2', desc: 'Fuel & EV Charging Station', amount: 45.00, perPerson: 11.25 },
  ]);

  const handleCalculateSplit = async () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    setIsSplitting(true);
    try {
      const res = await fetch('/api/expenses/split', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tripId: activeTrip?.id || 'trip-001',
          payerId: 'user-001',
          amount: numAmount,
          category,
          description,
          rawReceiptText,
          splitWith: participants,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSplitResult({
          items: data.parsedItems || [],
          breakdown: data.splitBreakdown || {},
        });
        setHistory([
          {
            id: String(Date.now()),
            desc: description,
            amount: numAmount,
            perPerson: Number((numAmount / participants.length).toFixed(2)),
          },
          ...history,
        ]);
      }
    } catch (err) {
      console.error('Expense split calculation failed:', err);
    } finally {
      setIsSplitting(false);
    }
  };

  const totalSpent = history.reduce((acc, h) => acc + h.amount, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Receipt className="w-3.5 h-3.5 text-purple-400" />
          Group Expense & Splitter
        </h3>
        <span className="text-[11px] font-extrabold text-emerald-400">
          Total: ${totalSpent.toFixed(2)}
        </span>
      </div>

      {/* Quick Add Expense Form */}
      <div className="glass-card p-3.5 rounded-2xl border border-slate-800 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white mt-1"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase">Amount ($)</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white mt-1"
            />
          </div>
        </div>

        {/* Receipt Text / AI OCR Parser Box */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center justify-between">
            <span>Receipt Text / OCR Line Items</span>
            <span className="text-purple-400 text-[9px] flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5" /> AI Itemizer
            </span>
          </label>
          <textarea
            value={rawReceiptText}
            onChange={(e) => setRawReceiptText(e.target.value)}
            rows={2}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-2 text-[11px] text-slate-300 font-mono mt-1 resize-none"
          />
        </div>

        {/* Participants */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
            Split Evenly Across ({participants.length} Travelers):
          </label>
          <div className="flex flex-wrap gap-1.5">
            {participants.map((p, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-950/40 text-purple-300 border border-purple-500/30"
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={handleCalculateSplit}
          disabled={isSplitting}
          className="w-full py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          {isSplitting ? 'Itemizing & Splitting...' : 'Split & Log Expense'}
        </button>
      </div>

      {/* Split Breakdown Modal Card */}
      {splitResult && (
        <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/40 space-y-2 animate-scale-up">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase text-purple-300">
              Per-Person Split Breakdown
            </span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>

          <div className="space-y-1 pt-1">
            {Object.entries(splitResult.breakdown).map(([name, share]) => (
              <div key={name} className="flex justify-between items-center text-xs">
                <span className="text-slate-300">{name}</span>
                <span className="font-mono font-bold text-white">${share.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History Log */}
      <div className="space-y-2 pt-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Recent Trip Expenses:
        </span>
        {history.map((h) => (
          <div
            key={h.id}
            className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
          >
            <div>
              <span className="font-semibold text-slate-200 block">{h.desc}</span>
              <span className="text-[10px] text-slate-400">
                ${h.perPerson.toFixed(2)} / person
              </span>
            </div>
            <span className="font-bold text-emerald-400 font-mono">${h.amount.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Sparkles, Check, X, CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";

export interface CopilotSuggestionItem {
  id: string;
  type: string;
  target_element_id: string;
  original: any;
  proposed: any;
  confidence: number;
  reason: string;
}

export default function CopilotSuggestionsList({ documentId }: { documentId?: string }) {
  const [suggestions, setSuggestions] = useState<CopilotSuggestionItem[]>([
    {
      id: "sug-1",
      type: "FORMATTING",
      target_element_id: "p-1",
      original: { margin_bottom_pt: 6.0 },
      proposed: { margin_bottom_pt: 8.0, font_family: "Garamond" },
      confidence: 95,
      reason: "Increase paragraph bottom margin from 6pt to 8pt to match Publisher Science Group template."
    },
    {
      id: "sug-2",
      type: "DROP_CAP",
      target_element_id: "p-2",
      original: { drop_cap: false },
      proposed: { drop_cap: true, drop_cap_lines: 3 },
      confidence: 92,
      reason: "First paragraph of Section 1 should feature a 3-line drop cap per Journal Blueprint."
    },
    {
      id: "sug-3",
      type: "TYPOGRAPHY",
      target_element_id: "sec-2",
      original: { font_size_pt: 16.0 },
      proposed: { font_size_pt: 18.0, font_weight: "bold" },
      confidence: 98,
      reason: "Promote Section 2 title font size from 16pt to 18pt for consistent Heading 2 hierarchy."
    }
  ]);

  const handleAccept = (id: string) => {
    setSuggestions(suggestions.filter(s => s.id !== id));
  };

  const handleReject = (id: string) => {
    setSuggestions(suggestions.filter(s => s.id !== id));
  };

  return (
    <div className="p-6 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4 text-xs">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">AI Formatting Copilot Suggestions</h3>
        </div>
        <span className="text-[10px] bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-2.5 py-0.5 rounded-full font-bold">
          Human-in-the-Loop Review
        </span>
      </div>

      <div className="space-y-3">
        {suggestions.map(s => (
          <div key={s.id} className="p-4 rounded-xl border border-purple-200 dark:border-purple-800/60 bg-purple-50/40 dark:bg-purple-950/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                  {s.type}
                </span>
                <span className="font-mono text-gray-500 font-bold">Node #{s.target_element_id}</span>
              </div>

              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-[11px]">
                {s.confidence}% Confidence
              </span>
            </div>

            <p className="text-gray-800 dark:text-gray-200 leading-relaxed font-medium">{s.reason}</p>

            {/* Side-by-Side Diff Preview */}
            <div className="grid grid-cols-2 gap-3 p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 font-mono text-[11px]">
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase">Current State</div>
                <div className="text-red-600 dark:text-red-400 truncate">{JSON.stringify(s.original)}</div>
              </div>

              <div>
                <div className="text-[10px] font-bold text-emerald-600 uppercase">Proposed Copilot State</div>
                <div className="text-emerald-600 dark:text-emerald-400 truncate">{JSON.stringify(s.proposed)}</div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-1">
              <button
                onClick={() => handleAccept(s.id)}
                className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center space-x-1 shadow-sm"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Accept Suggestion</span>
              </button>

              <button
                onClick={() => handleReject(s.id)}
                className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 font-bold flex items-center space-x-1"
              >
                <X className="h-3.5 w-3.5" />
                <span>Reject</span>
              </button>
            </div>
          </div>
        ))}

        {suggestions.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-emerald-500 opacity-60" />
            <p className="font-semibold text-xs">All AI Copilot recommendations reviewed & accepted!</p>
          </div>
        )}
      </div>
    </div>
  );
}

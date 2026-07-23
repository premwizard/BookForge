"use client";

import React from "react";
import { AlertTriangle, ShieldAlert, CheckCircle2, ArrowUpRight } from "lucide-react";

export interface LowConfidenceItem {
  id: string;
  element_id: string;
  confidence_score: number;
  reason: string;
  suggested_action: string;
}

export default function LowConfidenceViewer() {
  const regions: LowConfidenceItem[] = [
    {
      id: "lc-1",
      element_id: "p-14",
      confidence_score: 74,
      reason: "Ambiguous paragraph heading style: Text starts with bold inline run without heading tag.",
      suggested_action: "Promote element to Heading 3"
    },
    {
      id: "lc-2",
      element_id: "tbl-2",
      confidence_score: 68,
      reason: "Complex merged cell layout in Table 2: Border width inconsistency across merged cells.",
      suggested_action: "Apply Academic Grid table preset"
    }
  ];

  return (
    <div className="p-6 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4 text-xs">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-3">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Low-Confidence Regions Inspector</h3>
        </div>
        <span className="text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded font-bold">
          {regions.length} Regions Flagged
        </span>
      </div>

      <div className="space-y-3">
        {regions.map(r => (
          <div key={r.id} className="p-4 rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/40 dark:bg-amber-950/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-gray-800 dark:text-gray-200 font-bold">Node #{r.element_id}</span>
              <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
                {r.confidence_score}% Confidence
              </span>
            </div>

            <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{r.reason}</p>

            <div className="flex items-center justify-between pt-2 border-t border-amber-200/60 dark:border-amber-900/60">
              <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-300">Action: {r.suggested_action}</span>
              <button className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold flex items-center text-[10px] shadow">
                Inspect Node <ArrowUpRight className="h-3 w-3 ml-1" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Sparkles, CheckCircle2, ArrowRight, ShieldCheck, RefreshCw, Check, X } from "lucide-react";

export default function StyleMappingStudio({ templateId }: { templateId?: string }) {
  const [mappings, setMappings] = useState([
    { raw: "Heading 1", target: "Heading 1", confidence: 98, isApproved: true, reason: "Exact style name match" },
    { raw: "Heading 2", target: "Heading 2", confidence: 92, isApproved: true, reason: "Semantic heading level 2 matching" },
    { raw: "Normal / Text body", target: "Body Text", confidence: 90, isApproved: true, reason: "Default body text heuristic" },
    { raw: "CustomQuoteBlock", target: "Blockquote", confidence: 85, isApproved: false, reason: "Blockquote keyword heuristic" },
    { raw: "Table Grid", target: "Academic Table", confidence: 95, isApproved: true, reason: "Table grid border matching" },
    { raw: "AuthorNoteStyle", target: "Body Text", confidence: 72, isApproved: false, reason: "Fallback to body text" }
  ]);

  const handleApproveAll = () => {
    setMappings(mappings.map(m => ({ ...m, isApproved: true })));
  };

  return (
    <div className="space-y-4 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between bg-purple-50/60 dark:bg-purple-950/30 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-sm">AI Style & Semantic Mapping Engine</h3>
            <p className="text-gray-500">Maps raw author styles to target publisher blueprint specifications.</p>
          </div>
        </div>

        <button
          onClick={handleApproveAll}
          className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold shadow flex items-center space-x-1.5"
        >
          <CheckCircle2 className="h-4 w-4" />
          <span>Batch Approve All Mappings</span>
        </button>
      </div>

      <div className="p-5 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-sm space-y-3">
        <div className="grid grid-cols-12 gap-4 font-bold text-gray-400 uppercase tracking-wider text-[10px] border-b pb-2 dark:border-zinc-800">
          <div className="col-span-3">Raw Author Style</div>
          <div className="col-span-1 text-center">Flow</div>
          <div className="col-span-3">Target Blueprint Style</div>
          <div className="col-span-2 text-center">AI Confidence</div>
          <div className="col-span-3 text-right">Status & Action</div>
        </div>

        {mappings.map((m, i) => (
          <div key={i} className="grid grid-cols-12 gap-4 items-center p-3 rounded-lg border border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 hover:bg-gray-100/50">
            <div className="col-span-3 font-bold text-gray-900 dark:text-white font-mono">{m.raw}</div>

            <div className="col-span-1 flex justify-center text-gray-400">
              <ArrowRight className="h-4 w-4 text-purple-500" />
            </div>

            <div className="col-span-3 font-bold text-blue-600 dark:text-blue-400">{m.target}</div>

            <div className="col-span-2 text-center">
              <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                m.confidence >= 90 ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
              }`}>
                {m.confidence}% Match
              </span>
            </div>

            <div className="col-span-3 flex items-center justify-end space-x-2">
              {m.isApproved ? (
                <span className="flex items-center text-emerald-600 dark:text-emerald-400 font-bold">
                  <CheckCircle2 className="h-4 w-4 mr-1" /> Approved
                </span>
              ) : (
                <button
                  onClick={() => {
                    const next = [...mappings];
                    next[i].isApproved = true;
                    setMappings(next);
                  }}
                  className="px-2.5 py-1 rounded bg-purple-600 text-white font-semibold flex items-center shadow hover:bg-purple-700"
                >
                  <Check className="h-3 w-3 mr-1" /> Approve
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

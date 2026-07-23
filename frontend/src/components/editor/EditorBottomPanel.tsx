"use client";

import React, { useState } from "react";
import { 
  ChevronUp, ChevronDown, Terminal, AlertTriangle, CheckCircle2, 
  GitCommit, Activity, RefreshCw, XCircle, Check, X
} from "lucide-react";

interface BottomPanelProps {
  isExpanded: boolean;
  onToggleExpand: () => void;
  wordCount?: number;
  characterCount?: number;
  pageCount?: number;
  currentPage?: number;
}

export default function EditorBottomPanel({
  isExpanded,
  onToggleExpand,
  wordCount = 4500,
  characterCount = 28410,
  pageCount = 24,
  currentPage = 1
}: BottomPanelProps) {
  const [activeBottomTab, setActiveBottomTab] = useState<"validation" | "changes" | "console">("validation");

  const [trackChangesList, setTrackChangesList] = useState([
    { id: "tc-1", user: "Dr. Aris Thorne", type: "INSERTION", text: "and deterministic control over typography", node: "p-1", time: "10:44 AM" },
    { id: "tc-2", user: "Elena Vance", type: "DELETION", text: "legacy Microsoft Word styles", node: "p-2", time: "10:41 AM" }
  ]);

  return (
    <div className="border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col select-none text-xs">
      {/* Expanded Content Area */}
      {isExpanded && (
        <div className="h-44 p-4 border-b border-gray-200 dark:border-zinc-800 overflow-y-auto space-y-3">
          <div className="flex items-center justify-between border-b pb-2 dark:border-zinc-800">
            <div className="flex space-x-3">
              <button 
                onClick={() => setActiveBottomTab("validation")}
                className={`font-bold pb-1 border-b-2 transition-all ${
                  activeBottomTab === "validation" 
                    ? "border-blue-600 text-blue-600 dark:text-blue-400" 
                    : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                Publisher Validation Log (0 Errors)
              </button>

              <button 
                onClick={() => setActiveBottomTab("changes")}
                className={`font-bold pb-1 border-b-2 transition-all ${
                  activeBottomTab === "changes" 
                    ? "border-blue-600 text-blue-600 dark:text-blue-400" 
                    : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                Track Changes ({trackChangesList.length} Pending)
              </button>

              <button 
                onClick={() => setActiveBottomTab("console")}
                className={`font-bold pb-1 border-b-2 transition-all ${
                  activeBottomTab === "console" 
                    ? "border-blue-600 text-blue-600 dark:text-blue-400" 
                    : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                System & OT Console
              </button>
            </div>

            <button onClick={onToggleExpand} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500">
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          {/* Validation Tab */}
          {activeBottomTab === "validation" && (
            <div className="space-y-2">
              <div className="p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 flex items-center space-x-2 text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>All publisher layout, typography, and citation rules passed with zero violations!</span>
              </div>
            </div>
          )}

          {/* Track Changes Tab */}
          {activeBottomTab === "changes" && (
            <div className="space-y-2">
              {trackChangesList.map(tc => (
                <div key={tc.id} className="p-2.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      tc.type === "INSERTION" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                    }`}>
                      {tc.type}
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white">{tc.user}</span>
                    <span className="text-gray-500 truncate max-w-md font-mono">"{tc.text}"</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => setTrackChangesList(trackChangesList.filter(x => x.id !== tc.id))}
                      className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center"
                    >
                      <Check className="h-3 w-3 mr-1" /> Accept
                    </button>
                    <button 
                      onClick={() => setTrackChangesList(trackChangesList.filter(x => x.id !== tc.id))}
                      className="px-2.5 py-1 rounded border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 flex items-center"
                    >
                      <X className="h-3 w-3 mr-1" /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Console Tab */}
          {activeBottomTab === "console" && (
            <div className="font-mono text-[11px] text-zinc-400 bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 space-y-1">
              <div>[10:44:02.120] OT Engine: Applied revision #14 to document IFDM AST</div>
              <div>[10:44:02.145] Layout Engine: Re-flowed pages 1-3 in 18ms</div>
              <div>[10:44:02.180] WebSocket: Sync complete with 0 conflicts</div>
            </div>
          )}
        </div>
      )}

      {/* Persistent Status Bar Header */}
      <div className="px-4 py-2 flex items-center justify-between bg-gray-50 dark:bg-zinc-950 text-gray-600 dark:text-gray-400 font-medium text-[11px]">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onToggleExpand} 
            className="flex items-center text-gray-800 dark:text-gray-200 font-bold hover:text-blue-600"
          >
            {isExpanded ? <ChevronDown className="h-3.5 w-3.5 mr-1" /> : <ChevronUp className="h-3.5 w-3.5 mr-1" />}
            Console & Validation
          </button>

          <span>Page <span className="font-bold text-gray-900 dark:text-white">{currentPage}</span> of {pageCount}</span>
          <span><span className="font-bold text-gray-900 dark:text-white">{wordCount.toLocaleString()}</span> words</span>
          <span><span className="font-bold text-gray-900 dark:text-white">{characterCount.toLocaleString()}</span> characters</span>
        </div>

        <div className="flex items-center space-x-4">
          <span className="flex items-center text-emerald-600 dark:text-emerald-400 font-semibold">
            <RefreshCw className="h-3 w-3 mr-1 animate-spin" /> Live Sync Connected
          </span>
          <span className="text-gray-500 font-mono">WPM: 64</span>
        </div>
      </div>
    </div>
  );
}

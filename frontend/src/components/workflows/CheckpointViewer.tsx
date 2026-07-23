"use client";

import React, { useState } from "react";
import { Bookmark, RotateCcw, Clock, FileCode, CheckCircle2, ChevronRight } from "lucide-react";

export interface CheckpointItem {
  id: string;
  stage_name: string;
  created_at: string;
  node_id: string;
  state_data: any;
}

export default function CheckpointViewer() {
  const [checkpoints, setCheckpoints] = useState<CheckpointItem[]>([
    {
      id: "cp-101",
      stage_name: "Document Parser",
      created_at: "10:42:04 AM",
      node_id: "node-3",
      state_data: {
        parsed_ast: { sections: 5, paragraphs: 120, tables: 4, figures: 12 },
        word_count: 4500,
        detected_language: "en-US",
        file_hash: "sha256_e83b19a"
      }
    },
    {
      id: "cp-102",
      stage_name: "Transformation Engine",
      created_at: "10:42:06 AM",
      node_id: "node-7",
      state_data: {
        transformation_applied: true,
        ast_transformed: true,
        styles_mapped: 18,
        custom_macros_evaluated: 6
      }
    },
    {
      id: "cp-103",
      stage_name: "Layout Engine",
      created_at: "10:42:09 AM",
      node_id: "node-10",
      state_data: {
        layout_calculated: true,
        total_pages: 24,
        overflow_detected: false,
        header_footer_bound: true
      }
    }
  ]);

  const [selectedCheckpointId, setSelectedCheckpointId] = useState<string>("cp-101");
  const [restoreMessage, setRestoreMessage] = useState<string | null>(null);

  const selectedCheckpoint = checkpoints.find(c => c.id === selectedCheckpointId) || checkpoints[0];

  const handleRestore = (cp: CheckpointItem) => {
    setRestoreMessage(`Pipeline successfully restored to checkpoint milestone '${cp.stage_name}'!`);
    setTimeout(() => setRestoreMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {restoreMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-semibold">{restoreMessage}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Checkpoint Timeline List */}
        <div className="lg:col-span-1 p-4 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-3">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Milestone Checkpoints</h3>
            <Bookmark className="h-4 w-4 text-amber-500" />
          </div>

          <div className="space-y-2">
            {checkpoints.map((cp, idx) => {
              const isSelected = selectedCheckpointId === cp.id;
              return (
                <div
                  key={cp.id}
                  onClick={() => setSelectedCheckpointId(cp.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected 
                      ? "bg-amber-50/70 dark:bg-amber-950/40 border-amber-400 ring-2 ring-amber-500/20" 
                      : "bg-gray-50/50 dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-800 hover:border-amber-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300">
                        <Bookmark className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-900 dark:text-white">{cp.stage_name}</div>
                        <div className="text-[10px] text-gray-500 flex items-center space-x-1 mt-0.5">
                          <Clock className="h-3 w-3" />
                          <span>{cp.created_at}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className={`h-4 w-4 ${isSelected ? "text-amber-600" : "text-gray-400"}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* State Data JSON Inspector & Restore Button */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{selectedCheckpoint?.stage_name} Checkpoint</h3>
              <p className="text-xs text-gray-500">ID: {selectedCheckpoint?.id} • Captured at {selectedCheckpoint?.created_at}</p>
            </div>

            <button
              onClick={() => handleRestore(selectedCheckpoint)}
              className="flex items-center px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-md transition-all"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Restore State From Here
            </button>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider block">Context State Payload</span>
            <div className="p-4 rounded-xl bg-zinc-950 text-emerald-400 font-mono text-xs overflow-x-auto border border-zinc-800 max-h-96">
              <pre>{JSON.stringify(selectedCheckpoint?.state_data, null, 2)}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

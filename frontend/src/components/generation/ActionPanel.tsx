import React from "react";
import { Pause, Play, Square, Download, Share2, Copy } from "lucide-react";

interface Props {
  actions: {
    pause: () => Promise<void>;
    resume: () => Promise<void>;
    cancel: () => Promise<void>;
  };
  status: string;
}

export function ActionPanel({ actions, status }: Props) {
  const isRunning = status === "RUNNING";
  const isPaused = status === "PAUSED";
  const isFinished = status === "COMPLETED" || status === "FAILED" || status === "CANCELLED";

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
      <h3 className="text-sm font-medium text-neutral-400 mb-4">Quick Actions</h3>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        {!isFinished && (
          <button 
            onClick={isRunning ? actions.pause : actions.resume}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-all ${
              isRunning 
                ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30' 
                : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
            }`}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isRunning ? "Pause" : "Resume"}
          </button>
        )}
        
        {!isFinished && (
          <button 
            onClick={actions.cancel}
            className="flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all"
          >
            <Square className="w-4 h-4" />
            Cancel
          </button>
        )}

        {isFinished && (
          <button className="col-span-2 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition-all">
            <Play className="w-4 h-4" />
            Restart Job
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg bg-neutral-800/50 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-all">
          <Download className="w-4 h-4" />
          <span className="text-[10px] uppercase tracking-wider font-semibold">Logs</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg bg-neutral-800/50 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-all">
          <Share2 className="w-4 h-4" />
          <span className="text-[10px] uppercase tracking-wider font-semibold">Share</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg bg-neutral-800/50 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-all">
          <Copy className="w-4 h-4" />
          <span className="text-[10px] uppercase tracking-wider font-semibold">Clone</span>
        </button>
      </div>
    </div>
  );
}

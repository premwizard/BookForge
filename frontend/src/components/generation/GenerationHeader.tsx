import React from "react";
import { GenerationData } from "@/hooks/useGenerationStream";
import { Clock, Key, User, Tag, Activity } from "lucide-react";

interface Props {
  data: GenerationData | null;
  status: string;
}

export function GenerationHeader({ data, status }: Props) {
  if (!data) return null;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-2xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        
        {/* Title and Badge */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight text-white">The Great Gatsby</h1>
            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {status}
            </span>
          </div>
          <p className="text-neutral-400 font-medium">Penguin Random House &bull; Standard Workflow</p>
        </div>

        {/* Quick Meta */}
        <div className="grid grid-cols-2 md:flex gap-4 md:gap-8 text-sm">
          <div className="flex flex-col gap-1">
            <span className="text-neutral-500 flex items-center gap-1"><Key className="w-3 h-3" /> Job ID</span>
            <span className="font-mono text-neutral-300 truncate w-24" title={data.id}>{data.id.split('-')[0]}...</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-neutral-500 flex items-center gap-1"><User className="w-3 h-3" /> Triggered By</span>
            <span className="text-neutral-300">Auto Trigger</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-neutral-500 flex items-center gap-1"><Tag className="w-3 h-3" /> Priority</span>
            <span className="text-amber-400 font-medium">High</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-neutral-500 flex items-center gap-1"><Clock className="w-3 h-3" /> Elapsed</span>
            <span className="text-neutral-300 font-mono">00:03:42</span>
          </div>
        </div>
      </div>
    </div>
  );
}

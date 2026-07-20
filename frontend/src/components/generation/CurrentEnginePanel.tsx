import React from "react";
import { Cpu, MemoryStick, Zap, Server } from "lucide-react";
import { GenerationData } from "@/hooks/useGenerationStream";

interface Props {
  data: GenerationData | null;
  metrics: any[];
}

export function CurrentEnginePanel({ data, metrics }: Props) {
  // Use latest metrics or defaults
  const latest = metrics.length > 0 ? metrics[metrics.length - 1] : {
    cpu_usage: 42,
    memory_usage: 1024 * 1024 * 512, // 512MB
    nodes_processed: 840,
    total_nodes: 1200,
    speed: "24 nodes/s"
  };

  const progress = Math.round((latest.nodes_processed / latest.total_nodes) * 100) || 0;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-neutral-400">Current Engine</h3>
        <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-neutral-800 text-neutral-300 border border-neutral-700 flex items-center gap-1.5">
          <Server className="w-3 h-3 text-emerald-400" />
          worker-01
        </span>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">Blueprint Generator</h2>
        <p className="text-sm text-neutral-400">Analyzing document hierarchy and semantic structure.</p>
      </div>

      <div className="space-y-4">
        {/* Node Progress */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-neutral-400">Nodes Processed</span>
            <span className="text-white font-medium">{latest.nodes_processed} / {latest.total_nodes}</span>
          </div>
          <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Mini Stats Grid */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-neutral-500 flex items-center gap-1"><Zap className="w-3 h-3" /> Speed</span>
            <span className="text-sm text-neutral-200 font-mono">{latest.speed}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-neutral-500 flex items-center gap-1"><Cpu className="w-3 h-3" /> CPU</span>
            <span className="text-sm text-neutral-200 font-mono">{latest.cpu_usage}%</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-neutral-500 flex items-center gap-1"><MemoryStick className="w-3 h-3" /> RAM</span>
            <span className="text-sm text-neutral-200 font-mono">{(latest.memory_usage / 1024 / 1024).toFixed(0)} MB</span>
          </div>
        </div>
      </div>
    </div>
  );
}

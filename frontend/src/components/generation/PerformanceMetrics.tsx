import React from "react";
import { Activity } from "lucide-react";

interface Props {
  metrics?: any[];
}

export function PerformanceMetrics({ metrics = [] }: Props) {
  const data = [
    { time: '10:00', cpu: 20, ram: 400 },
    { time: '10:01', cpu: 45, ram: 450 },
    { time: '10:02', cpu: 85, ram: 512 },
    { time: '10:03', cpu: 60, ram: 520 },
    { time: '10:04', cpu: 30, ram: 520 },
  ];

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md text-xs">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-medium text-neutral-400">Resource Usage & Latency Telemetry</h3>
        <Activity className="w-4 h-4 text-neutral-500" />
      </div>

      <div className="h-32 w-full mb-4 flex items-end justify-between gap-2 p-2 bg-neutral-900/50 rounded-lg">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
            <div 
              className="w-full bg-indigo-500 rounded-t transition-all"
              style={{ height: `${d.cpu}%` }}
              title={`CPU: ${d.cpu}%`}
            ></div>
            <span className="text-[9px] text-neutral-500 font-mono">{d.time}</span>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500" />
          <span className="text-neutral-400">CPU Usage (%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-neutral-400">RAM (MB)</span>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { CheckCircle2, CircleDashed } from "lucide-react";

interface Props {
  timeline: any[];
  status: string;
}

export function OverallProgress({ timeline, status }: Props) {
  const total = timeline.length || 10;
  const completed = timeline.filter(t => t.status === "COMPLETED").length;
  const percentage = Math.round((completed / total) * 100) || 0;
  
  // Calculate stroke dasharray for SVG ring
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-center items-center h-full relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full" />
      
      <h3 className="text-sm font-medium text-neutral-400 mb-6 w-full text-left">Overall Progress</h3>
      
      <div className="relative flex items-center justify-center mb-6">
        <svg className="transform -rotate-90 w-40 h-40">
          {/* Background Ring */}
          <circle 
            cx="80" 
            cy="80" 
            r={radius} 
            stroke="currentColor" 
            strokeWidth="8" 
            fill="transparent" 
            className="text-neutral-800" 
          />
          {/* Progress Ring */}
          <circle 
            cx="80" 
            cy="80" 
            r={radius} 
            stroke="url(#gradient)" 
            strokeWidth="8" 
            fill="transparent" 
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-white tracking-tighter">{percentage}%</span>
          <span className="text-xs text-neutral-400 uppercase tracking-widest mt-1">Complete</span>
        </div>
      </div>

      <div className="flex w-full justify-between items-center text-sm">
        <div className="flex flex-col">
          <span className="text-neutral-500 flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-400"/> Stages</span>
          <span className="text-white font-medium">{completed} / {total}</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-neutral-500 flex items-center gap-1 justify-end"><CircleDashed className="w-3 h-3 text-indigo-400"/> Est. Finish</span>
          <span className="text-white font-medium">~4m 20s</span>
        </div>
      </div>
    </div>
  );
}

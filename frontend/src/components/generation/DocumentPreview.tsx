import React, { useState } from "react";
import { Maximize2, Search, FileText } from "lucide-react";

export function DocumentPreview() {
  const [view, setView] = useState<"page" | "spread">("page");

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl flex flex-col h-[500px] overflow-hidden shadow-2xl relative group">
      
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-black/20 backdrop-blur-md absolute top-0 left-0 right-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-neutral-400" />
          <span className="text-sm font-medium text-neutral-200">Live Preview</span>
        </div>
        
        <div className="flex bg-neutral-900 rounded-lg p-1 border border-neutral-800">
          <button 
            onClick={() => setView("page")}
            className={`px-3 py-1 text-xs font-medium rounded ${view === "page" ? "bg-neutral-700 text-white" : "text-neutral-400 hover:text-white"}`}
          >
            Page
          </button>
          <button 
            onClick={() => setView("spread")}
            className={`px-3 py-1 text-xs font-medium rounded ${view === "spread" ? "bg-neutral-700 text-white" : "text-neutral-400 hover:text-white"}`}
          >
            Spread
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded hover:bg-white/10 text-neutral-400 transition-colors">
            <Search className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded hover:bg-white/10 text-neutral-400 transition-colors">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview Area (Skeleton/Placeholder since rendering might not be done) */}
      <div className="flex-1 bg-neutral-950 flex items-center justify-center p-8 overflow-y-auto pt-16 custom-scrollbar relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        <div className="bg-white w-full max-w-[400px] aspect-[1/1.414] shadow-2xl shadow-black/50 p-8 flex flex-col gap-4 relative z-10">
          <div className="w-2/3 h-6 bg-neutral-200 rounded animate-pulse" />
          <div className="w-full h-3 bg-neutral-100 rounded animate-pulse" />
          <div className="w-full h-3 bg-neutral-100 rounded animate-pulse" />
          <div className="w-4/5 h-3 bg-neutral-100 rounded animate-pulse" />
          
          <div className="w-1/2 h-5 bg-neutral-200 rounded animate-pulse mt-6" />
          <div className="w-full h-3 bg-neutral-100 rounded animate-pulse" />
          <div className="w-full h-3 bg-neutral-100 rounded animate-pulse" />
          <div className="w-11/12 h-3 bg-neutral-100 rounded animate-pulse" />
          
          {/* Overlay scanning effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/10 to-transparent h-32 animate-[scan_3s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}

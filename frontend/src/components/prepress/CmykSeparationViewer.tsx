"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Palette, AlertTriangle, CheckCircle2, Layers } from "lucide-react";

export default function CmykSeparationViewer() {
  const [cyanActive, setCyanActive] = useState(true);
  const [magentaActive, setMagentaActive] = useState(true);
  const [yellowActive, setYellowActive] = useState(true);
  const [blackActive, setBlackActive] = useState(true);
  const [highlightHighDensity, setHighlightHighDensity] = useState(false);

  return (
    <div className="p-6 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4 text-xs select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-zinc-800 pb-3">
        <div className="flex items-center space-x-2">
          <Palette className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            CMYK Color Separation & Total Ink Coverage (TAC) Inspector
          </h3>
        </div>

        <button
          onClick={() => setHighlightHighDensity(!highlightHighDensity)}
          className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 shadow-sm transition-all ${
            highlightHighDensity 
              ? "bg-red-600 text-white" 
              : "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
          }`}
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>{highlightHighDensity ? "TAC Heatmap On (>300%)" : "Highlight Ink Limit (>300%)"}</span>
        </button>
      </div>

      {/* CMYK Channels Toggle Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setCyanActive(!cyanActive)}
          className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
            cyanActive ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-900 dark:text-cyan-200" : "border-gray-200 dark:border-zinc-800 bg-gray-50 opacity-40"
          }`}
        >
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 rounded-full bg-cyan-500"></div>
            <span className="font-bold">Cyan (C)</span>
          </div>
          {cyanActive ? <Eye className="h-4 w-4 text-cyan-600" /> : <EyeOff className="h-4 w-4 text-gray-400" />}
        </button>

        <button
          onClick={() => setMagentaActive(!magentaActive)}
          className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
            magentaActive ? "border-pink-500 bg-pink-50 dark:bg-pink-950/40 text-pink-900 dark:text-pink-200" : "border-gray-200 dark:border-zinc-800 bg-gray-50 opacity-40"
          }`}
        >
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 rounded-full bg-pink-500"></div>
            <span className="font-bold">Magenta (M)</span>
          </div>
          {magentaActive ? <Eye className="h-4 w-4 text-pink-600" /> : <EyeOff className="h-4 w-4 text-gray-400" />}
        </button>

        <button
          onClick={() => setYellowActive(!yellowActive)}
          className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
            yellowActive ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/40 text-yellow-900 dark:text-yellow-200" : "border-gray-200 dark:border-zinc-800 bg-gray-50 opacity-40"
          }`}
        >
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 rounded-full bg-yellow-400"></div>
            <span className="font-bold">Yellow (Y)</span>
          </div>
          {yellowActive ? <Eye className="h-4 w-4 text-yellow-600" /> : <EyeOff className="h-4 w-4 text-gray-400" />}
        </button>

        <button
          onClick={() => setBlackActive(!blackActive)}
          className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
            blackActive ? "border-gray-800 bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white" : "border-gray-200 dark:border-zinc-800 bg-gray-50 opacity-40"
          }`}
        >
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 rounded-full bg-zinc-900 dark:bg-zinc-100"></div>
            <span className="font-bold">Key / Black (K)</span>
          </div>
          {blackActive ? <Eye className="h-4 w-4 text-gray-900 dark:text-white" /> : <EyeOff className="h-4 w-4 text-gray-400" />}
        </button>
      </div>

      {/* CMYK Soft Proofing Render Canvas Container */}
      <div className="p-8 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-100 dark:bg-zinc-900 flex justify-center items-center relative overflow-hidden">
        <div className="w-[320px] h-[440px] bg-white dark:bg-zinc-950 shadow-2xl rounded p-6 space-y-4 border border-gray-300 relative select-none">
          {highlightHighDensity && (
            <div className="absolute top-12 left-8 w-24 h-16 bg-red-500/40 border-2 border-red-600 rounded flex items-center justify-center font-bold text-[9px] text-white animate-pulse">
              TAC 315% (Exceeds Limit)
            </div>
          )}

          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider border-b pb-1">Fogra39 Soft Proof Canvas</div>
          <h2 className={`font-bold text-lg ${cyanActive && magentaActive ? "text-indigo-950 dark:text-indigo-100" : "text-gray-400"}`}>
            Quantum Layout Mechanics
          </h2>

          <p className={`text-xs leading-relaxed ${cyanActive || magentaActive || yellowActive || blackActive ? "text-gray-800 dark:text-gray-200" : "text-gray-300 opacity-20"}`}>
            Determining press-ready CMYK ink separations ensures zero color shifts when transitioning from RGB digital displays to commercial offset presses.
          </p>

          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded text-[10px] font-bold text-amber-900 dark:text-amber-200">
            Spot Color: PANTONE 185 C (Red Press Varnish)
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Crop, ShieldCheck, CheckCircle2, Sliders, Layers } from "lucide-react";

export default function BleedTrimInspector() {
  const [bleedMm, setBleedMm] = useState(3.0);
  const [safeMarginMm, setSafeMarginMm] = useState(6.35);
  const [showCropMarks, setShowCropMarks] = useState(true);

  return (
    <div className="p-6 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4 text-xs select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-zinc-800 pb-3">
        <div className="flex items-center space-x-2">
          <Crop className="h-5 w-5 text-red-600 dark:text-red-400" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            Bleed, Trim Box & Safe Zone Inspector
          </h3>
        </div>

        <span className="text-[10px] bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 px-2.5 py-0.5 rounded-full font-bold">
          3.0mm Standard Bleed Active
        </span>
      </div>

      {/* Control Sliders & Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900">
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-bold mb-1">
            Bleed Margin: <span className="text-red-600">{bleedMm} mm</span>
          </label>
          <input 
            type="range" 
            min="0" 
            max="10" 
            step="0.5" 
            value={bleedMm} 
            onChange={(e) => setBleedMm(parseFloat(e.target.value))}
            className="w-full accent-red-600"
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-bold mb-1">
            Safe Text Margin: <span className="text-emerald-600">{safeMarginMm} mm</span>
          </label>
          <input 
            type="range" 
            min="3" 
            max="15" 
            step="0.5" 
            value={safeMarginMm} 
            onChange={(e) => setSafeMarginMm(parseFloat(e.target.value))}
            className="w-full accent-emerald-600"
          />
        </div>

        <div className="flex items-center justify-between pt-3">
          <span className="font-bold text-gray-800 dark:text-gray-200">Show Press Crop Marks</span>
          <input 
            type="checkbox" 
            checked={showCropMarks} 
            onChange={(e) => setShowCropMarks(e.target.checked)}
            className="h-4 w-4 rounded accent-red-600 cursor-pointer"
          />
        </div>
      </div>

      {/* Page Preview Box with Bleed/Trim Overlays */}
      <div className="p-8 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-100 dark:bg-zinc-900 flex justify-center items-center relative overflow-hidden">
        {/* Outer Bleed Box (Red border) */}
        <div className="p-4 border-2 border-dashed border-red-500 rounded bg-red-50/20 dark:bg-red-950/20 relative">
          <div className="absolute top-1 left-2 font-mono text-[9px] text-red-600 font-bold">Bleed Area ({bleedMm}mm)</div>

          {/* Trim Box (Black border) */}
          <div className="w-[300px] h-[400px] bg-white dark:bg-zinc-950 border-2 border-gray-900 dark:border-white rounded shadow-xl p-4 relative">
            <div className="absolute -top-3 left-2 font-mono text-[9px] text-gray-700 dark:text-gray-300 font-bold bg-white dark:bg-zinc-900 px-1 border rounded">Trim Boundary</div>

            {/* Safe Margin Box (Green border) */}
            <div className="w-full h-full border-2 border-dashed border-emerald-500 rounded p-4 space-y-2 relative">
              <div className="font-mono text-[9px] text-emerald-600 font-bold">Safe Text Area ({safeMarginMm}mm)</div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white">Page Layout Verification</h4>
              <p className="text-gray-600 dark:text-gray-400 text-xs">
                All text content remains strictly inside the green safe area, guaranteeing zero text clipping during industrial paper trimming.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

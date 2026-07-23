"use client";

import React from "react";
import CmykSeparationViewer from "@/components/prepress/CmykSeparationViewer";
import BleedTrimInspector from "@/components/prepress/BleedTrimInspector";
import { Palette, Crop, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function PrepressStudioPage() {
  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-950 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Palette className="h-7 w-7 text-amber-600 dark:text-amber-400 mr-2" />
            Pre-Press Color Proofing, Spot Color & Bleed Calibration Studio
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
            CMYK color separation soft-proofing, Total Ink Coverage (TAC &gt; 300%) inspection, 3mm bleed overlays, and ICC press profile calibration.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <CmykSeparationViewer />
        <BleedTrimInspector />
      </div>
    </div>
  );
}

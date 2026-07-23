"use client";

import React from "react";
import SpineCostCalculator from "@/components/pod/SpineCostCalculator";
import PodChannelMatrix from "@/components/pod/PodChannelMatrix";
import { Calculator, Globe, DollarSign } from "lucide-react";

export default function PodStudioPage() {
  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-950 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Calculator className="h-7 w-7 text-emerald-600 dark:text-emerald-400 mr-2" />
            Print-on-Demand (POD) Distribution & Royalty Analytics Studio
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
            Exact spine width & cover template dimension calculations, unit print cost estimation ($/book), distribution matrix (KDP, IngramSpark), and contributor royalty splits.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <SpineCostCalculator />
        <PodChannelMatrix />
      </div>
    </div>
  );
}

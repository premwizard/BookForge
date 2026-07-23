"use client";

import React from "react";
import TranslationStudio from "@/components/localization/TranslationStudio";
import GlobalRightsPanel from "@/components/localization/GlobalRightsPanel";
import { Globe, Languages, ShieldCheck, BookOpen, Layers } from "lucide-react";

export default function LocalizationStudioPage() {
  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-950 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Globe className="h-7 w-7 text-blue-600 dark:text-blue-400 mr-2" />
            AI Multi-Lingual Localization & Global Rights Studio
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
            Layout-aware manuscript translation in 50+ languages, dynamic text expansion reflow, RTL/CJK typography rules, and international territory licensing.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <TranslationStudio />
        <GlobalRightsPanel />
      </div>
    </div>
  );
}

"use client";

import React from "react";
import EReaderCanvas from "@/components/ereader/EReaderCanvas";
import NcxTocInspector from "@/components/ereader/NcxTocInspector";
import { BookOpen, Tablet, ListTree, CheckCircle2 } from "lucide-react";

export default function EReaderStudioPage() {
  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-950 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <BookOpen className="h-7 w-7 text-emerald-600 dark:text-emerald-400 mr-2" />
            EPUB3 & Kindle KFX E-Reader Inspector Studio
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
            Physical e-reader device emulation (Kindle Paperwhite 300 PPI E-Ink, Apple Books iPad Retina), reflowable font styling, and EPUB 3.3 NCX navigation validation.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <EReaderCanvas />
        <NcxTocInspector />
      </div>
    </div>
  );
}

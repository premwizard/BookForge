"use client";

import React from "react";
import BatchIngestionStudio from "@/components/batch/BatchIngestionStudio";
import CatalogSearchMatrix from "@/components/batch/CatalogSearchMatrix";
import { Archive, UploadCloud, BookOpen, Layers } from "lucide-react";

export default function BatchStudioPage() {
  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-950 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Archive className="h-7 w-7 text-sky-600 dark:text-sky-400 mr-2" />
            Enterprise Batch Processing, Ingestion Pipeline & Auto-Cataloging Engine
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
            Bulk manuscript archive ingestion (Zip 50+ files), automated BISAC classification, Dewey Decimal indexing, and batch multi-format release rendering.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <BatchIngestionStudio />
        <CatalogSearchMatrix />
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Archive, UploadCloud, RefreshCw, CheckCircle2, FileText, Cpu, Layers } from "lucide-react";

export interface BatchJobItem {
  id: string;
  archive_name: string;
  total_files: number;
  processed_files: number;
  failed_files: number;
  status: string;
  preset_name: string;
}

export default function BatchIngestionStudio() {
  const [isIngesting, setIsIngesting] = useState(false);
  const [jobs, setJobs] = useState<BatchJobItem[]>([
    { id: "bj-101", archive_name: "Q3_Academic_Press_Batch_2026.zip", total_files: 50, processed_files: 50, failed_files: 0, status: "Completed", preset_name: "Academic Book Standard" },
    { id: "bj-102", archive_name: "Springer_Monograph_Archive.zip", total_files: 24, processed_files: 24, failed_files: 0, status: "Completed", preset_name: "Springer Science Standard" }
  ]);

  const handleStartIngestion = () => {
    setIsIngesting(true);
    setTimeout(() => {
      const newJob: BatchJobItem = {
        id: `bj-${Date.now()}`,
        archive_name: "Batch_Manuscripts_Ingest.zip",
        total_files: 12,
        processed_files: 12,
        failed_files: 0,
        status: "Completed",
        preset_name: "Academic Book Standard"
      };
      setJobs([newJob, ...jobs]);
      setIsIngesting(false);
    }, 1200);
  };

  return (
    <div className="p-6 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4 text-xs select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-zinc-800 pb-3">
        <div className="flex items-center space-x-2">
          <Archive className="h-5 w-5 text-sky-600 dark:text-sky-400" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            Bulk Archive Ingestion & Queue Monitor
          </h3>
        </div>

        <button
          onClick={handleStartIngestion}
          disabled={isIngesting}
          className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold flex items-center space-x-1.5 shadow-sm"
        >
          <UploadCloud className={`h-3.5 w-3.5 ${isIngesting ? "animate-bounce" : ""}`} />
          <span>{isIngesting ? "Ingesting Zip Archive..." : "Ingest Zip Archive"}</span>
        </button>
      </div>

      {/* Real-time Queue Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 space-y-1">
          <div className="text-[10px] text-gray-500 font-bold uppercase">Active Processing Queue</div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">Idle (0 in queue)</div>
          <div className="text-[9px] text-gray-400">11 Worker Processes Standing By</div>
        </div>

        <div className="p-3.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 space-y-1">
          <div className="text-[10px] text-gray-500 font-bold uppercase">Total Ingested Manuscripts</div>
          <div className="text-lg font-bold text-sky-600 dark:text-sky-400">86 Files</div>
          <div className="text-[9px] text-gray-400">100% Ingestion Pass Rate</div>
        </div>

        <div className="p-3.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 space-y-1">
          <div className="text-[10px] text-gray-500 font-bold uppercase">BISAC Metadata Classifier</div>
          <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">Active AI Model</div>
          <div className="text-[9px] text-gray-400">Auto-Dewey & ISBN Matching</div>
        </div>
      </div>

      {/* Ingestion Jobs History Table */}
      <div className="border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-gray-50 dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 text-gray-500 font-bold uppercase text-[10px]">
            <tr>
              <th className="px-4 py-2.5">Archive Zip Name</th>
              <th className="px-4 py-2.5">Preset Format</th>
              <th className="px-4 py-2.5">Files Count</th>
              <th className="px-4 py-2.5">Ingestion Status</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(j => (
              <tr key={j.id} className="border-b border-gray-100 dark:border-zinc-800/50 hover:bg-gray-50 dark:hover:bg-zinc-900/50">
                <td className="px-4 py-2.5 font-bold font-mono text-sky-600 dark:text-sky-400">{j.archive_name}</td>
                <td className="px-4 py-2.5 text-gray-700 dark:text-gray-300">{j.preset_name}</td>
                <td className="px-4 py-2.5 font-semibold text-gray-900 dark:text-white">{j.processed_files} / {j.total_files} Files</td>
                <td className="px-4 py-2.5">
                  <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {j.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

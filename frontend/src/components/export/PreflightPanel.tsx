"use client";

import React from "react";
import { ShieldCheck, AlertTriangle, CheckCircle2, XCircle, Info, RefreshCw } from "lucide-react";

export interface PreflightCheckItem {
  check: string;
  status: "PASSED" | "WARNING" | "FAILED";
  message: string;
}

export interface PreflightReportProps {
  overallStatus: "PASSED" | "WARNINGS" | "FAILED" | "PENDING";
  checks: PreflightCheckItem[];
  onReRunPreflight?: () => void;
}

export default function PreflightPanel({
  overallStatus,
  checks,
  onReRunPreflight
}: PreflightReportProps) {
  return (
    <div className="p-6 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4 text-xs">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-3">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Automated Preflight Report</h3>
        </div>

        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            overallStatus === "PASSED" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" :
            overallStatus === "WARNINGS" ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" :
            overallStatus === "FAILED" ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300" :
            "bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-gray-300"
          }`}>
            {overallStatus}
          </span>

          {onReRunPreflight && (
            <button 
              onClick={onReRunPreflight}
              className="flex items-center px-3 py-1.5 rounded-lg border border-gray-300 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-200 transition-colors font-medium"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1 text-blue-500" />
              Re-run Checks
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {checks.map((c, i) => (
          <div 
            key={i} 
            className={`p-3 rounded-lg border flex items-start space-x-3 ${
              c.status === "PASSED" ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60" :
              c.status === "WARNING" ? "bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/60" :
              "bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-800/60"
            }`}
          >
            {c.status === "PASSED" && <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />}
            {c.status === "WARNING" && <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />}
            {c.status === "FAILED" && <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />}

            <div>
              <div className="font-bold text-gray-900 dark:text-white">{c.check}</div>
              <div className="text-gray-600 dark:text-gray-300 mt-0.5">{c.message}</div>
            </div>
          </div>
        ))}

        {checks.length === 0 && (
          <div className="text-center py-6 text-gray-400">
            <Info className="h-6 w-6 mx-auto mb-1 opacity-50" />
            <p>No preflight checks run yet. Trigger export to run preflight validation.</p>
          </div>
        )}
      </div>
    </div>
  );
}

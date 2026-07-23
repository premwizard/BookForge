"use client";

import React, { useState } from "react";
import { 
  Play, Pause, RefreshCw, XCircle, CheckCircle2, Clock, AlertCircle, 
  Terminal, ShieldCheck, Scan, FileCode, Layers, Palette, SlidersHorizontal,
  Sparkles, Eye, Layout, Printer, CheckSquare, Download, Archive, Cpu, Bell
} from "lucide-react";

export interface ExecutionStep {
  id: string;
  node_name: string;
  engine_type: string;
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED" | "RETRYING" | "SKIPPED";
  execution_time_ms?: number;
  error_message?: string;
  is_checkpoint?: boolean;
}

export default function ExecutionMonitor() {
  const [status, setStatus] = useState<"RUNNING" | "PAUSED" | "COMPLETED" | "FAILED">("RUNNING");
  const [steps, setSteps] = useState<ExecutionStep[]>([
    { id: "s1", node_name: "Virus Scan", engine_type: "virus_scan", status: "COMPLETED", execution_time_ms: 240 },
    { id: "s2", node_name: "OCR Engine", engine_type: "ocr", status: "COMPLETED", execution_time_ms: 1820 },
    { id: "s3", node_name: "Document Parser", engine_type: "parser", status: "COMPLETED", execution_time_ms: 950, is_checkpoint: true },
    { id: "s4", node_name: "Blueprint Loader", engine_type: "blueprint", status: "COMPLETED", execution_time_ms: 110 },
    { id: "s5", node_name: "Style Mapping", engine_type: "mapping", status: "COMPLETED", execution_time_ms: 320 },
    { id: "s6", node_name: "Rules Engine", engine_type: "rules", status: "COMPLETED", execution_time_ms: 450 },
    { id: "s7", node_name: "Transformation Engine", engine_type: "transformation", status: "RUNNING", is_checkpoint: true },
    { id: "s8", node_name: "Pre-Layout Validation", engine_type: "validation", status: "PENDING" },
    { id: "s9", node_name: "Editorial Review", engine_type: "review", status: "PENDING", is_checkpoint: true },
    { id: "s10", node_name: "Layout Engine", engine_type: "layout", status: "PENDING", is_checkpoint: true },
    { id: "s11", node_name: "Pagination Engine", engine_type: "pagination", status: "PENDING" },
    { id: "s12", node_name: "Rendering Engine", engine_type: "rendering", status: "PENDING", is_checkpoint: true },
    { id: "s13", node_name: "Final Validation", engine_type: "final_validation", status: "PENDING" },
    { id: "s14", node_name: "Export Engine", engine_type: "export", status: "PENDING", is_checkpoint: true },
    { id: "s15", node_name: "Archive Engine", engine_type: "archive", status: "PENDING" }
  ]);

  const [logs, setLogs] = useState<string[]>([
    "[10:42:01 INFO] Workflow instance initialized (ID: wf-88a29e)",
    "[10:42:01 INFO] Dispatched 'virus_scan' node to queue 'worker'",
    "[10:42:02 INFO] Virus scan clean file hash: sha256_e83b19a",
    "[10:42:02 INFO] Dispatched 'ocr' node to queue 'gpu'",
    "[10:42:04 INFO] OCR processed 42 blocks with 0.98 confidence",
    "[10:42:04 INFO] Checkpoint #1 saved at 'Document Parser'",
    "[10:42:05 INFO] Style mapping applied 18 document styles",
    "[10:42:06 INFO] Transformation Engine executing AST pass 2/3..."
  ]);

  const completedCount = steps.filter(s => s.status === "COMPLETED").length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  const handlePause = () => {
    setStatus("PAUSED");
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()} WARN] Workflow paused by user request.`]);
  };

  const handleResume = () => {
    setStatus("RUNNING");
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()} INFO] Resuming workflow orchestrator dispatch.`]);
  };

  const handleRestart = () => {
    setSteps(prev => prev.map((s, i) => i === 0 ? { ...s, status: "RUNNING" } : { ...s, status: "PENDING" }));
    setStatus("RUNNING");
    setLogs([`[${new Date().toLocaleTimeString()} INFO] Workflow restarted from stage #1.`]);
  };

  return (
    <div className="space-y-6">
      {/* Workflow Execution Header Card */}
      <div className="p-6 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Active Workflow Execution</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                status === "RUNNING" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 animate-pulse" :
                status === "PAUSED" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" :
                status === "COMPLETED" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" :
                "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
              }`}>
                {status}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Instance ID: <span className="font-mono text-gray-700 dark:text-gray-300">wf-inst-94a108b</span> • Document: <span className="font-semibold text-gray-700 dark:text-gray-300">Quantum_Physics_Journal_2026.docx</span></p>
          </div>

          <div className="flex items-center space-x-3">
            {status === "RUNNING" ? (
              <button 
                onClick={handlePause}
                className="flex items-center px-4 py-2 text-sm font-semibold rounded-lg bg-amber-500 hover:bg-amber-600 text-white shadow transition-colors"
              >
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </button>
            ) : (
              <button 
                onClick={handleResume}
                className="flex items-center px-4 py-2 text-sm font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow transition-colors"
              >
                <Play className="h-4 w-4 mr-2 fill-current" />
                Resume
              </button>
            )}

            <button 
              onClick={handleRestart}
              className="flex items-center px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-200 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2 text-blue-500" />
              Restart
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-gray-600 dark:text-gray-400">
            <span>Overall Progress ({completedCount}/{steps.length} stages)</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-gray-200 dark:bg-zinc-800 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Execution Stages Timeline View */}
      <div className="p-6 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Live Pipeline Stages</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {steps.map((step, idx) => (
            <div 
              key={step.id}
              className={`p-3 rounded-xl border transition-all relative ${
                step.status === "COMPLETED" ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60" :
                step.status === "RUNNING" ? "bg-blue-50/70 dark:bg-blue-950/40 border-blue-400 ring-2 ring-blue-500/20 animate-pulse" :
                step.status === "FAILED" ? "bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-800" :
                step.status === "RETRYING" ? "bg-amber-50/50 dark:bg-amber-950/20 border-amber-300" :
                "bg-gray-50/50 dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-800 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono text-[10px] text-gray-400">#{idx + 1}</span>
                {step.status === "COMPLETED" && <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
                {step.status === "RUNNING" && <RefreshCw className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-spin" />}
                {step.status === "PENDING" && <Clock className="h-4 w-4 text-gray-400" />}
              </div>

              <div className="text-xs font-bold text-gray-900 dark:text-white truncate">{step.node_name}</div>
              <div className="text-[10px] text-gray-500 font-mono mt-0.5">{step.engine_type}</div>

              {step.execution_time_ms && (
                <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold mt-2">
                  {step.execution_time_ms} ms
                </div>
              )}

              {step.is_checkpoint && (
                <span className="absolute top-2 right-2 text-[9px] bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded font-medium">CP</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Live Stream Terminal Logs */}
      <div className="p-4 rounded-xl bg-zinc-950 text-zinc-100 font-mono text-xs border border-zinc-800 shadow-inner space-y-3">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
          <div className="flex items-center space-x-2">
            <Terminal className="h-4 w-4 text-emerald-400" />
            <span className="font-bold text-zinc-300">Live Orchestration Stream</span>
          </div>
          <span className="text-[10px] text-zinc-500">Auto-scrolling</span>
        </div>

        <div className="space-y-1 max-h-48 overflow-y-auto pr-2">
          {logs.map((log, i) => (
            <div key={i} className="leading-relaxed hover:bg-zinc-900 px-1 rounded">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

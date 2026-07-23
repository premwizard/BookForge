"use client";

import React from "react";
import { Cpu, Zap, Activity, HardDrive, Layers, CheckCircle2, AlertOctagon, RefreshCw } from "lucide-react";

export default function WorkerQueueMonitor() {
  const queues = [
    { name: "priority", label: "Priority Queue", activeWorkers: 8, pendingJobs: 2, throughput: "140/min", status: "Healthy" },
    { name: "publisher", label: "Publisher Queue", activeWorkers: 12, pendingJobs: 5, throughput: "95/min", status: "Healthy" },
    { name: "gpu", label: "GPU Rendering Cluster", activeWorkers: 4, pendingJobs: 1, throughput: "42/min", status: "Optimal" },
    { name: "cpu", label: "High Memory CPU Queue", activeWorkers: 16, pendingJobs: 8, throughput: "210/min", status: "Healthy" },
    { name: "worker", label: "Standard Worker Queue", activeWorkers: 24, pendingJobs: 14, throughput: "480/min", status: "Healthy" },
    { name: "large_doc", label: "Large Document Queue", activeWorkers: 6, pendingJobs: 3, throughput: "18/min", status: "Healthy" }
  ];

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-sm flex items-center space-x-4">
          <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <Cpu className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">70 Active</div>
            <div className="text-xs text-gray-500">Celery Worker Processes</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-sm flex items-center space-x-4">
          <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">985/min</div>
            <div className="text-xs text-gray-500">Node Task Throughput</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-sm flex items-center space-x-4">
          <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">33 Jobs</div>
            <div className="text-xs text-gray-500">Total Enqueued Jobs</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-sm flex items-center space-x-4">
          <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <AlertOctagon className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">0 DLQ</div>
            <div className="text-xs text-gray-500">Dead-Letter Queue Count</div>
          </div>
        </div>
      </div>

      {/* Queue Grid */}
      <div className="p-6 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-3">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Distributed Queues</h3>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center">
            <CheckCircle2 className="h-4 w-4 mr-1" />
            All Queues Operational
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {queues.map(q => (
            <div key={q.name} className="p-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-gray-900 dark:text-white">{q.label}</span>
                <span className="text-[10px] font-mono bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded font-semibold">{q.name}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500 block">Workers</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{q.activeWorkers} Allocated</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Pending</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{q.pendingJobs} Jobs</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs pt-2 border-t border-gray-200 dark:border-zinc-800">
                <span className="text-gray-500">Throughput: <span className="font-semibold text-gray-700 dark:text-gray-300">{q.throughput}</span></span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{q.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

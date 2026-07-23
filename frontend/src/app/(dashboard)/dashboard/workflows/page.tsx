"use client";

import React, { useState } from "react";
import { 
  Workflow, Layers, Play, CheckCircle2, AlertOctagon, Activity, 
  Bookmark, Cpu, Plus, Sliders, RefreshCw, Clock
} from "lucide-react";
import PipelineDesigner from "@/components/workflows/PipelineDesigner";
import ExecutionMonitor from "@/components/workflows/ExecutionMonitor";
import CheckpointViewer from "@/components/workflows/CheckpointViewer";
import WorkerQueueMonitor from "@/components/workflows/WorkerQueueMonitor";

export default function WorkflowsPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "designer" | "monitor" | "checkpoints" | "queues">("dashboard");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 dark:border-zinc-800 pb-5">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-md">
              <Workflow className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Workflow Orchestration Engine</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Central publishing pipeline coordinator, DAG scheduler & Saga recovery manager.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setActiveTab("designer")}
            className="flex items-center px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow transition-all"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Workflow Template
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex space-x-2 border-b border-gray-200 dark:border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`flex items-center px-4 py-2.5 text-sm font-semibold rounded-lg transition-all ${
            activeTab === "dashboard"
              ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
              : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-800"
          }`}
        >
          <Activity className="h-4 w-4 mr-2" />
          Dashboard
        </button>

        <button
          onClick={() => setActiveTab("designer")}
          className={`flex items-center px-4 py-2.5 text-sm font-semibold rounded-lg transition-all ${
            activeTab === "designer"
              ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
              : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-800"
          }`}
        >
          <Layers className="h-4 w-4 mr-2" />
          Pipeline Designer
        </button>

        <button
          onClick={() => setActiveTab("monitor")}
          className={`flex items-center px-4 py-2.5 text-sm font-semibold rounded-lg transition-all ${
            activeTab === "monitor"
              ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
              : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-800"
          }`}
        >
          <Play className="h-4 w-4 mr-2" />
          Execution Monitor
        </button>

        <button
          onClick={() => setActiveTab("checkpoints")}
          className={`flex items-center px-4 py-2.5 text-sm font-semibold rounded-lg transition-all ${
            activeTab === "checkpoints"
              ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
              : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-800"
          }`}
        >
          <Bookmark className="h-4 w-4 mr-2" />
          Checkpoint Viewer
        </button>

        <button
          onClick={() => setActiveTab("queues")}
          className={`flex items-center px-4 py-2.5 text-sm font-semibold rounded-lg transition-all ${
            activeTab === "queues"
              ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
              : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-800"
          }`}
        >
          <Cpu className="h-4 w-4 mr-2" />
          Worker & Queue Monitor
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          {/* Top Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-sm flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                <Play className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">12 Active</div>
                <div className="text-xs text-gray-500">Running Workflows</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-sm flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">1,420</div>
                <div className="text-xs text-gray-500">Completed Today</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-sm flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                <Bookmark className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">4,812</div>
                <div className="text-xs text-gray-500">Checkpoints Created</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-sm flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                <AlertOctagon className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">0.02%</div>
                <div className="text-xs text-gray-500">Failure Recovery Rate</div>
              </div>
            </div>
          </div>

          {/* Quick Launch & Active Workflows Table */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-3">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Active Publishing Workflows</h3>
                <button onClick={() => setActiveTab("monitor")} className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">View Live Monitor</button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-gray-200 dark:border-zinc-800 text-gray-500">
                    <tr>
                      <th className="py-2 px-3">Instance ID</th>
                      <th className="py-2 px-3">Document</th>
                      <th className="py-2 px-3">Template</th>
                      <th className="py-2 px-3">Status</th>
                      <th className="py-2 px-3">Progress</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                    <tr className="hover:bg-gray-50 dark:hover:bg-zinc-900/50 cursor-pointer" onClick={() => setActiveTab("monitor")}>
                      <td className="py-3 px-3 font-mono">wf-88a29e</td>
                      <td className="py-3 px-3 font-semibold text-gray-900 dark:text-white">Quantum_Physics_Journal_2026.docx</td>
                      <td className="py-3 px-3 text-gray-600 dark:text-gray-400">Standard Publishing</td>
                      <td className="py-3 px-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">RUNNING</span></td>
                      <td className="py-3 px-3 text-emerald-600 font-semibold">46% (7/15)</td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-zinc-900/50 cursor-pointer" onClick={() => setActiveTab("monitor")}>
                      <td className="py-3 px-3 font-mono">wf-44c102</td>
                      <td className="py-3 px-3 font-semibold text-gray-900 dark:text-white">Neuroscience_Review_v2.pdf</td>
                      <td className="py-3 px-3 text-gray-600 dark:text-gray-400">Academic Publishing</td>
                      <td className="py-3 px-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">COMPLETED</span></td>
                      <td className="py-3 px-3 text-emerald-600 font-semibold">100% (6/6)</td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-zinc-900/50 cursor-pointer" onClick={() => setActiveTab("monitor")}>
                      <td className="py-3 px-3 font-mono">wf-12d90a</td>
                      <td className="py-3 px-3 font-semibold text-gray-900 dark:text-white">Weekly_Tech_Magazine_Issue42.docx</td>
                      <td className="py-3 px-3 text-gray-600 dark:text-gray-400">Quick Formatting</td>
                      <td className="py-3 px-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">PAUSED</span></td>
                      <td className="py-3 px-3 text-amber-600 font-semibold">60% (3/5)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Template Launcher Card */}
            <div className="lg:col-span-1 p-6 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-3">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Quick Pipeline Launch</h3>
                <Layers className="h-4 w-4 text-blue-500" />
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => setActiveTab("designer")}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:border-blue-300 text-left transition-all group"
                >
                  <div className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-blue-600">Standard Publishing Pipeline</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">16-stage pipeline (Parser, Layout, Render, Export, Archive)</div>
                </button>

                <button 
                  onClick={() => setActiveTab("designer")}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:border-blue-300 text-left transition-all group"
                >
                  <div className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-blue-600">Academic Publishing Pipeline</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">Peer review gate, citation validation, PDF/A compliance</div>
                </button>

                <button 
                  onClick={() => setActiveTab("designer")}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:border-blue-300 text-left transition-all group"
                >
                  <div className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-blue-600">AI Assisted Workflow</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">Automated style mapping with confidence score gates</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "designer" && (
        <PipelineDesigner onStartWorkflow={() => setActiveTab("monitor")} />
      )}

      {activeTab === "monitor" && (
        <ExecutionMonitor />
      )}

      {activeTab === "checkpoints" && (
        <CheckpointViewer />
      )}

      {activeTab === "queues" && (
        <WorkerQueueMonitor />
      )}
    </div>
  );
}

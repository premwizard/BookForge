"use client";

import React from "react";
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FolderOpen, FileText, CheckCircle2, Clock, Edit3, Download, Sparkles, 
  Workflow, LayoutTemplate, ShieldCheck, Activity, Cpu, ArrowUpRight, 
  Play, Layers, FileCheck, ShieldAlert, Zap, RefreshCw
} from "lucide-react";
import Link from "next/link";

const telemetryStats = [
  {
    name: "Total Active Projects",
    value: "14",
    icon: FolderOpen,
    description: "+3 new this month",
    trend: "+25%"
  },
  {
    name: "Manuscripts Processed",
    value: "284",
    icon: FileText,
    description: "4,820 total pages rendered",
    trend: "+18%"
  },
  {
    name: "Layout Rule Compliance",
    value: "99.2%",
    icon: CheckCircle2,
    description: "0 publisher rule violations",
    trend: "+0.4%"
  },
  {
    name: "Avg Rendering Latency",
    value: "42 ms",
    icon: Clock,
    description: "Per 100 pages (GPU accelerated)",
    trend: "18ms faster"
  }
];

const enginesGrid = [
  { name: "Parser & Analysis Engine", tag: "Parser", status: "OPERATIONAL", latency: "14ms", route: "/dashboard/projects" },
  { name: "Rule-Based Formatting Engine", tag: "Rules", status: "OPERATIONAL", latency: "8ms", route: "/dashboard/templates" },
  { name: "Multi-Format Transformation Engine", tag: "Transformation", status: "OPERATIONAL", latency: "12ms", route: "/dashboard/projects" },
  { name: "Advanced Layout & Paginator", tag: "Layout", status: "OPERATIONAL", latency: "18ms", route: "/dashboard/editor" },
  { name: "High-Fidelity Rendering Engine", tag: "Rendering", status: "OPERATIONAL", latency: "22ms", route: "/dashboard/editor" },
  { name: "Peer Review & Proofing Engine", tag: "Review", status: "OPERATIONAL", latency: "6ms", route: "/dashboard/editor" },
  { name: "Workflow Orchestration Engine", tag: "Orchestrator", status: "OPERATIONAL", latency: "4ms", route: "/dashboard/workflows" },
  { name: "Enterprise Visual Editor Studio", tag: "Visual Editor", status: "OPERATIONAL", latency: "11ms", route: "/dashboard/editor" },
  { name: "Multi-Format Export & Release", tag: "Export", status: "OPERATIONAL", latency: "28ms", route: "/dashboard/export" },
  { name: "Publisher Blueprint Studio", tag: "Templates", status: "OPERATIONAL", latency: "9ms", route: "/dashboard/templates" },
  { name: "AI Copilot & Intelligence Engine", tag: "AI Copilot", status: "OPERATIONAL", latency: "35ms", route: "/dashboard/ai" },
  { name: "Project & Catalog Management Hub", tag: "Projects", status: "OPERATIONAL", latency: "5ms", route: "/dashboard/projects" },
  { name: "Audit, Security & SOC2 Studio", tag: "Security", status: "OPERATIONAL", latency: "3ms", route: "/dashboard/settings" }
];

export default function DashboardOverview() {
  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-950 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Activity className="h-7 w-7 text-blue-600 dark:text-blue-400 mr-2" />
            DocForge Live Telemetry & Operations Command Center
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
            Real-time status monitoring across all 13 core engines, active Celery worker queues, and quick-action launchers.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center">
            <CheckCircle2 className="h-4 w-4 mr-1.5" /> All 13 Engines Operational
          </span>
        </div>
      </div>

      {/* Telemetry Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {telemetryStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name} className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {stat.name}
                </CardTitle>
                <Icon className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-between">
                  <span>{stat.value}</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                    {stat.trend}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Action Launchers Bar */}
      <div className="p-5 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-sm space-y-3">
        <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-xs border-b pb-2 dark:border-zinc-800">
          Executive Quick-Action Launchers
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <Link href="/dashboard/editor">
            <div className="p-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 hover:border-blue-500 cursor-pointer flex items-center space-x-2.5 group transition-all">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600">
                <Edit3 className="h-4 w-4" />
              </div>
              <div>
                <div className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 text-xs">Visual Editor</div>
                <div className="text-[10px] text-gray-400">Desktop DTP Canvas</div>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/export">
            <div className="p-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 hover:border-blue-500 cursor-pointer flex items-center space-x-2.5 group transition-all">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600">
                <Download className="h-4 w-4" />
              </div>
              <div>
                <div className="font-bold text-gray-900 dark:text-white group-hover:text-purple-600 text-xs">Export & Releases</div>
                <div className="text-[10px] text-gray-400">PDF/X, EPUB, JATS</div>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/ai">
            <div className="p-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 hover:border-blue-500 cursor-pointer flex items-center space-x-2.5 group transition-all">
              <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <div className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 text-xs">AI Copilot Studio</div>
                <div className="text-[10px] text-gray-400">Formatting Insights</div>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/workflows">
            <div className="p-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 hover:border-blue-500 cursor-pointer flex items-center space-x-2.5 group transition-all">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600">
                <Workflow className="h-4 w-4" />
              </div>
              <div>
                <div className="font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 text-xs">Workflows DAG</div>
                <div className="text-[10px] text-gray-400">Orchestrator Pipeline</div>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/templates">
            <div className="p-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 hover:border-blue-500 cursor-pointer flex items-center space-x-2.5 group transition-all">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600">
                <LayoutTemplate className="h-4 w-4" />
              </div>
              <div>
                <div className="font-bold text-gray-900 dark:text-white group-hover:text-amber-600 text-xs">Blueprint Studio</div>
                <div className="text-[10px] text-gray-400">Template Specifications</div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* 13-Engine Microservices Status Grid & Processing Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 13-Engine Microservice Grid (2/3 width) */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3 dark:border-zinc-800">
            <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-xs flex items-center">
              <Cpu className="h-4 w-4 mr-2 text-blue-600" />
              13 Core Engine Microservices Status
            </h3>
            <span className="text-[10px] font-mono text-gray-400">All Latencies &lt; 50ms</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {enginesGrid.map((eng, i) => (
              <Link key={i} href={eng.route}>
                <div className="p-3 rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 hover:border-blue-500 flex items-center justify-between transition-all group">
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 text-xs flex items-center">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                      {eng.name}
                    </div>
                    <div className="text-[10px] text-gray-400 pl-4">{eng.tag} Engine • Latency: {eng.latency}</div>
                  </div>

                  <ArrowUpRight className="h-3.5 w-3.5 text-gray-400 group-hover:text-blue-600" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Live Processing Activity Stream & Celery Queue (1/3 width) */}
        <div className="p-6 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3 dark:border-zinc-800">
            <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-xs">
              Live Activity Stream
            </h3>
            <RefreshCw className="h-3.5 w-3.5 text-blue-500 animate-spin" />
          </div>

          <div className="space-y-3 font-mono text-[11px]">
            {[
              { time: "10:45 AM", text: "PDF/X-1a Export generated for Volume 1", type: "EXPORT" },
              { time: "10:42 AM", text: "AI Copilot analysis completed on Node #p-1", type: "AI" },
              { time: "10:38 AM", text: "Blueprint v2.0 published for Penguin 6x9", type: "TEMPLATE" },
              { time: "10:30 AM", text: "SOC2 Compliance audit log archived", type: "SECURITY" },
              { time: "10:15 AM", text: "Celery Worker #4 finished page rendering", type: "WORKER" }
            ].map((item, idx) => (
              <div key={idx} className="p-2.5 rounded-lg border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-blue-600">{item.type}</span>
                  <span className="text-gray-400">{item.time}</span>
                </div>
                <div className="text-gray-800 dark:text-gray-200 font-sans text-xs">{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

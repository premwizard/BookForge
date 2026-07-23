"use client";

import React, { useState } from "react";
import CopilotSuggestionsList from "@/components/ai/CopilotSuggestionsList";
import LowConfidenceViewer from "@/components/ai/LowConfidenceViewer";
import { 
  Sparkles, ShieldCheck, Activity, Cpu, RefreshCw, BarChart3, 
  Coins, CheckCircle2, AlertTriangle, Layers, BookOpen
} from "lucide-react";

export default function AICopilotStudioPage() {
  const [activeProvider, setActiveProvider] = useState("GEMINI");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleReanalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-950 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Sparkles className="h-7 w-7 text-purple-600 dark:text-purple-400 mr-2" />
            AI Formatting Copilot & Intelligence Studio
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Non-destructive AI formatting recommendations, structure tree insights, multi-LLM provider routing, and low-confidence region inspection.
          </p>
        </div>

        <button
          onClick={handleReanalyze}
          disabled={isAnalyzing}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md transition-all flex items-center space-x-2 text-xs"
        >
          <RefreshCw className={`h-4 w-4 ${isAnalyzing ? "animate-spin" : ""}`} />
          <span>{isAnalyzing ? "Analyzing Document AST..." : "Re-Run AI Analysis"}</span>
        </button>
      </div>

      {/* Quality Telemetry & Provider Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 space-y-1">
          <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Overall Quality Score</div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">96 / 100</div>
          <div className="text-[10px] text-emerald-600 font-semibold">✓ Meets Publisher Specification</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 space-y-1">
          <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Content Domain</div>
          <div className="text-base font-bold text-gray-900 dark:text-white">Academic Science Journal</div>
          <div className="text-[10px] text-gray-400">Grade: Post-Graduate</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 space-y-1">
          <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Active LLM Provider</div>
          <div className="text-base font-bold text-purple-600 dark:text-purple-400 flex items-center">
            <Cpu className="h-4 w-4 mr-1.5" />
            Gemini 1.5 Pro
          </div>
          <div className="text-[10px] text-gray-400">Fallback: GPT-4o</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 space-y-1">
          <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Tokens & Cost</div>
          <div className="text-base font-bold text-gray-900 dark:text-white font-mono">18,090 tokens</div>
          <div className="text-[10px] font-semibold text-emerald-600">$0.024 Estimated Cost</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Copilot Suggestions Queue (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <CopilotSuggestionsList />
        </div>

        {/* Right Column: Low Confidence Viewer & LLM Telemetry (1/3 width) */}
        <div className="space-y-6">
          <LowConfidenceViewer />

          {/* LLM Provider Status */}
          <div className="p-6 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-sm space-y-3 text-xs">
            <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-zinc-800 pb-2">
              Multi-LLM Router Status
            </h3>

            <div className="space-y-2">
              {[
                { name: "Google Gemini 1.5 Pro", status: "Active Primary", window: "2M tokens", speed: "420 t/s" },
                { name: "OpenAI GPT-4o", status: "Active Fallback", window: "128k tokens", speed: "310 t/s" },
                { name: "Anthropic Claude 3.5", status: "Standby", window: "200k tokens", speed: "380 t/s" },
                { name: "Local Ollama Llama-3", status: "Offline", window: "8k tokens", speed: "85 t/s" }
              ].map(p => (
                <div key={p.name} className="p-2.5 rounded-lg border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">{p.name}</div>
                    <div className="text-[10px] text-gray-400">{p.window} • {p.speed}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                    p.status.includes("Primary") ? "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300" :
                    p.status.includes("Fallback") ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300" :
                    "bg-gray-200 text-gray-700 dark:bg-zinc-800 dark:text-gray-400"
                  }`}>
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

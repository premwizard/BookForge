"use client";

import React, { useState } from "react";
import { 
  Sliders, Palette, Layout, Table, ShieldAlert, Sparkles, CheckCircle2, 
  AlertTriangle, ChevronRight, RefreshCw, Layers, Check, X, FileText
} from "lucide-react";

export type RightTab = "inspector" | "live_styles" | "page_layout" | "media" | "rules" | "ai";

interface RightSidebarProps {
  activeTab: RightTab;
  onTabChange: (tab: RightTab) => void;
  selectedElementId?: string;
  selectedElementType?: string;
  selectedStyles?: any;
}

export default function EditorRightSidebar({
  activeTab,
  onTabChange,
  selectedElementId = "p-1",
  selectedElementType = "paragraph",
  selectedStyles = {}
}: RightSidebarProps) {
  const [aiSuggestions, setAiSuggestions] = useState([
    { id: "ai-1", type: "FORMATTING", text: "Increase paragraph bottom margin from 6pt to 8pt to match Journal Template specification.", confidence: 0.94 },
    { id: "ai-2", type: "TYPOGRAPHY", text: "Font Garamond 11.5pt conforms with Publisher Science Group style blueprint.", confidence: 0.98 }
  ]);

  return (
    <div className="w-80 border-l border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col h-full select-none text-xs">
      {/* 6-Tab Header Icons */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 px-2 py-1.5 overflow-x-auto">
        <button 
          onClick={() => onTabChange("inspector")} 
          title="Typography & Inspector"
          className={`p-2 rounded transition-colors ${activeTab === "inspector" ? "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold" : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"}`}
        >
          <Sliders className="h-4 w-4" />
        </button>

        <button 
          onClick={() => onTabChange("live_styles")} 
          title="Live Style Inspector"
          className={`p-2 rounded transition-colors ${activeTab === "live_styles" ? "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold" : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"}`}
        >
          <Palette className="h-4 w-4" />
        </button>

        <button 
          onClick={() => onTabChange("page_layout")} 
          title="Page Layout Specs"
          className={`p-2 rounded transition-colors ${activeTab === "page_layout" ? "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold" : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"}`}
        >
          <Layout className="h-4 w-4" />
        </button>

        <button 
          onClick={() => onTabChange("media")} 
          title="Image & Table Inspector"
          className={`p-2 rounded transition-colors ${activeTab === "media" ? "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold" : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"}`}
        >
          <Table className="h-4 w-4" />
        </button>

        <button 
          onClick={() => onTabChange("rules")} 
          title="Publisher Rules Inspector"
          className={`p-2 rounded transition-colors ${activeTab === "rules" ? "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold" : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"}`}
        >
          <ShieldAlert className="h-4 w-4" />
        </button>

        <button 
          onClick={() => onTabChange("ai")} 
          title="AI Assistant Suggestions"
          className={`p-2 rounded transition-colors ${activeTab === "ai" ? "bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 font-bold" : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"}`}
        >
          <Sparkles className="h-4 w-4" />
        </button>
      </div>

      {/* Tab Body Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Tab 1: Inspector & Typography */}
        {activeTab === "inspector" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2 dark:border-zinc-800">
              <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[11px]">Inspector Panel</h3>
              <span className="font-mono text-[10px] text-blue-600">{selectedElementId}</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-gray-600 dark:text-gray-400 font-semibold mb-1">Font Family</label>
                <input 
                  type="text" 
                  value={selectedStyles.font_family || "Garamond"} 
                  readOnly 
                  className="w-full px-3 py-1.5 rounded border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 font-serif" 
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-600 dark:text-gray-400 font-semibold mb-1">Font Size (pt)</label>
                  <input type="text" value={`${selectedStyles.font_size_pt || 11.5} pt`} readOnly className="w-full px-2 py-1.5 rounded border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900" />
                </div>
                <div>
                  <label className="block text-gray-600 dark:text-gray-400 font-semibold mb-1">Line Height</label>
                  <input type="text" value={selectedStyles.line_height || "1.35"} readOnly className="w-full px-2 py-1.5 rounded border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900" />
                </div>
              </div>

              <div>
                <label className="block text-gray-600 dark:text-gray-400 font-semibold mb-1">First Line Indent</label>
                <input type="text" value="18 pt (0.25 in)" readOnly className="w-full px-3 py-1.5 rounded border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900" />
              </div>

              <div>
                <label className="block text-gray-600 dark:text-gray-400 font-semibold mb-1">Paragraph Spacing</label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" value="Before: 0pt" readOnly className="px-2 py-1 rounded border bg-gray-50 dark:bg-zinc-900 text-gray-600" />
                  <input type="text" value="After: 6pt" readOnly className="px-2 py-1 rounded border bg-gray-50 dark:bg-zinc-900 text-gray-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Live Style Inspector */}
        {activeTab === "live_styles" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2 dark:border-zinc-800">
              <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[11px]">Live Style Inspector</h3>
              <Palette className="h-4 w-4 text-blue-500" />
            </div>

            <div className="space-y-3">
              {/* Applied Style */}
              <div className="p-3 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20 space-y-1">
                <div className="font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider text-[10px]">1. Applied Direct Style</div>
                <div className="font-mono text-gray-800 dark:text-gray-200">font_weight: "normal", font_size_pt: 11.5</div>
              </div>

              {/* Computed Style */}
              <div className="p-3 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-1">
                <div className="font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider text-[10px]">2. Computed Style Result</div>
                <div className="font-mono text-gray-800 dark:text-gray-200">Garamond 11.5pt, line_height: 1.35, #000000</div>
              </div>

              {/* Inherited Style */}
              <div className="p-3 rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 space-y-1">
                <div className="font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider text-[10px]">3. Inherited Body Style</div>
                <div className="font-mono text-gray-600 dark:text-gray-400">Garamond 11.5pt from &lt;section-body&gt;</div>
              </div>

              {/* Blueprint Style */}
              <div className="p-3 rounded-lg border border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20 space-y-1">
                <div className="font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider text-[10px]">4. Blueprint Template Style</div>
                <div className="font-mono text-gray-800 dark:text-gray-200">Journal Standard Academic 2026</div>
              </div>

              {/* Rule Overrides */}
              <div className="p-3 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 space-y-1">
                <div className="font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider text-[10px] flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  5. Rule Overrides (0 Detected)
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  ✓ Matches Publisher Rules perfectly
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Page Layout */}
        {activeTab === "page_layout" && (
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[11px]">Page Layout Specs</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-gray-600 dark:text-gray-400 font-semibold mb-1">Paper Size</label>
                <select className="w-full px-3 py-1.5 rounded border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900">
                  <option value="A4">A4 (210 x 297 mm)</option>
                  <option value="LETTER">US Letter (8.5 x 11 in)</option>
                  <option value="TRADE">Trade Book (6 x 9 in)</option>
                  <option value="EXECUTIVE">Executive (7.25 x 10.5 in)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-600 dark:text-gray-400 font-semibold mb-1">Margins (in)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" value="Top: 1.0 in" readOnly className="px-2 py-1 rounded border bg-gray-50 dark:bg-zinc-900 text-gray-600" />
                  <input type="text" value="Bottom: 1.0 in" readOnly className="px-2 py-1 rounded border bg-gray-50 dark:bg-zinc-900 text-gray-600" />
                  <input type="text" value="Inside: 1.25 in" readOnly className="px-2 py-1 rounded border bg-gray-50 dark:bg-zinc-900 text-gray-600" />
                  <input type="text" value="Outside: 1.0 in" readOnly className="px-2 py-1 rounded border bg-gray-50 dark:bg-zinc-900 text-gray-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: AI Assistant Panel */}
        {activeTab === "ai" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2 dark:border-zinc-800">
              <h3 className="font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider text-[11px] flex items-center">
                <Sparkles className="h-4 w-4 mr-1 text-purple-500" />
                AI Assistant
              </h3>
              <span className="text-[10px] bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded font-semibold">Manual Approval</span>
            </div>

            <div className="space-y-3">
              {aiSuggestions.map(s => (
                <div key={s.id} className="p-3 rounded-lg border border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300">{s.type} SUGGESTION</span>
                    <span className="text-[10px] font-semibold text-emerald-600">{Math.round(s.confidence * 100)}% Confidence</span>
                  </div>

                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-[11px]">{s.text}</p>

                  <div className="flex items-center space-x-2 pt-1">
                    <button 
                      onClick={() => setAiSuggestions(aiSuggestions.filter(x => x.id !== s.id))}
                      className="flex-1 py-1 rounded bg-purple-600 hover:bg-purple-700 text-white font-semibold flex items-center justify-center"
                    >
                      <Check className="h-3 w-3 mr-1" /> Accept
                    </button>
                    <button 
                      onClick={() => setAiSuggestions(aiSuggestions.filter(x => x.id !== s.id))}
                      className="py-1 px-3 rounded border border-gray-300 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}

              {aiSuggestions.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-emerald-500 opacity-60" />
                  <p className="text-xs font-medium">All AI suggestions reviewed!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

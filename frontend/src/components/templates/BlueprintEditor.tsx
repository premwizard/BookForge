"use client";

import React, { useState } from "react";
import { Sliders, Type, Layout, ShieldAlert, Plus, CheckCircle2, Save, RefreshCw } from "lucide-react";

export default function BlueprintEditor({ templateId }: { templateId?: string }) {
  const [trimSize, setTrimSize] = useState("TRADE_6X9");
  const [marginTop, setMarginTop] = useState("1.0");
  const [marginInside, setMarginInside] = useState("1.25");
  const [marginOutside, setMarginOutside] = useState("1.0");
  const [marginBottom, setMarginBottom] = useState("1.0");

  const [styles, setStyles] = useState([
    { name: "Heading 1", font: "Garamond", size: 24, weight: "bold", color: "#111827", after: 12 },
    { name: "Heading 2", font: "Garamond", size: 18, weight: "bold", color: "#1F2937", after: 8 },
    { name: "Body Text", font: "Times New Roman", size: 11.5, weight: "normal", color: "#374151", after: 6 },
    { name: "Blockquote", font: "Inter", size: 10, weight: "italic", color: "#4B5563", after: 6 }
  ]);

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveBlueprint = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 800);
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Action Bar */}
      <div className="flex items-center justify-between bg-gray-50 dark:bg-zinc-900/60 p-4 rounded-xl border border-gray-200 dark:border-zinc-800">
        <div>
          <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Visual Blueprint Editor</h2>
          <p className="text-gray-500">Configure machine-readable typography and layout geometry specs.</p>
        </div>

        <button
          onClick={handleSaveBlueprint}
          disabled={isSaving}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow flex items-center space-x-1.5"
        >
          {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          <span>{isSaving ? "Saving Version..." : "Save Blueprint Snapshot"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Page Geometry & Trim Specs (1/3) */}
        <div className="p-5 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b pb-3 dark:border-zinc-800">
            <Layout className="h-4 w-4 text-blue-600" />
            <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider">1. Page Geometry Specs</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Standard Trim Size</label>
              <select 
                value={trimSize}
                onChange={(e) => setTrimSize(e.target.value)}
                className="w-full px-3 py-1.5 rounded border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 font-medium text-gray-900 dark:text-white"
              >
                <option value="TRADE_6X9">Trade Book (6 x 9 in)</option>
                <option value="A4">A4 (210 x 297 mm)</option>
                <option value="LETTER">US Letter (8.5 x 11 in)</option>
                <option value="EXECUTIVE">Executive (7.25 x 10.5 in)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-gray-500 mb-1">Top Margin (in)</label>
                <input type="text" value={marginTop} onChange={(e) => setMarginTop(e.target.value)} className="w-full px-2 py-1 rounded border bg-gray-50 dark:bg-zinc-900" />
              </div>
              <div>
                <label className="block text-gray-500 mb-1">Bottom Margin (in)</label>
                <input type="text" value={marginBottom} onChange={(e) => setMarginBottom(e.target.value)} className="w-full px-2 py-1 rounded border bg-gray-50 dark:bg-zinc-900" />
              </div>
              <div>
                <label className="block text-gray-500 mb-1">Inside Gutter (in)</label>
                <input type="text" value={marginInside} onChange={(e) => setMarginInside(e.target.value)} className="w-full px-2 py-1 rounded border bg-gray-50 dark:bg-zinc-900" />
              </div>
              <div>
                <label className="block text-gray-500 mb-1">Outside Margin (in)</label>
                <input type="text" value={marginOutside} onChange={(e) => setMarginOutside(e.target.value)} className="w-full px-2 py-1 rounded border bg-gray-50 dark:bg-zinc-900" />
              </div>
            </div>
          </div>
        </div>

        {/* Typography Hierarchy Manager (2/3) */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3 dark:border-zinc-800">
            <div className="flex items-center space-x-2">
              <Type className="h-4 w-4 text-blue-600" />
              <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider">2. Typography Hierarchy Specifications</h3>
            </div>
            <button className="px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold flex items-center">
              <Plus className="h-3 w-3 mr-1" /> Add Style
            </button>
          </div>

          <div className="space-y-3">
            {styles.map((st, i) => (
              <div key={i} className="p-3 rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 flex items-center justify-between gap-4">
                <div className="w-32">
                  <div className="font-bold text-gray-900 dark:text-white">{st.name}</div>
                  <div className="text-[10px] text-gray-400">Target Style</div>
                </div>

                <div className="grid grid-cols-4 gap-2 flex-1">
                  <div>
                    <span className="text-[10px] text-gray-400">Font</span>
                    <input type="text" value={st.font} readOnly className="w-full px-2 py-1 rounded border bg-white dark:bg-zinc-950 font-serif" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400">Size (pt)</span>
                    <input type="text" value={`${st.size} pt`} readOnly className="w-full px-2 py-1 rounded border bg-white dark:bg-zinc-950" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400">Weight</span>
                    <input type="text" value={st.weight} readOnly className="w-full px-2 py-1 rounded border bg-white dark:bg-zinc-950 capitalize" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400">After Spacing</span>
                    <input type="text" value={`${st.after} pt`} readOnly className="w-full px-2 py-1 rounded border bg-white dark:bg-zinc-950" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

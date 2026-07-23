"use client";

import React, { useState } from "react";
import BlueprintEditor from "@/components/templates/BlueprintEditor";
import StyleMappingStudio from "@/components/templates/StyleMappingStudio";
import { 
  LayoutTemplate, Settings, Layers, Sparkles, History, Code2, 
  CheckCircle2, ChevronLeft, ArrowLeft, Upload, FileText
} from "lucide-react";
import Link from "next/link";

export default function TemplateDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<"editor" | "mappings" | "versions" | "raw">("editor");

  const sampleJson = {
    template_name: "Penguin Standard Academic 6x9",
    category: "Academic & Fiction",
    version: 2,
    page_geometry: {
      trim_size: "6x9 in",
      margin_top_in: 1.0,
      margin_bottom_in: 1.0,
      margin_inside_in: 1.25,
      margin_outside_in: 1.0
    },
    styles: [
      { style_name: "Heading 1", font_family: "Garamond", font_size_pt: 24, font_weight: "bold" },
      { style_name: "Heading 2", font_family: "Garamond", font_size_pt: 18, font_weight: "bold" },
      { style_name: "Body Text", font_family: "Times New Roman", font_size_pt: 11.5, line_height: 1.35 }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Back Link & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-950 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
        <div className="space-y-1">
          <Link href="/dashboard/templates" className="inline-flex items-center text-xs font-semibold text-blue-600 hover:underline mb-1">
            <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to Template Library
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <LayoutTemplate className="h-7 w-7 text-blue-600 dark:text-blue-400 mr-2" />
            Penguin Standard Academic 6x9 Master Blueprint
          </h1>
          <p className="text-gray-500 text-xs">
            Machine-readable layout blueprint specification (`v2.0`) • 5 Extracted Typography Styles • Active
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
            ✓ Active Master Blueprint
          </span>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex items-center space-x-2 border-b border-gray-200 dark:border-zinc-800 pb-1 text-xs">
        <button
          onClick={() => setActiveTab("editor")}
          className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${
            activeTab === "editor"
              ? "bg-blue-600 text-white shadow"
              : "bg-white dark:bg-zinc-950 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-900"
          }`}
        >
          <Settings className="h-4 w-4" />
          <span>Visual Blueprint Editor</span>
        </button>

        <button
          onClick={() => setActiveTab("mappings")}
          className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${
            activeTab === "mappings"
              ? "bg-blue-600 text-white shadow"
              : "bg-white dark:bg-zinc-950 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-900"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>AI Style Mappings</span>
        </button>

        <button
          onClick={() => setActiveTab("versions")}
          className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${
            activeTab === "versions"
              ? "bg-blue-600 text-white shadow"
              : "bg-white dark:bg-zinc-950 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-900"
          }`}
        >
          <History className="h-4 w-4" />
          <span>Version Snapshots</span>
        </button>

        <button
          onClick={() => setActiveTab("raw")}
          className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${
            activeTab === "raw"
              ? "bg-blue-600 text-white shadow"
              : "bg-white dark:bg-zinc-950 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-900"
          }`}
        >
          <Code2 className="h-4 w-4" />
          <span>Raw `.blueprint.json` AST</span>
        </button>
      </div>

      {/* Tab Body Content */}
      {activeTab === "editor" && <BlueprintEditor templateId={params.id} />}
      {activeTab === "mappings" && <StyleMappingStudio templateId={params.id} />}

      {activeTab === "versions" && (
        <div className="p-6 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 space-y-4 text-xs">
          <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-sm">Blueprint Version History</h3>
          <div className="space-y-3">
            {[
              { version: "v2.0", date: "Today 10:45 AM", author: "Dr. Aris Thorne", notes: "Updated Garamond headings spacing after." },
              { version: "v1.0", date: "Yesterday 4:20 PM", author: "Elena Vance", notes: "Initial DOCX blueprint extraction." }
            ].map(v => (
              <div key={v.version} className="p-4 rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 flex items-center justify-between">
                <div>
                  <div className="font-bold text-blue-600 text-sm">{v.version}</div>
                  <div className="text-gray-700 dark:text-gray-300 mt-1">{v.notes}</div>
                  <div className="text-[10px] text-gray-400 mt-1">Created by {v.author} • {v.date}</div>
                </div>

                <button className="px-3 py-1.5 rounded border border-gray-300 dark:border-zinc-700 font-semibold hover:bg-gray-100 dark:hover:bg-zinc-800">
                  Diff Version
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "raw" && (
        <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-blue-400 space-y-2 overflow-x-auto">
          <div className="text-zinc-500 font-bold uppercase text-[10px] pb-2 border-b border-zinc-800">
            // Definitive Machine-Readable Format Specification AST
          </div>
          <pre>{JSON.stringify(sampleJson, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

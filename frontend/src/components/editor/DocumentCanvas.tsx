"use client";

import React, { useState } from "react";
import { ViewMode } from "./EditorTopToolbar";
import { User, Sparkles, Layers, BookOpen, AlertCircle, CornerDownRight } from "lucide-react";

interface DocumentCanvasProps {
  viewMode: ViewMode;
  zoom: number;
  onSelectElement?: (elementId: string, elementType: string, styles: any) => void;
}

export default function DocumentCanvas({
  viewMode,
  zoom,
  onSelectElement
}: DocumentCanvasProps) {
  const [activeElementId, setActiveElementId] = useState<string>("p-1");

  const handleElementClick = (id: string, type: string, styles: any) => {
    setActiveElementId(id);
    onSelectElement?.(id, type, styles);
  };

  // Compute container class based on view mode
  const isSpread = viewMode === "SPREAD";
  const isBook = viewMode === "BOOK";

  return (
    <div className="flex-1 bg-gray-200 dark:bg-zinc-900/80 overflow-auto p-8 flex flex-col items-center justify-start select-text relative">
      <div 
        className={`transition-all duration-300 ${
          isSpread || isBook ? "flex flex-row space-x-6 justify-center" : "flex flex-col space-y-8 items-center"
        }`}
        style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}
      >
        {/* PAGE 1 */}
        <div 
          className="w-[800px] min-h-[1050px] bg-white dark:bg-zinc-950 text-gray-900 dark:text-gray-100 shadow-xl border border-gray-300 dark:border-zinc-800 p-16 relative flex flex-col justify-between"
        >
          {/* Header */}
          <div className="flex justify-between items-center text-[10px] text-gray-400 border-b border-gray-100 dark:border-zinc-900 pb-2 mb-8 font-serif uppercase tracking-widest">
            <span>JOURNAL OF QUANTUM PUBLISHING</span>
            <span>VOL. 42 • ISSUE 3</span>
          </div>

          {/* Page Content Body */}
          <div className="space-y-6 flex-1 font-serif text-base leading-relaxed">
            {/* Title Node */}
            <div 
              onClick={() => handleElementClick("title-1", "heading-1", { font_size_pt: 24, font_weight: "bold", font_family: "Garamond" })}
              className={`p-2 rounded border transition-all cursor-pointer ${
                activeElementId === "title-1" ? "ring-2 ring-blue-500 bg-blue-50/20 dark:bg-blue-950/20" : "hover:border-blue-200"
              }`}
            >
              <h1 className="text-3xl font-bold font-serif tracking-tight text-gray-900 dark:text-white">
                Quantum Mechanical Document Layouts & High-Speed DTP Orchestration
              </h1>
              <p className="text-sm font-sans text-gray-500 mt-2">
                By Dr. Aris Thorne & Elena Vance • Publisher Science Group
              </p>
            </div>

            {/* Section 1 Node */}
            <div 
              onClick={() => handleElementClick("sec-1", "heading-2", { font_size_pt: 18, font_weight: "bold", font_family: "Garamond" })}
              className={`p-2 rounded border transition-all cursor-pointer ${
                activeElementId === "sec-1" ? "ring-2 ring-blue-500 bg-blue-50/20 dark:bg-blue-950/20" : "hover:border-blue-200"
              }`}
            >
              <h2 className="text-xl font-bold font-serif text-gray-900 dark:text-gray-100 mt-4 mb-2">
                1. Executive Introduction & Architecture Overview
              </h2>
            </div>

            {/* Paragraph 1 Node */}
            <div 
              onClick={() => handleElementClick("p-1", "paragraph", { font_size_pt: 11.5, font_family: "Garamond", line_height: 1.35 })}
              className={`p-2 rounded border transition-all cursor-pointer relative ${
                activeElementId === "p-1" ? "ring-2 ring-blue-500 bg-blue-50/20 dark:bg-blue-950/20" : "hover:border-blue-200"
              }`}
            >
              <p className="indent-6 text-justify">
                Modern publication engineering requires deterministic control over typography, multi-column flow, drop caps, and strict rule validation without sacrificing user experience. By leveraging an Internal Document Model (IFDM) operating as replayable operational transforms, DocForge coordinates every step of the publishing pipeline from virus scanning to PDF/A archive generation.
              </p>

              {/* Simulated Collaborator Live Cursor */}
              <div className="absolute top-2 right-12 flex items-center space-x-1 bg-purple-600 text-white text-[9px] px-1.5 py-0.5 rounded shadow animate-bounce">
                <User className="h-3 w-3 mr-0.5" /> Elena Vance editing...
              </div>
            </div>

            {/* Paragraph 2 Node with Drop Cap */}
            <div 
              onClick={() => handleElementClick("p-2", "paragraph", { font_size_pt: 11.5, font_family: "Garamond", drop_cap: true })}
              className={`p-2 rounded border transition-all cursor-pointer ${
                activeElementId === "p-2" ? "ring-2 ring-blue-500 bg-blue-50/20 dark:bg-blue-950/20" : "hover:border-blue-200"
              }`}
            >
              <p className="indent-6 text-justify">
                <span className="float-left text-4xl font-bold font-serif pr-2 leading-none text-blue-600 dark:text-blue-400">T</span>
                he integration of live computed style inspection guarantees that every paragraph adheres strictly to publisher templates. Authors receive instant feedback on broken cross-references, citation violations, and layout overflows before exporting final EPUB or print PDF assets.
              </p>
            </div>

            {/* Academic Table Node */}
            <div 
              onClick={() => handleElementClick("tbl-1", "table", { border_width: 1, table_style: "Academic Grid" })}
              className={`p-3 rounded border transition-all cursor-pointer my-4 ${
                activeElementId === "tbl-1" ? "ring-2 ring-blue-500 bg-blue-50/20 dark:bg-blue-950/20" : "hover:border-blue-200"
              }`}
            >
              <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Table 1.1: Performance Telemetry Benchmarks</div>
              <table className="w-full text-xs border-collapse border border-gray-300 dark:border-zinc-700 font-sans">
                <thead>
                  <tr className="bg-gray-100 dark:bg-zinc-900 border-b border-gray-300 dark:border-zinc-700">
                    <th className="p-2 text-left border-r border-gray-300 dark:border-zinc-700">Pipeline Stage</th>
                    <th className="p-2 text-left border-r border-gray-300 dark:border-zinc-700">Execution Engine</th>
                    <th className="p-2 text-left">Avg Latency</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200 dark:border-zinc-800">
                    <td className="p-2 border-r border-gray-200 dark:border-zinc-800">Document Parsing</td>
                    <td className="p-2 border-r border-gray-200 dark:border-zinc-800">CPU Parser Core</td>
                    <td className="p-2 font-mono text-emerald-600">42 ms</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-gray-200 dark:border-zinc-800">Layout Calculation</td>
                    <td className="p-2 border-r border-gray-200 dark:border-zinc-800">GPU Layout Cluster</td>
                    <td className="p-2 font-mono text-emerald-600">18 ms</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center text-[10px] text-gray-400 border-t border-gray-100 dark:border-zinc-900 pt-2 mt-8 font-serif">
            <span>DocForge DTP Studio</span>
            <span className="font-bold text-gray-700 dark:text-gray-300">Page 1</span>
          </div>
        </div>

        {/* SPREAD VIEW SECOND PAGE */}
        {(isSpread || isBook) && (
          <div 
            className="w-[800px] min-h-[1050px] bg-white dark:bg-zinc-950 text-gray-900 dark:text-gray-100 shadow-xl border border-gray-300 dark:border-zinc-800 p-16 relative flex flex-col justify-between"
          >
            {/* Header */}
            <div className="flex justify-between items-center text-[10px] text-gray-400 border-b border-gray-100 dark:border-zinc-900 pb-2 mb-8 font-serif uppercase tracking-widest">
              <span>QUANTUM LAYOUT ENGINE</span>
              <span>PAGE 2</span>
            </div>

            {/* Page Content Body */}
            <div className="space-y-6 flex-1 font-serif text-base leading-relaxed">
              <div 
                onClick={() => handleElementClick("sec-2", "heading-2", { font_size_pt: 18, font_weight: "bold" })}
                className={`p-2 rounded border transition-all cursor-pointer ${
                  activeElementId === "sec-2" ? "ring-2 ring-blue-500 bg-blue-50/20 dark:bg-blue-950/20" : "hover:border-blue-200"
                }`}
              >
                <h2 className="text-xl font-bold font-serif text-gray-900 dark:text-gray-100">
                  2. Operational Transform Replays & Style Overrides
                </h2>
              </div>

              <div 
                onClick={() => handleElementClick("p-3", "paragraph", { font_size_pt: 11.5 })}
                className={`p-2 rounded border transition-all cursor-pointer ${
                  activeElementId === "p-3" ? "ring-2 ring-blue-500 bg-blue-50/20 dark:bg-blue-950/20" : "hover:border-blue-200"
                }`}
              >
                <p className="indent-6 text-justify">
                  Every user edit is executed as a atomic operational transform (OT). This guarantees that concurrent editing sessions by multiple reviewers remain synchronized without data loss or race conditions.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center text-[10px] text-gray-400 border-t border-gray-100 dark:border-zinc-900 pt-2 mt-8 font-serif">
              <span>DocForge DTP Studio</span>
              <span className="font-bold text-gray-700 dark:text-gray-300">Page 2</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

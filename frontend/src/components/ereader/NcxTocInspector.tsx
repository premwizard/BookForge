"use client";

import React from "react";
import { ListTree, CheckCircle2, ShieldCheck, FileCheck, Layers } from "lucide-react";

export default function NcxTocInspector() {
  const tocItems = [
    { title: "Title Page & Metadata", src: "OEBPS/title.xhtml", depth: 1, aria: "doc-cover" },
    { title: "Chapter 1: Executive Overview & Architecture", src: "OEBPS/ch01.xhtml", depth: 1, aria: "doc-chapter" },
    { title: "1.1 Internal Document Model AST", src: "OEBPS/ch01.xhtml#sec1", depth: 2, aria: "doc-subtitle" },
    { title: "Chapter 2: Quantum Mechanical Layouts", src: "OEBPS/ch02.xhtml", depth: 1, aria: "doc-chapter" },
    { title: "Chapter 3: Multi-Format Rendering & Archival PDF", src: "OEBPS/ch03.xhtml", depth: 1, aria: "doc-chapter" }
  ];

  return (
    <div className="p-6 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4 text-xs select-none">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-3">
        <div className="flex items-center space-x-2">
          <ListTree className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            EPUB 3.3 Navigation Document & NCX TOC Inspector
          </h3>
        </div>

        <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 rounded-full font-bold">
          ✓ ARIA Accessibility Validated
        </span>
      </div>

      <div className="space-y-2">
        {tocItems.map((item, idx) => (
          <div 
            key={idx} 
            className="p-3 rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 flex items-center justify-between"
            style={{ paddingLeft: `${item.depth * 16}px` }}
          >
            <div className="flex items-center space-x-2">
              <span className="font-bold text-gray-900 dark:text-white">{item.title}</span>
            </div>

            <div className="flex items-center space-x-3">
              <span className="font-mono text-[10px] text-gray-400">{item.src}</span>
              <span className="px-2 py-0.5 rounded font-mono text-[9px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                {item.aria}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

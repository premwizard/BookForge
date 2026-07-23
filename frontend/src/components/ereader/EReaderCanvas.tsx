"use client";

import React, { useState } from "react";
import { Tablet, Smartphone, Sun, Moon, BookOpen, ChevronLeft, ChevronRight, Type, CheckCircle2 } from "lucide-react";

export default function EReaderCanvas() {
  const [device, setDevice] = useState<"kindle" | "ipad" | "phone">("kindle");
  const [theme, setTheme] = useState<"DAY" | "SEPIA" | "NIGHT" | "E_INK">("E_INK");
  const [fontFamily, setFontFamily] = useState("Bookerly");
  const [fontSizePt, setFontSizePt] = useState(14);
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="p-6 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4 text-xs select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-zinc-800 pb-3">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            Multi-Device E-Reader Hardware Emulator
          </h3>
        </div>

        <div className="flex items-center space-x-2">
          {/* Device Target Switcher */}
          <button
            onClick={() => { setDevice("kindle"); setTheme("E_INK"); }}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1 transition-all ${
              device === "kindle" ? "bg-emerald-600 text-white shadow" : "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300"
            }`}
          >
            <Tablet className="h-3.5 w-3.5" />
            <span>Kindle Paperwhite</span>
          </button>

          <button
            onClick={() => { setDevice("ipad"); setTheme("DAY"); }}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1 transition-all ${
              device === "ipad" ? "bg-emerald-600 text-white shadow" : "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300"
            }`}
          >
            <Tablet className="h-3.5 w-3.5" />
            <span>Apple iPad Retina</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Font Family, Font Size, Theme */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <Type className="h-4 w-4 text-gray-400" />
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 font-bold"
            >
              <option value="Bookerly">Amazon Bookerly</option>
              <option value="Garamond">Adobe Garamond</option>
              <option value="Georgia">Georgia</option>
              <option value="San Francisco">SF Pro (Apple Books)</option>
            </select>
          </div>

          <div className="flex items-center space-x-1">
            <button onClick={() => setFontSizePt(Math.max(10, fontSizePt - 1))} className="px-2 py-1 bg-white dark:bg-zinc-950 border rounded font-bold">A-</button>
            <span className="font-mono font-bold px-1">{fontSizePt}pt</span>
            <button onClick={() => setFontSizePt(Math.min(24, fontSizePt + 1))} className="px-2 py-1 bg-white dark:bg-zinc-950 border rounded font-bold">A+</button>
          </div>
        </div>

        {/* Theme Switcher Buttons */}
        <div className="flex items-center space-x-1.5">
          <button onClick={() => setTheme("DAY")} className={`px-2.5 py-1 rounded font-bold border ${theme === "DAY" ? "border-emerald-600 bg-white text-gray-900" : "bg-gray-100 dark:bg-zinc-800"}`}>Day</button>
          <button onClick={() => setTheme("SEPIA")} className={`px-2.5 py-1 rounded font-bold border ${theme === "SEPIA" ? "border-amber-600 bg-amber-100 text-amber-900" : "bg-gray-100 dark:bg-zinc-800"}`}>Sepia</button>
          <button onClick={() => setTheme("NIGHT")} className={`px-2.5 py-1 rounded font-bold border ${theme === "NIGHT" ? "border-indigo-600 bg-zinc-900 text-white" : "bg-gray-100 dark:bg-zinc-800"}`}>Night</button>
          <button onClick={() => setTheme("E_INK")} className={`px-2.5 py-1 rounded font-bold border ${theme === "E_INK" ? "border-emerald-600 bg-stone-200 text-stone-900" : "bg-gray-100 dark:bg-zinc-800"}`}>E-Ink</button>
        </div>
      </div>

      {/* Hardware Frame Preview Canvas */}
      <div className="p-8 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-100 dark:bg-zinc-900 flex justify-center items-center relative overflow-hidden">
        {/* Physical Device Outer Frame */}
        <div className={`transition-all shadow-2xl relative p-6 border-4 border-gray-800 ${
          device === "kindle" ? "w-[340px] min-h-[460px] rounded-3xl bg-stone-900" :
          device === "ipad" ? "w-[420px] min-h-[520px] rounded-2xl bg-zinc-800" :
          "w-[280px] min-h-[480px] rounded-3xl bg-black"
        }`}>
          {/* E-Reader Screen */}
          <div 
            className={`w-full min-h-[400px] p-6 rounded transition-all space-y-4 flex flex-col justify-between ${
              theme === "DAY" ? "bg-white text-gray-900" :
              theme === "SEPIA" ? "bg-[#fbf0d9] text-[#5f4b32]" :
              theme === "NIGHT" ? "bg-zinc-950 text-gray-100" :
              "bg-[#e3e3e0] text-black font-serif"
            }`}
            style={{ fontFamily: fontFamily, fontSize: `${fontSizePt}px` }}
          >
            <div className="space-y-3">
              <div className="text-[10px] opacity-60 uppercase font-sans tracking-wider border-b pb-1">
                {device === "kindle" ? "Kindle Paperwhite (300 PPI E-Ink)" : "Apple Books - EPUB 3.3"}
              </div>

              <h3 className="font-bold text-base">Chapter 1: Executive Overview & Architecture</h3>

              <p className="leading-relaxed">
                The fundamental architecture of DocForge relies on deterministic Internal Formatting Document Model (IFDM) AST nodes to deliver press-ready publishing output across print, digital ebook, and Web streams.
              </p>
            </div>

            {/* E-Reader Footer & Page Turns */}
            <div className="flex items-center justify-between text-[10px] opacity-70 font-sans border-t pt-2">
              <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} className="flex items-center hover:opacity-100">
                <ChevronLeft className="h-3.5 w-3.5 mr-0.5" /> Prev
              </button>
              <span>Page {currentPage} of 14 • 8% Read</span>
              <button onClick={() => setCurrentPage(currentPage + 1)} className="flex items-center hover:opacity-100">
                Next <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

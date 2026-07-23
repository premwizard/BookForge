"use client";

import React, { useState } from "react";
import { Search, Filter, BookOpen, Tag, Download, CheckCircle2 } from "lucide-react";

export default function CatalogSearchMatrix() {
  const [query, setQuery] = useState("");
  const [bisacFilter, setBisacFilter] = useState("ALL");

  const catalogItems = [
    { id: "cat-1", title: "Quantum Layout Mechanics Vol. 1", authors: "Dr. Aris Thorne", bisac: "SCI055000 SCIENCE / Physics", dewey: "530.12", isbn: "978-3-16-148410-0", words: "58,400" },
    { id: "cat-2", title: "High-Volume Digital Publishing Pipelines", authors: "Elena Rostova", bisac: "COM060000 COMPUTERS / Publishing", dewey: "005.52", isbn: "978-1-56619-909-4", words: "72,100" },
    { id: "cat-3", title: "Advanced Typography & Grid Geometry", authors: "Marcus Vance", bisac: "DES007000 DESIGN / Graphic Arts", dewey: "686.22", isbn: "978-0-262-51087-5", words: "49,800" }
  ];

  const filteredItems = catalogItems.filter(item => {
    const matchesQuery = item.title.toLowerCase().includes(query.toLowerCase()) || item.authors.toLowerCase().includes(query.toLowerCase()) || item.isbn.includes(query);
    const matchesBisac = bisacFilter === "ALL" || item.bisac.includes(bisacFilter);
    return matchesQuery && matchesBisac;
  });

  return (
    <div className="p-6 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4 text-xs select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-zinc-800 pb-3">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-5 w-5 text-sky-600 dark:text-sky-400" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            Ingested Enterprise Catalog Search Matrix
          </h3>
        </div>

        <button className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center space-x-1 shadow-sm">
          <Download className="h-3.5 w-3.5" />
          <span>Batch Export All Filtered ({filteredItems.length})</span>
        </button>
      </div>

      {/* Search & BISAC Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="h-4 w-4 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Title, Author, or ISBN-13..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white font-medium"
          />
        </div>

        <select
          value={bisacFilter}
          onChange={(e) => setBisacFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white font-bold"
        >
          <option value="ALL">All BISAC Categories</option>
          <option value="SCIENCE">Science / Physics</option>
          <option value="COMPUTERS">Computers / Publishing</option>
          <option value="DESIGN">Design / Graphic Arts</option>
        </select>
      </div>

      {/* Catalog Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredItems.map(item => (
          <div key={item.id} className="p-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 space-y-2 hover:border-sky-400 transition-all">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 px-2 py-0.5 rounded font-bold">
                Dewey: {item.dewey}
              </span>
              <span className="font-mono text-[10px] text-gray-400">{item.words} Words</span>
            </div>

            <h4 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">{item.title}</h4>
            <div className="text-[11px] text-gray-500 font-semibold">{item.authors}</div>

            <div className="text-[10px] text-gray-600 dark:text-gray-400 font-mono border-t pt-2 dark:border-zinc-800">
              ISBN: {item.isbn}
            </div>

            <div className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold truncate">
              {item.bisac}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

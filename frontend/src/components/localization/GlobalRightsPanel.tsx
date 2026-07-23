"use client";

import React, { useState } from "react";
import { ShieldCheck, Plus, Globe, CheckCircle2, DollarSign, Building } from "lucide-react";

export interface GlobalRightsItem {
  id: string;
  territory: string;
  publisher: string;
  language: string;
  isbn: string;
  royalty: number;
  status: string;
}

export default function GlobalRightsPanel() {
  const [rights, setRights] = useState<GlobalRightsItem[]>([
    { id: "rig-1", territory: "DE_AT_CH", publisher: "Springer Science Germany", language: "German (de)", isbn: "978-3-16-148410-0", royalty: 14.0, status: "Active" },
    { id: "rig-2", territory: "JP_APAC", publisher: "Maruzen Publishing Japan", language: "Japanese (ja)", isbn: "978-4-88373-120-1", royalty: 12.5, status: "Active" },
    { id: "rig-3", territory: "FR_EU", publisher: "Hachette Livre France", language: "French (fr)", isbn: "978-2-01-234567-8", royalty: 12.0, status: "Pending License" }
  ]);

  const [newTerritory, setNewTerritory] = useState("");
  const [newPublisher, setNewPublisher] = useState("");
  const [newLanguage, setNewLanguage] = useState("de");

  const handleAddRights = () => {
    if (!newTerritory.trim() || !newPublisher.trim()) return;
    const item: GlobalRightsItem = {
      id: `rig-${Date.now()}`,
      territory: newTerritory.toUpperCase(),
      publisher: newPublisher,
      language: newLanguage,
      isbn: `978-3-${Math.floor(100000 + Math.random() * 900000)}`,
      royalty: 12.5,
      status: "Active"
    };
    setRights([item, ...rights]);
    setNewTerritory("");
    setNewPublisher("");
  };

  return (
    <div className="p-6 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4 text-xs">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-3">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            International Rights & Territory Licensing
          </h3>
        </div>
        <span className="text-[10px] bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-2.5 py-0.5 rounded-full font-bold">
          Global ISBN Variant Tracking
        </span>
      </div>

      {/* Add Licensing Form */}
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <input 
          type="text" 
          placeholder="Territory Code (e.g. DE_AT_CH, JP_APAC)"
          value={newTerritory}
          onChange={(e) => setNewTerritory(e.target.value)}
          className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white font-medium"
        />
        <input 
          type="text" 
          placeholder="Licensed Publisher (e.g. Springer Nature)"
          value={newPublisher}
          onChange={(e) => setNewPublisher(e.target.value)}
          className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white font-medium"
        />
        <button
          onClick={handleAddRights}
          disabled={!newTerritory.trim() || !newPublisher.trim()}
          className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center space-x-1 shadow-sm"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Rights License</span>
        </button>
      </div>

      {/* Rights Table */}
      <div className="border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-gray-50 dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 text-gray-500 font-bold uppercase text-[10px]">
            <tr>
              <th className="px-4 py-2.5">Territory Code</th>
              <th className="px-4 py-2.5">Licensed Publisher</th>
              <th className="px-4 py-2.5">Territory ISBN-13</th>
              <th className="px-4 py-2.5">Royalty Split</th>
              <th className="px-4 py-2.5 text-right">License Status</th>
            </tr>
          </thead>
          <tbody>
            {rights.map(r => (
              <tr key={r.id} className="border-b border-gray-100 dark:border-zinc-800/50 hover:bg-gray-50 dark:hover:bg-zinc-900/50">
                <td className="px-4 py-2.5 font-bold font-mono text-purple-600 dark:text-purple-400">{r.territory}</td>
                <td className="px-4 py-2.5 font-bold text-gray-900 dark:text-white">{r.publisher}</td>
                <td className="px-4 py-2.5 font-mono text-gray-600 dark:text-gray-400">{r.isbn}</td>
                <td className="px-4 py-2.5 font-semibold text-emerald-600">{r.royalty}% Net</td>
                <td className="px-4 py-2.5 text-right">
                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                    r.status === "Active" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" :
                    "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                  }`}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

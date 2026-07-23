"use client";

import React, { useState } from "react";
import { Calculator, DollarSign, BookOpen, Sliders, CheckCircle2, ArrowRight } from "lucide-react";

export default function SpineCostCalculator() {
  const [pageCount, setPageCount] = useState(280);
  const [paperStock, setPaperStock] = useState("60lb Cream");
  const [retailPrice, setRetailPrice] = useState(19.99);

  // PPI multipliers
  const ppi = paperStock === "50lb White" ? 500 : paperStock === "60lb Cream" ? 444 : 380;
  const spineIn = (pageCount / ppi).toFixed(3);
  const spineMm = (parseFloat(spineIn) * 25.4).toFixed(2);
  const printCost = (1.00 + pageCount * 0.012).toFixed(2);
  const retailerCut = (retailPrice * 0.40).toFixed(2);
  const netRoyalty = Math.max(0, retailPrice - parseFloat(retailerCut) - parseFloat(printCost)).toFixed(2);
  const marginPercent = ((parseFloat(netRoyalty) / retailPrice) * 100).toFixed(1);

  return (
    <div className="p-6 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4 text-xs select-none">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-3">
        <div className="flex items-center space-x-2">
          <Calculator className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            POD Spine Width & Unit Economics Calculator
          </h3>
        </div>

        <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 rounded-full font-bold">
          Amazon KDP & IngramSpark Formula
        </span>
      </div>

      {/* Calculator Sliders & Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900">
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-bold mb-1">
            Manuscript Page Count: <span className="text-emerald-600">{pageCount} pages</span>
          </label>
          <input 
            type="range" 
            min="48" 
            max="800" 
            step="4" 
            value={pageCount} 
            onChange={(e) => setPageCount(parseInt(e.target.value))}
            className="w-full accent-emerald-600"
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-bold mb-1">Paper Stock Weight</label>
          <select
            value={paperStock}
            onChange={(e) => setPaperStock(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-gray-900 dark:text-white font-bold"
          >
            <option value="50lb White">50lb White (Standard - 500 PPI)</option>
            <option value="60lb Cream">60lb Cream (Premium Fiction - 444 PPI)</option>
            <option value="70lb Color">70lb Color (Illustrated - 380 PPI)</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-bold mb-1">List Retail Price ($ USD)</label>
          <input 
            type="number" 
            step="0.50"
            value={retailPrice} 
            onChange={(e) => setRetailPrice(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-gray-900 dark:text-white font-bold"
          />
        </div>
      </div>

      {/* Calculated Results Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 space-y-1">
          <div className="text-[10px] text-gray-500 font-bold uppercase">Calculated Spine Width</div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">{spineIn} in <span className="text-xs text-gray-400">({spineMm} mm)</span></div>
          <div className="text-[9px] text-gray-400">Cover Template Ready</div>
        </div>

        <div className="p-3.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 space-y-1">
          <div className="text-[10px] text-gray-500 font-bold uppercase">Unit Print Cost</div>
          <div className="text-lg font-bold text-amber-600 dark:text-amber-400">${printCost} / book</div>
          <div className="text-[9px] text-gray-400">Fixed $1.00 + $0.012/page</div>
        </div>

        <div className="p-3.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 space-y-1">
          <div className="text-[10px] text-gray-500 font-bold uppercase">Retailer Channel Cut (40%)</div>
          <div className="text-lg font-bold text-gray-700 dark:text-gray-300">${retailerCut}</div>
          <div className="text-[9px] text-gray-400">Amazon / Retail Margin</div>
        </div>

        <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-1">
          <div className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold uppercase">Net Author Royalty</div>
          <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">${netRoyalty} / copy</div>
          <div className="text-[9px] text-emerald-600 font-bold">{marginPercent}% Profit Margin</div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Share2, DollarSign, CheckCircle2, Globe, Users, CreditCard } from "lucide-react";

export default function PodChannelMatrix() {
  const [channels] = useState([
    { id: "ch-kdp", name: "Amazon KDP Direct", units_sold: 280, gross: "$5,597.20", net_payout: "$2,195.20", status: "Live" },
    { id: "ch-ingram", name: "IngramSpark Global Network", units_sold: 132, gross: "$2,638.68", net_payout: "$1,034.88", status: "Live" },
    { id: "ch-lulu", name: "Lulu Press Direct", units_sold: 0, gross: "$0.00", net_payout: "$0.00", status: "Draft" }
  ]);

  const [splits] = useState([
    { id: "sp-1", contributor: "Dr. Aris Thorne", role: "Primary Author", share: "70.0%", email: "aris@docforge.com", payout: "$2,261.05" },
    { id: "sp-2", contributor: "Elena Rostova", role: "Co-Author & Editor", share: "30.0%", email: "elena@docforge.com", payout: "$969.03" }
  ]);

  return (
    <div className="p-6 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4 text-xs select-none">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-3">
        <div className="flex items-center space-x-2">
          <Globe className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            POD Network Distribution & Royalty Split Matrix
          </h3>
        </div>

        <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 rounded-full font-bold">
          Monthly Payout Automated
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Connected Distribution Channels */}
        <div className="p-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 space-y-3">
          <h4 className="font-bold text-gray-900 dark:text-white uppercase text-[10px] tracking-wider border-b pb-2 dark:border-zinc-800">
            Active Print Distribution Channels
          </h4>

          {channels.map(ch => (
            <div key={ch.id} className="p-3 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-between">
              <div>
                <div className="font-bold text-gray-900 dark:text-white">{ch.name}</div>
                <div className="text-[10px] text-gray-500">{ch.units_sold} Units Sold • Gross: {ch.gross}</div>
              </div>

              <div className="text-right">
                <div className="font-bold text-emerald-600 dark:text-emerald-400">{ch.net_payout}</div>
                <span className={`px-2 py-0.5 rounded font-bold text-[9px] ${
                  ch.status === "Live" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "bg-gray-100 text-gray-600"
                }`}>
                  {ch.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Contributor Royalty Splits */}
        <div className="p-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 space-y-3">
          <h4 className="font-bold text-gray-900 dark:text-white uppercase text-[10px] tracking-wider border-b pb-2 dark:border-zinc-800">
            Contributor Royalty Split Contracts
          </h4>

          {splits.map(sp => (
            <div key={sp.id} className="p-3 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-between">
              <div>
                <div className="font-bold text-gray-900 dark:text-white">{sp.contributor} <span className="text-gray-400 font-normal">({sp.role})</span></div>
                <div className="text-[10px] text-gray-500">{sp.email} • Contract: {sp.share}</div>
              </div>

              <div className="text-right">
                <div className="font-bold text-emerald-600 dark:text-emerald-400">{sp.payout}</div>
                <span className="text-[9px] text-gray-400">Direct Deposit</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

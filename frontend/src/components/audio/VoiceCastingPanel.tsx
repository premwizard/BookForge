"use client";

import React, { useState } from "react";
import { Mic, UserCheck, Volume2, Sparkles } from "lucide-react";

export default function VoiceCastingPanel() {
  const [voices, setVoices] = useState([
    { id: "v-1", section: "Main Narrator", voice_name: "Rachel - Professional Narrator", gender: "Female", accent: "American", pitch: "1.0x" },
    { id: "v-2", section: "Academic & Technical Quotes", voice_name: "Dr. Adam - Academic Presenter", gender: "Male", accent: "British", pitch: "0.95x" },
    { id: "v-3", section: "Blockquotes & Storytelling", voice_name: "Emma - Storyteller", gender: "Female", accent: "Transatlantic", pitch: "1.05x" }
  ]);

  return (
    <div className="p-6 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4 text-xs">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-3">
        <div className="flex items-center space-x-2">
          <Mic className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            Multi-Speaker Synthetic Voice Casting
          </h3>
        </div>
        <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-2.5 py-0.5 rounded-full font-bold">
          SSML 1.1 Compliant
        </span>
      </div>

      <div className="space-y-2">
        {voices.map(v => (
          <div key={v.id} className="p-3.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-bold text-gray-900 dark:text-white">{v.section}</div>
              <div className="text-[10px] text-gray-500">{v.voice_name} • {v.accent} • Pitch: {v.pitch}</div>
            </div>

            <button className="px-3 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 font-bold flex items-center space-x-1 hover:bg-indigo-50">
              <Volume2 className="h-3.5 w-3.5" />
              <span>Preview Voice</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import React from "react";
import AudioPlayerStudio from "@/components/audio/AudioPlayerStudio";
import VoiceCastingPanel from "@/components/audio/VoiceCastingPanel";
import { Radio, Mic, Download, Layers } from "lucide-react";

export default function AudioStudioPage() {
  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-950 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Radio className="h-7 w-7 text-indigo-600 dark:text-indigo-400 mr-2" />
            Interactive AudioBook, Podcast & Voice Synthesizer Studio
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
            AST-driven SSML narration script generation, multi-speaker synthetic voice casting, and chapterized `.m4b` audiobook packaging.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AudioPlayerStudio />
        </div>
        <div>
          <VoiceCastingPanel />
        </div>
      </div>
    </div>
  );
}

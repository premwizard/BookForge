"use client";

import React, { useState } from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2, Download, Mic, Radio, Clock, CheckCircle2 } from "lucide-react";

export interface ChapterTrack {
  id: string;
  title: string;
  start: string;
  duration: string;
}

export default function AudioPlayerStudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState("1.0x");
  const [selectedVoice, setSelectedVoice] = useState("rachel-narrator-pro");

  const chapters: ChapterTrack[] = [
    { id: "ch-1", title: "Chapter 1: Executive Overview & Architecture", start: "00:00", duration: "07:00" },
    { id: "ch-2", title: "Chapter 2: Quantum Mechanical Document Layouts", start: "07:00", duration: "09:20" },
    { id: "ch-3", title: "Chapter 3: Multi-Format Rendering & Archival PDF", start: "16:20", duration: "07:20" }
  ];

  const [activeChapter, setActiveChapter] = useState(chapters[0]);

  return (
    <div className="p-6 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4 text-xs select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-zinc-800 pb-3">
        <div className="flex items-center space-x-2">
          <Radio className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            Chapterized AudioBook & Podcast Player
          </h3>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={speed}
            onChange={(e) => setSpeed(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white font-bold"
          >
            <option value="1.0x">1.0x Speed</option>
            <option value="1.25x">1.25x Speed</option>
            <option value="1.5x">1.5x Speed</option>
            <option value="2.0x">2.0x Speed</option>
          </select>

          <button className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center space-x-1.5 shadow-sm">
            <Download className="h-3.5 w-3.5" />
            <span>Download .M4B Bundle</span>
          </button>
        </div>
      </div>

      {/* Main Waveform & Player Control Center */}
      <div className="p-5 rounded-xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/60 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">Currently Playing Chapter</div>
            <div className="text-sm font-bold text-gray-900 dark:text-white">{activeChapter.title}</div>
          </div>
          <div className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
            {activeChapter.start} / 23:40
          </div>
        </div>

        {/* Waveform Visualization Bars */}
        <div className="h-14 bg-white dark:bg-zinc-900 rounded-lg p-2 flex items-center justify-between gap-1 border border-indigo-100 dark:border-indigo-950">
          {Array.from({ length: 48 }).map((_, i) => (
            <div
              key={i}
              className={`w-full rounded-full transition-all ${
                isPlaying && i < 18 ? "bg-indigo-600" : "bg-indigo-200 dark:bg-indigo-950"
              }`}
              style={{ height: `${Math.max(15, Math.sin(i * 0.4) * 80 + 20)}%` }}
            ></div>
          ))}
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center space-x-4">
          <button className="p-2 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
            <SkipBack className="h-4 w-4" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all"
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
          </button>

          <button className="p-2 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
            <SkipForward className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Chapter Tracklist */}
      <div className="space-y-2 pt-2">
        <h4 className="font-bold text-gray-900 dark:text-white uppercase text-[10px] tracking-wider">Chapter Cue Markers</h4>
        {chapters.map(ch => (
          <div
            key={ch.id}
            onClick={() => setActiveChapter(ch)}
            className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between transition-all ${
              activeChapter.id === ch.id
                ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40"
                : "border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 hover:border-indigo-300"
            }`}
          >
            <div className="flex items-center space-x-2">
              <span className="font-mono font-bold text-indigo-600">{ch.start}</span>
              <span className="font-bold text-gray-900 dark:text-white">{ch.title}</span>
            </div>

            <span className="font-mono text-gray-400">{ch.duration}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

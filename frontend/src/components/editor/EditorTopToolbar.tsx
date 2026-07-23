"use client";

import React from "react";
import { 
  Undo2, Redo2, Printer, Save, Bold, Italic, Underline, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Highlighter, Type,
  Palette, Columns, Sparkles, Eye, Edit3, MessageSquare, ZoomIn, ZoomOut,
  Maximize2, Share2, Download, Layers, ShieldAlert, CheckCircle2, ChevronDown,
  SplitSquareVertical, LayoutGrid, Monitor, BookOpen
} from "lucide-react";

export type ViewMode = "PAGED" | "SPREAD" | "CONTINUOUS" | "BOOK" | "FULLSCREEN" | "PRINT" | "RESPONSIVE";
export type EditMode = "EDITING" | "SUGGESTING" | "VIEWING" | "REVIEW";

interface TopToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  editMode: EditMode;
  onEditModeChange: (mode: EditMode) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  trackChanges: boolean;
  onToggleTrackChanges: () => void;
  onToggleAiPanel: () => void;
  onToggleBottomPanel: () => void;
  isSaving?: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onFormat?: (type: string, val?: any) => void;
}

export default function EditorTopToolbar({
  viewMode,
  onViewModeChange,
  editMode,
  onEditModeChange,
  zoom,
  onZoomChange,
  trackChanges,
  onToggleTrackChanges,
  onToggleAiPanel,
  onToggleBottomPanel,
  isSaving = false,
  onUndo,
  onRedo,
  onFormat = () => {}
}: TopToolbarProps) {
  return (
    <div className="bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800 px-4 py-2 flex flex-wrap items-center justify-between gap-3 select-none text-xs">
      {/* Group 1: Undo/Redo & Save Status & Mode Switcher */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1 border-r border-gray-200 dark:border-zinc-800 pr-2">
          <button 
            onClick={onUndo} 
            title="Undo (Ctrl+Z)" 
            className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300"
          >
            <Undo2 className="h-4 w-4" />
          </button>
          <button 
            onClick={onRedo} 
            title="Redo (Ctrl+Y)" 
            className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300"
          >
            <Redo2 className="h-4 w-4" />
          </button>
        </div>

        {/* Save indicator */}
        <div className="flex items-center space-x-1 text-gray-500 border-r border-gray-200 dark:border-zinc-800 pr-2">
          {isSaving ? (
            <span className="flex items-center text-blue-600 text-[11px] font-medium">
              <Save className="h-3.5 w-3.5 mr-1 animate-spin" /> Saving...
            </span>
          ) : (
            <span className="flex items-center text-emerald-600 dark:text-emerald-400 text-[11px] font-medium">
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Saved
            </span>
          )}
        </div>

        {/* Edit Mode Dropdown */}
        <select
          value={editMode}
          onChange={(e) => onEditModeChange(e.target.value as EditMode)}
          className="px-2 py-1 rounded bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 font-semibold text-gray-800 dark:text-gray-200 focus:outline-none"
        >
          <option value="EDITING">Editing Mode</option>
          <option value="SUGGESTING">Suggesting Mode</option>
          <option value="REVIEW">Editorial Review</option>
          <option value="VIEWING">View Only</option>
        </select>
      </div>

      {/* Group 2: Typography & Formatting Tools */}
      <div className="flex items-center space-x-1.5 flex-wrap">
        <select 
          onChange={(e) => onFormat("fontFamily", e.target.value)}
          className="px-2 py-1 rounded bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-800 dark:text-gray-200 font-medium"
        >
          <option value="Garamond">Garamond</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Inter">Inter</option>
          <option value="Georgia">Georgia</option>
          <option value="Courier New">Courier New</option>
        </select>

        <select 
          defaultValue="12"
          onChange={(e) => onFormat("fontSize", e.target.value)}
          className="px-2 py-1 rounded bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-800 dark:text-gray-200 font-medium w-16"
        >
          <option value="9">9 pt</option>
          <option value="10">10 pt</option>
          <option value="11">11 pt</option>
          <option value="12">12 pt</option>
          <option value="14">14 pt</option>
          <option value="16">16 pt</option>
          <option value="18">18 pt</option>
          <option value="24">24 pt</option>
        </select>

        <div className="flex items-center space-x-0.5 border-l border-r border-gray-200 dark:border-zinc-800 px-1">
          <button onClick={() => onFormat("bold")} title="Bold (Ctrl+B)" className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300">
            <Bold className="h-4 w-4" />
          </button>
          <button onClick={() => onFormat("italic")} title="Italic (Ctrl+I)" className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300">
            <Italic className="h-4 w-4" />
          </button>
          <button onClick={() => onFormat("underline")} title="Underline (Ctrl+U)" className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300">
            <Underline className="h-4 w-4" />
          </button>
          <button onClick={() => onFormat("strikethrough")} title="Strikethrough" className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300">
            <Strikethrough className="h-4 w-4" />
          </button>
        </div>

        {/* Alignment */}
        <div className="flex items-center space-x-0.5 border-r border-gray-200 dark:border-zinc-800 pr-1">
          <button onClick={() => onFormat("align", "left")} title="Align Left" className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300">
            <AlignLeft className="h-4 w-4" />
          </button>
          <button onClick={() => onFormat("align", "center")} title="Align Center" className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300">
            <AlignCenter className="h-4 w-4" />
          </button>
          <button onClick={() => onFormat("align", "right")} title="Align Right" className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300">
            <AlignRight className="h-4 w-4" />
          </button>
          <button onClick={() => onFormat("align", "justify")} title="Justify" className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300">
            <AlignJustify className="h-4 w-4" />
          </button>
        </div>

        {/* Columns & Drop Caps */}
        <div className="flex items-center space-x-1">
          <button onClick={() => onFormat("columns", 2)} title="2 Columns Layout" className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300">
            <Columns className="h-4 w-4" />
          </button>
          <button onClick={() => onFormat("dropCap")} title="Toggle Drop Cap" className="p-1 rounded border border-gray-200 dark:border-zinc-700 text-xs font-serif font-bold text-gray-700 dark:text-gray-300 px-1.5">
            D
          </button>
        </div>
      </div>

      {/* Group 3: View Mode & Controls */}
      <div className="flex items-center space-x-2">
        {/* View Mode Selector */}
        <select
          value={viewMode}
          onChange={(e) => onViewModeChange(e.target.value as ViewMode)}
          className="px-2 py-1 rounded bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-800 dark:text-gray-200 font-semibold"
        >
          <option value="PAGED">Single Page View</option>
          <option value="SPREAD">Spread View (2-Page Book)</option>
          <option value="CONTINUOUS">Continuous Scroll</option>
          <option value="BOOK">Book View Mode</option>
          <option value="PRINT">Print Preview</option>
          <option value="RESPONSIVE">Responsive Preview</option>
        </select>

        {/* Zoom Controls */}
        <div className="flex items-center space-x-1 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded px-1 py-0.5">
          <button onClick={() => onZoomChange(Math.max(0.5, zoom - 0.1))} className="p-1 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded">
            <ZoomOut className="h-3.5 w-3.5 text-gray-600 dark:text-gray-300" />
          </button>
          <span className="text-[11px] font-mono font-semibold px-1 text-gray-700 dark:text-gray-300">{Math.round(zoom * 100)}%</span>
          <button onClick={() => onZoomChange(Math.min(2.0, zoom + 0.1))} className="p-1 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded">
            <ZoomIn className="h-3.5 w-3.5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Track Changes Toggle */}
        <button
          onClick={onToggleTrackChanges}
          className={`flex items-center px-2 py-1 rounded border font-semibold text-[11px] transition-colors ${
            trackChanges
              ? "bg-amber-100 dark:bg-amber-950/60 border-amber-300 text-amber-800 dark:text-amber-300"
              : "bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-gray-400"
          }`}
        >
          Track Changes
        </button>

        {/* AI Panel Button */}
        <button
          onClick={onToggleAiPanel}
          className="flex items-center px-2.5 py-1 rounded bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-[11px] shadow-sm hover:from-purple-700 hover:to-indigo-700"
        >
          <Sparkles className="h-3.5 w-3.5 mr-1" />
          AI Assistant
        </button>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { 
  ListTree, Layers, Image as ImageIcon, Palette, Layout, Bookmark, 
  MessageSquare, History, Search, ChevronRight, Plus, CheckCircle2, User,
  FileText, CornerDownRight, RotateCcw, Trash2
} from "lucide-react";

export type LeftTab = "outline" | "pages" | "assets" | "styles" | "templates" | "bookmarks" | "comments" | "history";

interface LeftSidebarProps {
  activeTab: LeftTab;
  onTabChange: (tab: LeftTab) => void;
  onSelectNode?: (nodeId: string) => void;
  onApplyStyle?: (styleName: string) => void;
}

export default function EditorLeftSidebar({
  activeTab,
  onTabChange,
  onSelectNode,
  onApplyStyle
}: LeftSidebarProps) {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([
    { id: "c1", user: "Dr. Aris Thorne", text: "Verify citation math formula in section 2.4", time: "10 mins ago", resolved: false },
    { id: "c2", user: "Elena Vance", text: "Publisher requested Garamond 11.5pt for chapter headings.", time: "1 hour ago", resolved: true }
  ]);

  const [historyItems, setHistoryItems] = useState([
    { rev: 14, action: "FORMAT_RANGE", details: "Applied Heading 1 to node #sec-2", time: "10:44:02 AM" },
    { rev: 13, action: "INSERT_TEXT", details: "Inserted 42 words in Section 2.1", time: "10:43:15 AM" },
    { rev: 12, action: "STYLE_APPLY", details: "Bulk applied Academic Table style", time: "10:41:50 AM" }
  ]);

  return (
    <div className="w-80 border-r border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col h-full select-none text-xs">
      {/* 8-Tab Icons Navigation Header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 px-2 py-1.5 overflow-x-auto">
        <button 
          onClick={() => onTabChange("outline")} 
          title="Document Outline"
          className={`p-2 rounded transition-colors ${activeTab === "outline" ? "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold" : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"}`}
        >
          <ListTree className="h-4 w-4" />
        </button>

        <button 
          onClick={() => onTabChange("pages")} 
          title="Page Navigator & Thumbnails"
          className={`p-2 rounded transition-colors ${activeTab === "pages" ? "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold" : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"}`}
        >
          <Layers className="h-4 w-4" />
        </button>

        <button 
          onClick={() => onTabChange("assets")} 
          title="Asset Manager"
          className={`p-2 rounded transition-colors ${activeTab === "assets" ? "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold" : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"}`}
        >
          <ImageIcon className="h-4 w-4" />
        </button>

        <button 
          onClick={() => onTabChange("styles")} 
          title="Style Palette"
          className={`p-2 rounded transition-colors ${activeTab === "styles" ? "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold" : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"}`}
        >
          <Palette className="h-4 w-4" />
        </button>

        <button 
          onClick={() => onTabChange("templates")} 
          title="Page Blueprints"
          className={`p-2 rounded transition-colors ${activeTab === "templates" ? "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold" : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"}`}
        >
          <Layout className="h-4 w-4" />
        </button>

        <button 
          onClick={() => onTabChange("bookmarks")} 
          title="Bookmarks & Cross-Refs"
          className={`p-2 rounded transition-colors ${activeTab === "bookmarks" ? "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold" : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"}`}
        >
          <Bookmark className="h-4 w-4" />
        </button>

        <button 
          onClick={() => onTabChange("comments")} 
          title="Comments & Discussions"
          className={`p-2 rounded transition-colors ${activeTab === "comments" ? "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold" : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"}`}
        >
          <MessageSquare className="h-4 w-4" />
        </button>

        <button 
          onClick={() => onTabChange("history")} 
          title="Operation History"
          className={`p-2 rounded transition-colors ${activeTab === "history" ? "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold" : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"}`}
        >
          <History className="h-4 w-4" />
        </button>
      </div>

      {/* Tab Body Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Tab 1: Document Outline */}
        {activeTab === "outline" && (
          <div className="space-y-3">
            <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[11px]">Document Outline</h3>
            <div className="space-y-1 text-gray-700 dark:text-gray-300">
              <div className="font-bold cursor-pointer hover:text-blue-600 py-1" onClick={() => onSelectNode?.("sec-1")}>
                1. Executive Introduction
              </div>
              <div className="pl-4 text-gray-600 dark:text-gray-400 cursor-pointer hover:text-blue-600 py-0.5" onClick={() => onSelectNode?.("sec-1-1")}>
                1.1 Core Methodology
              </div>
              <div className="pl-4 text-gray-600 dark:text-gray-400 cursor-pointer hover:text-blue-600 py-0.5" onClick={() => onSelectNode?.("sec-1-2")}>
                1.2 Publishing Standards
              </div>
              <div className="font-bold cursor-pointer hover:text-blue-600 py-1 pt-2" onClick={() => onSelectNode?.("sec-2")}>
                2. Quantum Mechanics & Formatting
              </div>
              <div className="pl-4 text-gray-600 dark:text-gray-400 cursor-pointer hover:text-blue-600 py-0.5" onClick={() => onSelectNode?.("sec-2-1")}>
                2.1 LDM Document Structures
              </div>
              <div className="pl-4 text-gray-600 dark:text-gray-400 cursor-pointer hover:text-blue-600 py-0.5" onClick={() => onSelectNode?.("sec-2-2")}>
                2.2 Style Inspection & Rules
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Page Navigator */}
        {activeTab === "pages" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2 dark:border-zinc-800">
              <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[11px]">Page Navigator</h3>
              <span className="text-[10px] text-gray-500 font-semibold">24 Pages</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4, 5, 6].map(page => (
                <div 
                  key={page}
                  className="p-2 rounded-lg border border-gray-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-400 bg-gray-50 dark:bg-zinc-900 cursor-pointer group text-center space-y-1"
                >
                  <div className="h-24 bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded p-1.5 shadow-sm overflow-hidden text-[6px] text-gray-400">
                    <div className="h-1 bg-gray-300 w-3/4 mb-1"></div>
                    <div className="h-0.5 bg-gray-200 w-full mb-0.5"></div>
                    <div className="h-0.5 bg-gray-200 w-full mb-0.5"></div>
                    <div className="h-0.5 bg-gray-200 w-2/3"></div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400">Page {page}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Assets Manager */}
        {activeTab === "assets" && (
          <div className="space-y-3">
            <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[11px]">Asset Manager</h3>
            <div className="p-3 rounded-lg border border-dashed border-gray-300 dark:border-zinc-700 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-900">
              <Plus className="h-5 w-5 mx-auto text-blue-500 mb-1" />
              <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">Upload Image or Asset</span>
            </div>

            <div className="space-y-2">
              <div className="p-2 rounded-lg border border-gray-200 dark:border-zinc-800 flex items-center space-x-3 bg-gray-50 dark:bg-zinc-900">
                <div className="h-8 w-8 bg-blue-100 dark:bg-blue-950 text-blue-600 rounded flex items-center justify-center font-bold">
                  IMG
                </div>
                <div className="flex-1 truncate">
                  <div className="font-bold text-gray-800 dark:text-gray-200 truncate">figure1_quantum_diagram.png</div>
                  <div className="text-[10px] text-gray-400">1.2 MB • 300 DPI</div>
                </div>
              </div>

              <div className="p-2 rounded-lg border border-gray-200 dark:border-zinc-800 flex items-center space-x-3 bg-gray-50 dark:bg-zinc-900">
                <div className="h-8 w-8 bg-purple-100 dark:bg-purple-950 text-purple-600 rounded flex items-center justify-center font-bold">
                  TTF
                </div>
                <div className="flex-1 truncate">
                  <div className="font-bold text-gray-800 dark:text-gray-200 truncate">Garamond-Semibold.ttf</div>
                  <div className="text-[10px] text-gray-400">Embedded Font</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Styles Palette */}
        {activeTab === "styles" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-2 dark:border-zinc-800">
              <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[11px]">Styles Palette</h3>
              <button className="text-[10px] text-blue-600 font-semibold hover:underline">Bulk Apply</button>
            </div>

            <div className="space-y-2">
              {[
                { name: "Heading 1", type: "Paragraph", font: "Garamond 24pt Bold", color: "#111827" },
                { name: "Heading 2", type: "Paragraph", font: "Garamond 18pt Bold", color: "#1F2937" },
                { name: "Body Text", type: "Paragraph", font: "Times New Roman 11.5pt", color: "#374151" },
                { name: "Blockquote", type: "Paragraph", font: "Inter 10pt Italic", color: "#4B5563" },
                { name: "Academic Table", type: "Table", font: "1pt Grid Border", color: "#000000" }
              ].map(st => (
                <div 
                  key={st.name}
                  onClick={() => onApplyStyle?.(st.name)}
                  className="p-2.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 hover:border-blue-500 cursor-pointer flex items-center justify-between group"
                >
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600">{st.name}</div>
                    <div className="text-[10px] text-gray-500">{st.type} • {st.font}</div>
                  </div>
                  <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">Apply</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 7: Comments */}
        {activeTab === "comments" && (
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[11px]">Editorial Comments</h3>
            
            <div className="space-y-2">
              {comments.map(c => (
                <div key={c.id} className="p-3 rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50/70 dark:bg-zinc-900/70 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <User className="h-3.5 w-3.5 text-blue-600" />
                      <span className="font-bold text-gray-900 dark:text-white">{c.user}</span>
                    </div>
                    <span className="text-[10px] text-gray-400">{c.time}</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 8: Operation History */}
        {activeTab === "history" && (
          <div className="space-y-3">
            <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[11px]">Unlimited History</h3>
            <div className="space-y-2">
              {historyItems.map(h => (
                <div key={h.rev} className="p-2.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-blue-600 font-bold">Rev #{h.rev}</span>
                    <span className="text-[10px] text-gray-400">{h.time}</span>
                  </div>
                  <div className="text-gray-800 dark:text-gray-200 font-medium">{h.details}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

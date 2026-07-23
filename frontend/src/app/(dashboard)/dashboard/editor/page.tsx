"use client";

import React, { useState, useEffect } from "react";
import EditorTopToolbar, { ViewMode, EditMode } from "@/components/editor/EditorTopToolbar";
import EditorLeftSidebar, { LeftTab } from "@/components/editor/EditorLeftSidebar";
import DocumentCanvas from "@/components/editor/DocumentCanvas";
import EditorRightSidebar, { RightTab } from "@/components/editor/EditorRightSidebar";
import EditorBottomPanel from "@/components/editor/EditorBottomPanel";

export default function VisualEditorPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("PAGED");
  const [editMode, setEditMode] = useState<EditMode>("EDITING");
  const [zoom, setZoom] = useState<number>(1.0);
  const [trackChanges, setTrackChanges] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [leftTab, setLeftTab] = useState<LeftTab>("outline");
  const [rightTab, setRightTab] = useState<RightTab>("inspector");
  const [isBottomExpanded, setIsBottomExpanded] = useState<boolean>(false);

  const [selectedElementId, setSelectedElementId] = useState<string>("p-1");
  const [selectedElementType, setSelectedElementType] = useState<string>("paragraph");
  const [selectedStyles, setSelectedStyles] = useState<any>({ font_family: "Garamond", font_size_pt: 11.5, line_height: 1.35 });

  // Handle global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key.toLowerCase() === "s") {
          e.preventDefault();
          handleSave();
        } else if (e.key.toLowerCase() === "z") {
          e.preventDefault();
          handleUndo();
        } else if (e.key.toLowerCase() === "y") {
          e.preventDefault();
          handleRedo();
        } else if (e.key.toLowerCase() === "b") {
          e.preventDefault();
          handleFormat("bold");
        } else if (e.key.toLowerCase() === "i") {
          e.preventDefault();
          handleFormat("italic");
        } else if (e.key.toLowerCase() === "u") {
          e.preventDefault();
          handleFormat("underline");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 800);
  };

  const handleUndo = () => {
    console.log("Undo operation executed.");
  };

  const handleRedo = () => {
    console.log("Redo operation executed.");
  };

  const handleFormat = (type: string, val?: any) => {
    console.log(`Formatting operation applied: ${type}`, val);
  };

  const handleSelectElement = (id: string, type: string, styles: any) => {
    setSelectedElementId(id);
    setSelectedElementType(type);
    setSelectedStyles(styles);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-100 dark:bg-zinc-900 -m-8">
      {/* Top Toolbar */}
      <EditorTopToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        editMode={editMode}
        onEditModeChange={setEditMode}
        zoom={zoom}
        onZoomChange={setZoom}
        trackChanges={trackChanges}
        onToggleTrackChanges={() => setTrackChanges(!trackChanges)}
        onToggleAiPanel={() => setRightTab("ai")}
        onToggleBottomPanel={() => setIsBottomExpanded(!isBottomExpanded)}
        isSaving={isSaving}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onFormat={handleFormat}
      />

      {/* Main Workspace (Left Sidebar + Center Canvas + Right Sidebar) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Navigation Sidebar */}
        <EditorLeftSidebar
          activeTab={leftTab}
          onTabChange={setLeftTab}
          onSelectNode={(nodeId) => setSelectedElementId(nodeId)}
          onApplyStyle={(styleName) => handleFormat("style", styleName)}
        />

        {/* Center Document Canvas */}
        <DocumentCanvas
          viewMode={viewMode}
          zoom={zoom}
          onSelectElement={handleSelectElement}
        />

        {/* Right Inspector Sidebar */}
        <EditorRightSidebar
          activeTab={rightTab}
          onTabChange={setRightTab}
          selectedElementId={selectedElementId}
          selectedElementType={selectedElementType}
          selectedStyles={selectedStyles}
        />
      </div>

      {/* Bottom Console & Status Bar */}
      <EditorBottomPanel
        isExpanded={isBottomExpanded}
        onToggleExpand={() => setIsBottomExpanded(!isBottomExpanded)}
        wordCount={4500}
        characterCount={28410}
        pageCount={24}
        currentPage={1}
      />
    </div>
  );
}

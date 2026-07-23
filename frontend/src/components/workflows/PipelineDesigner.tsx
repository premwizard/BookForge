"use client";

import React, { useState } from "react";
import { 
  Play, Plus, Save, CheckCircle2, AlertTriangle, Layers, Settings2, 
  ArrowRight, ShieldCheck, Scan, FileCode, Palette, Sparkles, SlidersHorizontal,
  Layout, Eye, Printer, CheckSquare, Download, Archive, Bell, UserCheck, Code,
  Cpu, Zap, RefreshCw, Trash2, HelpCircle
} from "lucide-react";

export interface WorkflowNodeItem {
  id: string;
  name: string;
  engine_type: string;
  dependencies: string[];
  conditions: {
    type?: string;
    field?: string;
    operator?: string;
    value?: any;
    min_confidence?: number;
  };
  config: {
    timeout?: number;
    retry?: number;
    rollback?: boolean;
    priority?: number;
  };
  queue_type: string;
  is_checkpoint: boolean;
  x?: number;
  y?: number;
}

const AVAILABLE_ENGINE_TYPES = [
  { type: "virus_scan", label: "Virus Scan", icon: ShieldCheck, category: "Security & Ingestion" },
  { type: "ocr", label: "OCR Engine", icon: Scan, category: "Security & Ingestion" },
  { type: "parser", label: "Document Parser", icon: FileCode, category: "Parsing & Structure" },
  { type: "blueprint", label: "Blueprint Loader", icon: Layers, category: "Parsing & Structure" },
  { type: "mapping", label: "Style Mapping", icon: Palette, category: "Styling & Rules" },
  { type: "rules", label: "Rules Engine", icon: SlidersHorizontal, category: "Styling & Rules" },
  { type: "transformation", label: "Transformation Engine", icon: Sparkles, category: "Styling & Rules" },
  { type: "validation", label: "Pre-Layout Validation", icon: CheckCircle2, category: "Validation & Review" },
  { type: "review", label: "Peer / Editorial Review", icon: Eye, category: "Validation & Review" },
  { type: "layout", label: "Layout Engine", icon: Layout, category: "Layout & Pagination" },
  { type: "pagination", label: "Pagination Engine", icon: Layers, category: "Layout & Pagination" },
  { type: "rendering", label: "Rendering Engine", icon: Printer, category: "Rendering & Output" },
  { type: "final_validation", label: "Final Validation", icon: CheckSquare, category: "Rendering & Output" },
  { type: "export", label: "Export Engine", icon: Download, category: "Rendering & Output" },
  { type: "archive", label: "Archive Engine", icon: Archive, category: "Storage & Ops" },
  { type: "notification", label: "Notification Node", icon: Bell, category: "Integrations" },
  { type: "approval", label: "Manual Approval", icon: UserCheck, category: "Integrations" },
  { type: "plugin", label: "Custom Plugin", icon: Cpu, category: "Custom" },
  { type: "script", label: "Custom Script", icon: Code, category: "Custom" }
];

const PRESET_TEMPLATES = [
  {
    id: "standard-publishing",
    name: "Standard Publishing (Default 16-Stage)",
    category: "Standard",
    description: "Full end-to-end publishing pipeline from upload virus scan to archive.",
    nodes: [
      { id: "node-1", name: "Virus Scan", engine_type: "virus_scan", dependencies: [], queue_type: "worker", is_checkpoint: false, config: { retry: 2 } },
      { id: "node-2", name: "OCR Check", engine_type: "ocr", dependencies: ["node-1"], queue_type: "gpu", is_checkpoint: false, config: { retry: 1 } },
      { id: "node-3", name: "Document Parser", engine_type: "parser", dependencies: ["node-2"], queue_type: "cpu", is_checkpoint: true, config: { retry: 3 } },
      { id: "node-4", name: "Blueprint Loader", engine_type: "blueprint", dependencies: ["node-3"], queue_type: "worker", is_checkpoint: false, config: { retry: 1 } },
      { id: "node-5", name: "Style Mapping", engine_type: "mapping", dependencies: ["node-4"], queue_type: "worker", is_checkpoint: false, config: { retry: 1 } },
      { id: "node-6", name: "Rules Engine", engine_type: "rules", dependencies: ["node-5"], queue_type: "worker", is_checkpoint: false, config: { retry: 2 } },
      { id: "node-7", name: "Transformation Engine", engine_type: "transformation", dependencies: ["node-6"], queue_type: "cpu", is_checkpoint: true, config: { retry: 2, rollback: true } },
      { id: "node-8", name: "Validation", engine_type: "validation", dependencies: ["node-7"], queue_type: "worker", is_checkpoint: true, config: { retry: 1 } },
      { id: "node-9", name: "Review Gate", engine_type: "review", dependencies: ["node-8"], queue_type: "publisher", is_checkpoint: true, config: { retry: 0 } },
      { id: "node-10", name: "Layout Engine", engine_type: "layout", dependencies: ["node-9"], queue_type: "cpu", is_checkpoint: true, config: { retry: 2, rollback: true } },
      { id: "node-11", name: "Pagination", engine_type: "pagination", dependencies: ["node-10"], queue_type: "cpu", is_checkpoint: false, config: { retry: 1 } },
      { id: "node-12", name: "Rendering", engine_type: "rendering", dependencies: ["node-11"], queue_type: "gpu", is_checkpoint: true, config: { retry: 2 } },
      { id: "node-13", name: "Final Validation", engine_type: "final_validation", dependencies: ["node-12"], queue_type: "worker", is_checkpoint: false, config: { retry: 1 } },
      { id: "node-14", name: "Export Engine", engine_type: "export", dependencies: ["node-13"], queue_type: "worker", is_checkpoint: true, config: { retry: 3 } },
      { id: "node-15", name: "Archive Engine", engine_type: "archive", dependencies: ["node-14"], queue_type: "worker", is_checkpoint: false, config: { retry: 1 } }
    ]
  },
  {
    id: "quick-formatting",
    name: "Quick Formatting",
    category: "Fast Track",
    description: "Lightweight pipeline skipping OCR, Review, and Archive for fast drafts.",
    nodes: [
      { id: "node-q1", name: "Document Parser", engine_type: "parser", dependencies: [], queue_type: "worker", is_checkpoint: true, config: { retry: 1 } },
      { id: "node-q2", name: "Style Mapping", engine_type: "mapping", dependencies: ["node-q1"], queue_type: "worker", is_checkpoint: false, config: { retry: 1 } },
      { id: "node-q3", name: "Transformation", engine_type: "transformation", dependencies: ["node-q2"], queue_type: "worker", is_checkpoint: true, config: { retry: 1 } },
      { id: "node-q4", name: "Layout & Render", engine_type: "rendering", dependencies: ["node-q3"], queue_type: "cpu", is_checkpoint: true, config: { retry: 1 } },
      { id: "node-q5", name: "Export PDF", engine_type: "export", dependencies: ["node-q4"], queue_type: "worker", is_checkpoint: true, config: { retry: 1 } }
    ]
  },
  {
    id: "academic-publishing",
    name: "Academic Publishing",
    category: "Academic",
    description: "Includes strict rule validation, citation extraction, peer review gates, and PDF/A compliance.",
    nodes: [
      { id: "node-a1", name: "Parser & Citation Extractor", engine_type: "parser", dependencies: [], queue_type: "cpu", is_checkpoint: true, config: { retry: 2 } },
      { id: "node-a2", name: "Blueprint Alignment", engine_type: "blueprint", dependencies: ["node-a1"], queue_type: "worker", is_checkpoint: false, config: { retry: 1 } },
      { id: "node-a3", name: "Academic Rules Check", engine_type: "rules", dependencies: ["node-a2"], queue_type: "worker", is_checkpoint: false, config: { retry: 1 } },
      { id: "node-a4", name: "Peer Review Gate", engine_type: "review", dependencies: ["node-a3"], queue_type: "publisher", is_checkpoint: true, config: { retry: 0 } },
      { id: "node-a5", name: "Layout & Math Rendering", engine_type: "layout", dependencies: ["node-a4"], queue_type: "gpu", is_checkpoint: true, config: { retry: 2 } },
      { id: "node-a6", name: "PDF/A Export & JATS XML", engine_type: "export", dependencies: ["node-a5"], queue_type: "worker", is_checkpoint: true, config: { retry: 2 } }
    ]
  },
  {
    id: "ai-assisted-workflow",
    name: "AI Assisted Workflow",
    category: "AI Enhanced",
    description: "Integrates AI confidence thresholds, auto-corrections, and automated style suggestions.",
    nodes: [
      { id: "node-ai1", name: "OCR & Document Parsing", engine_type: "parser", dependencies: [], queue_type: "gpu", is_checkpoint: true, config: { retry: 2 } },
      { id: "node-ai2", name: "AI Style Suggestion", engine_type: "mapping", dependencies: ["node-ai1"], queue_type: "priority", is_checkpoint: false, config: { retry: 1 }, conditions: { type: "SIMPLE", operator: "ai_confidence", min_confidence: 0.80 } },
      { id: "node-ai3", name: "Transformation Engine", engine_type: "transformation", dependencies: ["node-ai2"], queue_type: "cpu", is_checkpoint: true, config: { retry: 2 } },
      { id: "node-ai4", name: "Automated Validation", engine_type: "validation", dependencies: ["node-ai3"], queue_type: "worker", is_checkpoint: false, config: { retry: 1 } },
      { id: "node-ai5", name: "Render & Multi-Format Export", engine_type: "export", dependencies: ["node-ai4"], queue_type: "worker", is_checkpoint: true, config: { retry: 2 } }
    ]
  }
];

export default function PipelineDesigner({ onStartWorkflow }: { onStartWorkflow?: (template: any) => void }) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("standard-publishing");
  const [nodes, setNodes] = useState<WorkflowNodeItem[]>(PRESET_TEMPLATES[0].nodes as any);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; message: string } | null>(null);
  const [templateName, setTemplateName] = useState<string>("Standard Publishing Pipeline");

  const activeNode = nodes.find(n => n.id === activeNodeId);

  const loadPresetTemplate = (templateId: string) => {
    const tmpl = PRESET_TEMPLATES.find(t => t.id === templateId);
    if (tmpl) {
      setSelectedTemplateId(templateId);
      setNodes(JSON.parse(JSON.stringify(tmpl.nodes)));
      setTemplateName(tmpl.name);
      setValidationResult(null);
    }
  };

  const addNode = (engineType: string) => {
    const engineMeta = AVAILABLE_ENGINE_TYPES.find(e => e.type === engineType);
    const newNodeId = `node-${Date.now().toString().slice(-4)}`;
    const lastNode = nodes[nodes.length - 1];

    const newNode: WorkflowNodeItem = {
      id: newNodeId,
      name: engineMeta ? engineMeta.label : engineType,
      engine_type: engineType,
      dependencies: lastNode ? [lastNode.id] : [],
      conditions: {},
      config: { timeout: 300, retry: 1, rollback: false },
      queue_type: engineType === "rendering" || engineType === "ocr" ? "gpu" : "worker",
      is_checkpoint: false
    };

    setNodes([...nodes, newNode]);
    setActiveNodeId(newNodeId);
  };

  const removeNode = (nodeId: string) => {
    // Remove node and clear dependency references
    const updated = nodes
      .filter(n => n.id !== nodeId)
      .map(n => ({
        ...n,
        dependencies: n.dependencies.filter(d => d !== nodeId)
      }));
    setNodes(updated);
    if (activeNodeId === nodeId) setActiveNodeId(null);
  };

  const updateActiveNode = (updates: Partial<WorkflowNodeItem>) => {
    if (!activeNodeId) return;
    setNodes(nodes.map(n => n.id === activeNodeId ? { ...n, ...updates } : n));
  };

  const validateGraph = () => {
    // Check for circular dependencies & missing IDs
    const nodeIds = new Set(nodes.map(n => n.id));
    let hasCycle = false;
    let missingDep = false;

    for (const node of nodes) {
      for (const dep of node.dependencies) {
        if (!nodeIds.has(dep)) {
          missingDep = true;
        }
      }
    }

    if (missingDep) {
      setValidationResult({ isValid: false, message: "Missing dependency references detected." });
      return;
    }

    // Topological sort check for cycles
    const inDegree: Record<string, number> = {};
    const edges: Record<string, string[]> = {};
    
    nodes.forEach(n => {
      inDegree[n.id] = n.dependencies.length;
      edges[n.id] = [];
    });

    nodes.forEach(n => {
      n.dependencies.forEach(dep => {
        if (edges[dep]) edges[dep].push(n.id);
      });
    });

    const queue = nodes.filter(n => inDegree[n.id] === 0).map(n => n.id);
    let visited = 0;

    while (queue.length > 0) {
      const u = queue.shift()!;
      visited++;
      (edges[u] || []).forEach(v => {
        inDegree[v]--;
        if (inDegree[v] === 0) queue.push(v);
      });
    }

    if (visited !== nodes.length) {
      setValidationResult({ isValid: false, message: "Circular dependency loop detected in workflow graph!" });
    } else {
      setValidationResult({ isValid: true, message: `DAG is valid! (${nodes.length} stages, no cycles)` });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center space-x-3">
          <Layers className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <div>
            <input 
              type="text" 
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="text-lg font-bold text-gray-900 dark:text-white bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-zinc-700 focus:outline-none focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">{nodes.length} orchestrator nodes configured</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <select 
            value={selectedTemplateId}
            onChange={(e) => loadPresetTemplate(e.target.value)}
            className="px-3 py-2 text-sm font-medium rounded-lg bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {PRESET_TEMPLATES.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          <button 
            onClick={validateGraph}
            className="flex items-center px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-200 transition-colors"
          >
            <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-500" />
            Validate DAG
          </button>

          {onStartWorkflow && (
            <button 
              onClick={() => onStartWorkflow({ name: templateName, nodes })}
              className="flex items-center px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md transition-all"
            >
              <Play className="h-4 w-4 mr-2 fill-current" />
              Execute Pipeline
            </button>
          )}
        </div>
      </div>

      {/* Validation Message Alert */}
      {validationResult && (
        <div className={`p-4 rounded-xl border flex items-center justify-between ${
          validationResult.isValid 
            ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
            : "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300"
        }`}>
          <div className="flex items-center space-x-3">
            {validationResult.isValid ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            )}
            <span className="text-sm font-medium">{validationResult.message}</span>
          </div>
          <button onClick={() => setValidationResult(null)} className="text-xs font-semibold underline">Dismiss</button>
        </div>
      )}

      {/* Main Canvas Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Node Palette (Left Sidebar) */}
        <div className="lg:col-span-1 p-4 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-3">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Engine Nodes</h3>
            <span className="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium">Palette</span>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {AVAILABLE_ENGINE_TYPES.map((engine) => {
              const Icon = engine.icon;
              return (
                <button
                  key={engine.type}
                  onClick={() => addNode(engine.type)}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg border border-gray-100 dark:border-zinc-800/80 bg-gray-50/50 dark:bg-zinc-900/50 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:border-blue-300 dark:hover:border-blue-700 transition-all text-left group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-1.5 rounded-md bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-800 dark:text-gray-200">{engine.label}</div>
                      <div className="text-[10px] text-gray-500 dark:text-gray-400">{engine.category}</div>
                    </div>
                  </div>
                  <Plus className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Visual Pipeline Canvas (Center Area) */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-gray-50 dark:bg-zinc-900/60 border border-gray-200 dark:border-zinc-800 min-h-[600px] space-y-4 relative">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-zinc-800 pb-3">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Pipeline Flow Canvas</h3>
            <span className="text-xs text-gray-500">Click a node to configure parameters</span>
          </div>

          <div className="space-y-4 py-4 max-h-[550px] overflow-y-auto pr-2">
            {nodes.map((node, index) => {
              const engineMeta = AVAILABLE_ENGINE_TYPES.find(e => e.type === node.engine_type);
              const Icon = engineMeta ? engineMeta.icon : Layers;
              const isSelected = activeNodeId === node.id;

              return (
                <div key={node.id} className="relative">
                  {/* Connector Arrow */}
                  {index > 0 && (
                    <div className="flex justify-center my-1">
                      <ArrowRight className="h-4 w-4 text-blue-500 rotate-90" />
                    </div>
                  )}

                  {/* Node Card */}
                  <div 
                    onClick={() => setActiveNodeId(node.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer shadow-sm relative group ${
                      isSelected 
                        ? "bg-white dark:bg-zinc-950 border-blue-500 ring-2 ring-blue-500/20" 
                        : "bg-white dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          node.is_checkpoint 
                            ? "bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400"
                            : "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400"
                        }`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-bold text-gray-900 dark:text-white">{node.name}</span>
                            {node.is_checkpoint && (
                              <span className="text-[10px] bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full font-medium">Checkpoint</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-2 mt-0.5">
                            <span>Queue: <span className="font-semibold text-gray-700 dark:text-gray-300">{node.queue_type}</span></span>
                            <span>•</span>
                            <span>Retries: {node.config?.retry ?? 0}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono px-2 py-1 rounded bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400">{node.id}</span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); removeNode(node.id); }}
                          className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {nodes.length === 0 && (
              <div className="text-center py-16 text-gray-400 dark:text-gray-500">
                <Layers className="h-12 w-12 mx-auto mb-3 opacity-40" />
                <p className="text-sm">No nodes in pipeline. Click nodes on the left to build a workflow.</p>
              </div>
            )}
          </div>
        </div>

        {/* Node Inspector (Right Sidebar) */}
        <div className="lg:col-span-1 p-4 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-3">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Node Inspector</h3>
            <Settings2 className="h-4 w-4 text-gray-400" />
          </div>

          {activeNode ? (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-600 dark:text-gray-400 font-semibold mb-1">Node Label</label>
                <input 
                  type="text"
                  value={activeNode.name}
                  onChange={(e) => updateActiveNode({ name: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-600 dark:text-gray-400 font-semibold mb-1">Celery Queue Target</label>
                <select
                  value={activeNode.queue_type}
                  onChange={(e) => updateActiveNode({ queue_type: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white"
                >
                  <option value="worker">standard (worker)</option>
                  <option value="priority">priority queue</option>
                  <option value="publisher">publisher queue</option>
                  <option value="gpu">GPU cluster</option>
                  <option value="cpu">high-memory CPU</option>
                  <option value="large_doc">large document queue</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Create Checkpoint</span>
                <input 
                  type="checkbox"
                  checked={activeNode.is_checkpoint}
                  onChange={(e) => updateActiveNode({ is_checkpoint: e.target.checked })}
                  className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-zinc-800">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Retry & Recovery Config</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-gray-500">Max Retries</label>
                    <input 
                      type="number"
                      min="0"
                      max="10"
                      value={activeNode.config?.retry ?? 1}
                      onChange={(e) => updateActiveNode({ config: { ...activeNode.config, retry: parseInt(e.target.value) || 0 } })}
                      className="w-full px-2 py-1 rounded border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="text-gray-500">Timeout (sec)</label>
                    <input 
                      type="number"
                      value={activeNode.config?.timeout ?? 300}
                      onChange={(e) => updateActiveNode({ config: { ...activeNode.config, timeout: parseInt(e.target.value) || 300 } })}
                      className="w-full px-2 py-1 rounded border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 dark:border-zinc-800">
                <span className="font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Parent Dependencies</span>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {nodes.filter(n => n.id !== activeNode.id).map(other => (
                    <label key={other.id} className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <input 
                        type="checkbox"
                        checked={activeNode.dependencies.includes(other.id)}
                        onChange={(e) => {
                          const newDeps = e.target.checked 
                            ? [...activeNode.dependencies, other.id]
                            : activeNode.dependencies.filter(d => d !== other.id);
                          updateActiveNode({ dependencies: newDeps });
                        }}
                        className="rounded text-blue-600"
                      />
                      <span className="truncate">{other.name} ({other.id})</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400 dark:text-gray-500">
              <Settings2 className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p className="text-xs">Select a node on the canvas to configure parameters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

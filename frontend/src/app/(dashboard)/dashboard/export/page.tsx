"use client";

import React, { useState } from "react";
import PreflightPanel, { PreflightCheckItem } from "@/components/export/PreflightPanel";
import ReleaseBundler from "@/components/export/ReleaseBundler";
import { 
  Download, FileCheck, Layers, Sparkles, RefreshCw, FileText, CheckCircle2, 
  AlertTriangle, ShieldCheck, HardDrive, Hash, Calendar, Trash2
} from "lucide-react";

export default function ExportStudioPage() {
  const [selectedFormat, setSelectedFormat] = useState("PDF_X1A");
  const [cmykProfile, setCmykProfile] = useState("Fogra39");
  const [dpi, setDpi] = useState(300);
  const [isbn, setIsbn] = useState("978-0-123456-78-9");
  const [doi, setDoi] = useState("10.1000/docforge.2026.42");
  const [isExporting, setIsExporting] = useState(false);

  const [preflightStatus, setPreflightStatus] = useState<"PASSED" | "WARNINGS" | "FAILED" | "PENDING">("PASSED");
  const [preflightChecks, setPreflightChecks] = useState<PreflightCheckItem[]>([
    { check: "IMAGE_DPI", status: "PASSED", message: "All 18 document images satisfy 300+ DPI press requirements." },
    { check: "FONT_EMBEDDING", status: "PASSED", message: "All Garamond & Inter typography fonts subsetted and embedded." },
    { check: "COLOR_SPACE", status: "PASSED", message: "RGB color assets converted to Fogra39 CMYK press space." },
    { check: "ACCESSIBILITY_ALT_TEXT", status: "PASSED", message: "All figures contain WCAG-compliant ARIA alt text." }
  ]);

  const [exportsList, setExportsList] = useState([
    { id: "exp-1", format: "PDF_X1A", filename: "press_release_v1.pdf", size: "4.8 MB", checksum: "md5_e4d909c290d0fb1ca068ffaddf22cbd0", status: "COMPLETED", date: "10:45 AM" },
    { id: "exp-2", format: "EPUB_33", filename: "ebook_reflowable.epub", size: "2.1 MB", checksum: "md5_89a0b12c5ef2a100cc9011ff5a432b21", status: "COMPLETED", date: "10:42 AM" },
    { id: "exp-3", format: "JATS_XML", filename: "journal_article.xml", size: "384 KB", checksum: "md5_110293aa88bbfca99023412354a11200", status: "COMPLETED", date: "10:30 AM" }
  ]);

  const handleStartExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      const newExp = {
        id: `exp-${Date.now()}`,
        format: selectedFormat,
        filename: `document_${selectedFormat.toLowerCase()}_${Date.now().toString().slice(-4)}.${selectedFormat.toLowerCase().includes("pdf") ? "pdf" : selectedFormat.toLowerCase().includes("epub") ? "epub" : "xml"}`,
        size: "3.5 MB",
        checksum: `md5_${Math.random().toString(36).substring(2, 12)}`,
        status: "COMPLETED",
        date: "Just now"
      };
      setExportsList([newExp, ...exportsList]);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-950 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Download className="h-7 w-7 text-blue-600 dark:text-blue-400 mr-2" />
            Multi-Format Export & Publishing Release Studio
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Generate press-ready PDF/X-1a, archival PDF/A-1b, EPUB 3.3, JATS XML, ICML, and packaged release bundles with preflight quality checks.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Export Configuration Form (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Format Selector Studio */}
          <div className="p-6 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-zinc-800 pb-3">
              1. Select Distribution Format
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { id: "PDF_X1A", title: "Press PDF/X-1a", desc: "CMYK, Trim & Bleed Marks", badge: "Print Press" },
                { id: "PDF_A1B", title: "Archival PDF/A-1b", desc: "Long-term Archival Standard", badge: "ISO Standard" },
                { id: "EPUB_33", title: "Reflowable EPUB 3.3", desc: "Accessible Ebook Format", badge: "IDPF / W3C" },
                { id: "JATS_XML", title: "NLM / JATS 1.3 XML", desc: "Academic Journal Schema", badge: "NLM / PubMed" },
                { id: "ICML", title: "Adobe InDesign ICML", desc: "Text Thread Exchange", badge: "Desktop DTP" },
                { id: "HTML5_WEB", title: "HTML5 Web Publication", desc: "Responsive Web Format", badge: "Web Engine" }
              ].map(f => (
                <div
                  key={f.id}
                  onClick={() => setSelectedFormat(f.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 relative ${
                    selectedFormat === f.id
                      ? "ring-2 ring-blue-600 border-blue-600 bg-blue-50/50 dark:bg-blue-950/30"
                      : "hover:border-gray-300 dark:hover:border-zinc-700 bg-gray-50/50 dark:bg-zinc-900/50"
                  }`}
                >
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-gray-300">
                    {f.badge}
                  </span>
                  <div className="font-bold text-sm text-gray-900 dark:text-white">{f.title}</div>
                  <div className="text-xs text-gray-500">{f.desc}</div>
                </div>
              ))}
            </div>

            {/* Format Parameters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-100 dark:border-zinc-800">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Color Profile (CMYK)</label>
                <select 
                  value={cmykProfile}
                  onChange={(e) => setCmykProfile(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 text-xs font-medium text-gray-900 dark:text-white"
                >
                  <option value="Fogra39">Fogra39 (Coated Commercial Press)</option>
                  <option value="SWOP2006">US Web Coated (SWOP) v2</option>
                  <option value="GRACoL2006">GRACoL2006 Coated 1</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Resolution (DPI)</label>
                <select 
                  value={dpi}
                  onChange={(e) => setDpi(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 text-xs font-medium text-gray-900 dark:text-white"
                >
                  <option value={300}>300 DPI (Standard Press Quality)</option>
                  <option value={600}>600 DPI (High-Definition Line Art)</option>
                  <option value={150}>150 DPI (Digital Web Preview)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">ISBN Identifier</label>
                <input 
                  type="text" 
                  value={isbn} 
                  onChange={(e) => setIsbn(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 text-xs font-mono text-gray-900 dark:text-white" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">DOI Identifier</label>
                <input 
                  type="text" 
                  value={doi} 
                  onChange={(e) => setDoi(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 text-xs font-mono text-gray-900 dark:text-white" 
                />
              </div>
            </div>

            <button
              onClick={handleStartExport}
              disabled={isExporting}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg transition-all flex items-center justify-center space-x-2 text-sm"
            >
              {isExporting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin mr-1" />
                  <span>Running Preflight & Rendering {selectedFormat}...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-1" />
                  <span>Generate Export ({selectedFormat})</span>
                </>
              )}
            </button>
          </div>

          {/* Preflight Verification Report */}
          <PreflightPanel
            overallStatus={preflightStatus}
            checks={preflightChecks}
            onReRunPreflight={() => console.log("Re-running preflight checks...")}
          />
        </div>

        {/* Right Column: Release Bundler & Export Artifact List (1/3 width) */}
        <div className="space-y-6">
          {/* Multi-Format Release Bundler */}
          <ReleaseBundler />

          {/* Export Artifacts & History */}
          <div className="p-6 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4 text-xs">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-zinc-800 pb-3 flex items-center justify-between">
              <span>Generated Artifacts</span>
              <span className="text-[10px] text-gray-500 font-normal">{exportsList.length} Total</span>
            </h3>

            <div className="space-y-2">
              {exportsList.map(exp => (
                <div key={exp.id} className="p-3 rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      {exp.format}
                    </span>
                    <span className="text-[10px] text-gray-400">{exp.date}</span>
                  </div>

                  <div className="font-bold text-gray-900 dark:text-white truncate">{exp.filename}</div>

                  <div className="flex items-center justify-between text-[10px] text-gray-500 border-t border-gray-200 dark:border-zinc-800 pt-2">
                    <span className="font-mono">{exp.size}</span>
                    <span className="font-mono truncate max-w-[120px]">{exp.checksum}</span>
                  </div>

                  <button className="w-full py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center justify-center space-x-1 shadow-sm mt-1">
                    <Download className="h-3.5 w-3.5" />
                    <span>Download Artifact</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

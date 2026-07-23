"use client";

import React, { useState } from "react";
import { Package, Download, CheckSquare, FileText, CheckCircle2, Archive } from "lucide-react";

export default function ReleaseBundler() {
  const [bundleName, setBundleName] = useState("Official Publisher Release 2026");
  const [selectedFormats, setSelectedFormats] = useState<string[]>(["PDF_X1A", "EPUB_33", "JATS_XML"]);
  const [isBundling, setIsBundling] = useState(false);
  const [createdBundle, setCreatedBundle] = useState<any>(null);

  const toggleFormat = (fmt: string) => {
    if (selectedFormats.includes(fmt)) {
      setSelectedFormats(selectedFormats.filter(f => f !== fmt));
    } else {
      setSelectedFormats([...selectedFormats, fmt]);
    }
  };

  const handleGenerateBundle = () => {
    setIsBundling(true);
    setTimeout(() => {
      setIsBundling(false);
      setCreatedBundle({
        name: bundleName,
        zip_filename: `bundle_${bundleName.toLowerCase().replace(/ /g, "_")}.zip`,
        formats_count: selectedFormats.length,
        size: "8.4 MB",
        onix_version: "ONIX 3.0 Manifest Embedded"
      });
    }, 1200);
  };

  return (
    <div className="p-6 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4 text-xs">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-3">
        <div className="flex items-center space-x-2">
          <Package className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Multi-Format Release Bundler</h3>
        </div>
        <span className="text-[10px] bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded font-semibold">ONIX 3.0 Ready</span>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">Release Package Title</label>
          <input 
            type="text" 
            value={bundleName}
            onChange={(e) => setBundleName(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white font-medium"
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Include Formats in Zipped Release</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[
              { id: "PDF_X1A", label: "Press PDF/X-1a (CMYK)" },
              { id: "PDF_A1B", label: "Archival PDF/A-1b" },
              { id: "EPUB_33", label: "Reflowable EPUB 3.3" },
              { id: "JATS_XML", label: "NLM/JATS 1.3 XML" },
              { id: "ICML", label: "Adobe InDesign ICML" },
              { id: "HTML5_WEB", label: "HTML5 Web Publication" }
            ].map(fmt => (
              <label 
                key={fmt.id}
                onClick={() => toggleFormat(fmt.id)}
                className={`p-2.5 rounded-lg border cursor-pointer flex items-center space-x-2 transition-all ${
                  selectedFormats.includes(fmt.id)
                    ? "bg-purple-50 dark:bg-purple-950/40 border-purple-400 text-purple-900 dark:text-purple-200"
                    : "bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-gray-400"
                }`}
              >
                <input 
                  type="checkbox" 
                  checked={selectedFormats.includes(fmt.id)}
                  readOnly
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <span className="font-semibold text-[11px]">{fmt.label}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerateBundle}
          disabled={isBundling || selectedFormats.length === 0}
          className="w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold shadow-md transition-all flex items-center justify-center space-x-2"
        >
          <Package className="h-4 w-4" />
          <span>{isBundling ? "Packaging Zipped Bundle..." : `Package Release Bundle (${selectedFormats.length} Formats)`}</span>
        </button>

        {createdBundle && (
          <div className="p-3 rounded-lg border border-purple-300 dark:border-purple-800 bg-purple-50/60 dark:bg-purple-950/30 flex items-center justify-between mt-3">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <div>
                <div className="font-bold text-gray-900 dark:text-white">{createdBundle.name}</div>
                <div className="text-[10px] text-gray-500">{createdBundle.zip_filename} • {createdBundle.size}</div>
              </div>
            </div>

            <button className="flex items-center px-3 py-1.5 rounded-lg bg-purple-600 text-white font-semibold text-xs shadow hover:bg-purple-700">
              <Download className="h-3.5 w-3.5 mr-1" />
              Download ZIP
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

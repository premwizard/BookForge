import React from "react";
import { FileText, Download, Eye } from "lucide-react";

interface Props {
  outputs: any[];
}

export function GeneratedOutputs({ outputs }: Props) {
  const defaultOutputs = [
    { type: "PDF", name: "The_Great_Gatsby_Print.pdf", size: "24.5 MB", status: "READY" },
    { type: "EPUB", name: "The_Great_Gatsby_Digital.epub", size: "8.2 MB", status: "READY" },
    { type: "DOCX", name: "The_Great_Gatsby_Draft.docx", size: "12.1 MB", status: "READY" }
  ];

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
      <h3 className="text-sm font-medium text-neutral-400 mb-4">Generated Files</h3>
      
      <div className="space-y-3">
        {defaultOutputs.map((file, i) => (
          <div key={i} className="bg-black/20 border border-white/5 rounded-xl p-3 flex items-center justify-between group hover:bg-black/40 transition-colors">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                file.type === "PDF" ? "bg-rose-500/20 text-rose-400" :
                file.type === "EPUB" ? "bg-emerald-500/20 text-emerald-400" :
                "bg-blue-500/20 text-blue-400"
              }`}>
                <span className="text-[10px] font-bold">{file.type}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-neutral-200 font-medium truncate w-32" title={file.name}>{file.name}</span>
                <span className="text-xs text-neutral-500">{file.size}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-1.5 rounded hover:bg-white/10 text-neutral-400 hover:text-white transition-colors" title="Preview">
                <Eye className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded hover:bg-white/10 text-neutral-400 hover:text-white transition-colors" title="Download">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

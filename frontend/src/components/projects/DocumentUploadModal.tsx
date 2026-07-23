"use client";

import React, { useState } from "react";
import { Upload, FileText, CheckCircle2, RefreshCw, X, FilePlus } from "lucide-react";

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  onUploadSuccess?: (doc: any) => void;
}

export default function DocumentUploadModal({
  isOpen,
  onClose,
  projectId,
  onUploadSuccess
}: DocumentUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentTitle, setDocumentTitle] = useState("");
  const [templateId, setTemplateId] = useState("tmpl-1");
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!documentTitle) {
        setDocumentTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleSubmit = () => {
    if (!selectedFile && !documentTitle) return;

    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      const newDoc = {
        id: `doc-${Date.now()}`,
        name: documentTitle || "Uploaded Manuscript",
        filename: selectedFile?.name || "manuscript.docx",
        size: "2.4 MB",
        status: "Parsed",
        created_at: "Just now"
      };
      onUploadSuccess?.(newDoc);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 select-none text-xs">
      <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b pb-3 dark:border-zinc-800">
          <div className="flex items-center space-x-2">
            <Upload className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Upload Manuscript Document
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          {/* Drag and Drop Zone */}
          <div className="p-6 rounded-xl border-2 border-dashed border-gray-300 dark:border-zinc-700 hover:border-blue-500 text-center bg-gray-50 dark:bg-zinc-900/50 cursor-pointer space-y-2 relative">
            <input 
              type="file" 
              accept=".docx,.pdf,.epub,.md,.txt"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer" 
            />
            <FilePlus className="h-8 w-8 mx-auto text-blue-500 opacity-80" />
            <div className="font-bold text-gray-800 dark:text-gray-200 text-xs">
              {selectedFile ? selectedFile.name : "Drag & Drop DOCX, PDF, or EPUB file here"}
            </div>
            <p className="text-[10px] text-gray-400">Maximum file size: 100 MB • Supports virus scan & AST extraction</p>
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">Document Title</label>
            <input 
              type="text" 
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              placeholder="e.g. Chapter 1 - Quantum Layout Mechanics"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white font-medium text-xs"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">Publisher Blueprint Template</label>
            <select
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white font-medium text-xs"
            >
              <option value="tmpl-1">Penguin Standard Academic 6x9 (Garamond)</option>
              <option value="tmpl-2">Science Journal Double Column (Nature / IEEE)</option>
              <option value="tmpl-3">Executive Financial Report A4</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2 pt-2 border-t dark:border-zinc-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 font-semibold hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isUploading}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow flex items-center space-x-1.5"
          >
            {isUploading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            <span>{isUploading ? "Ingesting Manuscript..." : "Upload & Run Pipeline"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

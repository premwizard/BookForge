"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FilePlus2, XCircle, CheckCircle2, PauseCircle, PlayCircle } from "lucide-react";
import api from "@/lib/api";

interface UploadDropzoneProps {
  projectId: string;
  onClose: () => void;
  onUploadSuccess: () => void;
}

export default function UploadDropzone({ projectId, onClose, onUploadSuccess }: UploadDropzoneProps) {
  const [files, setFiles] = useState<{ file: File; progress: number; status: string; id: string }[]>([]);
  const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      progress: 0,
      status: "queued",
      id: Math.random().toString(36).substring(7),
    }));
    setFiles((prev) => [...prev, ...newFiles]);
    newFiles.forEach((fileObj) => uploadFileChunks(fileObj));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/html': ['.html'],
      'text/markdown': ['.md'],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  const uploadFileChunks = async (fileObj: { file: File; id: string }) => {
    const { file, id } = fileObj;
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    
    setFiles((prev) => prev.map(f => f.id === id ? { ...f, status: "uploading" } : f));

    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const start = chunkIndex * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);
      
      const formData = new FormData();
      formData.append("file", chunk, file.name);
      formData.append("project_id", projectId);
      formData.append("chunk_index", chunkIndex.toString());
      formData.append("total_chunks", totalChunks.toString());

      try {
        await api.post("/documents/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        
        const progress = Math.round(((chunkIndex + 1) / totalChunks) * 100);
        setFiles((prev) => prev.map(f => f.id === id ? { ...f, progress } : f));
      } catch (error) {
        setFiles((prev) => prev.map(f => f.id === id ? { ...f, status: "failed" } : f));
        return;
      }
    }
    
    setFiles((prev) => prev.map(f => f.id === id ? { ...f, status: "completed" } : f));
    onUploadSuccess();
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter(f => f.id !== id));
  };

  return (
    <Card className="border-dashed border-2 border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900">
      <CardContent className="py-6">
        <div {...getRootProps()} className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-transparent'}`}>
          <input {...getInputProps()} />
          <FilePlus2 className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">Drag & Drop or Browse</h3>
          <p className="text-sm text-gray-500 mt-1 mb-4">Supports PDF, DOCX, Markdown, HTML (Max 50MB)</p>
        </div>

        {files.length > 0 && (
          <div className="mt-6 space-y-4">
            <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">Upload Queue</h4>
            {files.map((fileObj) => (
              <div key={fileObj.id} className="flex items-center gap-4 bg-white dark:bg-zinc-800 p-3 rounded-md shadow-sm border border-gray-100 dark:border-zinc-700">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium line-clamp-1">{fileObj.file.name}</span>
                    <span className="text-xs text-gray-500">{fileObj.progress}%</span>
                  </div>
                  <Progress value={fileObj.progress} className="h-2" />
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500 capitalize">{fileObj.status}</span>
                    <span className="text-xs text-gray-500">{(fileObj.file.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {fileObj.status === 'completed' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                  {fileObj.status === 'failed' && <XCircle className="h-5 w-5 text-red-500" />}
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500" onClick={() => removeFile(fileObj.id)}>
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>
      </CardContent>
    </Card>
  );
}

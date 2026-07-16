"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Upload, Download, CheckCircle2, AlertCircle, FilePlus2, Play, Edit3, Network, BrainCircuit, ClipboardCheck } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import DocumentEditor from "@/components/DocumentEditor";
import UploadDropzone from "@/components/UploadDropzone";
import Link from "next/link";

export default function ProjectDetailsPage() {
  const queryClient = useQueryClient();
  const params = useParams();
  const projectId = params?.id as string;
  const [isUploading, setIsUploading] = useState(false);

  // Mock document data
  const { data: documents } = useQuery({
    queryKey: ["documents", projectId],
    queryFn: async () => {
      return [
        { id: "d1", filename: "chapter_1_draft.pdf", status: "Formatted", uploaded_at: "2026-07-16T10:05:00Z" },
        { id: "d2", filename: "introduction.docx", status: "Uploaded", uploaded_at: "2026-07-16T10:15:00Z" }
      ];
    }
  });

  // Mock Validation Report
  const report = {
    score: 95,
    issues: [
      "Margin overflow on page 12.",
      "Missing figure caption for Figure 1.3"
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Project Details</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage documents and view formatting reports.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export All
          </Button>
          <Button onClick={() => setIsUploading(!isUploading)}>
            <Upload className="mr-2 h-4 w-4" /> Upload Document
          </Button>
        </div>
      </div>

      {isUploading && (
        <UploadDropzone 
          projectId={projectId} 
          onClose={() => setIsUploading(false)} 
          onUploadSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["documents", projectId] });
          }} 
        />
      )}

      <Tabs defaultValue="documents" className="w-full">
        <TabsList>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="editor">Live Editor</TabsTrigger>
          <TabsTrigger value="validation">Validation Report</TabsTrigger>
          <TabsTrigger value="exports">Exports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="documents" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents?.map((doc: any) => (
              <Card key={doc.id}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-medium flex items-center">
                    <FileText className="mr-2 h-4 w-4 text-blue-500" />
                    {doc.filename}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      doc.status === 'Formatted' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    {doc.status === 'Uploaded' && (
                      <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        <Play className="mr-2 h-4 w-4" /> Process Now
                      </Button>
                    )}
                    {doc.status === 'Formatted' && (
                      <>
                        <Button size="sm" variant="outline" className="w-full">
                          <Edit3 className="mr-2 h-4 w-4" /> Edit
                        </Button>
                        <Link href={`/dashboard/projects/${projectId}/documents/${doc.id}/structure`} className="w-full">
                          <Button size="sm" variant="secondary" className="w-full">
                            <Network className="mr-2 h-4 w-4" /> DOM
                          </Button>
                        </Link>
                        <Link href={`/dashboard/projects/${projectId}/documents/${doc.id}/ai`} className="w-full">
                          <Button size="sm" variant="secondary" className="w-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400">
                            <BrainCircuit className="mr-2 h-4 w-4" /> AI
                          </Button>
                        </Link>
                        <Link href={`/dashboard/projects/${projectId}/documents/${doc.id}/validation`} className="w-full">
                          <Button size="sm" variant="secondary" className="w-full bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400">
                            <ClipboardCheck className="mr-2 h-4 w-4" /> QA
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="editor" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-100 dark:border-zinc-800">
              <div>
                <CardTitle>Interactive Editor</CardTitle>
                <CardDescription>Manually refine the AI-formatted output.</CardDescription>
              </div>
              <Button size="sm">Save Changes</Button>
            </CardHeader>
            <CardContent className="p-0">
              <DocumentEditor initialContent="<h1>Chapter 1: Introduction</h1><p>This text was automatically generated by the AI Formatting Engine. You can edit it here before exporting.</p>" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validation" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>AI Validation Score</CardTitle>
                  <CardDescription>Overall formatting health.</CardDescription>
                </div>
                <div className="text-4xl font-bold text-green-500">{report.score}/100</div>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Identified Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {report.issues.map((issue, idx) => (
                  <li key={idx} className="flex items-start bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md text-yellow-800 dark:text-yellow-200 text-sm">
                    <AlertCircle className="h-5 w-5 mr-2 shrink-0" />
                    {issue}
                  </li>
                ))}
                {report.issues.length === 0 && (
                  <li className="flex items-center text-green-600 dark:text-green-400 text-sm">
                    <CheckCircle2 className="h-5 w-5 mr-2" /> All formatting rules passed successfully.
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exports" className="mt-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Download className="h-12 w-12 text-gray-300 dark:text-zinc-700 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Ready for Export</h3>
              <p className="text-gray-500 max-w-sm mt-2 mb-6">
                Your project is fully formatted. You can export it to various formats including DOCX, PDF, and EPUB.
              </p>
              <div className="flex gap-3">
                <Button>Export as PDF</Button>
                <Button variant="outline">Export as DOCX</Button>
                <Button variant="outline">Export as EPUB</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

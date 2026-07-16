'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Download, CheckCircle2, AlertCircle, FileText, Loader2, Play, Settings, History, Trash2, FileOutput } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from '@/lib/api';

export default function ExportDashboardPage() {
  const params = useParams();
  const projectId = params.id as string;
  const docId = params.docId as string;
  
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exports, setExports] = useState<any[]>([]);
  const [format, setFormat] = useState("DOCX");
  const [activeJobs, setActiveJobs] = useState<Record<string, any>>({});

  useEffect(() => {
    fetchExports();
  }, [docId]);

  const fetchExports = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/documents/${docId}/exports`);
      setExports(res.data || []);
      
      // Setup polling for any running jobs
      const running = res.data.filter((e: any) => 
        e.latest_job && ['Queued', 'Preparing', 'Rendering', 'Optimizing'].includes(e.latest_job.status)
      );
      
      if (running.length > 0) {
        startPolling();
      }
    } catch (error) {
      console.error("Error fetching exports", error);
    } finally {
      setLoading(false);
    }
  };

  const startPolling = () => {
    const interval = setInterval(async () => {
      try {
        const res = await api.get(`/documents/${docId}/exports`);
        setExports(res.data || []);
        
        const stillRunning = res.data.some((e: any) => 
          e.latest_job && ['Queued', 'Preparing', 'Rendering', 'Optimizing'].includes(e.latest_job.status)
        );
        
        if (!stillRunning) {
          clearInterval(interval);
          setExporting(false);
        }
      } catch (e) {
        clearInterval(interval);
      }
    }, 3000);
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      await api.post(`/documents/${docId}/export?format=${format}`);
      fetchExports();
      startPolling();
    } catch (error) {
      console.error("Failed to start export", error);
      setExporting(false);
    }
  };

  const handleDelete = async (exportId: string) => {
    try {
      await api.delete(`/exports/${exportId}`);
      fetchExports();
    } catch (error) {
      console.error("Failed to delete export", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FileOutput className="h-8 w-8 text-primary" />
            Export Center
          </h1>
          <p className="text-muted-foreground mt-1">
            Generate production-ready files in various formats.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>New Export</CardTitle>
            <CardDescription>Configure and generate a new file.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Output Format</label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DOCX">Microsoft Word (DOCX)</SelectItem>
                  <SelectItem value="PDF">Adobe PDF (Print Ready)</SelectItem>
                  <SelectItem value="EPUB">eBook (EPUB3)</SelectItem>
                  <SelectItem value="MARKDOWN">Markdown (MD)</SelectItem>
                  <SelectItem value="HTML">Semantic HTML5</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 pt-2">
              <Button 
                className="w-full" 
                onClick={handleExport}
                disabled={exporting}
              >
                {exporting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Start Export
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-muted-foreground" />
              Export History
            </CardTitle>
            <CardDescription>Recently generated files for this document.</CardDescription>
          </CardHeader>
          <CardContent>
            {exports.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg bg-muted/20">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
                <p>No exports generated yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {exports.map((item) => {
                  const exp = item.export;
                  const job = item.latest_job;
                  const isRunning = job && ['Queued', 'Preparing', 'Rendering', 'Optimizing'].includes(job.status);
                  const isFailed = job && job.status === 'Failed';
                  const isCompleted = job && job.status === 'Completed';

                  return (
                    <div key={exp.id} className="flex flex-col sm:flex-row items-center justify-between p-4 border rounded-lg bg-card">
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="p-3 bg-primary/10 rounded-lg shrink-0">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-lg">{exp.format} Document</h4>
                            {isRunning && <Badge variant="outline" className="animate-pulse">{job.status}</Badge>}
                            {isCompleted && <Badge className="bg-green-500">Ready</Badge>}
                            {isFailed && <Badge variant="destructive">Failed</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {new Date(exp.created_at).toLocaleString()} 
                            {exp.file_size && ` • ${(exp.file_size / 1024 / 1024).toFixed(2)} MB`}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-4 sm:mt-0 w-full sm:w-auto justify-end">
                        {isRunning && (
                           <div className="flex items-center gap-2 text-sm text-muted-foreground mr-4">
                             <Loader2 className="h-4 w-4 animate-spin" />
                             Processing...
                           </div>
                        )}
                        {isCompleted && (
                          <Button variant="default" size="sm" onClick={() => alert("Download started! (Mock)")}>
                            <Download className="h-4 w-4 mr-2" /> Download
                          </Button>
                        )}
                        {isFailed && (
                          <Button variant="outline" size="sm" onClick={() => handleExport()}>
                            Retry
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDelete(exp.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

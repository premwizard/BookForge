'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BrainCircuit, CheckCircle2, AlertCircle, FileText, BarChart3, ListTree, RefreshCw, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import api from '@/lib/api';

export default function AIDocumentIntelligencePage() {
  const params = useParams();
  const projectId = params.id as string;
  const docId = params.docId as string;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [jobStatus, setJobStatus] = useState<any>(null);
  const [insights, setInsights] = useState<any>(null);

  useEffect(() => {
    fetchInsights();
  }, [docId]);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      // Fetch latest job status
      try {
        const jobRes = await api.get(`/documents/${docId}/analysis`);
        setJobStatus(jobRes.data);
      } catch (e) {
        setJobStatus(null);
      }
      
      // Fetch insights
      try {
        const insightRes = await api.get(`/documents/${docId}/insights`);
        setInsights(insightRes.data);
      } catch (e) {
        setInsights(null);
      }
    } catch (error) {
      console.error("Error fetching AI insights", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    try {
      setAnalyzing(true);
      await api.post(`/documents/${docId}/analyze`);
      // Start polling for status
      fetchInsights();
      const interval = setInterval(async () => {
        const jobRes = await api.get(`/documents/${docId}/analysis`);
        setJobStatus(jobRes.data);
        if (jobRes.data.status === 'Completed' || jobRes.data.status === 'Failed') {
          clearInterval(interval);
          setAnalyzing(false);
          fetchInsights();
        }
      }, 3000);
    } catch (error) {
      console.error("Analysis failed to start", error);
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const isJobRunning = jobStatus?.status === 'Queued' || jobStatus?.status === 'Running';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BrainCircuit className="h-8 w-8 text-primary" />
            AI Intelligence
          </h1>
          <p className="text-muted-foreground mt-1">
            Semantic understanding and structural analysis powered by AI.
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={fetchInsights}
            disabled={isJobRunning}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button 
            onClick={handleAnalyze}
            disabled={isJobRunning || analyzing}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isJobRunning || analyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                {insights ? 'Reanalyze Document' : 'Analyze Document'}
              </>
            )}
          </Button>
        </div>
      </div>

      {isJobRunning && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 text-primary animate-spin" />
                <span className="font-medium">AI Analysis in Progress</span>
              </div>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {jobStatus?.status}
              </Badge>
            </div>
            <Progress value={jobStatus?.status === 'Running' ? 66 : 33} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              The AI is reading and understanding your document. This may take a few moments for large manuscripts.
            </p>
          </CardContent>
        </Card>
      )}

      {jobStatus?.status === 'Failed' && (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Analysis Failed</span>
            </div>
            <p className="text-sm text-destructive/80 mt-1">
              {jobStatus.error_message || "An unknown error occurred during analysis."}
            </p>
          </CardContent>
        </Card>
      )}

      {!insights && !isJobRunning && jobStatus?.status !== 'Failed' && (
        <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-lg bg-muted/20">
          <Wand2 className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No Analysis Found</h3>
          <p className="text-muted-foreground max-w-sm mt-2 mb-6">
            Run the AI Intelligence Engine to extract semantic structure, classifications, and quality scores.
          </p>
          <Button onClick={handleAnalyze} size="lg">
            <Sparkles className="mr-2 h-5 w-5" />
            Start Analysis
          </Button>
        </div>
      )}

      {insights && !isJobRunning && (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="structure">Structure</TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            <TabsTrigger value="developer">Raw JSON</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Overall Quality</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {insights.quality_scores?.overall_quality?.score || "N/A"}/100
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {insights.quality_scores?.overall_quality?.reason || "Pending detailed analysis."}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Formatting Readiness</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {insights.quality_scores?.formatting_readiness?.score || "N/A"}/100
                  </div>
                  <Progress value={insights.quality_scores?.formatting_readiness?.score || 0} className="h-1 mt-2" />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Document Sections</CardTitle>
                  <ListTree className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {insights.structure_tree?.chapters?.length || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Detected chapters/top-level sections
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="structure">
            <Card>
              <CardHeader>
                <CardTitle>Semantic Structure</CardTitle>
                <CardDescription>
                  The logical structure of your document as understood by the AI.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="p-4 bg-muted/50 rounded-lg overflow-auto max-h-[500px] text-sm">
                  {JSON.stringify(insights.structure_tree, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="suggestions">
            <Card>
              <CardHeader>
                <CardTitle>Style Suggestions</CardTitle>
                <CardDescription>
                  AI-generated recommendations for improving document formatting and structure.
                </CardDescription>
              </CardHeader>
              <CardContent>
                 <pre className="p-4 bg-muted/50 rounded-lg overflow-auto max-h-[500px] text-sm">
                  {JSON.stringify(insights.style_suggestions, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="developer">
             <Card>
              <CardHeader>
                <CardTitle>Raw Insights (Developer Mode)</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="p-4 bg-slate-950 text-slate-50 rounded-lg overflow-auto max-h-[600px] text-xs font-mono">
                  {JSON.stringify(insights, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

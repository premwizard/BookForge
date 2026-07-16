'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ClipboardCheck, CheckCircle2, AlertTriangle, AlertCircle, XCircle, Info, RefreshCw, Loader2, Play, Download, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import api from '@/lib/api';

export default function ValidationDashboardPage() {
  const params = useParams();
  const projectId = params.id as string;
  const docId = params.docId as string;
  
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [runStatus, setRunStatus] = useState<any>(null);
  const [issues, setIssues] = useState<any[]>([]);
  const [score, setScore] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchValidationData();
  }, [docId]);

  const fetchValidationData = async () => {
    try {
      setLoading(true);
      const [statusRes, issuesRes, scoreRes] = await Promise.all([
        api.get(`/documents/${docId}/validation`).catch(() => ({ data: null })),
        api.get(`/documents/${docId}/issues`).catch(() => ({ data: [] })),
        api.get(`/documents/${docId}/quality`).catch(() => ({ data: null }))
      ]);
      
      setRunStatus(statusRes.data);
      setIssues(issuesRes.data || []);
      setScore(scoreRes.data);
    } catch (error) {
      console.error("Error fetching validation data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async () => {
    try {
      setValidating(true);
      await api.post(`/documents/${docId}/validate`);
      fetchValidationData();
      
      const interval = setInterval(async () => {
        const res = await api.get(`/documents/${docId}/validation`);
        setRunStatus(res.data);
        if (res.data.status === 'Completed' || res.data.status === 'Failed') {
          clearInterval(interval);
          setValidating(false);
          fetchValidationData();
        }
      }, 3000);
    } catch (error) {
      console.error("Failed to start validation", error);
      setValidating(false);
    }
  };

  const filteredIssues = issues.filter(issue => 
    issue.problem.toLowerCase().includes(searchTerm.toLowerCase()) || 
    issue.cause?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isRunning = runStatus?.status === 'Queued' || runStatus?.status === 'Running';

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return <XCircle className="h-5 w-5 text-destructive" />;
      case 'high': return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'medium': return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'low': return <Info className="h-5 w-5 text-blue-500" />;
      default: return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return <Badge variant="destructive">Critical</Badge>;
      case 'high': return <Badge className="bg-orange-500 hover:bg-orange-600">High</Badge>;
      case 'medium': return <Badge className="bg-yellow-500 hover:bg-yellow-600">Medium</Badge>;
      case 'low': return <Badge className="bg-blue-500 hover:bg-blue-600">Low</Badge>;
      default: return <Badge variant="secondary">Info</Badge>;
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
            <ClipboardCheck className="h-8 w-8 text-primary" />
            Quality Assurance
          </h1>
          <p className="text-muted-foreground mt-1">
            Detect formatting, structural, and typographical issues before exporting.
          </p>
        </div>
        
        <div className="flex gap-2">
          {runStatus?.status === 'Completed' && (
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Report
            </Button>
          )}
          <Button 
            onClick={handleValidate}
            disabled={isRunning || validating}
            className="bg-primary hover:bg-primary/90"
          >
            {isRunning || validating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Validating...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Run Validation
              </>
            )}
          </Button>
        </div>
      </div>

      {isRunning && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 text-primary animate-spin" />
                <span className="font-medium">Validation in Progress</span>
              </div>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {runStatus?.status}
              </Badge>
            </div>
            <Progress value={runStatus?.status === 'Running' ? 66 : 33} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              Executing typography, layout, structural, and image validation rules...
            </p>
          </CardContent>
        </Card>
      )}

      {score && !isRunning && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Overall Quality</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">
                {score.overall_quality_score}/100
              </div>
              <Progress value={score.overall_quality_score} className="h-1 mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Formatting</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{score.formatting_score}/100</div>
              <Progress value={score.formatting_score} className="h-1 mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Typography</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{score.typography_score}/100</div>
              <Progress value={score.typography_score} className="h-1 mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{score.structure_score}/100</div>
              <Progress value={score.structure_score} className="h-1 mt-2" />
            </CardContent>
          </Card>
        </div>
      )}

      {!score && !isRunning && runStatus?.status !== 'Failed' && (
        <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-lg bg-muted/20">
          <ClipboardCheck className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No Validation History</h3>
          <p className="text-muted-foreground max-w-sm mt-2 mb-6">
            Run the QA engine to check your document for structural inconsistencies, broken formatting, and typography errors.
          </p>
          <Button onClick={handleValidate} size="lg">
            <Play className="mr-2 h-5 w-5" />
            Run Validation
          </Button>
        </div>
      )}

      {issues.length > 0 && !isRunning && (
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>Detected Issues</CardTitle>
                <CardDescription>Found {issues.length} potential formatting or structural problems.</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search issues..." 
                    className="pl-8 w-full md:w-[250px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredIssues.map((issue) => (
                <div key={issue.id} className="flex flex-col p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {getSeverityIcon(issue.severity)}
                      </div>
                      <div>
                        <h4 className="text-base font-semibold">{issue.problem}</h4>
                        <div className="flex items-center gap-2 mt-1 mb-2">
                          {getSeverityBadge(issue.severity)}
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                            Location: {issue.location || "Unknown"}
                          </span>
                        </div>
                        {issue.cause && (
                          <p className="text-sm text-muted-foreground mt-2">
                            <strong>Cause:</strong> {issue.cause}
                          </p>
                        )}
                        {issue.recommendation && (
                          <div className="bg-primary/10 text-primary p-3 rounded-md mt-3 text-sm flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
                            <span><strong>Recommendation:</strong> {issue.recommendation}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filteredIssues.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No issues found matching your search.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

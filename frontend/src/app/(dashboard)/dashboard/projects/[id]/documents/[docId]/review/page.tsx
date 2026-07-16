'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MessageSquare, ThumbsUp, GitCompare, Share2, Users, History, Activity, PenTool, Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import api from '@/lib/api';

export default function ReviewWorkspacePage() {
  const params = useParams();
  const docId = params.docId as string;
  
  const [comments, setComments] = useState<any[]>([]);
  const [workflowStatus, setWorkflowStatus] = useState<any>(null);
  
  useEffect(() => {
    fetchComments();
    fetchWorkflowStatus();
    
    // Simulate WebSocket connection
    const wsUrl = `ws://localhost:8000/api/v1/collaboration/ws/${docId}`;
    const ws = new WebSocket(wsUrl);
    ws.onmessage = (event) => {
      console.log("WebSocket event:", event.data);
    };
    
    return () => ws.close();
  }, [docId]);
  
  const fetchComments = async () => {
    try {
      const res = await api.get(`/documents/${docId}/comments`);
      setComments(res.data || []);
    } catch (e) {
      console.error(e);
    }
  };
  
  const fetchWorkflowStatus = async () => {
    try {
      const res = await api.get(`/workflow/status/${docId}`);
      setWorkflowStatus(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col space-y-4">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between p-4 bg-card border rounded-lg shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Review Workspace
          </h1>
          <div className="h-6 w-px bg-border hidden sm:block"></div>
          <Badge variant="secondary" className="hidden sm:flex">
            State: {workflowStatus?.state?.name || "Draft"}
          </Badge>
          <Badge variant="outline" className="hidden md:flex text-green-600 border-green-200 bg-green-50">
            <Lock className="h-3 w-3 mr-1" /> Checked Out (You)
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" /> Share
          </Button>
          <Button variant="outline" size="sm">
            <History className="mr-2 h-4 w-4" /> Versions
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" size="sm">
            <ThumbsUp className="mr-2 h-4 w-4" /> Approve
          </Button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
        
        {/* Document Editor / Viewer Panel */}
        <Card className="flex-1 flex flex-col min-h-0 border-primary/10 shadow-md">
          <CardHeader className="py-3 px-4 border-b bg-muted/30 shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center">
                <PenTool className="h-4 w-4 mr-2 text-muted-foreground" />
                Document Viewer (Annotate Mode)
              </CardTitle>
              <div className="flex gap-1">
                {/* Formatting/Annotation tools mock */}
                <Button variant="ghost" size="icon" className="h-8 w-8"><MessageSquare className="h-4 w-4 text-muted-foreground" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8"><PenTool className="h-4 w-4 text-muted-foreground" /></Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-auto bg-gray-50/50 dark:bg-gray-900/50">
            <div className="max-w-[800px] mx-auto bg-white dark:bg-black my-8 p-12 shadow-sm border rounded min-h-[800px]">
              <h1 className="text-3xl font-bold mb-6">Chapter 1: The Beginning</h1>
              <p className="text-lg leading-relaxed mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                <span className="bg-yellow-200 dark:bg-yellow-900/50 cursor-pointer border-b-2 border-yellow-400" title="Comment by Editor: Rephrase this section.">
                  Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </span>
              </p>
              <p className="text-lg leading-relaxed mb-4">
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Collaboration Sidebar */}
        <Card className="w-full lg:w-[400px] flex flex-col min-h-0 shrink-0 border-l shadow-lg">
          <Tabs defaultValue="comments" className="flex-1 flex flex-col min-h-0">
            <TabsList className="w-full rounded-none border-b grid grid-cols-3 shrink-0">
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            
            <TabsContent value="comments" className="flex-1 min-h-0 p-0 m-0 flex flex-col">
              <ScrollArea className="flex-1 p-4">
                {comments.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <MessageSquare className="mx-auto h-8 w-8 opacity-20 mb-3" />
                    <p className="text-sm">No comments yet. Highlight text to add one.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="p-3 bg-muted/50 rounded-lg border text-sm">
                        <div className="font-semibold mb-1 flex justify-between">
                          <span>User {comment.user_id.substring(0, 5)}</span>
                          <span className="text-xs text-muted-foreground text-right">{new Date(comment.created_at).toLocaleDateString()}</span>
                        </div>
                        <p>{comment.content}</p>
                      </div>
                    ))}
                  </div>
                )}
                {/* Mock Comment */}
                <div className="p-3 bg-card rounded-lg border text-sm mt-4 shadow-sm border-primary/20 relative">
                  <div className="absolute -left-1 top-4 w-1 h-8 bg-yellow-400 rounded-r-md"></div>
                  <div className="font-semibold mb-1 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs">JS</div>
                      <span>Jane (Editor)</span>
                    </div>
                    <span className="text-xs text-muted-foreground text-right">Just now</span>
                  </div>
                  <p className="mt-2 text-foreground">Can we rephrase this section to flow better?</p>
                  <div className="mt-3 flex gap-2">
                    <Button variant="secondary" size="sm" className="h-7 text-xs">Reply</Button>
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-green-600">Resolve</Button>
                  </div>
                </div>
              </ScrollArea>
              <div className="p-4 border-t bg-muted/30 shrink-0">
                <textarea 
                  className="w-full flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                  placeholder="Add a general comment..."
                ></textarea>
                <div className="flex justify-end mt-2">
                  <Button size="sm">Post Comment</Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="tasks" className="flex-1 min-h-0 p-4 m-0 overflow-auto">
               <div className="space-y-3">
                 <div className="p-3 border rounded-lg bg-card border-l-4 border-l-orange-500">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-sm">Review formatting of Chapter 1</h4>
                      <Badge variant="outline" className="text-[10px]">In Progress</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">Assigned to: You</p>
                    <Button variant="outline" size="sm" className="w-full h-7 text-xs">Mark Complete</Button>
                 </div>
               </div>
            </TabsContent>
            
            <TabsContent value="activity" className="flex-1 min-h-0 p-4 m-0 overflow-auto">
              <div className="relative border-l ml-3 pl-4 space-y-6">
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-primary ring-4 ring-background"></div>
                  <p className="text-sm font-medium">Jane (Editor) locked the document</p>
                  <p className="text-xs text-muted-foreground">10 minutes ago</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-muted-foreground ring-4 ring-background"></div>
                  <p className="text-sm font-medium">Status changed to Editor Review</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-muted-foreground ring-4 ring-background"></div>
                  <p className="text-sm font-medium">Version 2.0 created</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
        
      </div>
    </div>
  );
}

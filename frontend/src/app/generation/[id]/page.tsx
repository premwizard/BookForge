"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { GenerationHeader } from "@/components/generation/GenerationHeader";
import { OverallProgress } from "@/components/generation/OverallProgress";
import { PipelineTimeline } from "@/components/generation/PipelineTimeline";
import { LiveLogs } from "@/components/generation/LiveLogs";
import { CurrentEnginePanel } from "@/components/generation/CurrentEnginePanel";
import { DocumentPreview } from "@/components/generation/DocumentPreview";
import { ActionPanel } from "@/components/generation/ActionPanel";
import { PerformanceMetrics } from "@/components/generation/PerformanceMetrics";
import { ValidationPanel } from "@/components/generation/ValidationPanel";
import { GeneratedOutputs } from "@/components/generation/GeneratedOutputs";
import { ActivityFeed } from "@/components/generation/ActivityFeed";
import { useGenerationStream } from "@/hooks/useGenerationStream";

export default function GenerationPage() {
  const params = useParams();
  const generationId = params.id as string;
  
  // Custom hook that manages WebSockets and fetches initial REST data
  const { data, status, logs, timeline, metrics, outputs, validation, actions } = useGenerationStream(generationId);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-950 text-white">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white overflow-x-hidden p-6 font-sans antialiased relative">
      {/* Background Particles/Gradient placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-black pointer-events-none -z-10" />

      <div className="max-w-[1600px] mx-auto space-y-6">
        <GenerationHeader data={data} status={status} />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (Main progress and visualization) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <OverallProgress timeline={timeline} status={status} />
              <CurrentEnginePanel data={data} metrics={metrics} />
            </div>
            
            <PipelineTimeline timeline={timeline} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <DocumentPreview />
               <ValidationPanel validation={validation} />
            </div>
            
            <LiveLogs logs={logs} />
          </div>

          {/* Right Column (Metrics, Feed, Actions) */}
          <div className="lg:col-span-4 space-y-6">
            <ActionPanel actions={actions} status={status} />
            <PerformanceMetrics metrics={metrics} />
            <ActivityFeed events={timeline} />
            <GeneratedOutputs outputs={outputs} />
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';

// Interfaces for our state
export interface GenerationData {
  id: string;
  template_id: string;
  document_id: string;
  status: string;
  current_node_id: string;
  created_at: string;
}

export function useGenerationStream(generationId: string) {
  const [data, setData] = useState<GenerationData | null>(null);
  const [status, setStatus] = useState<string>("loading");
  const [logs, setLogs] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [outputs, setOutputs] = useState<any[]>([]);
  const [validation, setValidation] = useState<any>({});
  
  // This is a placeholder for the actual actions
  const actions = {
    pause: async () => { await fetch(`http://localhost:8000/api/v1/generation/${generationId}/pause`, { method: 'POST' }); },
    resume: async () => { await fetch(`http://localhost:8000/api/v1/generation/${generationId}/resume`, { method: 'POST' }); },
    cancel: async () => { await fetch(`http://localhost:8000/api/v1/generation/${generationId}/cancel`, { method: 'POST' }); },
  };

  useEffect(() => {
    if (!generationId) return;

    // 1. Initial REST Fetch
    const fetchInitialData = async () => {
      try {
        const [resData, resLogs, resTimeline, resMetrics] = await Promise.all([
          fetch(`http://localhost:8000/api/v1/generation/${generationId}`),
          fetch(`http://localhost:8000/api/v1/generation/${generationId}/logs`),
          fetch(`http://localhost:8000/api/v1/generation/${generationId}/timeline`),
          fetch(`http://localhost:8000/api/v1/generation/${generationId}/metrics`)
        ]);
        
        const initData = await resData.json();
        setData(initData);
        setStatus(initData.status || "UNKNOWN");
        setLogs(await resLogs.json());
        setTimeline(await resTimeline.json());
        setMetrics(await resMetrics.json());
      } catch (error) {
        console.error("Failed to fetch initial generation data", error);
        setStatus("error");
      }
    };
    
    fetchInitialData();

    // 2. WebSocket Connection for live updates
    const wsUrl = `ws://localhost:8000/generation/${generationId}/stream`;
    let ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'log') {
        setLogs(prev => [...prev, message.data]);
      } else if (message.type === 'timeline_update') {
        // Update specific node in timeline
        setTimeline(prev => prev.map(node => node.node_id === message.data.node_id ? { ...node, ...message.data } : node));
      } else if (message.type === 'status_update') {
        setStatus(message.data.status);
      } else if (message.type === 'metrics_update') {
        setMetrics(prev => [...prev, message.data]);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      ws.close();
    };
  }, [generationId]);

  return { data, status, logs, timeline, metrics, outputs, validation, actions };
}

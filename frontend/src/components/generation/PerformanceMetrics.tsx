import React from "react";
import { Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  metrics: any[];
}

export function PerformanceMetrics({ metrics }: Props) {
  // Dummy data for charts
  const data = [
    { time: '10:00', cpu: 20, ram: 400 },
    { time: '10:01', cpu: 45, ram: 450 },
    { time: '10:02', cpu: 85, ram: 512 },
    { time: '10:03', cpu: 60, ram: 520 },
    { time: '10:04', cpu: 30, ram: 520 },
  ];

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-medium text-neutral-400">Resource Usage</h3>
        <Activity className="w-4 h-4 text-neutral-500" />
      </div>

      <div className="h-40 w-full mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Tooltip 
              contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', fontSize: '12px' }}
              itemStyle={{ color: '#e5e5e5' }}
            />
            <Line type="monotone" dataKey="cpu" stroke="#6366f1" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="ram" stroke="#10b981" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500" />
          <span className="text-neutral-400">CPU Usage</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-neutral-400">RAM Usage</span>
        </div>
      </div>
    </div>
  );
}

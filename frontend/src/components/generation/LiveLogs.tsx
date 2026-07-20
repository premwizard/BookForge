import React, { useRef, useEffect, useState } from "react";
import { Terminal, Download, Search, Pause, Play } from "lucide-react";

interface Log {
  id: string;
  level: string;
  message: string;
  created_at: string;
}

interface Props {
  logs: Log[];
}

export function LiveLogs({ logs }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [filter, setFilter] = useState("");

  const defaultLogs = [
    { id: '1', level: 'INFO', message: 'Initializing parsing engine...', created_at: new Date().toISOString() },
    { id: '2', level: 'INFO', message: 'Detected 148 headings in document.', created_at: new Date().toISOString() },
    { id: '3', level: 'DEBUG', message: 'Memory allocation successful (1.2GB).', created_at: new Date().toISOString() },
    { id: '4', level: 'WARNING', message: 'Style "Heading 7" missing from mapping rules.', created_at: new Date().toISOString() }
  ];

  const displayLogs = logs.length > 0 ? logs : defaultLogs;
  const filteredLogs = displayLogs.filter(l => l.message.toLowerCase().includes(filter.toLowerCase()) || l.level.toLowerCase().includes(filter.toLowerCase()));

  useEffect(() => {
    if (autoScroll) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [filteredLogs, autoScroll]);

  const getLogColor = (level: string) => {
    switch (level.toUpperCase()) {
      case 'ERROR': return 'text-rose-400';
      case 'WARNING': return 'text-amber-400';
      case 'SUCCESS': return 'text-emerald-400';
      case 'DEBUG': return 'text-neutral-500';
      default: return 'text-indigo-200';
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-col h-[400px] shadow-2xl overflow-hidden">
      {/* Terminal Header */}
      <div className="bg-black/40 px-4 py-3 flex items-center justify-between border-b border-neutral-800 backdrop-blur-md">
        <div className="flex items-center gap-2 text-neutral-400">
          <Terminal className="w-4 h-4" />
          <span className="text-sm font-medium font-mono">Live Logs</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input 
              type="text" 
              placeholder="Search..." 
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="bg-neutral-800 border border-neutral-700 text-xs text-white rounded-md pl-7 pr-3 py-1 focus:outline-none focus:border-indigo-500 w-40 transition-all"
            />
          </div>
          
          <button 
            onClick={() => setAutoScroll(!autoScroll)}
            className={`p-1.5 rounded transition-colors ${autoScroll ? 'bg-indigo-500/20 text-indigo-400' : 'bg-neutral-800 text-neutral-400 hover:text-white'}`}
            title={autoScroll ? "Pause Auto-scroll" : "Resume Auto-scroll"}
          >
            {autoScroll ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          
          <button className="p-1.5 rounded bg-neutral-800 text-neutral-400 hover:text-white transition-colors" title="Download Logs">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="p-4 overflow-y-auto custom-scrollbar flex-1 font-mono text-[13px] leading-relaxed">
        {filteredLogs.map((log, i) => (
          <div key={log.id || i} className="flex gap-4 mb-1.5 hover:bg-white/5 px-2 py-0.5 rounded transition-colors">
            <span className="text-neutral-600 shrink-0 select-none">
              {new Date(log.created_at).toLocaleTimeString([], { hour12: false, fractionalSecondDigits: 3 })}
            </span>
            <span className={`shrink-0 w-16 font-semibold ${getLogColor(log.level)}`}>
              [{log.level}]
            </span>
            <span className="text-neutral-300 break-words">{log.message}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

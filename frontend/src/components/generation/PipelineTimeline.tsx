import React from "react";
import { CheckCircle2, Circle, Loader2, AlertTriangle, XCircle } from "lucide-react";

interface Props {
  timeline: any[];
}

export function PipelineTimeline({ timeline }: Props) {
  // Dummy timeline if empty
  const defaultTimeline = [
    { name: "Upload", status: "COMPLETED" },
    { name: "Parser", status: "COMPLETED" },
    { name: "Blueprint", status: "RUNNING" },
    { name: "Mapping", status: "PENDING" },
    { name: "Transformation", status: "PENDING" },
    { name: "Validation", status: "PENDING" },
    { name: "Layout", status: "PENDING" },
    { name: "Rendering", status: "PENDING" },
    { name: "Export", status: "PENDING" }
  ];

  const nodes = timeline.length > 0 ? timeline : defaultTimeline;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED": return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case "RUNNING": return <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />;
      case "FAILED": return <XCircle className="w-5 h-5 text-rose-500" />;
      case "WARNING": return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      default: return <Circle className="w-5 h-5 text-neutral-600" />;
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md overflow-x-auto custom-scrollbar">
      <h3 className="text-sm font-medium text-neutral-400 mb-6">Pipeline Timeline</h3>
      
      <div className="flex items-center min-w-max pb-4 px-2">
        {nodes.map((node, i) => (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center gap-3 relative group">
              <div className={`p-2 rounded-xl transition-all duration-300 ${
                node.status === "RUNNING" ? "bg-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.5)] border border-indigo-500/50" : 
                node.status === "COMPLETED" ? "bg-emerald-500/10 border border-emerald-500/20" :
                "bg-neutral-800/50 border border-neutral-700/50"
              }`}>
                {getStatusIcon(node.status)}
              </div>
              <span className={`text-xs font-medium whitespace-nowrap ${
                node.status === "RUNNING" ? "text-indigo-300" : 
                node.status === "COMPLETED" ? "text-emerald-200" : "text-neutral-500"
              }`}>
                {node.name}
              </span>
              
              {/* Tooltip on hover */}
              <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-800 border border-neutral-700 rounded-md px-3 py-1.5 text-xs z-10 pointer-events-none whitespace-nowrap shadow-xl">
                Status: {node.status}
              </div>
            </div>
            
            {i < nodes.length - 1 && (
              <div className="w-12 md:w-20 lg:w-24 h-[2px] -mt-6 mx-2 relative">
                <div className="absolute inset-0 bg-neutral-800 rounded" />
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-indigo-500 rounded transition-all duration-1000"
                  style={{ width: nodes[i].status === "COMPLETED" ? "100%" : "0%" }}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

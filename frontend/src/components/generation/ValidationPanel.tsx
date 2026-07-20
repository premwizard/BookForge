import React, { useState } from "react";
import { AlertTriangle, XCircle, Lightbulb, ChevronDown, ChevronRight } from "lucide-react";

interface Props {
  validation: any;
}

export function ValidationPanel({ validation }: Props) {
  const [expanded, setExpanded] = useState<string | null>("warnings");

  const toggle = (section: string) => {
    setExpanded(expanded === section ? null : section);
  };

  const defaultWarnings = [
    { id: 1, message: 'Style "Heading 7" missing from mapping rules.' },
    { id: 2, message: 'Image "fig1.png" resolution is below 300dpi.' }
  ];

  const defaultSuggestions = [
    { id: 1, confidence: 85, message: 'AI suggests mapping "Title" to "h1".' }
  ];

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md flex flex-col h-[500px]">
      <h3 className="text-sm font-medium text-neutral-400 mb-6">Validation Summary</h3>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
        
        {/* Errors Accordion */}
        <div className="border border-rose-500/20 rounded-xl overflow-hidden bg-rose-500/5">
          <button 
            onClick={() => toggle('errors')}
            className="w-full flex items-center justify-between p-3 text-left hover:bg-rose-500/10 transition-colors"
          >
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-400" />
              <span className="text-sm font-medium text-rose-200">Errors (0)</span>
            </div>
            {expanded === 'errors' ? <ChevronDown className="w-4 h-4 text-rose-400" /> : <ChevronRight className="w-4 h-4 text-rose-400" />}
          </button>
          {expanded === 'errors' && (
            <div className="p-3 border-t border-rose-500/10 text-sm text-neutral-400 bg-black/20">
              No blocking errors found.
            </div>
          )}
        </div>

        {/* Warnings Accordion */}
        <div className="border border-amber-500/20 rounded-xl overflow-hidden bg-amber-500/5">
          <button 
            onClick={() => toggle('warnings')}
            className="w-full flex items-center justify-between p-3 text-left hover:bg-amber-500/10 transition-colors"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-amber-200">Warnings ({defaultWarnings.length})</span>
            </div>
            {expanded === 'warnings' ? <ChevronDown className="w-4 h-4 text-amber-400" /> : <ChevronRight className="w-4 h-4 text-amber-400" />}
          </button>
          {expanded === 'warnings' && (
            <div className="p-3 border-t border-amber-500/10 text-sm bg-black/20 space-y-2">
              {defaultWarnings.map(w => (
                <div key={w.id} className="flex items-start gap-2 text-amber-100/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500/50 mt-1.5 shrink-0" />
                  <span>{w.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Suggestions Accordion */}
        <div className="border border-indigo-500/20 rounded-xl overflow-hidden bg-indigo-500/5">
          <button 
            onClick={() => toggle('suggestions')}
            className="w-full flex items-center justify-between p-3 text-left hover:bg-indigo-500/10 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-medium text-indigo-200">AI Insights ({defaultSuggestions.length})</span>
            </div>
            {expanded === 'suggestions' ? <ChevronDown className="w-4 h-4 text-indigo-400" /> : <ChevronRight className="w-4 h-4 text-indigo-400" />}
          </button>
          {expanded === 'suggestions' && (
            <div className="p-3 border-t border-indigo-500/10 text-sm bg-black/20 space-y-2">
              {defaultSuggestions.map(s => (
                <div key={s.id} className="flex flex-col gap-1 text-indigo-100/70">
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/50 mt-1.5 shrink-0" />
                    <span>{s.message}</span>
                  </div>
                  <div className="pl-3.5 flex items-center gap-2">
                    <span className="text-xs text-neutral-500">Confidence:</span>
                    <div className="w-24 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${s.confidence}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

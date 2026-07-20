import React from "react";
import { Zap } from "lucide-react";

interface Props {
  events: any[];
}

export function ActivityFeed({ events }: Props) {
  const defaultEvents = [
    { id: 1, message: "Blueprint generated successfully.", time: "2 min ago" },
    { id: 2, message: "Mapped 97 styles.", time: "1 min ago" },
    { id: 3, message: "AI suggested 3 mappings.", time: "45 sec ago" },
    { id: 4, message: "Validation found 2 warnings.", time: "Just now" }
  ];

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-medium text-neutral-400">Activity Feed</h3>
      </div>
      
      <div className="space-y-4">
        {defaultEvents.map((evt, i) => (
          <div key={evt.id} className="flex gap-3 relative">
            {i !== defaultEvents.length - 1 && (
              <div className="absolute left-2 top-6 bottom-[-16px] w-[1px] bg-neutral-800" />
            )}
            <div className="w-4 h-4 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center shrink-0 mt-0.5 z-10">
              <Zap className="w-2 h-2 text-indigo-400" />
            </div>
            <div>
              <p className="text-sm text-neutral-200">{evt.message}</p>
              <span className="text-xs text-neutral-500">{evt.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

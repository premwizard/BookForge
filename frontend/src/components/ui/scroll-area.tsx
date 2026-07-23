import * as React from "react";

export function ScrollArea({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`overflow-y-auto max-h-[400px] ${className}`} {...props}>
      {children}
    </div>
  );
}

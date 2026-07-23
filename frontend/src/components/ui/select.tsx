import * as React from "react";

export function Select({ children, value, onValueChange, ...props }: any) {
  return <div className="relative">{children}</div>;
}

export function SelectTrigger({ children, className = "", ...props }: any) {
  return (
    <div className={`px-3 py-2 border rounded-lg bg-white dark:bg-zinc-900 text-xs font-semibold cursor-pointer ${className}`} {...props}>
      {children}
    </div>
  );
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  return <span>{placeholder || "Select option..."}</span>;
}

export function SelectContent({ children, className = "", ...props }: any) {
  return <div className={`p-1 bg-white dark:bg-zinc-950 border rounded-lg shadow-lg text-xs mt-1 ${className}`} {...props}>{children}</div>;
}

export function SelectItem({ children, value, ...props }: any) {
  return (
    <div className="px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded cursor-pointer text-xs" {...props}>
      {children}
    </div>
  );
}

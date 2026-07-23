import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

export function Badge({ className = "", variant = "default", ...props }: BadgeProps) {
  const base = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-100 text-gray-900 dark:bg-zinc-800 dark:text-gray-100",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline: "text-gray-900 border border-gray-200 dark:text-gray-100 dark:border-zinc-800"
  };
  return <div className={`${base} ${variants[variant] || variants.default} ${className}`} {...props} />;
}

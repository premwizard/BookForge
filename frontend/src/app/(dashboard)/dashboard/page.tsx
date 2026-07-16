"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderOpen, FileText, CheckCircle2, Clock } from "lucide-react";

const stats = [
  {
    name: "Total Projects",
    value: "12",
    icon: FolderOpen,
    description: "+2 from last month",
  },
  {
    name: "Documents Processed",
    value: "145",
    icon: FileText,
    description: "+18% from last month",
  },
  {
    name: "Success Rate",
    value: "98.5%",
    icon: CheckCircle2,
    description: "Formatting validation",
  },
  {
    name: "Avg Processing Time",
    value: "1.2m",
    icon: Clock,
    description: "Per 100 pages",
  },
];

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {stat.name}
                </CardTitle>
                <Icon className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4 border-b border-gray-100 dark:border-zinc-800 pb-4 last:border-0 last:pb-0">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">Document Formatting Completed</p>
                    <p className="text-sm text-gray-500">Project: Science Fiction Anthology</p>
                  </div>
                  <div className="text-sm text-gray-500">2h ago</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Processing Queue</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="flex flex-col items-center justify-center h-40 text-gray-500">
               <Clock className="h-8 w-8 mb-2 opacity-50" />
               <p>No jobs in queue.</p>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

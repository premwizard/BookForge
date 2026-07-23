"use client";

import React, { useState } from "react";
import { ShieldCheck, Download, Search, Filter, Clock, HardDrive, ShieldAlert, CheckCircle2 } from "lucide-react";

export interface AuditLogEntry {
  id: string;
  action: string;
  category: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
  ip_address: string;
  device_info: string;
  created_at: string;
}

export default function AuditLogsTable() {
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const [logs, setLogs] = useState<AuditLogEntry[]>([
    { id: "log-1", action: "SECURITY_LOGIN_SUCCESS", category: "SECURITY", severity: "INFO", ip_address: "192.168.1.42", device_info: "Chrome 126 / Windows", created_at: "Today 10:45 AM" },
    { id: "log-2", action: "PUBLISHER_BLUEPRINT_PUBLISHED", category: "TEMPLATE", severity: "INFO", ip_address: "192.168.1.42", device_info: "DocForge Studio Client", created_at: "Today 10:30 AM" },
    { id: "log-3", action: "DOCUMENT_EXPORT_PDF_X1A", category: "EXPORT", severity: "INFO", ip_address: "10.0.0.12", device_info: "Export Celery Worker #4", created_at: "Today 10:15 AM" },
    { id: "log-4", action: "API_KEY_GENERATED", category: "SECURITY", severity: "WARNING", ip_address: "192.168.1.42", device_info: "Chrome 126 / Windows", created_at: "Yesterday 4:20 PM" },
    { id: "log-5", action: "SOC2_COMPLIANCE_CHECK_PASSED", category: "SECURITY", severity: "INFO", ip_address: "127.0.0.1", device_info: "Internal SIEM Daemon", created_at: "Jul 21, 2026" }
  ]);

  const filteredLogs = logs.filter(l => {
    const matchesCat = categoryFilter === "ALL" || l.category === categoryFilter;
    const matchesSearch = search === "" || l.action.toLowerCase().includes(search.toLowerCase()) || l.ip_address.includes(search);
    return matchesCat && matchesSearch;
  });

  const handleExportCSV = () => {
    const header = "ID,Action,Category,Severity,IP Address,Timestamp\n";
    const rows = filteredLogs.map(l => `${l.id},${l.action},${l.category},${l.severity},${l.ip_address},${l.created_at}`);
    const blob = new Blob([header + rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "soc2_audit_trail_report.csv";
    a.click();
  };

  return (
    <div className="p-6 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-zinc-800 pb-3">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            Immutable SOC2 Audit Trail Log
          </h3>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center space-x-1.5 shadow-sm"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export Audit CSV</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2 flex-1 w-full">
          <Search className="h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search action or IP address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white font-semibold"
          >
            <option value="ALL">All Categories</option>
            <option value="SECURITY">Security</option>
            <option value="DOCUMENT">Document Edits</option>
            <option value="EXPORT">Exports</option>
            <option value="TEMPLATE">Templates</option>
          </select>
        </div>
      </div>

      {/* Audit Table */}
      <div className="border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-gray-50 dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 text-gray-500 font-bold uppercase text-[10px]">
            <tr>
              <th className="px-4 py-2.5">Action Event</th>
              <th className="px-4 py-2.5">Category</th>
              <th className="px-4 py-2.5">Severity</th>
              <th className="px-4 py-2.5">IP Address</th>
              <th className="px-4 py-2.5 text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map(l => (
              <tr key={l.id} className="border-b border-gray-100 dark:border-zinc-800/50 hover:bg-gray-50 dark:hover:bg-zinc-900/50">
                <td className="px-4 py-2.5 font-bold font-mono text-gray-900 dark:text-white">{l.action}</td>
                <td className="px-4 py-2.5">
                  <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    {l.category}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                    l.severity === "INFO" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" :
                    l.severity === "WARNING" ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" :
                    "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                  }`}>
                    {l.severity}
                  </span>
                </td>
                <td className="px-4 py-2.5 font-mono text-gray-600 dark:text-gray-400">{l.ip_address}</td>
                <td className="px-4 py-2.5 text-right text-gray-400">{l.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

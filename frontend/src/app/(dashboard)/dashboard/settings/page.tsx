"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/authStore";
import AuditLogsTable from "@/components/audit/AuditLogsTable";
import ApiKeyManager from "@/components/audit/ApiKeyManager";
import { 
  ShieldCheck, Key, Lock, CreditCard, Bell, User, Building, Download, 
  CheckCircle2, AlertTriangle, FileText, Cpu
} from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"profile" | "audit" | "apikeys" | "compliance" | "billing" | "notifications">("profile");

  return (
    <div className="space-y-6 max-w-5xl text-xs">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <ShieldCheck className="h-7 w-7 text-blue-600 dark:text-blue-400 mr-2" />
          Enterprise Security, Audit & Administration Studio
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage immutable SOC2 audit logs, API key access control, compliance retention policies, and enterprise billing.
        </p>
      </div>

      {/* Tabs Navigation Header */}
      <div className="flex items-center space-x-2 border-b border-gray-200 dark:border-zinc-800 pb-1 flex-wrap gap-y-1">
        {[
          { id: "profile", label: "Profile & Account", icon: User },
          { id: "audit", label: "Immutable Audit Logs", icon: ShieldCheck },
          { id: "apikeys", label: "API Key Access", icon: Key },
          { id: "compliance", label: "SOC2 & Compliance", icon: Building },
          { id: "billing", label: "Billing & Licenses", icon: CreditCard },
          { id: "notifications", label: "Notifications", icon: Bell }
        ].map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3 py-2 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === t.id
                  ? "bg-blue-600 text-white shadow"
                  : "bg-white dark:bg-zinc-950 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-900"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Profile & Account */}
      {activeTab === "profile" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Profile & User Credentials</CardTitle>
            <CardDescription className="text-xs">Update your personal account credentials and security role.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Email Address</Label>
              <Input type="email" defaultValue={user?.email || "admin@docforge.com"} disabled className="text-xs" />
              <p className="text-[10px] text-gray-500">Your organization SSO email address.</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Security Role (RBAC)</Label>
              <Input type="text" defaultValue={user?.role || "Publisher Administrator"} disabled className="text-xs font-bold text-blue-600" />
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button className="text-xs">Save Profile Changes</Button>
          </CardFooter>
        </Card>
      )}

      {/* Tab 2: Immutable Audit Logs */}
      {activeTab === "audit" && <AuditLogsTable />}

      {/* Tab 3: API Key Access */}
      {activeTab === "apikeys" && <ApiKeyManager />}

      {/* Tab 4: SOC2 & Compliance */}
      {activeTab === "compliance" && (
        <div className="space-y-4">
          <div className="p-6 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3 dark:border-zinc-800">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center">
                <Building className="h-5 w-5 text-emerald-600 mr-2" />
                SOC2 Type II & Data Retention Compliance
              </h3>
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                ✓ 100% Compliant
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 space-y-1">
                <div className="font-bold text-gray-900 dark:text-white">GDPR Data Retention Policy</div>
                <div className="text-gray-500">Immutable 90-day active audit log retention policy enabled.</div>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 space-y-1">
                <div className="font-bold text-gray-900 dark:text-white">Data Encryption at Rest</div>
                <div className="text-gray-500">AES-256 GCM database and file artifact encryption active.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Billing & Licenses */}
      {activeTab === "billing" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Enterprise Licensing & Subscription</CardTitle>
            <CardDescription className="text-xs">Manage seat licensing and monthly usage quotas.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-4 border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/20 rounded-xl">
              <div>
                <h3 className="font-bold text-blue-900 dark:text-blue-100 text-sm">Enterprise Publisher Suite</h3>
                <p className="text-xs text-blue-700 dark:text-blue-300">Unlimited Multi-Format Releases & AI Formatting Copilot</p>
              </div>
              <div className="text-right">
                <div className="font-bold text-xl text-blue-900 dark:text-blue-100">$299/mo</div>
                <p className="text-[10px] text-blue-700 dark:text-blue-300">Active Seats: 10 / 25</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-between">
            <Button variant="outline" className="text-xs">Manage Seats</Button>
            <Button className="text-xs">Download Latest Invoice</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

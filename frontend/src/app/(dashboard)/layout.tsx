"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { BookOpen, FolderOpen, LayoutDashboard, Settings, LogOut, FileText, Workflow, Edit3, Download, Sparkles } from "lucide-react";
import { useEffect } from "react";

const sidebarLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/projects", label: "Projects", icon: FolderOpen },
  { href: "/dashboard/editor", label: "Visual Editor", icon: Edit3 },
  { href: "/dashboard/export", label: "Export & Releases", icon: Download },
  { href: "/dashboard/ai", label: "AI Copilot", icon: Sparkles },
  { href: "/dashboard/workflows", label: "Workflows", icon: Workflow },
  { href: "/dashboard/templates", label: "Templates", icon: FileText },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, token } = useAuthStore();

  useEffect(() => {
    // If not logged in and we are trying to access dashboard, we could redirect here.
    // For now we allow viewing to see the UI.
    // if (!token) {
    //   router.push("/login");
    // }
  }, [token, router]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-zinc-900">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-zinc-800">
          <BookOpen className="h-6 w-6 text-blue-600 mr-2" />
          <span className="text-xl font-bold text-gray-900 dark:text-white">BookForge</span>
        </div>
        
        <div className="p-4 space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-800"
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200 dark:border-zinc-800">
          <button 
            onClick={() => { logout(); router.push("/login"); }}
            className="flex items-center px-4 py-3 w-full text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-800 transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between px-8">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            {sidebarLinks.find(l => l.href === pathname)?.label || "Dashboard"}
          </h1>
          <div className="flex items-center space-x-4">
             <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm">
               {user?.email?.charAt(0).toUpperCase() || 'U'}
             </div>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import DocumentUploadModal from "@/components/projects/DocumentUploadModal";
import { 
  BookOpen, FolderOpen, ArrowLeft, Upload, Edit3, CheckCircle2, 
  Users, Milestone, FileText, Download, Play, RefreshCw, Star, Trash2
} from "lucide-react";
import Link from "next/link";

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<"documents" | "members" | "milestones">("documents");
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const [documents, setDocuments] = useState([
    { id: "doc-1", name: "Chapter 1: Executive Overview & Pipeline Architecture", filename: "chapter1_arch.docx", pages: 12, status: "Completed", date: "10:45 AM" },
    { id: "doc-2", name: "Chapter 2: Quantum Mechanical Document Layouts", filename: "chapter2_quantum.docx", pages: 16, status: "Formatting", date: "10:30 AM" },
    { id: "doc-3", name: "Chapter 3: Multi-Format Rendering & Archival PDF/A", filename: "chapter3_pdfa.docx", pages: 14, status: "Parsed", date: "Yesterday" }
  ]);

  const [members, setMembers] = useState([
    { name: "Dr. Aris Thorne", email: "aris@docforge.com", role: "OWNER", status: "Active" },
    { name: "Elena Vance", email: "elena@publisher.com", role: "MANAGING_EDITOR", status: "Active" },
    { name: "Marcus Brody", email: "marcus@layout.org", role: "LAYOUT_ARCHITECT", status: "Active" }
  ]);

  const [milestones, setMilestones] = useState([
    { tag: "v2.0-final-press", date: "Today 11:00 AM", notes: "Final Press Release Candidate for print submission.", author: "Dr. Aris Thorne" },
    { tag: "v1.5-editorial", date: "Yesterday 4:30 PM", notes: "Peer review proofing completed with 0 errors.", author: "Elena Vance" },
    { tag: "v1.0-draft", date: "Jul 20, 2026", notes: "Initial manuscript ingestion.", author: "Dr. Aris Thorne" }
  ]);

  const handleUploadSuccess = (newDoc: any) => {
    setDocuments([newDoc, ...documents]);
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-950 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
        <div className="space-y-1">
          <Link href="/dashboard/projects" className="inline-flex items-center font-semibold text-blue-600 hover:underline mb-1">
            <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to Projects Directory
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <BookOpen className="h-7 w-7 text-blue-600 dark:text-blue-400 mr-2" />
            Quantum Publishing Architecture Volume 1
          </h1>
          <p className="text-gray-500">Academic Science Journal • ISBN: 978-0-123456-78-9 • Category: Academic & Technical</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsUploadOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow flex items-center space-x-1.5"
          >
            <Upload className="h-4 w-4" />
            <span>Upload Manuscript</span>
          </button>
        </div>
      </div>

      {/* Project Telemetry Metrics Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 space-y-1">
          <div className="text-gray-500 font-semibold uppercase tracking-wider text-[10px]">Pipeline Progress</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">85% Complete</div>
          <div className="w-full bg-gray-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden mt-1">
            <div className="bg-blue-600 h-full w-[85%]"></div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 space-y-1">
          <div className="text-gray-500 font-semibold uppercase tracking-wider text-[10px]">Active Manuscripts</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{documents.length} Chapters</div>
          <div className="text-gray-400 text-[10px]">42 Total Pages</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 space-y-1">
          <div className="text-gray-500 font-semibold uppercase tracking-wider text-[10px]">Team Collaborators</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{members.length} Members</div>
          <div className="text-emerald-600 font-semibold text-[10px]">✓ Active Team RBAC</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 space-y-1">
          <div className="text-gray-500 font-semibold uppercase tracking-wider text-[10px]">Latest Release Milestone</div>
          <div className="text-base font-bold text-purple-600 dark:text-purple-400 font-mono">v2.0-final-press</div>
          <div className="text-gray-400 text-[10px]">Tagged Today 11:00 AM</div>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex items-center space-x-2 border-b border-gray-200 dark:border-zinc-800 pb-1">
        <button
          onClick={() => setActiveTab("documents")}
          className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${
            activeTab === "documents"
              ? "bg-blue-600 text-white shadow"
              : "bg-white dark:bg-zinc-950 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-900"
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Manuscript Documents ({documents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("members")}
          className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${
            activeTab === "members"
              ? "bg-blue-600 text-white shadow"
              : "bg-white dark:bg-zinc-950 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-900"
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Collaborators & Team</span>
        </button>

        <button
          onClick={() => setActiveTab("milestones")}
          className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${
            activeTab === "milestones"
              ? "bg-blue-600 text-white shadow"
              : "bg-white dark:bg-zinc-950 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-900"
          }`}
        >
          <Milestone className="h-4 w-4" />
          <span>Release Milestones</span>
        </button>
      </div>

      {/* Tab 1: Documents List */}
      {activeTab === "documents" && (
        <div className="p-6 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b pb-3 dark:border-zinc-800">
            <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider">Manuscript Documents Pipeline</h3>
            <button onClick={() => setIsUploadOpen(true)} className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold flex items-center">
              <Upload className="h-3.5 w-3.5 mr-1" /> Ingest New Document
            </button>
          </div>

          <div className="space-y-2">
            {documents.map(doc => (
              <div key={doc.id} className="p-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 flex items-center justify-between gap-4 hover:border-blue-500 transition-all">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-blue-100 dark:bg-blue-950 text-blue-600 rounded-lg font-bold">
                    DOC
                  </div>
                  <div>
                    <div className="font-bold text-sm text-gray-900 dark:text-white">{doc.name}</div>
                    <div className="text-gray-500 text-[10px] mt-0.5">{doc.filename} • {doc.pages} Pages • Updated {doc.date}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    doc.status === "Completed" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" :
                    doc.status === "Formatting" ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" :
                    "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                  }`}>
                    {doc.status}
                  </span>

                  <Link href="/dashboard/editor">
                    <button className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center shadow">
                      <Edit3 className="h-3.5 w-3.5 mr-1" /> Open in Visual Editor
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Members & Team */}
      {activeTab === "members" && (
        <div className="p-6 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-sm space-y-3">
          <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider border-b pb-3 dark:border-zinc-800">
            Collaborator Team Permissions & Roles
          </h3>

          <div className="space-y-2">
            {members.map(m => (
              <div key={m.email} className="p-3.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 flex items-center justify-between">
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">{m.name}</div>
                  <div className="text-gray-500 text-[10px]">{m.email}</div>
                </div>

                <span className="px-2.5 py-1 rounded bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 font-bold text-[10px]">
                  {m.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Modal */}
      <DocumentUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        projectId={params.id}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
}

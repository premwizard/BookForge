"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FolderPlus, BookOpen, Clock, MoreVertical, Search, LayoutGrid, List as ListIcon, Star, Trash2, Upload, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import DocumentUploadModal from "@/components/projects/DocumentUploadModal";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([
    { id: "proj-1", name: "Quantum Publishing Architecture Volume 1", description: "Academic 6x9 manuscript format with Garamond typography.", status: "Formatting", favorite: true, total_documents: 3, total_pages: 42, completion: 85, created_at: "2026-07-20" },
    { id: "proj-2", name: "Modern Artificial Intelligence & Agentic Workflows", description: "Technical multi-column ebook & PDF press release.", status: "Completed", favorite: false, total_documents: 5, total_pages: 180, completion: 100, created_at: "2026-07-15" },
    { id: "proj-3", name: "Corporate Financial & Annual Compliance Report 2026", description: "Corporate financial layout with custom table styling.", status: "In Review", favorite: true, total_documents: 2, total_pages: 64, completion: 70, created_at: "2026-07-10" }
  ]);

  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(undefined);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [search, setSearch] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    const newP = {
      id: `proj-${Date.now()}`,
      name: newProjectName,
      description: newProjectDesc || "Custom publishing project workspace.",
      status: "Active",
      favorite: false,
      total_documents: 0,
      total_pages: 0,
      completion: 10,
      created_at: new Date().toISOString().split("T")[0]
    };
    setProjects([newP, ...projects]);
    setNewProjectName("");
    setNewProjectDesc("");
    setIsCreating(false);
  };

  const toggleFavorite = (id: string) => {
    setProjects(projects.map(p => p.id === id ? { ...p, favorite: !p.favorite } : p));
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <BookOpen className="h-7 w-7 text-blue-600 dark:text-blue-400 mr-2" />
            Publishing Projects & Catalog Hub
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage multi-document manuscripts, publishing catalogs, team roles, and processing telemetry.</p>
        </div>
        <Button onClick={() => setIsCreating(!isCreating)}>
          <FolderPlus className="mr-2 h-4 w-4" /> New Publishing Project
        </Button>
      </div>

      {/* New Project Form */}
      {isCreating && (
        <Card className="border-blue-200 dark:border-blue-900 bg-blue-50/40 dark:bg-blue-950/20">
          <CardContent className="pt-6">
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 space-y-1">
                  <label className="font-bold text-gray-800 dark:text-gray-200">Project Name</label>
                  <Input 
                    placeholder="e.g. Quantum Mechanics Textbook 2026" 
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="font-bold text-gray-800 dark:text-gray-200">Description</label>
                  <Input 
                    placeholder="Short description..." 
                    value={newProjectDesc}
                    onChange={(e) => setNewProjectDesc(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2 self-end">
                <Button type="button" variant="ghost" onClick={() => setIsCreating(false)}>Cancel</Button>
                <Button type="submit" disabled={!newProjectName.trim()}>
                  Create Project
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Search & View Mode Switcher */}
      <div className="flex items-center justify-between space-x-2">
        <div className="flex-1 flex items-center space-x-2 bg-white dark:bg-zinc-950 p-2 rounded-lg border border-gray-200 dark:border-zinc-800">
          <Search className="h-4 w-4 text-gray-400 ml-2" />
          <Input 
            type="text" 
            placeholder="Search projects by title or category..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-0 shadow-none focus-visible:ring-0 px-2 text-xs"
          />
        </div>
        <div className="flex bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden">
          <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} className="rounded-none border-r px-3" onClick={() => setViewMode('grid')}>
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === 'table' ? 'secondary' : 'ghost'} className="rounded-none px-3" onClick={() => setViewMode('table')}>
            <ListIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card 
            className="border-dashed border-2 border-gray-300 dark:border-zinc-700 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-colors cursor-pointer flex flex-col items-center justify-center p-6 min-h-[220px] group"
            onClick={() => setIsCreating(true)}
          >
            <div className="p-3 bg-gray-100 dark:bg-zinc-800 rounded-full group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 mb-3 transition-colors">
              <FolderPlus className="h-8 w-8 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
            </div>
            <span className="text-gray-700 dark:text-gray-300 font-bold text-sm">Create New Publishing Project</span>
          </Card>

          {filteredProjects.map((project: any) => (
            <Card key={project.id} className="hover:border-blue-500 transition-all flex flex-col justify-between group">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-lg">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <button onClick={() => toggleFavorite(project.id)} className="p-1 text-gray-400 hover:text-yellow-400">
                    <Star className={`h-4 w-4 ${project.favorite ? "fill-yellow-400 text-yellow-400" : ""}`} />
                  </button>
                </div>

                <Link href={`/dashboard/projects/${project.id}`}>
                  <CardTitle className="mt-3 text-base font-bold line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {project.name}
                  </CardTitle>
                </Link>
                <CardDescription className="line-clamp-2 text-xs mt-1">
                  {project.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">{project.total_documents} Documents • {project.total_pages} Pages</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    project.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                    project.status === 'Formatting' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                    'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                  }`}>
                    {project.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-gray-400">
                    <span>Processing Completion</span>
                    <span className="font-bold">{project.completion || 85}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full" style={{ width: `${project.completion || 85}%` }}></div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-2 border-t dark:border-zinc-800">
                  <Link href={`/dashboard/projects/${project.id}`} className="flex-1">
                    <Button variant="outline" className="w-full text-xs font-bold">
                      Open Command Center
                    </Button>
                  </Link>

                  <Button 
                    variant="outline"
                    className="text-xs"
                    onClick={() => {
                      setSelectedProjectId(project.id);
                      setIsUploadOpen(true);
                    }}
                  >
                    <Upload className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-950">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50 dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
              <tr>
                <th className="px-4 py-3 font-bold">Project Title</th>
                <th className="px-4 py-3 font-bold">Status</th>
                <th className="px-4 py-3 font-bold">Documents</th>
                <th className="px-4 py-3 font-bold">Progress</th>
                <th className="px-4 py-3 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project: any) => (
                <tr key={project.id} className="border-b border-gray-100 dark:border-zinc-800/50 hover:bg-gray-50 dark:hover:bg-zinc-900/50">
                  <td className="px-4 py-3 font-bold">
                    <Link href={`/dashboard/projects/${project.id}`} className="hover:text-blue-600">
                      {project.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                      {project.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{project.total_documents} Manuscripts</td>
                  <td className="px-4 py-3 font-mono font-bold text-blue-600">{project.completion || 85}%</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/dashboard/projects/${project.id}`}>
                      <Button variant="ghost" size="sm" className="font-bold text-xs">
                        Open Project
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Upload Document Modal */}
      <DocumentUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        projectId={selectedProjectId}
      />
    </div>
  );
}

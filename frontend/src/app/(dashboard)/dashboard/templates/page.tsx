"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Plus, FileText, Upload, Settings, LayoutTemplate, Sparkles, CheckCircle2, BookOpen } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([
    { id: "tmpl-1", name: "Penguin Standard Academic 6x9", category: "Academic & Fiction", description: "Standard 6x9 trade book template with Garamond typography.", version: 2, styles_count: 5, is_active: true },
    { id: "tmpl-2", name: "Science Journal Double Column", category: "Academic Journal", description: "2-Column IEEE / Nature style journal layout template.", version: 1, styles_count: 8, is_active: true },
    { id: "tmpl-3", name: "Executive Financial Report A4", category: "Corporate & Legal", description: "Modern executive report template with custom table grid styles.", version: 1, styles_count: 6, is_active: true }
  ]);
  
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateCategory, setNewTemplateCategory] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateTemplate = () => {
    if (!newTemplateName) return;
    const newT = {
      id: `tmpl-${Date.now()}`,
      name: newTemplateName,
      category: newTemplateCategory || "General",
      description: "Custom uploaded publisher blueprint specification.",
      version: 1,
      styles_count: 4,
      is_active: true
    };
    setTemplates([...templates, newT]);
    setIsDialogOpen(false);
    setNewTemplateName("");
    setNewTemplateCategory("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <LayoutTemplate className="h-7 w-7 text-blue-600 dark:text-blue-400 mr-2" />
            Publisher Blueprint & Master Template Studio
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Manage machine-readable layout blueprints (`.blueprint.json`), typography hierarchies, and AI semantic style mappings.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={<Button />}>
            <Plus className="mr-2 h-4 w-4" /> Create Custom Blueprint
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Publisher Blueprint</DialogTitle>
              <DialogDescription>
                Create a template profile. Upload a DOCX file to automatically extract styles and geometry into a `.blueprint.json` AST.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 text-xs">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right font-semibold">Name</Label>
                <Input 
                  id="name" 
                  value={newTemplateName} 
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  placeholder="e.g. Penguin Standard 6x9"
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right font-semibold">Category</Label>
                <Input 
                  id="category" 
                  value={newTemplateCategory} 
                  onChange={(e) => setNewTemplateCategory(e.target.value)}
                  placeholder="e.g. Fiction, Academic"
                  className="col-span-3" 
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" onClick={handleCreateTemplate}>Create & Extract Blueprint</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search blueprints & templates..."
            className="pl-8 text-xs"
          />
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="overflow-hidden flex flex-col group hover:border-blue-500 transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  {template.category}
                </span>
                <span className="text-[10px] text-gray-400 font-mono">v{template.version}.0</span>
              </div>
              <CardTitle className="text-base flex items-center">
                <LayoutTemplate className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
                {template.name}
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 space-y-2 text-xs">
              <CardDescription className="text-xs">
                {template.description}
              </CardDescription>

              <div className="flex items-center justify-between text-[11px] text-gray-500 pt-2 border-t border-gray-100 dark:border-zinc-800 font-medium">
                <span>{template.styles_count} Extracted Styles</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Active Blueprint
                </span>
              </div>
            </CardContent>

            <CardFooter className="border-t border-gray-100 dark:border-zinc-800 pt-3 bg-gray-50/50 dark:bg-zinc-900/50">
              <Link href={`/dashboard/templates/${template.id}`} className="w-full">
                <Button variant="outline" className="w-full text-xs font-bold">
                  <Settings className="h-3.5 w-3.5 mr-2" /> Inspect & Edit Blueprint
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

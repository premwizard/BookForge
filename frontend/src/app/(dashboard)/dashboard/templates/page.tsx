'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Plus, FileText, Upload, Settings, LayoutTemplate } from 'lucide-react';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import api from '@/lib/api';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // New template state
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateCategory, setNewTemplateCategory] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/templates');
      setTemplates(res.data);
    } catch (error) {
      console.error("Failed to fetch templates", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTemplate = async () => {
    if (!newTemplateName) return;
    try {
      await api.post('/templates/', {
        name: newTemplateName,
        category: newTemplateCategory,
        is_active: true,
        is_default: false
      });
      setIsDialogOpen(false);
      setNewTemplateName('');
      setNewTemplateCategory('');
      fetchTemplates();
    } catch (error) {
      console.error("Failed to create template", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Template Library</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Select or create formatting templates for your documents.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={<Button />}>
            <Plus className="mr-2 h-4 w-4" /> Create Custom Template
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Template</DialogTitle>
              <DialogDescription>
                Create a new template profile. You can upload the DOCX file in the next step.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input 
                  id="name" 
                  value={newTemplateName} 
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  placeholder="e.g. Penguin Standard 6x9"
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">Category</Label>
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
              <Button type="button" onClick={handleCreateTemplate}>Create Template</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex items-center space-x-2 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search templates..."
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          <p>Loading templates...</p>
        ) : templates.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center p-12 border rounded-lg border-dashed">
            <LayoutTemplate className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium">No templates found</h3>
            <p className="text-muted-foreground mt-2 mb-6 text-center max-w-sm">Get started by creating a new document template. You can upload your official DOCX file to automatically extract styles.</p>
            <Button onClick={() => setIsDialogOpen(true)} variant="outline">Create Template</Button>
          </div>
        ) : (
          templates.map((template) => (
            <Card key={template.id} className="overflow-hidden flex flex-col group">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <LayoutTemplate className="h-4 w-4 mr-2 text-blue-500" />
                  {template.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <CardDescription className="text-sm">
                  Category: {template.category || "Uncategorized"}
                </CardDescription>
              </CardContent>
              <CardFooter className="border-t border-gray-100 dark:border-zinc-800 pt-4 bg-gray-50/50 dark:bg-zinc-900/50">
                <Link href={`/dashboard/templates/${template.id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    <Settings className="h-4 w-4 mr-2" /> Inspect & Upload
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

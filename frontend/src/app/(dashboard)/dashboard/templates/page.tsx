"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutTemplate, Plus, Star } from "lucide-react";

export default function TemplatesPage() {
  const templates = [
    {
      id: "1",
      name: "Standard Novel",
      description: "6x9 trade paperback format with standard 1-inch margins and dropped chapter starts.",
      isPopular: true,
      preview: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "2",
      name: "Academic Thesis",
      description: "Double-spaced, 1.5-inch left margin for binding, Times New Roman 12pt.",
      isPopular: false,
      preview: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "3",
      name: "Technical Documentation",
      description: "Optimized for code snippets, deep hierarchies, and detailed indexing.",
      isPopular: false,
      preview: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "4",
      name: "Modern Anthology",
      description: "Sleek, minimalist design perfect for poetry or short story collections.",
      isPopular: true,
      preview: "https://images.unsplash.com/photo-1474932430478-367d16b99031?q=80&w=600&auto=format&fit=crop",
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Templates</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Select or create formatting templates for your documents.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Custom Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="overflow-hidden flex flex-col group">
            <div className="h-40 overflow-hidden relative bg-gray-100 dark:bg-zinc-800">
              <img 
                src={template.preview} 
                alt={template.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {template.isPopular && (
                <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center shadow-sm">
                  <Star className="h-3 w-3 mr-1 fill-current" /> Popular
                </div>
              )}
            </div>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <LayoutTemplate className="h-4 w-4 mr-2 text-blue-500" />
                {template.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <CardDescription className="text-sm">
                {template.description}
              </CardDescription>
            </CardContent>
            <CardFooter className="border-t border-gray-100 dark:border-zinc-800 pt-4 bg-gray-50/50 dark:bg-zinc-900/50">
              <Button variant="outline" className="w-full">Use Template</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

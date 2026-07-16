"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, ChevronDown, FileJson, Database, AlignLeft, Image as ImageIcon, Table as TableIcon } from "lucide-react";
import api from "@/lib/api";
import { useState } from "react";

const TreeNode = ({ node }: { node: any }) => {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="ml-4 border-l border-gray-200 dark:border-zinc-800 pl-2 py-1">
      <div 
        className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 p-1 rounded"
        onClick={() => setExpanded(!expanded)}
      >
        {hasChildren ? (
          expanded ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />
        ) : (
          <div className="w-4" /> // placeholder
        )}
        <span className="text-xs font-semibold px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded">
          {node.type}
        </span>
        <span className="text-sm truncate max-w-[200px] text-gray-700 dark:text-gray-300">
          {node.text}
        </span>
      </div>
      {expanded && hasChildren && (
        <div className="mt-1">
          {node.children.map((child: any, idx: number) => (
            <TreeNode key={idx} node={child} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function DocumentStructurePage() {
  const params = useParams();
  const documentId = params?.docId as string;

  const { data: structure, isLoading: isStructureLoading } = useQuery({
    queryKey: ["document", documentId, "structure"],
    queryFn: async () => {
      // Stub data for now if API isn't ready
      // const res = await api.get(`/parser/${documentId}/structure`);
      // return res.data;
      return [
        {
          id: "1", type: "Document", text: "", attributes: {},
          children: [
            { id: "2", type: "Heading1", text: "Chapter 1", attributes: {}, children: [
              { id: "3", type: "Paragraph", text: "This is a paragraph under chapter 1.", attributes: {}, children: [] },
              { id: "4", type: "Table", text: "", attributes: {}, children: [
                { id: "5", type: "TableRow", text: "", attributes: {}, children: [
                  { id: "6", type: "TableCell", text: "Cell 1", attributes: {}, children: [] }
                ]}
              ]}
            ]}
          ]
        }
      ];
    }
  });

  const { data: metadata } = useQuery({
    queryKey: ["document", documentId, "metadata"],
    queryFn: async () => {
      // const res = await api.get(`/parser/${documentId}/metadata`);
      // return res.data;
      return [
        { key: "title", value: "Parsed Document Title" },
        { key: "author", value: "John Doe" },
        { key: "page_count", value: "42" },
      ];
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Database className="h-8 w-8 text-blue-500" /> Document Structure
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">DOM representation of the parsed document.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-r">
          <CardHeader>
            <CardTitle className="text-lg">DOM Tree</CardTitle>
          </CardHeader>
          <CardContent className="h-[600px] overflow-y-auto">
            {isStructureLoading ? (
              <div>Loading...</div>
            ) : (
              <div>
                {structure?.map((node: any, idx: number) => (
                  <TreeNode key={idx} node={node} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="metadata" className="w-full">
              <TabsList>
                <TabsTrigger value="metadata"><AlignLeft className="h-4 w-4 mr-2" /> Metadata</TabsTrigger>
                <TabsTrigger value="json"><FileJson className="h-4 w-4 mr-2" /> JSON Inspector</TabsTrigger>
                <TabsTrigger value="images"><ImageIcon className="h-4 w-4 mr-2" /> Images</TabsTrigger>
                <TabsTrigger value="tables"><TableIcon className="h-4 w-4 mr-2" /> Tables</TabsTrigger>
              </TabsList>
              
              <TabsContent value="metadata" className="mt-4">
                <div className="space-y-4">
                  {metadata?.map((meta: any, idx: number) => (
                    <div key={idx} className="grid grid-cols-3 gap-4 border-b pb-2">
                      <div className="font-medium text-gray-600 dark:text-gray-400">{meta.key}</div>
                      <div className="col-span-2">{meta.value}</div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="json" className="mt-4">
                <div className="bg-gray-900 text-green-400 p-4 rounded-md h-[450px] overflow-auto font-mono text-xs">
                  <pre>{JSON.stringify(structure, null, 2)}</pre>
                </div>
              </TabsContent>

              <TabsContent value="images" className="mt-4">
                <div className="text-gray-500 text-sm">No images found in this document.</div>
              </TabsContent>

              <TabsContent value="tables" className="mt-4">
                <div className="text-gray-500 text-sm">Select a table from the DOM tree to view it.</div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

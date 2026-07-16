"use client";

import React, { useState, useEffect } from 'react';
import { FileCode, Settings, LayoutTemplate, Search, CheckCircle2, ChevronRight, Hash, Image as ImageIcon, Table as TableIcon } from 'lucide-react';
import api from '@/lib/api';

export default function BlueprintViewer({ params }: { params: { id: string } }) {
  const [blueprint, setBlueprint] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('styles');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // In a real app we'd fetch from `/api/v1/blueprints/versions/${params.id}`
    // For this demonstration, we mock the blueprint response.
    setTimeout(() => {
      setBlueprint({
        version: "1.0",
        publisher: "ABC Publications",
        template_metadata: {
          title: "Standard Fiction Template",
          author: "Design Team",
          language: "en-US"
        },
        styles: {
          "Heading 1": { type: "paragraph", font: { name: "Inter", size: 24, bold: true }, paragraph: { space_after: 12 } },
          "Heading 2": { type: "paragraph", font: { name: "Inter", size: 18, bold: true }, paragraph: { space_after: 8 } },
          "Body Text": { type: "paragraph", font: { name: "Georgia", size: 11 }, paragraph: { line_spacing: 1.5, space_after: 10 } },
          "Caption": { type: "paragraph", font: { name: "Inter", size: 9, italic: true }, paragraph: { alignment: "CENTER" } }
        },
        layout: [
          { section_index: 0, orientation: "PORTRAIT", margins: { top: 72, bottom: 72, left: 72, right: 72 } }
        ]
      });
      setLoading(false);
    }, 800);
  }, [params.id]);

  if (loading) {
    return <div className="p-8 animate-pulse text-gray-500">Loading Blueprint Specification...</div>;
  }

  const filteredStyles = Object.entries(blueprint.styles || {}).filter(([name]) => 
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-indigo-600" />
            Blueprint Viewer
          </h2>
          <p className="text-xs text-gray-500 mt-1 truncate">v{blueprint.version} • {blueprint.publisher}</p>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <button onClick={() => setActiveTab('styles')} className={`w-full flex items-center justify-between p-2 rounded-md text-sm ${activeTab === 'styles' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
            <span className="flex items-center gap-2"><Settings className="w-4 h-4" /> Styles</span>
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{Object.keys(blueprint.styles).length}</span>
          </button>
          <button onClick={() => setActiveTab('layout')} className={`w-full flex items-center justify-between p-2 rounded-md text-sm ${activeTab === 'layout' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
            <span className="flex items-center gap-2"><LayoutTemplate className="w-4 h-4" /> Layout</span>
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{blueprint.layout?.length || 0}</span>
          </button>
          <button onClick={() => setActiveTab('numbering')} className={`w-full flex items-center p-2 rounded-md text-sm ${activeTab === 'numbering' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
            <Hash className="w-4 h-4 mr-2" /> Numbering
          </button>
          <button onClick={() => setActiveTab('json')} className={`w-full flex items-center p-2 rounded-md text-sm ${activeTab === 'json' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
            <FileCode className="w-4 h-4 mr-2" /> Raw JSON
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{blueprint.template_metadata.title}</h1>
            <div className="flex items-center text-sm text-gray-500 mt-1 space-x-4">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-green-500" /> Validated</span>
              <span>Language: {blueprint.template_metadata.language}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {activeTab === 'styles' && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search styles..." 
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredStyles.map(([name, props]: any) => (
                  <div key={name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:border-indigo-300 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold text-gray-900 text-lg">{name}</h3>
                      <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium uppercase tracking-wider">
                        {props.type}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                      <div>
                        <span className="text-gray-500 block text-xs uppercase tracking-wider mb-1">Font</span>
                        <div className="font-medium text-gray-900">
                          {props.font?.name || "Inherit"} {props.font?.size ? `${props.font.size}pt` : ""}
                        </div>
                        <div className="text-gray-500 flex gap-2 mt-1">
                          {props.font?.bold && <span className="font-bold">B</span>}
                          {props.font?.italic && <span className="italic">I</span>}
                          {props.font?.underline && <span className="underline">U</span>}
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-gray-500 block text-xs uppercase tracking-wider mb-1">Paragraph</span>
                        <div className="text-gray-900">
                          Align: {props.paragraph?.alignment || "Left"}
                        </div>
                        <div className="text-gray-500 mt-1">
                          Spacing: {props.paragraph?.space_after ? `After ${props.paragraph.space_after}pt` : "None"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'layout' && (
            <div className="space-y-4">
              {blueprint.layout?.map((section: any, idx: number) => (
                <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 text-lg mb-4 border-b pb-2">Section {idx + 1}</h3>
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <span className="text-gray-500 block text-xs uppercase tracking-wider mb-1">Orientation</span>
                      <div className="font-medium text-gray-900 capitalize">{section.orientation?.toLowerCase() || 'Portrait'}</div>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-xs uppercase tracking-wider mb-1">Page Size</span>
                      <div className="font-medium text-gray-900">{section.page_width || 0} x {section.page_height || 0} pt</div>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-xs uppercase tracking-wider mb-1">Margins (Top / Bottom)</span>
                      <div className="font-medium text-gray-900">{section.margins?.top || 0}pt / {section.margins?.bottom || 0}pt</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'json' && (
            <div className="bg-gray-900 rounded-xl p-4 overflow-auto h-[calc(100vh-200px)]">
              <pre className="text-green-400 text-sm font-mono leading-relaxed">
                {JSON.stringify(blueprint, null, 2)}
              </pre>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

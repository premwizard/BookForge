"use client";

import React, { useState, useEffect } from 'react';
import { Network, Search, CheckCircle2, AlertCircle, Sparkles, Save, Filter, ChevronDown, Check, Undo, ArrowRightLeft } from 'lucide-react';
import api from '@/lib/api';

export default function MappingWorkspace({ params }: { params: { id: string } }) {
  const [mappings, setMappings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, ai, manual

  useEffect(() => {
    // In a real app we'd fetch from `/api/v1/mapping/${params.id}/mappings`
    setTimeout(() => {
      setMappings([
        { id: '1', raw_type: 'Heading 1', blueprint_style: 'Heading 1', confidence: 100, is_ai: false, status: 'approved' },
        { id: '2', raw_type: 'Subheading', blueprint_style: 'Heading 2', confidence: 95, is_ai: false, status: 'approved' },
        { id: '3', raw_type: 'BodyText', blueprint_style: 'Body Text', confidence: 90, is_ai: false, status: 'approved' },
        { id: '4', raw_type: 'Quote Block', blueprint_style: 'Block Text', confidence: 85, is_ai: true, reason: 'Semantic similarity to quotation blocks.', status: 'pending' },
        { id: '5', raw_type: 'AuthorBio', blueprint_style: 'Normal', confidence: 50, is_ai: true, reason: 'No exact match. Defaulting to Normal.', status: 'pending' },
      ]);
      setLoading(false);
    }, 800);
  }, [params.id]);

  const handleApprove = (id: string) => {
    setMappings(mappings.map(m => m.id === id ? { ...m, status: 'approved' } : m));
  };

  const handleApproveAll = () => {
    setMappings(mappings.map(m => ({ ...m, status: 'approved' })));
  };

  if (loading) {
    return <div className="p-8 animate-pulse text-gray-500">Loading Mapping Workspace...</div>;
  }

  const filtered = mappings.filter(m => {
    if (filter === 'ai') return m.is_ai;
    if (filter === 'manual') return m.status === 'pending';
    return true;
  });

  const pendingCount = mappings.filter(m => m.status === 'pending').length;

  return (
    <div className="flex h-screen bg-gray-50 flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Network className="w-5 h-5 text-indigo-700" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Style Mapping Workspace</h1>
            <p className="text-sm text-gray-500">Mapping raw elements to Standard Fiction Template</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600 font-medium bg-gray-100 px-3 py-1 rounded-full">
            {pendingCount} Pending Reviews
          </div>
          <button 
            onClick={handleApproveAll}
            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
          >
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            Approve All
          </button>
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm shadow-sm">
            <Save className="w-4 h-4" />
            Save Profile
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8 max-w-6xl mx-auto w-full">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <button onClick={() => setFilter('all')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === 'all' ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>All</button>
            <button onClick={() => setFilter('ai')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${filter === 'ai' ? 'bg-amber-100 text-amber-700' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}><Sparkles className="w-3.5 h-3.5"/> AI Suggested</button>
            <button onClick={() => setFilter('manual')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === 'manual' ? 'bg-rose-100 text-rose-700' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>Needs Review</button>
          </div>
          
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search mappings..." 
              className="w-full pl-9 pr-4 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Mapping List */}
        <div className="space-y-4">
          {filtered.map(mapping => (
            <div key={mapping.id} className={`bg-white rounded-xl shadow-sm border p-5 transition-all ${mapping.status === 'pending' ? 'border-amber-300 ring-1 ring-amber-100' : 'border-gray-200 hover:border-indigo-300'}`}>
              
              <div className="flex items-center justify-between">
                
                {/* Left Side: Raw Element */}
                <div className="flex-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1 block">Raw Element</span>
                  <div className="text-lg font-medium text-gray-900 bg-gray-50 py-2 px-3 rounded border border-gray-100 inline-block">
                    {mapping.raw_type}
                  </div>
                </div>

                {/* Center: Arrow & Confidence */}
                <div className="flex flex-col items-center justify-center px-8">
                  <div className="text-xs font-bold text-gray-400 mb-1">{mapping.confidence}% Match</div>
                  <div className={`h-0.5 w-16 relative ${mapping.confidence >= 95 ? 'bg-green-500' : mapping.confidence >= 70 ? 'bg-amber-400' : 'bg-rose-400'}`}>
                    <div className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-2 rotate-45 border-t-2 border-r-2 ${mapping.confidence >= 95 ? 'border-green-500' : mapping.confidence >= 70 ? 'border-amber-400' : 'border-rose-400'}`}></div>
                  </div>
                </div>

                {/* Right Side: Blueprint Style */}
                <div className="flex-1 flex justify-end">
                  <div className="w-full max-w-xs">
                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-500 mb-1 block text-right">Blueprint Style</span>
                    <div className="relative">
                      <select className="w-full appearance-none bg-white border border-indigo-200 text-gray-900 text-md font-medium rounded-lg px-4 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
                        <option value={mapping.blueprint_style}>{mapping.blueprint_style}</option>
                        <option value="Heading 1">Heading 1</option>
                        <option value="Heading 2">Heading 2</option>
                        <option value="Body Text">Body Text</option>
                        <option value="Normal">Normal</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="ml-6 pl-6 border-l border-gray-100 flex flex-col items-center justify-center space-y-2">
                  {mapping.status === 'pending' ? (
                    <button onClick={() => handleApprove(mapping.id)} className="p-2 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors" title="Approve">
                      <Check className="w-5 h-5" />
                    </button>
                  ) : (
                    <div className="p-2 rounded-full bg-gray-50 text-green-500 cursor-default" title="Approved">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  )}
                </div>

              </div>
              
              {/* AI Reason Context */}
              {mapping.is_ai && (
                <div className="mt-4 pt-3 border-t border-amber-100 flex items-start gap-2 text-sm text-amber-700 bg-amber-50/50 p-3 rounded-lg">
                  <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold block mb-0.5">AI Suggestion Reason:</span>
                    {mapping.reason}
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

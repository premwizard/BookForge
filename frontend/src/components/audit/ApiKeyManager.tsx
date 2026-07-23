"use client";

import React, { useState } from "react";
import { Key, Plus, Trash2, ShieldCheck, Copy, Check, Lock } from "lucide-react";

export interface ApiKeyItem {
  id: string;
  name: string;
  key_prefix: string;
  scopes: string[];
  created_at: string;
}

export default function ApiKeyManager() {
  const [keys, setKeys] = useState<ApiKeyItem[]>([
    { id: "key-1", name: "Production CI/CD Release Key", key_prefix: "sk_live_a1b2...", scopes: ["read", "write", "export"], created_at: "Jul 01, 2026" },
    { id: "key-2", name: "Staging Publisher Integration", key_prefix: "sk_live_f8e9...", scopes: ["read", "export"], created_at: "Jul 15, 2026" }
  ]);

  const [newKeyName, setNewKeyName] = useState("");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerateKey = () => {
    if (!newKeyName.trim()) return;
    const rawSecret = `sk_live_${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`;
    const newK: ApiKeyItem = {
      id: `key-${Date.now()}`,
      name: newKeyName,
      key_prefix: `${rawSecret.substring(0, 12)}...`,
      scopes: ["read", "write", "export"],
      created_at: "Just now"
    };
    setKeys([newK, ...keys]);
    setGeneratedKey(rawSecret);
    setNewKeyName("");
  };

  const handleRevokeKey = (id: string) => {
    setKeys(keys.filter(k => k.id !== id));
  };

  const copyToClipboard = () => {
    if (generatedKey) {
      navigator.clipboard.writeText(generatedKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-6 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4 text-xs">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-3">
        <div className="flex items-center space-x-2">
          <Key className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            API Keys & Programmatic Access
          </h3>
        </div>
        <span className="text-[10px] bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-2.5 py-0.5 rounded-full font-bold">
          HMAC-SHA256 Encrypted
        </span>
      </div>

      {/* Secret Key Display Modal Banner */}
      {generatedKey && (
        <div className="p-4 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/40 space-y-2">
          <div className="font-bold text-emerald-800 dark:text-emerald-300">
            ✓ New Secret Key Generated — Copy it now. It will not be shown again!
          </div>
          <div className="flex items-center space-x-2 bg-white dark:bg-zinc-900 p-2 rounded-lg border font-mono text-xs text-gray-900 dark:text-white">
            <span className="flex-1 truncate">{generatedKey}</span>
            <button onClick={copyToClipboard} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 text-blue-600">
              {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>
      )}

      {/* Generate Form */}
      <div className="flex items-center space-x-2">
        <input 
          type="text" 
          placeholder="New Key Description (e.g. Production Webhook Key)"
          value={newKeyName}
          onChange={(e) => setNewKeyName(e.target.value)}
          className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white font-medium"
        />
        <button
          onClick={handleGenerateKey}
          disabled={!newKeyName.trim()}
          className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center space-x-1 shadow-sm"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Generate Secret Key</span>
        </button>
      </div>

      {/* Active Keys List */}
      <div className="space-y-2 pt-2">
        {keys.map(k => (
          <div key={k.id} className="p-3.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-bold text-gray-900 dark:text-white flex items-center">
                <Lock className="h-3.5 w-3.5 text-purple-500 mr-1.5" />
                {k.name}
              </div>
              <div className="font-mono text-[10px] text-gray-500">{k.key_prefix} • Created {k.created_at}</div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex space-x-1">
                {k.scopes.map(s => (
                  <span key={s} className="px-2 py-0.5 rounded font-mono text-[9px] bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                    {s}
                  </span>
                ))}
              </div>

              <button
                onClick={() => handleRevokeKey(k.id)}
                className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950 text-red-600 transition-colors"
                title="Revoke Key"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

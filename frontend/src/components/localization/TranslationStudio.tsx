"use client";

import React, { useState } from "react";
import { Languages, Globe, RefreshCw, CheckCircle2, ArrowRight, BookOpen, AlertCircle, AlignLeft, AlignRight } from "lucide-react";

export interface TranslationVariant {
  id: string;
  lang_code: string;
  lang_name: string;
  quality_score: number;
  expansion: number;
  is_rtl: boolean;
  status: string;
}

export default function TranslationStudio() {
  const [targetLang, setTargetLang] = useState("de");
  const [isTranslating, setIsTranslating] = useState(false);

  const variants: TranslationVariant[] = [
    { id: "de", lang_code: "de", lang_name: "German (Deutsch)", quality_score: 98.8, expansion: 1.28, is_rtl: false, status: "Completed" },
    { id: "ja", lang_code: "ja", lang_name: "Japanese (日本語)", quality_score: 97.4, expansion: 0.85, is_rtl: false, status: "Completed" },
    { id: "ar", lang_code: "ar", lang_name: "Arabic (العربية)", quality_score: 96.9, expansion: 1.12, is_rtl: true, status: "Completed" },
    { id: "fr", lang_code: "fr", lang_name: "French (Français)", quality_score: 98.2, expansion: 1.18, is_rtl: false, status: "Completed" }
  ];

  const handleTranslate = () => {
    setIsTranslating(true);
    setTimeout(() => setIsTranslating(false), 1200);
  };

  const activeVariant = variants.find(v => v.lang_code === targetLang) || variants[0];

  return (
    <div className="p-6 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-zinc-800 pb-3">
        <div className="flex items-center space-x-2">
          <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            Layout-Aware AI Translation & Reflow Studio
          </h3>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white font-bold"
          >
            <option value="de">German (Deutsch)</option>
            <option value="ja">Japanese (日本語)</option>
            <option value="ar">Arabic (العربية)</option>
            <option value="fr">French (Français)</option>
          </select>

          <button
            onClick={handleTranslate}
            disabled={isTranslating}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center space-x-1.5 shadow-sm"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isTranslating ? "animate-spin" : ""}`} />
            <span>{isTranslating ? "Translating AST..." : "Run AI Translation"}</span>
          </button>
        </div>
      </div>

      {/* Language Metrics Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="p-3 rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 space-y-0.5">
          <div className="text-[10px] text-gray-500 font-bold uppercase">BLEU / COMET Quality</div>
          <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{activeVariant.quality_score}%</div>
          <div className="text-[9px] text-gray-400">High-Fidelity Context Match</div>
        </div>

        <div className="p-3 rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 space-y-0.5">
          <div className="text-[10px] text-gray-500 font-bold uppercase">Text Expansion Reflow</div>
          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {activeVariant.expansion > 1 ? `+${Math.round((activeVariant.expansion - 1) * 100)}%` : `-${Math.round((1 - activeVariant.expansion) * 100)}%`}
          </div>
          <div className="text-[9px] text-gray-400">Auto-Tracking: -0.02em</div>
        </div>

        <div className="p-3 rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 space-y-0.5">
          <div className="text-[10px] text-gray-500 font-bold uppercase">Reading Direction</div>
          <div className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
            {activeVariant.is_rtl ? <AlignRight className="h-4 w-4 text-amber-500 mr-1" /> : <AlignLeft className="h-4 w-4 text-blue-500 mr-1" />}
            {activeVariant.is_rtl ? "Right-to-Left (RTL)" : "Left-to-Right (LTR)"}
          </div>
          <div className="text-[9px] text-gray-400">{activeVariant.is_rtl ? "Arabic / Hebrew Mode" : "Standard Latin Flow"}</div>
        </div>

        <div className="p-3 rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 space-y-0.5">
          <div className="text-[10px] text-gray-500 font-bold uppercase">Glossary Rules</div>
          <div className="text-lg font-bold text-purple-600 dark:text-purple-400">3 Domain Terms</div>
          <div className="text-[9px] text-gray-400">Physics & Typography Preserved</div>
        </div>
      </div>

      {/* Side-by-Side Manuscript Translation Diff */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Source English */}
        <div className="p-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 space-y-2">
          <div className="flex items-center justify-between border-b pb-2 dark:border-zinc-800">
            <span className="font-bold text-gray-900 dark:text-white text-xs">Source English (en-US)</span>
            <span className="px-2 py-0.5 rounded font-mono text-[9px] bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-gray-300">Original Manuscript</span>
          </div>

          <h4 className="font-bold text-sm text-gray-900 dark:text-white">Chapter 1: Quantum Layout Mechanics</h4>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            The fundamental architecture of DocForge relies on deterministic Internal Formatting Document Model (IFDM) AST nodes to deliver press-ready publishing output across print, digital ebook, and Web streams.
          </p>
        </div>

        {/* Target Translation */}
        <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/30 dark:bg-blue-950/20 space-y-2">
          <div className="flex items-center justify-between border-b pb-2 dark:border-blue-900/60">
            <span className="font-bold text-blue-900 dark:text-blue-200 text-xs">Target {activeVariant.lang_name}</span>
            <span className="px-2 py-0.5 rounded font-mono text-[9px] bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold">
              AI AST Reflow Matched
            </span>
          </div>

          <h4 className="font-bold text-sm text-blue-950 dark:text-blue-100" dir={activeVariant.is_rtl ? "rtl" : "ltr"}>
            {targetLang === "de" ? "Kapitel 1: Quanten-Layout-Mechanik" :
             targetLang === "ja" ? "第1章：クアンタムレイアウトメカニクス" :
             targetLang === "ar" ? "الفصل 1: ميكانيكا التنسيق الكمومي" :
             "Chapitre 1: Mécanique de mise en page quantique"}
          </h4>

          <p className="text-gray-900 dark:text-gray-100 leading-relaxed" dir={activeVariant.is_rtl ? "rtl" : "ltr"}>
            {targetLang === "de" ? "Die grundlegende Architektur von DocForge basiert auf deterministischen IFDM-AST-Knoten, um druckfertige Veröffentlichungsergebnisse über Print-, Digital-E-Book- und Web-Streams hinweg zu liefern." :
             targetLang === "ja" ? "DocForgeの基本アーキテクチャは、決定論的なIFDM ASTノードに依存して、印刷、デジタル電子書籍、Webストリームにわたる印刷対応の出版出力を実現します。" :
             targetLang === "ar" ? "تعتمد البنية الأساسية لـ DocForge على عقد IFDM AST المحددة لتقديم مخرجات نشر جاهزة للطباعة عبر البث الرقمي والويب." :
             "L'architecture fondamentale de DocForge repose sur des nœuds AST IFDM déterministes pour fournir une sortie d'édition prête pour l'impression."}
          </p>
        </div>
      </div>
    </div>
  );
}

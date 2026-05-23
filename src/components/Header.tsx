import React from 'react';
import { Sparkles, Code, Layers } from 'lucide-react';

interface HeaderProps {
  onLoadDemo: () => void;
  hasSnippets: boolean;
}

export function Header({ onLoadDemo, hasSnippets }: HeaderProps) {
  return (
    <header className="relative overflow-hidden mb-8 border-b border-neutral-100 bg-white/60 backdrop-blur-md pb-6 pt-2">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center p-2 rounded-xl bg-indigo-50 text-indigo-600 ring-4 ring-indigo-50/50">
              <Code className="w-5 h-5" />
            </span>
            <span className="text-xs font-mono font-medium tracking-widest text-indigo-600 uppercase bg-indigo-50/70 px-2 py-0.5 rounded-full">
              Snippet Widget v1.0
            </span>
          </div>
          <h1 className="text-3xl font-bold font-display text-neutral-900 tracking-tight">
            Creatore di <span className="text-indigo-600 bg-clip-text">Card Snippet</span>
          </h1>
          <p className="text-sm text-neutral-500 mt-1 max-w-xl">
            Crea, personalizza ed esporta splendide card di codice per la tua homepage. I dati sono salvati al sicuro nel tuo browser (Local Storage).
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!hasSnippets && (
            <button
              onClick={onLoadDemo}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100/80 rounded-lg transition-colors cursor-pointer border border-indigo-100"
              id="btn-load-demo"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Carica Snippet di Esempio
            </button>
          )}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-50 border border-neutral-100 text-[11px] font-mono text-neutral-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Offline-Ready
          </div>
        </div>
      </div>
    </header>
  );
}

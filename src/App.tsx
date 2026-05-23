import React, { useState, useEffect, useRef } from 'react';
import { 
  Monitor, 
  FileCode, 
  Trash2, 
  Copy, 
  Check, 
  Plus, 
  Code, 
  Palette, 
  RefreshCw, 
  Terminal, 
  Search, 
  Sparkles, 
  Info,
  Layers,
  Layout,
  ExternalLink,
  Laptop
} from 'lucide-react';
import { SnippetCard, LANGUAGES, CARD_THEMES, CardTheme } from './types';

// Default initial snippets to make the desktop feel lively and ready to use
const DEFAULT_SNIPPETS: SnippetCard[] = [
  {
    id: 'setup-flex',
    title: 'Centrare Div (Tailwind)',
    code: '<div class="flex items-center justify-center min-h-screen">\n  <div class="p-6 bg-white rounded-xl shadow-md">\n    🎯 Centrato!\n  </div>\n</div>',
    language: 'html',
    tags: ['layout', 'css'],
    themeClass: 'bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-700 border-none text-white',
    textColor: 'text-white',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString() // 1 day ago
  },
  {
    id: 'js-fetch',
    title: 'Richiesta API Async',
    code: 'async function fetchData(url) {\n  try {\n    const response = await fetch(url);\n    if (!response.ok) throw new Error("Errore network");\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error("Fetch fallito:", error);\n  }\n}',
    language: 'javascript',
    tags: ['api', 'async'],
    themeClass: 'bg-radial from-slate-900 to-slate-950 border-slate-800 text-slate-100',
    textColor: 'text-slate-100',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString() // 5 hours ago
  },
  {
    id: 'sqlite-query',
    title: 'SQL Select Con Join',
    code: 'SELECT u.id, u.username, o.total_price\nFROM users u\nINNER JOIN orders o ON u.id = o.user_id\nWHERE o.status = \'completed\'\nORDER BY o.total_price DESC\nLIMIT 5;',
    language: 'sql',
    tags: ['db', 'query'],
    themeClass: 'bg-gradient-to-tr from-amber-500 via-red-500 to-purple-600 border-none text-white',
    textColor: 'text-white',
    createdAt: new Date().toISOString()
  }
];

export default function App() {
  // Database States
  const [snippets, setSnippets] = useState<SnippetCard[]>(() => {
    const saved = localStorage.getItem('cozy_card_snippets');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Errore nel parsing del local storage', e);
      }
    }
    return DEFAULT_SNIPPETS;
  });

  // Editor States & Input Fields
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [tagsInput, setTagsInput] = useState('');
  const [selectedThemeId, setSelectedThemeId] = useState('slate');

  // Interactive OS states
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editorCopied, setEditorCopied] = useState(false);
  
  // Custom mock screen wallpaper/theme
  const [screenBrightness, setScreenBrightness] = useState<number>(3); // 1 to 5
  const [wallpaperMode, setWallpaperMode] = useState<'cozy-grid' | 'cosmic-dark' | 'glass-retro'>('cozy-grid');

  // References for terminal and styling
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Keep digital clock updating in status bar
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Save automatically to local storage when array modifies
  useEffect(() => {
    localStorage.setItem('cozy_card_snippets', JSON.stringify(snippets));
  }, [snippets]);

  // Load selected snippet into editor
  const handleSelectSnippet = (snippet: SnippetCard) => {
    setSelectedId(snippet.id);
    setTitle(snippet.title);
    setCode(snippet.code);
    setLanguage(snippet.language);
    setTagsInput(snippet.tags ? snippet.tags.join(', ') : '');
    
    // Attempt to match background styling back to the defined themes
    const foundTheme = CARD_THEMES.find(t => t.backgroundClass === snippet.themeClass);
    if (foundTheme) {
      setSelectedThemeId(foundTheme.id);
    } else {
      setSelectedThemeId('slate');
    }
    showNotification('Snippet caricato nel workstation!');
  };

  // Switch back to empty "Add New" state
  const handleNewSnippet = () => {
    setSelectedId(null);
    setTitle('');
    setCode('');
    setLanguage('javascript');
    setTagsInput('');
    setSelectedThemeId('slate');
    showNotification('Editor ripulito. Pronto per un nuovo snippet!');
  };

  // Notification utility
  const showNotification = (msg: string) => {
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
    setToastMessage(msg);
    notificationTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Copy code utility
  const copyToClipboard = (text: string, id: string | 'editor') => {
    navigator.clipboard.writeText(text);
    if (id === 'editor') {
      setEditorCopied(true);
      setTimeout(() => setEditorCopied(false), 2000);
      showNotification('Codice dell\'editor copiato negli appunti! 📋');
    } else {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
      showNotification('Snippet copiato negli appunti! 📋');
    }
  };

  // Create or Update Action
  const handleSaveSnippet = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      showNotification('Per favore inserisci un titolo!');
      return;
    }
    if (!code.trim()) {
      showNotification('Per favore inserisci del codice!');
      return;
    }

    const selectedTheme = CARD_THEMES.find(t => t.id === selectedThemeId) || CARD_THEMES[0];
    const isLightText = selectedTheme.backgroundClass.includes('text-slate-900') || selectedTheme.backgroundClass.includes('text-neutral-900');
    const textColor = isLightText ? 'text-slate-800' : 'text-slate-100';

    const tagsArray = tagsInput
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(t => t.length > 0);

    if (selectedId) {
      // UPDATE EXISTING
      setSnippets(prev => prev.map(s => {
        if (s.id === selectedId) {
          return {
            ...s,
            title: title.trim(),
            code: code,
            language: language,
            tags: tagsArray,
            themeClass: selectedTheme.backgroundClass,
            textColor: textColor,
          };
        }
        return s;
      }));
      showNotification('Snippet card modificata con successo!');
    } else {
      // WRITE NEW
      const newSnippet: SnippetCard = {
        id: 'snip-' + Math.random().toString(36).substring(2, 9),
        title: title.trim(),
        code: code,
        language: language,
        tags: tagsArray,
        themeClass: selectedTheme.backgroundClass,
        textColor: textColor,
        createdAt: new Date().toISOString()
      };
      setSnippets(prev => [newSnippet, ...prev]);
      setSelectedId(newSnippet.id); // set active
      showNotification('Nuovo snippet salvato sul desktop! 💾');
    }
  };

  // Delete Action
  const handleDeleteSnippet = (idToDelete: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation(); // prevent selecting it while clicking delete icon
    }
    
    if (confirm('Sei sicuro di voler eliminare definitivamente questo snippet?')) {
      setSnippets(prev => prev.filter(s => s.id !== idToDelete));
      if (selectedId === idToDelete) {
        handleNewSnippet();
      }
      showNotification('Snippet eliminato.');
    }
  };

  // Filter snippets based on search input
  const filteredSnippets = snippets.filter(s => {
    const query = searchQuery.toLowerCase();
    return (
      s.title.toLowerCase().includes(query) ||
      s.code.toLowerCase().includes(query) ||
      s.language.toLowerCase().includes(query) ||
      (s.tags && s.tags.some(t => t.includes(query)))
    );
  });

  const activeThemeObj = CARD_THEMES.find(t => t.id === selectedThemeId) || CARD_THEMES[0];

  // Brightness css helper
  const getBrightnessFilterClass = () => {
    switch (screenBrightness) {
      case 1: return 'brightness-50';
      case 2: return 'brightness-75';
      case 3: return 'brightness-90';
      case 4: return 'brightness-100';
      case 5: return 'brightness-110 contrast-105';
      default: return 'brightness-100';
    }
  };

  return (
    <div id="snippet_app_root" className="min-h-screen bg-slate-950 flex flex-col items-center justify-start p-3 md:p-6 select-text overflow-x-hidden">
      
      {/* Visual Desk Accessory: Cyber background grid and desk lamp light */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none opacity-60 z-0"></div>

      {/* Decorative Warm Ambient Glow from above representation */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-28 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute top-10 left-1/3 w-72 h-44 bg-cyan-500/15 blur-[100px] rounded-full pointer-events-none z-0"></div>

      {/* Header section with human, literal descriptions - Humble Design */}
      <header className="relative z-10 w-full max-w-5xl mb-4 text-center select-none pt-1">
        <h1 className="text-3xl font-semibold tracking-tight text-white font-display flex items-center justify-center gap-2">
          <Terminal className="text-emerald-400 w-8 h-8 animate-pulse" />
          <span>Creatore di Card Snippet</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-lg mx-auto font-sans">
          Crea bellissime card di codice compatto, copiale al volo e salvale istantaneamente. Uno spazio di lavoro ordinato per i tuoi snippet preferiti.
        </p>
      </header>

      {/* THE MONITOR FRAME WORKSTATION */}
      <main className="relative z-10 w-full max-w-5xl flex-1 flex flex-col justify-center">
        
        {/* PHYSICAL MONITOR BEZEL */}
        <div id="pc_monitor" className="relative w-full bg-[#1e1e1f] rounded-3xl p-3 md:p-4 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border-4 border-zinc-700/80 flex flex-col">
          
          {/* Web Cam & Ambient sensor at the center top */}
          <div className="w-full flex items-center justify-center -mt-1 mb-2">
            <div className="flex items-center gap-2 bg-neutral-900/80 px-4 py-0.5 rounded-full border border-zinc-800">
              <span className="w-1.5 h-1.5 bg-blue-500/80 rounded-full animate-ping"></span>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">CozyCam HD</span>
            </div>
          </div>

          {/* INNER GLASS SCREEN SCREEN FRAME */}
          <div className={`w-full rounded-xl overflow-hidden border-2 border-neutral-900 bg-slate-950 flex flex-col relative transition-all duration-300 ${getBrightnessFilterClass()}`}>
            
            {/* SCREEN REFLECTION GLOSS LAYER */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/[0.01] via-transparent to-white/[0.04] z-10"></div>

            {/* MOCK OS STATUS BAR */}
            <div className="bg-slate-900 border-b border-slate-800/80 px-3 py-2 flex justify-between items-center text-xs font-mono text-slate-400 select-none">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">💻 SnippetOS</span>
                <span className="text-slate-600">|</span>
                <button 
                  onClick={handleNewSnippet}
                  className="hover:text-emerald-300 transition-colors flex items-center gap-1 active:scale-95 cursor-pointer"
                  title="Inizia un nuovo frammento vuoto"
                >
                  <Plus className="w-3 h-3 text-emerald-400" />
                  Nuovo File
                </button>
                <span className="text-slate-600 hidden sm:inline">|</span>
                <span className="text-slate-500 hidden sm:inline">Theme: {activeThemeObj.name}</span>
              </div>
              
              <div className="hidden md:flex items-center gap-3 text-[11px] text-slate-500">
                <span>⚡ RAM: 24KB Utilizzata</span>
                <span>•</span>
                <span className="text-emerald-500 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block"></span>
                  STREAMS PRONTI
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Screen Controls Inside OS */}
                <div className="flex items-center gap-1 bg-slate-950/80 px-2 py-0.5 rounded-md border border-slate-800 text-[10px]">
                  <span className="text-slate-600">Luminosità:</span>
                  <button 
                    onClick={() => setScreenBrightness(b => Math.max(1, b - 1))}
                    className="hover:text-white px-1 font-bold text-slate-400"
                    title="Diminuisci luminosità schermo"
                  >
                    -
                  </button>
                  <span className="text-emerald-400 font-bold">{screenBrightness}</span>
                  <button 
                    onClick={() => setScreenBrightness(b => Math.min(5, b + 1))}
                    className="hover:text-white px-1 font-bold text-slate-400"
                    title="Aumenta luminosità schermo"
                  >
                    +
                  </button>
                </div>
                
                <span className="text-slate-600">|</span>
                <span className="text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/60 font-semibold tracking-wider">
                  {currentTime || '--:--:--'}
                </span>
              </div>
            </div>

            {/* MAIN OPERATING SYSTEM WORKSPACE */}
            <div className="flex flex-col lg:flex-row min-h-[550px] divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
              
              {/* LEFT COLUMN: ACTIVE CODE EDITOR & live Preview setup (60% Width) */}
              <div className="w-full lg:w-[60%] p-4 bg-slate-950/90 flex flex-col justify-between space-y-4">
                
                {/* Workspace Title & Controls */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 bg-slate-900/60 px-2.5 py-1 rounded-md border border-slate-800/80">
                      <div className="flex space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block block"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block block"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block block"></span>
                      </div>
                      <span className="text-xs font-mono text-slate-300 ml-1">
                        {selectedId ? `Modifica: ${title || 'frammento'}` : 'Nuovo Snippet Card'}
                      </span>
                    </div>

                    {selectedId && (
                      <button 
                        onClick={handleNewSnippet}
                        className="text-xs bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-800 hover:border-emerald-500/40 px-2 py-1 rounded transition-all duration-150 flex items-center gap-1 active:scale-95 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Inizia Nuovo
                      </button>
                    )}
                  </div>

                  {/* Code Editor form */}
                  <form onSubmit={handleSaveSnippet} className="space-y-3.5">
                    
                    {/* Inputs Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] uppercase font-mono font-bold tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                          <span>Titolo del frammento</span>
                        </label>
                        <input 
                          type="text"
                          required
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="es. Toggle Modal, Fetch Helper..."
                          className="w-full bg-slate-900/90 border border-slate-800 focus:border-emerald-500/50 rounded-lg text-slate-200 placeholder-slate-600 px-3 py-1.5 text-xs focus:outline-none transition-all duration-150 focus:ring-1 focus:ring-emerald-500/20"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase font-mono font-bold tracking-wider text-slate-400 mb-1">
                          Linguaggio / Syntax
                        </label>
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          className="w-full bg-slate-900/90 border border-slate-800 focus:border-emerald-500/50 rounded-lg text-slate-200 px-3 py-1.5 text-xs focus:outline-none transition-all duration-150 focus:ring-1 focus:ring-emerald-500/20 cursor-pointer"
                        >
                          {LANGUAGES.map(lang => (
                            <option key={lang.value} value={lang.value}>
                              {lang.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Code Textarea Styled with line numbers decoration */}
                    <div>
                      <label className="block text-[11px] uppercase font-mono font-bold tracking-wider text-slate-400 mb-1 flex justify-between items-center">
                        <span>Codice Sorgente</span>
                        <span className="text-[10px] text-slate-600 tracking-normal lowercase italic font-light">premi TAB o digita liberamente</span>
                      </label>

                      <div className="relative rounded-lg border border-slate-800 bg-slate-900/90 overflow-hidden font-mono text-xs shadow-inner flex">
                        
                        {/* Interactive Left Line Numbers visual block */}
                        <div className="bg-slate-900/50 select-none text-slate-600 text-right px-2.5 py-3 border-r border-slate-800/60 font-mono text-[11px] flex flex-col space-y-1 w-9">
                          <span>1</span>
                          <span>2</span>
                          <span>3</span>
                          <span>4</span>
                          <span>5</span>
                          <span>6</span>
                          <span>7</span>
                          <span>8</span>
                        </div>

                        {/* Real Textarea */}
                        <textarea
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          placeholder="// Inserisci o incolla qui il tuo codice...&#10;const saluto = 'Ciao, Mondo!';&#10;console.log(saluto);"
                          rows={6}
                          className="w-full bg-transparent text-emerald-300 placeholder-slate-700 p-3 text-xs md:text-[13px] font-mono focus:outline-none resize-none overflow-y-auto leading-normal whitespace-pre leading-relaxed focus:bg-slate-900/30 transition-all duration-150"
                        />
                        
                        {/* Tiny code stamp icon on the bottom right corner */}
                        <div className="absolute bottom-2 right-2.5 opacity-10 pointer-events-none">
                          <Code className="text-white w-10 h-10" />
                        </div>
                      </div>
                    </div>

                    {/* Metadata tags search & cosmetic theme label */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] uppercase font-mono font-bold tracking-wider text-slate-400 mb-1">
                          Tag Chiave <span className="text-slate-600 lowercase">(separati da virgola)</span>
                        </label>
                        <input 
                          type="text"
                          value={tagsInput}
                          onChange={(e) => setTagsInput(e.target.value)}
                          placeholder="es. frontend, utility, mysql"
                          className="w-full bg-slate-900/90 border border-slate-800 focus:border-emerald-500/50 rounded-lg text-slate-200 placeholder-slate-600 px-3 py-1.5 text-xs focus:outline-none transition-all"
                        />
                      </div>

                      {/* Snippet Card Aesthetic Theme Selector */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px] uppercase font-mono font-bold tracking-wider text-slate-400 flex items-center gap-1">
                            <Palette className="w-3 h-3 text-emerald-400" />
                            Stile Sfondo Card
                          </span>
                          <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/30 border border-emerald-900/40 px-1.5 rounded">
                            {activeThemeObj.name}
                          </span>
                        </div>
                        
                        {/* Theme circles row */}
                        <div className="flex flex-wrap gap-2 py-0.5">
                          {CARD_THEMES.map(theme => {
                            const isGradient = theme.backgroundClass.includes('from-');
                            const circleBg = isGradient 
                              ? theme.backgroundClass 
                              : theme.id === 'minimal-light' ? 'bg-white' : 'bg-neutral-900';
                            
                            const isSelected = selectedThemeId === theme.id;

                            return (
                              <button
                                key={theme.id}
                                type="button"
                                onClick={() => setSelectedThemeId(theme.id)}
                                className={`w-6 h-6 rounded-full cursor-pointer transition-all duration-300 relative focus:outline-none ${circleBg} ${
                                  isSelected 
                                    ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-950 scale-110 shadow-lg' 
                                    : 'hover:scale-105 opacity-80 hover:opacity-100 border border-slate-700'
                                }`}
                                title={theme.name}
                              >
                                {isSelected && (
                                  <span className="absolute inset-0 flex items-center justify-center">
                                    <span className={`w-1.5 h-1.5 rounded-full ${theme.id === 'minimal-light' ? 'bg-slate-950' : 'bg-white'}`}></span>
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Operational Buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <button
                        type="submit"
                        className="flex-1 min-w-[130px] bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-medium px-4 py-2 rounded-lg text-xs tracking-wide transition-all duration-150 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 shadow-md flex items-center justify-center gap-1.5 font-bold cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        {selectedId ? 'Salva Modifiche' : 'Crea Snippet Card'}
                      </button>

                      <button
                        type="button"
                        onClick={handleNewSnippet}
                        className="bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800 px-3.5 py-2 rounded-lg text-xs transition-all duration-150 flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                        title="Cancella le modifiche non salvate"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                        Ripristina
                      </button>
                    </div>

                  </form>
                </div>

                {/* VISUAL PREVIEW OF THE THEMED CARD (Saves screen estate and gives physical satisfaction) */}
                <div className="pt-2 border-t border-slate-900">
                  <div className="text-[10px] text-slate-400 font-mono tracking-wider uppercase mb-1.5 flex items-center justify-between">
                    <span>Anteprima Card Live</span>
                    <span className="text-[9px] text-amber-500 flex items-center gap-0.5">
                      <Sparkles className="w-2.5 h-2.5" />
                      Pronta da Inserire nella Homepage
                    </span>
                  </div>

                  <div className="relative group">
                    {/* The Rendered Card Miniature */}
                    <div className={`rounded-xl p-4 transition-all duration-500 ${activeThemeObj.backgroundClass} shadow-xl border border-white/10 relative overflow-hidden min-h-[140px] flex flex-col justify-between`}>
                      
                      {/* Gloss lines for premium visual */}
                      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/5 to-transparent"></div>

                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-sm tracking-tight capitalize font-sans leading-tight">
                            {title.trim() || 'Titolo Snippet'}
                          </h4>
                          <span className="inline-block mt-1 text-[9px] font-mono tracking-wider bg-black/20 text-white/90 px-1.5 py-0.5 rounded uppercase font-bold">
                            {language}
                          </span>
                        </div>

                        {/* Top bar copy actions on preview */}
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => copyToClipboard(code || '// Inserisci del codice', 'editor')}
                            className="bg-black/30 hover:bg-black/50 text-white/95 hover:text-white p-1.5 rounded-lg text-[10px] transition-all flex items-center justify-center gap-1 active:scale-90 border border-white/10 cursor-pointer"
                            title="Copia codice attuale"
                          >
                            {editorCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span className="sr-only">Copia</span>
                          </button>
                        </div>
                      </div>

                      {/* Scaled Render Code Text space inside miniature */}
                      <div className="mt-3 bg-black/20 p-2.5 rounded-lg border border-black/10 text-[11px] font-mono whitespace-pre overflow-x-auto max-h-[85px] leading-relaxed custom-scrollbar">
                        {code.trim() || '// Digita codice nell\'editor per visualizzarlo in tempo reale'}
                      </div>

                      {/* Bottom row of tags styled within card */}
                      <div className="mt-2.5 pt-2 border-t border-white/5 flex flex-wrap gap-1 items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {tagsInput.split(',').map(t => t.trim()).filter(Boolean).slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="text-[9px] bg-white/10 text-white/80 px-1.5 py-0.5 rounded font-mono">
                              #{tag}
                            </span>
                          ))}
                          {!tagsInput.trim() && <span className="text-[9px] text-white/40 italic font-mono">nessun tag</span>}
                        </div>
                        <span className="text-[8px] opacity-60 font-mono">
                          CardOS Studio
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: RECALLED LIST OF CARDS SYSTEM (40% Width) */}
              <div className="w-full lg:w-[40%] bg-slate-900/60 p-4 flex flex-col justify-between">
                
                {/* Search Bar & Storage Title */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5 text-slate-300 font-mono text-xs uppercase font-semibold">
                      <Layout className="w-4 h-4 text-emerald-400" />
                      <span>Desktop Storage ({snippets.length})</span>
                    </div>

                    <span className="text-[10px] text-slate-500 font-sans">Clicca su un File</span>
                  </div>

                  {/* Filter Search Input */}
                  <div className="relative mb-4">
                    <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-500">
                      <Search className="w-3.5 h-3.5" />
                    </span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cerca tra i tuoi snippet..."
                      className="w-full bg-slate-950/80 border border-slate-800/80 rounded-lg text-slate-200 placeholder-slate-600 pl-8 pr-3 py-1.5 text-xs focus:ring-1 focus:ring-emerald-500/20 focus:outline-none focus:border-slate-700 transition-all"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[10px] text-slate-500 hover:text-slate-300 cursor-pointer"
                      >
                        Pulisci
                      </button>
                    )}
                  </div>

                  {/* SNIPPETS ARCHIVE GRID: INTERACTIVE FLOPPY / CARD ICONS */}
                  <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                    
                    {filteredSnippets.length === 0 ? (
                      <div className="text-center py-10 bg-slate-950/30 border border-dashed border-slate-800/80 rounded-xl p-4 flex flex-col items-center justify-center">
                        <Monitor className="text-slate-700 w-10 h-10 mb-2 stroke-[1.5]" />
                        <span className="text-xs font-mono text-slate-500 block">Nessun file trovato</span>
                        <p className="text-[11px] text-slate-600 mt-1 max-w-[200px]">
                          Crea nuovi frammenti o modifica la barra di ricerca!
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-2">
                        {filteredSnippets.map(snippet => {
                          const isSelected = selectedId === snippet.id;
                          const isCopied = copiedId === snippet.id;

                          // Extract background color representation to color mock icon indicators
                          const iconTheme = CARD_THEMES.find(t => t.backgroundClass === snippet.themeClass) || CARD_THEMES[0];

                          return (
                            <div
                              key={snippet.id}
                              onClick={() => handleSelectSnippet(snippet)}
                              className={`group relative text-left p-2.5 rounded-lg border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                                isSelected 
                                  ? 'bg-slate-900 border-emerald-500/80 shadow-[0_0_15px_-5px_rgba(16,185,129,0.2)]' 
                                  : 'bg-slate-950/80 border-slate-800/80 hover:bg-slate-900/40 hover:border-slate-700'
                              }`}
                            >
                              
                              {/* Left Thumbnail + Title meta */}
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                
                                {/* Simulated mini Disk / Card representation with chosen theme coloring! */}
                                <div className={`w-8 h-8 rounded flex-shrink-0 relative flex items-center justify-center ${iconTheme.backgroundClass} shadow border border-white/5`}>
                                  <FileCode className="w-4 h-4" />
                                  
                                  {/* Small label for language */}
                                  <span className="absolute -bottom-1 -right-1 text-[7px] px-1 bg-black/80 rounded text-amber-400 font-mono scale-90 border border-slate-800">
                                    {snippet.language.slice(0, 3)}
                                  </span>
                                </div>

                                <div className="min-w-0 flex-1">
                                  <h5 className="text-[12px] font-sans font-semibold text-slate-200 truncate group-hover:text-white transition-colors">
                                    {snippet.title}
                                  </h5>
                                  <p className="text-[10px] text-slate-500 font-mono truncate max-w-[170px] mt-0.5">
                                    {snippet.code.replace(/\n/g, ' ')}
                                  </p>
                                </div>
                              </div>

                              {/* Right Inline Action toolbars (Visible constantly or on hover) */}
                              <div className="flex items-center gap-1 ml-2">
                                
                                {/* Copy Button */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyToClipboard(snippet.code, snippet.id);
                                  }}
                                  className={`p-1.5 rounded bg-slate-900/95 border hover:bg-slate-850 transition-colors cursor-pointer ${
                                    isCopied ? 'border-emerald-500/50 text-emerald-400' : 'border-slate-800 text-slate-400 hover:text-slate-200'
                                  }`}
                                  title="Copia codice negli appunti"
                                >
                                  {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                </button>

                                {/* Delete Button */}
                                <button
                                  type="button"
                                  onClick={(e) => handleDeleteSnippet(snippet.id, e)}
                                  className="p-1.5 rounded bg-slate-900/95 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 hover:bg-slate-850 transition-all cursor-pointer"
                                  title="Elimina questo snippet permanentemente"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>

                              {/* Selected neon edge bar indicator */}
                              {isSelected && (
                                <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-emerald-400 rounded-r"></span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Desk user guidelines & local storage info */}
                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-400">
                    <div className="flex items-start gap-1.5">
                      <Info className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-300">Come procedo per la mia homepage?</p>
                        <p className="text-[10px] text-slate-500 font-light leading-normal mt-0.5">
                          Personalizza il tuo frammento, seleziona uno sfondo sgargiante o sobrio e clicca l'icona di copia. Il codice compatto è pronto per essere inserito ovunque! I dati rimangono salvati localmente.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* MONITOR PHYSICAL BOTTOM CASE / BUTTONS BAR */}
          <div className="w-full pt-3 px-2 flex justify-between items-center text-[10px] font-mono text-zinc-500 select-none">
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-600">CARDOS DISPLAY HD</span>
              <span>•</span>
              <span className="text-emerald-500/80 animate-pulse">● AUTO-SALVATO</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span>Sincronizzazione Locale</span>
              {/* Fake physical glowing power button */}
              <div className="flex items-center gap-1 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800 font-bold">
                <span className="text-zinc-400">Led</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] inline-block"></span>
              </div>
            </div>
          </div>

        </div>

        {/* MONITOR PEDESTAL (physical monitor neck and base) */}
        <div className="hidden sm:block select-none pointer-events-none">
          {/* Stem neck */}
          <div className="mx-auto w-24 h-10 bg-gradient-to-b from-zinc-700 to-zinc-800 border-x border-zinc-600 relative z-[-1]"></div>
          {/* Base bottom slab */}
          <div className="mx-auto w-52 h-4 bg-zinc-600 rounded-t-xl border-x border-t border-zinc-500/60 shadow-xl relative z-[-1]"></div>
        </div>

      </main>

      {/* Persistent Beautiful OS Notification toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border-2 border-emerald-500/60 text-slate-100 rounded-xl px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)] font-mono text-xs flex items-center gap-2.5 animate-fade-in transition-all">
          <Terminal className="text-emerald-400 w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Humble Footer */}
      <footer className="w-full max-w-5xl text-center text-slate-600 text-[10px] mt-6 select-none border-t border-slate-900/50 pt-4 font-mono">
        Creatore di Card Snippet • LocalStorage sincronizzato • Sviluppato con React & Tailwind v4
      </footer>

    </div>
  );
}

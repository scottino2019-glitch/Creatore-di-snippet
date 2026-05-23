export interface SnippetCard {
  id: string;
  title: string;
  code: string;
  language: string;
  tags: string[];
  themeClass: string; // The CSS background styling for visual representation of the card
  textColor: string;  // Light or dark font inside the card UI
  createdAt: string;
}

export type SupportedLanguage = {
  value: string;
  label: string;
};

export const LANGUAGES: SupportedLanguage[] = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'python', label: 'Python' },
  { value: 'sql', label: 'SQL' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'text', label: 'Testo Semplice' },
  { value: 'json', label: 'JSON' }
];

export interface CardTheme {
  id: string;
  name: string;
  backgroundClass: string;
}

export const CARD_THEMES: CardTheme[] = [
  { id: 'slate', name: 'Ardesia', backgroundClass: 'bg-radial from-slate-900 to-slate-950 border-slate-800 text-slate-100' },
  { id: 'synthwave', name: 'Synthwave', backgroundClass: 'bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 border-none text-white' },
  { id: 'emerald', name: 'Smeraldo', backgroundClass: 'bg-gradient-to-tr from-teal-400 to-emerald-600 border-none text-white' },
  { id: 'ocean', name: 'Oceano Deep', backgroundClass: 'bg-gradient-to-r from-blue-600 to-cyan-500 border-none text-white' },
  { id: 'sunset', name: 'Tramonto d\'Oro', backgroundClass: 'bg-gradient-to-tr from-amber-500 via-red-500 to-purple-600 border-none text-white' },
  { id: 'modern-dark', name: 'Carbon Black', backgroundClass: 'bg-neutral-900 border-neutral-800 text-neutral-100' },
  { id: 'minimal-light', name: 'Galleria Bianca', backgroundClass: 'bg-white border-neutral-200 text-neutral-900' },
  { id: 'peach', name: 'Sabbia Rosa', backgroundClass: 'bg-gradient-to-tr from-orange-300 to-rose-400 border-none text-slate-900' }
];

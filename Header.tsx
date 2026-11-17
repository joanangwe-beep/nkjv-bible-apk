import React from 'react';
import { Language, ViewMode } from '../types/bible';
import { Search, Volume2, Play, Settings, Smartphone, BookOpen, Layers } from 'lucide-react';

interface HeaderProps {
  activeLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onOpenSearch: () => void;
  onOpenAudio: () => void;
  onToggleAutoScroll?: () => void;
  isAutoScrolling?: boolean;
  onOpenSettings: () => void;
  onOpenApkModal: () => void;
  currentBook?: string;
  currentChapter?: number;
  onOpenBookPicker?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeLanguage,
  onLanguageChange,
  viewMode,
  onViewModeChange,
  onOpenSearch,
  onOpenAudio,
  onToggleAutoScroll,
  isAutoScrolling = false,
  onOpenSettings,
  onOpenApkModal,
  currentBook,
  currentChapter,
  onOpenBookPicker,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-blue-950 via-blue-900 to-slate-900 text-white shadow-md border-b border-blue-900/60">
      {/* Top Bar Row */}
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-2">
        {/* Brand Lockup */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl overflow-hidden shadow-inner border border-amber-400/40 bg-blue-950 flex items-center justify-center">
            <img src="/icon.svg" alt="NKJV Bible Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-bold text-base sm:text-lg tracking-tight text-white leading-none">
                NKJV Bible
              </span>
              <span className="text-[10px] font-semibold text-amber-300 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
                Bilingual
              </span>
            </div>
            <p className="text-[10px] text-blue-200/80 tracking-wide font-sans truncate hidden sm:block">
              Read • Study • Share • Live the Word
            </p>
          </div>
        </div>

        {/* Center: Language Toggle (Mandatory Section 2) */}
        <div className="flex items-center bg-blue-950/80 p-0.5 rounded-xl border border-blue-800/80 shadow-inner">
          <button
            onClick={() => onLanguageChange('en')}
            className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeLanguage === 'en'
                ? 'bg-amber-400 text-blue-950 shadow-sm font-bold'
                : 'text-blue-200/70 hover:text-white'
            }`}
          >
            ENGLISH
          </button>
          <button
            onClick={() => onLanguageChange('sw')}
            className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeLanguage === 'sw'
                ? 'bg-amber-400 text-blue-950 shadow-sm font-bold'
                : 'text-blue-200/70 hover:text-white'
            }`}
          >
            KISWAHILI
          </button>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-blue-100 hover:text-white hover:bg-white/10 transition-colors"
            title="Search Scripture"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Audio Bible Trigger */}
          <button
            onClick={onOpenAudio}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-blue-100 hover:text-white hover:bg-white/10 transition-colors"
            title="Audio Bible Read-Aloud"
            aria-label="Audio Bible"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          {/* Android APK Modal Trigger */}
          <button
            onClick={onOpenApkModal}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/30 text-amber-300 text-xs font-medium transition-colors"
            title="Download / Build Android APK"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Android APK</span>
          </button>

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-blue-100 hover:text-white hover:bg-white/10 transition-colors"
            title="App Settings"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sub-Bar: Quick Book/Chapter Navigation & View Mode */}
      {currentBook && currentChapter && (
        <div className="bg-blue-950/90 border-t border-blue-900/60 px-4 py-1.5 flex items-center justify-between text-xs">
          <button
            onClick={onOpenBookPicker}
            className="flex items-center gap-1.5 font-serif font-semibold text-amber-300 hover:text-amber-200 transition-colors py-0.5 px-2 rounded-lg bg-blue-900/40 hover:bg-blue-900/80 border border-blue-800/60"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {currentBook} {currentChapter}
            </span>
            <span className="text-[10px] text-blue-300 font-sans font-normal ml-0.5">▼</span>
          </button>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle: Parallel, English, Kiswahili */}
            <div className="flex items-center bg-blue-900/40 rounded-lg p-0.5 border border-blue-800/60 text-[11px]">
              <button
                onClick={() => onViewModeChange('parallel')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  viewMode === 'parallel' ? 'bg-blue-800 text-white font-medium' : 'text-blue-300 hover:text-white'
                }`}
                title="Parallel Bilingual Display"
              >
                Parallel
              </button>
              <button
                onClick={() => onViewModeChange('en-only')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  viewMode === 'en-only' ? 'bg-blue-800 text-white font-medium' : 'text-blue-300 hover:text-white'
                }`}
                title="English Only"
              >
                EN
              </button>
              <button
                onClick={() => onViewModeChange('sw-only')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  viewMode === 'sw-only' ? 'bg-blue-800 text-white font-medium' : 'text-blue-300 hover:text-white'
                }`}
                title="Kiswahili Only"
              >
                SW
              </button>
            </div>

            {/* Auto-Scroll Quick Button */}
            {onToggleAutoScroll && (
              <button
                onClick={onToggleAutoScroll}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                  isAutoScrolling
                    ? 'bg-emerald-500 text-white animate-pulse'
                    : 'bg-blue-900/50 text-blue-200 hover:text-white hover:bg-blue-900'
                }`}
                title="Auto-Scroll Mode"
              >
                <Play className={`w-3 h-3 ${isAutoScrolling ? 'fill-current' : ''}`} />
                <span className="hidden sm:inline">{isAutoScrolling ? 'Scrolling' : 'Auto'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

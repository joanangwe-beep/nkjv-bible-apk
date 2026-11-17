import React from 'react';
import { Language, UserSettings, HighlightRecord, ReadingPlan } from '../types/bible';
import { getTodayVerse } from '../data/dailyVerses';
import {
  BookOpen,
  Search,
  Video,
  Sparkles,
  Share2,
  Calendar,
  Bookmark,
  ChevronRight,
  Highlighter,
  Smartphone,
  ExternalLink,
  Download,
} from 'lucide-react';

interface HomeScreenProps {
  activeLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  onNavigateTab: (tab: any) => void;
  onOpenPassage: (book: string, chapter: number, verse?: number) => void;
  lastReadBook: string;
  lastReadChapter: number;
  recentHighlights: HighlightRecord[];
  readingPlan: ReadingPlan | null;
  onOpenApkModal: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  activeLanguage,
  onLanguageChange,
  onNavigateTab,
  onOpenPassage,
  lastReadBook,
  lastReadChapter,
  recentHighlights,
  readingPlan,
  onOpenApkModal,
}) => {
  const isEn = activeLanguage === 'en';
  const dailyVerse = getTodayVerse();

  const handleShareDaily = () => {
    const text = isEn
      ? `"${dailyVerse.textEn}"\n— ${dailyVerse.referenceEn} (NKJV)\n\nShared via NKJV Bible App`
      : `"${dailyVerse.textSw}"\n— ${dailyVerse.referenceSw} (SUV)\n\nImeshirikiwa kupitia NKJV Bible App`;

    if (navigator.share) {
      navigator.share({ title: dailyVerse.referenceEn, text });
    } else {
      navigator.clipboard.writeText(text);
      alert('Daily Verse copied to clipboard!');
    }
  };

  const handleOpenChatGPT = () => {
    const prompt = `Please share a deep Christian theological devotional and life application for ${dailyVerse.referenceEn}: "${dailyVerse.textEn}"`;
    navigator.clipboard.writeText(prompt);
    window.open(`https://chatgpt.com/?q=${encodeURIComponent(prompt)}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* App Hero Card with Brand Identity */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-blue-800/80">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
              HOLY BIBLE • NKJV
            </span>
          </div>

          <h1 className="font-serif font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-white leading-tight">
            Read • Study • Share • Live the Word
          </h1>

          <p className="text-xs sm:text-sm text-blue-200/90 max-w-xl font-sans leading-relaxed">
            {isEn
              ? 'Complete bilingual Scripture reader featuring English NKJV and Kiswahili side-by-side, Jesus\' words in green, Reels creator, and study tools.'
              : 'Biblia kamili ya lugha mbili ya Kiingereza (NKJV) na Kiswahili (SUV), maneno ya Yesu katika rangi ya kijani, na studio ya video Reels.'}
          </p>

          {/* Quick Language Toggle (Prominent on Home Screen) */}
          <div className="pt-2 flex items-center gap-3">
            <div className="flex bg-blue-950/90 p-1 rounded-xl border border-blue-700/80 shadow-inner">
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all ${
                  activeLanguage === 'en'
                    ? 'bg-amber-400 text-blue-950 font-bold shadow-sm'
                    : 'text-blue-200/80 hover:text-white'
                }`}
              >
                ENGLISH
              </button>
              <button
                onClick={() => onLanguageChange('sw')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all ${
                  activeLanguage === 'sw'
                    ? 'bg-amber-400 text-blue-950 font-bold shadow-sm'
                    : 'text-blue-200/80 hover:text-white'
                }`}
              >
                KISWAHILI
              </button>
            </div>

            <button
              onClick={onOpenApkModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/30 text-amber-300 text-xs font-semibold transition-colors"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Install APK</span>
            </button>

            <button
              onClick={() => onNavigateTab('settings')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-800/80 hover:bg-blue-800 border border-blue-600/60 text-white text-xs font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-amber-300" />
              <span>Offline Bible (66 Books)</span>
            </button>
          </div>
        </div>

        {/* Decorative Golden Cross and Light in background */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none flex items-center justify-end pr-6">
          <img src="/icon.svg" alt="Cross Logo Watermark" className="w-56 h-56 object-contain" />
        </div>
      </div>

      {/* Continue Reading Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-900 dark:text-amber-400 shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              {isEn ? 'Continue Reading' : 'Endelea Kusoma'}
            </span>
            <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900 dark:text-white">
              {lastReadBook} Chapter {lastReadChapter}
            </h3>
            <span className="text-xs text-slate-500">
              {isEn ? 'Resume reading where you left off' : 'Rejea ulipoishia kusoma'}
            </span>
          </div>
        </div>

        <button
          onClick={() => onOpenPassage(lastReadBook, lastReadChapter)}
          className="px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-900/20 transition-colors shrink-0"
        >
          <span>{isEn ? 'Resume' : 'Endelea'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Daily Verse Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-amber-50 via-white to-amber-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/20 border border-amber-200/80 dark:border-amber-900/50 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
              {isEn ? 'Verse of the Day' : 'Mstari wa Leo'}
            </span>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {isEn ? dailyVerse.theme : dailyVerse.themeSw}
          </span>
        </div>

        {/* Verse text */}
        <div className="space-y-2">
          <blockquote className="font-serif italic text-base sm:text-lg text-slate-900 dark:text-slate-100 leading-relaxed">
            "{isEn ? dailyVerse.textEn : dailyVerse.textSw}"
          </blockquote>

          <p className="font-serif font-bold text-xs sm:text-sm text-blue-950 dark:text-amber-400">
            — {isEn ? dailyVerse.referenceEn : dailyVerse.referenceSw} ({isEn ? 'NKJV' : 'SUV'})
          </p>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans pt-1">
            {isEn ? dailyVerse.devotionalEn : dailyVerse.devotionalSw}
          </p>
        </div>

        {/* Action triggers for Daily Verse */}
        <div className="pt-2 border-t border-amber-200/60 dark:border-amber-900/40 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('reels')}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Video className="w-3.5 h-3.5" />
              <span>{isEn ? 'Create Reel' : 'Tengeneza Reel'}</span>
            </button>

            <button
              onClick={handleShareDaily}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{isEn ? 'Share' : 'Shiriki'}</span>
            </button>
          </div>

          <button
            onClick={handleOpenChatGPT}
            className="flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{isEn ? 'Discuss with ChatGPT' : 'Jadili na ChatGPT'}</span>
          </button>
        </div>
      </div>

      {/* Quick Action Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => onNavigateTab('search')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-left hover:border-blue-500 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <Search className="w-5 h-5" />
          </div>
          <span className="block font-bold text-xs text-slate-800 dark:text-white">
            {isEn ? 'Quick Search' : 'Utafutaji'}
          </span>
          <span className="text-[10px] text-slate-500">
            {isEn ? 'Topic & Verse Finder' : 'Tafuta mada na mistari'}
          </span>
        </button>

        <button
          onClick={() => onNavigateTab('reels')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-left hover:border-amber-400 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <Video className="w-5 h-5" />
          </div>
          <span className="block font-bold text-xs text-slate-800 dark:text-white">
            {isEn ? 'Reels Studio' : 'Studio ya Reels'}
          </span>
          <span className="text-[10px] text-slate-500">
            {isEn ? '9:16 Video & Images' : 'Picha na video za kijamii'}
          </span>
        </button>

        <button
          onClick={() => onNavigateTab('research')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-left hover:border-purple-500 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="block font-bold text-xs text-slate-800 dark:text-white">
            {isEn ? 'AI Study' : 'Utafiti wa AI'}
          </span>
          <span className="text-[10px] text-slate-500">
            {isEn ? 'Concordance & Context' : 'Muktadha na kamusi'}
          </span>
        </button>

        <button
          onClick={() => onNavigateTab('library')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-left hover:border-emerald-500 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <Calendar className="w-5 h-5" />
          </div>
          <span className="block font-bold text-xs text-slate-800 dark:text-white">
            {isEn ? 'Reading Plan' : 'Ratiba ya Kusoma'}
          </span>
          <span className="text-[10px] text-slate-500">
            {isEn ? 'Gospel of John & Psalms' : 'Injili ya Yohana na Zaburi'}
          </span>
        </button>
      </div>

      {/* Today's Reading Plan Card */}
      {readingPlan && (
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              {isEn ? 'Today\'s Reading Plan' : 'Ratiba ya Leo'}
            </span>
            <span className="text-xs font-semibold text-blue-900 dark:text-blue-300">
              {readingPlan.completedDays.length}/{readingPlan.totalDays} Days Complete
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-serif font-bold text-sm text-slate-900 dark:text-white">
                {isEn ? readingPlan.title : readingPlan.titleSw}
              </h4>
              <p className="text-xs text-slate-500">
                {readingPlan.days[0]?.scriptureRef || 'Daily Walk with Scripture'}
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('library')}
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold flex items-center"
            >
              <span>View Plan</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Recently Highlighted Verses */}
      {recentHighlights.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {isEn ? 'Recently Saved Verses' : 'Mistari Iliyohifadhiwa Karibuni'}
            </span>
            <button
              onClick={() => onNavigateTab('library')}
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold"
            >
              {isEn ? 'View All' : 'Ona Yote'}
            </button>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2">
            {recentHighlights.slice(0, 4).map((hl) => (
              <div
                key={hl.id}
                onClick={() => onOpenPassage(hl.book, hl.chapter, hl.verse)}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 cursor-pointer shadow-sm transition-all"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-serif font-bold text-xs text-blue-900 dark:text-amber-400">
                    {hl.book} {hl.chapter}:{hl.verse}
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                </div>
                {hl.note ? (
                  <p className="text-xs italic text-slate-600 dark:text-slate-400 truncate">
                    "{hl.note}"
                  </p>
                ) : (
                  <span className="text-[11px] text-slate-500">Highlighted Passage</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Access Card: Build & Test Android APK */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-blue-950 to-indigo-950 text-white border border-amber-400/40 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-blue-950 flex items-center justify-center shrink-0 font-bold">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm text-amber-300">
              Build & Test Android APK
            </h4>
            <p className="text-xs text-blue-200">
              Download the complete Android Gradle project ZIP (9.75 MB) to build the installable APK.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('settings')}
          className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-blue-950 font-bold text-xs flex items-center justify-center gap-1.5 shrink-0 transition-colors cursor-pointer"
        >
          <span>Open in Settings</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

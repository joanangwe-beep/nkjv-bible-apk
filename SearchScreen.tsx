import React, { useState, useEffect } from 'react';
import { Language, Testament } from '../types/bible';
import { searchBibleAsync, SearchResult, TOPICAL_SEARCH_PRESETS } from '../utils/bibleEngine';
import { BIBLE_BOOKS, findBook } from '../data/bibleBooks';
import { Search, X, History, Filter, BookOpen, ChevronRight, HardDrive } from 'lucide-react';

interface SearchScreenProps {
  activeLanguage: Language;
  onSelectVerseResult: (book: string, chapter: number, verse: number) => void;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  activeLanguage,
  onSelectVerseResult,
}) => {
  const [query, setQuery] = useState('');
  const [testamentFilter, setTestamentFilter] = useState<'ALL' | 'OT' | 'NT'>('ALL');
  const [bookFilter, setBookFilter] = useState<string>('ALL');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('nkjv_bible_search_history');
      return stored ? JSON.parse(stored) : ['John 3:16', 'faith', 'peace', 'shepherd'];
    } catch {
      return ['John 3:16', 'faith', 'peace', 'shepherd'];
    }
  });

  const isEn = activeLanguage === 'en';

  const handlePerformSearch = async (searchWord: string) => {
    setQuery(searchWord);
    if (!searchWord.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const matches = await searchBibleAsync(searchWord, {
        activeLanguage,
        testamentFilter,
        bookFilter,
      });
      setResults(matches);
    } catch (err) {
      console.warn('Search error:', err);
    } finally {
      setIsSearching(false);
    }

    // Update history
    const trimmed = searchWord.trim();
    if (trimmed && !searchHistory.includes(trimmed)) {
      const updated = [trimmed, ...searchHistory.filter((h) => h !== trimmed)].slice(0, 10);
      setSearchHistory(updated);
      try {
        localStorage.setItem('nkjv_bible_search_history', JSON.stringify(updated));
      } catch {}
    }
  };

  useEffect(() => {
    if (query.trim()) {
      handlePerformSearch(query);
    }
  }, [testamentFilter, bookFilter, activeLanguage]);

  const handleClearHistory = () => {
    setSearchHistory([]);
    try {
      localStorage.removeItem('nkjv_bible_search_history');
    } catch {}
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Title */}
      <div>
        <h1 className="font-serif font-bold text-xl sm:text-2xl text-blue-950 dark:text-amber-400">
          {isEn ? 'Advanced Bible Search' : 'Utafutaji wa Maandiko'}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {isEn
            ? 'Search across English and Kiswahili by word, exact phrase, reference, or topic'
            : 'Tafuta kwa Kiingereza na Kiswahili kwa neno, sentensi kamili, rejeleo, au mada'}
        </p>
      </div>

      {/* Search Input Box */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!e.target.value.trim()) setResults([]);
          }}
          onKeyDown={(e) => e.key === 'Enter' && handlePerformSearch(query)}
          placeholder={
            isEn
              ? 'Search words, topics, or references (e.g. John 3:16, love, shepherd)...'
              : 'Tafuta maneno au mafungu (mf. Yohana 3:16, upendo, mchungaji)...'
          }
          className="w-full pl-11 pr-10 py-3 text-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
            className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {/* Testament filters */}
        <div className="flex bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setTestamentFilter('ALL')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              testamentFilter === 'ALL' ? 'bg-blue-900 text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            {isEn ? 'All Scripture' : 'Yote'}
          </button>
          <button
            onClick={() => setTestamentFilter('OT')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              testamentFilter === 'OT' ? 'bg-blue-900 text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            {isEn ? 'Old Testament' : 'Agano la Kale'}
          </button>
          <button
            onClick={() => setTestamentFilter('NT')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              testamentFilter === 'NT' ? 'bg-blue-900 text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            {isEn ? 'New Testament' : 'Agano Jipya'}
          </button>
        </div>

        {/* Book filter dropdown */}
        <select
          value={bookFilter}
          onChange={(e) => setBookFilter(e.target.value)}
          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs focus:outline-none"
        >
          <option value="ALL">{isEn ? 'All 66 Books' : 'Vitabu Vyote 66'}</option>
          {BIBLE_BOOKS.map((b) => (
            <option key={b.id} value={b.name}>
              {isEn ? b.name : b.swName}
            </option>
          ))}
        </select>
      </div>

      {/* Preset Topics */}
      <div>
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
          {isEn ? 'Browse by Biblical Topic:' : 'Mada za Kibiblia:'}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {TOPICAL_SEARCH_PRESETS.map((p, i) => (
            <button
              key={i}
              onClick={() => handlePerformSearch(p.query)}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-amber-400 text-slate-700 dark:text-slate-300 transition-colors"
            >
              {isEn ? p.topic : p.topicSw}
            </button>
          ))}
        </div>
      </div>

      {/* Search History */}
      {!query && searchHistory.length > 0 && (
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5" />
              {isEn ? 'Recent Searches' : 'Utafutaji wa Hivi Karibuni'}
            </span>
            <button
              onClick={handleClearHistory}
              className="text-[11px] text-slate-400 hover:text-red-500"
            >
              {isEn ? 'Clear' : 'Futa'}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {searchHistory.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handlePerformSearch(item)}
                className="text-xs px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Results List */}
      {query && (
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              {results.length} {isEn ? 'matching verses found' : 'mafungu yamepatikana'}
            </span>
            <span className="text-[11px] text-slate-400">
              {isEn ? 'Prioritizing English' : 'Kipaumbele: Kiswahili'}
            </span>
          </div>

          {results.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {isEn ? 'No direct matches found' : 'Hakuna mafungu yaliyopatikana'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {isEn ? 'Try searching another word or topic from the presets above.' : 'Jaribu kutafuta neno lingine au mada hapo juu.'}
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {results.map((res, i) => {
                const bookMeta = findBook(res.book);
                const refEn = `${res.book} ${res.chapter}:${res.verse}`;
                const refSw = `${bookMeta?.swName || res.book} ${res.chapter}:${res.verse}`;

                return (
                  <div
                    key={i}
                    onClick={() => onSelectVerseResult(res.book, res.chapter, res.verse)}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 shadow-sm transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-sm text-blue-900 dark:text-amber-400">
                          {isEn ? refEn : refSw}
                        </span>
                        <span className="text-xs text-slate-500">
                          ({isEn ? refSw : refEn})
                        </span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-semibold uppercase">
                        {res.matchLanguage} match
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <p
                        className="font-serif text-slate-800 dark:text-slate-200 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: res.highlightEn }}
                      />
                      <p
                        className="font-serif text-slate-500 dark:text-slate-400 italic leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: res.highlightSw }}
                      />
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end text-[11px] text-blue-600 dark:text-blue-400 font-medium group-hover:translate-x-0.5 transition-transform">
                      <span>{isEn ? 'Open in Context' : 'Fungua katika Muktadha'}</span>
                      <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

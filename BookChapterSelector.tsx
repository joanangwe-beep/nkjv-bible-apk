import React, { useState } from 'react';
import { BIBLE_BOOKS } from '../data/bibleBooks';
import { BookInfo, Testament } from '../types/bible';
import { X, Search, ChevronRight } from 'lucide-react';

interface BookChapterSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBook: string;
  selectedChapter: number;
  onSelect: (book: string, chapter: number) => void;
  activeLanguage: 'en' | 'sw';
}

export const BookChapterSelector: React.FC<BookChapterSelectorProps> = ({
  isOpen,
  onClose,
  selectedBook,
  selectedChapter,
  onSelect,
  activeLanguage,
}) => {
  const [testament, setTestament] = useState<Testament>('NT');
  const [activeBook, setActiveBook] = useState<BookInfo | null>(
    () => BIBLE_BOOKS.find(b => b.name === selectedBook) || BIBLE_BOOKS[42] // John default
  );
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredBooks = BIBLE_BOOKS.filter(book => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        book.name.toLowerCase().includes(q) ||
        book.swName.toLowerCase().includes(q) ||
        book.abbrev.toLowerCase().includes(q) ||
        book.swAbbrev.toLowerCase().includes(q)
      );
    }
    return book.testament === testament;
  });

  const handleSelectChapter = (ch: number) => {
    if (activeBook) {
      onSelect(activeBook.name, ch);
      onClose();
    }
  };

  const isEn = activeLanguage === 'en';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full sm:max-w-xl rounded-t-3xl sm:rounded-3xl max-h-[85vh] sm:max-h-[80vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-blue-950 text-white">
          <div>
            <h3 className="font-serif font-bold text-base sm:text-lg">
              {isEn ? 'Select Book & Chapter' : 'Chagua Kitabu na Sura'}
            </h3>
            <p className="text-xs text-blue-200/80">
              {isEn ? '66 Books • Old & New Testament' : 'Vitabu 66 • Agano la Kale na Jipya'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder={isEn ? 'Search books (e.g. John, Zaburi, Gen)...' : 'Tafuta vitabu (mf. Yohana, Zaburi, Mwa)...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Testament Switcher (hidden during search) */}
        {!searchQuery && (
          <div className="flex border-b border-slate-200 dark:border-slate-800 px-3 pt-2 bg-white dark:bg-slate-900">
            <button
              onClick={() => setTestament('OT')}
              className={`flex-1 pb-2.5 text-xs font-semibold border-b-2 transition-colors ${
                testament === 'OT'
                  ? 'border-blue-900 text-blue-900 dark:border-blue-400 dark:text-blue-400 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {isEn ? 'Old Testament (39)' : 'Agano la Kale (39)'}
            </button>
            <button
              onClick={() => setTestament('NT')}
              className={`flex-1 pb-2.5 text-xs font-semibold border-b-2 transition-colors ${
                testament === 'NT'
                  ? 'border-blue-900 text-blue-900 dark:border-blue-400 dark:text-blue-400 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {isEn ? 'New Testament (27)' : 'Agano Jipya (27)'}
            </button>
          </div>
        )}

        {/* Split View: Books on Left, Chapters on Right */}
        <div className="flex-1 flex overflow-hidden">
          {/* Books List */}
          <div className="w-1/2 border-r border-slate-200 dark:border-slate-800 overflow-y-auto p-2 space-y-1">
            {filteredBooks.map((book) => {
              const isSelected = activeBook?.name === book.name;
              return (
                <button
                  key={book.id}
                  onClick={() => setActiveBook(book)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-blue-900 text-white font-semibold shadow-sm'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="truncate pr-1">
                    <span className="block truncate">
                      {isEn ? book.name : book.swName}
                    </span>
                    <span
                      className={`text-[10px] block truncate ${
                        isSelected ? 'text-blue-200' : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {isEn ? book.swName : book.name} • {book.chaptersCount} ch
                    </span>
                  </div>
                  <ChevronRight
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isSelected ? 'text-amber-300' : 'text-slate-400'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Chapters Grid */}
          <div className="w-1/2 overflow-y-auto p-3">
            {activeBook ? (
              <div>
                <div className="mb-3 pb-2 border-b border-slate-200 dark:border-slate-800">
                  <h4 className="font-serif font-bold text-sm text-slate-900 dark:text-white">
                    {isEn ? activeBook.name : activeBook.swName}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isEn ? 'Select a chapter' : 'Chagua sura'}
                  </p>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: activeBook.chaptersCount }, (_, i) => i + 1).map((ch) => {
                    const isCurrent =
                      activeBook.name === selectedBook && ch === selectedChapter;
                    return (
                      <button
                        key={ch}
                        onClick={() => handleSelectChapter(ch)}
                        className={`h-11 rounded-xl text-xs font-semibold flex items-center justify-center transition-all ${
                          isCurrent
                            ? 'bg-amber-400 text-blue-950 font-bold shadow-md ring-2 ring-amber-300'
                            : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {ch}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                {isEn ? 'Choose a book first' : 'Chagua kitabu kwanza'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

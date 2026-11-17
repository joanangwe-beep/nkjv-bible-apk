import React, { useState, useEffect, useRef } from 'react';
import { VerseData, Language, ViewMode, HighlightRecord, HighlightColor, UserSettings } from '../types/bible';
import { loadChapterVerses } from '../utils/bibleEngine';
import { BIBLE_BOOKS, findBook } from '../data/bibleBooks';
import { bibleSpeech } from '../utils/audioEngine';
import { VerseActionModal } from './VerseActionModal';
import { NoteDialog } from './NoteDialog';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Bookmark,
  Share2,
  Check,
} from 'lucide-react';

interface BibleReaderProps {
  currentBook: string;
  currentChapter: number;
  onNavigateChapter: (book: string, chapter: number) => void;
  activeLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  settings: UserSettings;
  highlights: HighlightRecord[];
  onSaveHighlight: (hl: HighlightRecord) => void;
  onDeleteHighlight: (id: string) => void;
  bookmarks: { book: string; chapter: number; verse: number }[];
  onToggleBookmark: (book: string, chapter: number, verse: number) => void;
  onSaveNote: (book: string, chapter: number, verse: number, title: string, content: string, tags: string[]) => void;
  onOpenReelCreator: (verse: VerseData) => void;
  onOpenAIStudy: (verse: VerseData) => void;
  onOpenDownloadManager?: () => void;
  initialTargetVerse?: number | null;
}

export const BibleReader: React.FC<BibleReaderProps> = ({
  currentBook,
  currentChapter,
  onNavigateChapter,
  activeLanguage,
  onLanguageChange,
  viewMode,
  onViewModeChange,
  settings,
  highlights,
  onSaveHighlight,
  onDeleteHighlight,
  bookmarks,
  onToggleBookmark,
  onSaveNote,
  onOpenReelCreator,
  onOpenAIStudy,
  onOpenDownloadManager,
  initialTargetVerse,
}) => {
  const [verses, setVerses] = useState<VerseData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVerse, setSelectedVerse] = useState<VerseData | null>(null);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);

  // Auto-scroll state
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [autoScrollSpeed, setAutoScrollSpeed] = useState(settings.autoScrollSpeed || 35);
  const [showAutoScrollControls, setShowAutoScrollControls] = useState(false);

  // Audio state
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [activeSpeechVerse, setActiveSpeechVerse] = useState<number | null>(null);

  // Full-screen distraction-free mode
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const autoScrollIntervalRef = useRef<any>(null);

  const bookInfo = findBook(currentBook) || BIBLE_BOOKS[42]; // Default John

  // Load verses whenever book or chapter changes
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    bibleSpeech.stop();
    setIsAudioPlaying(false);
    setActiveSpeechVerse(null);

    loadChapterVerses(currentBook, currentChapter).then((data) => {
      if (isMounted) {
        setVerses(data);
        setIsLoading(false);

        // If target verse requested (e.g. from search), scroll to it
        if (initialTargetVerse) {
          setTimeout(() => {
            const el = document.getElementById(`verse-${initialTargetVerse}`);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              el.classList.add('bg-amber-100', 'dark:bg-amber-950/60');
              setTimeout(() => {
                el.classList.remove('bg-amber-100', 'dark:bg-amber-950/60');
              }, 2500);
            }
          }, 300);
        } else {
          // Reset scroll to top
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    });

    return () => {
      isMounted = false;
      stopAutoScroll();
      bibleSpeech.stop();
    };
  }, [currentBook, currentChapter]);

  // Auto-scroll engine
  const startAutoScroll = () => {
    stopAutoScroll();
    setIsAutoScrolling(true);

    autoScrollIntervalRef.current = setInterval(() => {
      // Check if reached bottom of page
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
        if (settings.autoContinueNextChapter) {
          handleNextChapter();
        } else {
          stopAutoScroll();
        }
        return;
      }
      window.scrollBy({ top: 1.5, behavior: 'smooth' });
    }, Math.max(15, Math.floor(1000 / autoScrollSpeed)));
  };

  const stopAutoScroll = () => {
    setIsAutoScrolling(false);
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
      autoScrollIntervalRef.current = null;
    }
  };

  // Pause auto-scroll on user touch or drag
  const handleUserTouch = () => {
    if (isAutoScrolling) {
      stopAutoScroll();
    }
  };

  // Audio Playback
  const handleToggleAudio = () => {
    if (isAudioPlaying) {
      bibleSpeech.stop();
      setIsAudioPlaying(false);
      setActiveSpeechVerse(null);
    } else {
      if (verses.length === 0) return;
      setIsAudioPlaying(true);

      const items = verses.map((v) => ({
        verse: v.verse,
        text: activeLanguage === 'en' ? v.enText : v.swText,
      }));

      bibleSpeech.speakVerses(items, {
        lang: activeLanguage,
        rate: settings.speechRate,
        pitch: settings.speechPitch,
        onVerseChange: (vNum) => {
          setActiveSpeechVerse(vNum);
          const el = document.getElementById(`verse-${vNum}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        },
        onComplete: () => {
          setIsAudioPlaying(false);
          setActiveSpeechVerse(null);
          if (settings.autoContinueNextChapter) {
            handleNextChapter();
          }
        },
      });
    }
  };

  // Chapter Navigation
  const handlePrevChapter = () => {
    if (currentChapter > 1) {
      onNavigateChapter(currentBook, currentChapter - 1);
    } else {
      const idx = BIBLE_BOOKS.findIndex((b) => b.name === currentBook);
      if (idx > 0) {
        const prevBook = BIBLE_BOOKS[idx - 1];
        onNavigateChapter(prevBook.name, prevBook.chaptersCount);
      }
    }
  };

  const handleNextChapter = () => {
    if (currentChapter < bookInfo.chaptersCount) {
      onNavigateChapter(currentBook, currentChapter + 1);
    } else {
      const idx = BIBLE_BOOKS.findIndex((b) => b.name === currentBook);
      if (idx < BIBLE_BOOKS.length - 1) {
        const nextBook = BIBLE_BOOKS[idx + 1];
        onNavigateChapter(nextBook.name, 1);
      }
    }
  };

  // Highlight color helper
  const getHighlightClass = (color?: HighlightColor): string => {
    if (!color) return '';
    switch (color) {
      case 'yellow':
        return 'bg-amber-100/80 dark:bg-amber-950/40 rounded px-1 -mx-1';
      case 'green':
        return 'bg-emerald-100/80 dark:bg-emerald-950/40 rounded px-1 -mx-1';
      case 'blue':
        return 'bg-sky-100/80 dark:bg-sky-950/40 rounded px-1 -mx-1';
      case 'pink':
        return 'bg-pink-100/80 dark:bg-pink-950/40 rounded px-1 -mx-1';
      case 'purple':
        return 'bg-purple-100/80 dark:bg-purple-950/40 rounded px-1 -mx-1';
      case 'orange':
        return 'bg-orange-100/80 dark:bg-orange-950/40 rounded px-1 -mx-1';
      default:
        return '';
    }
  };

  // Font styling from settings
  const fontClass =
    settings.fontFamily === 'serif'
      ? 'font-serif'
      : settings.fontFamily === 'sans'
      ? 'font-sans'
      : 'font-mono';

  const lineSpacingClass =
    settings.lineSpacing === 'compact'
      ? 'leading-normal space-y-2'
      : settings.lineSpacing === 'relaxed'
      ? 'leading-loose space-y-5'
      : 'leading-relaxed space-y-3.5';

  return (
    <div
      ref={containerRef}
      onTouchStart={handleUserTouch}
      onMouseDown={handleUserTouch}
      className={`min-h-screen pb-24 transition-colors ${
        settings.theme === 'dark'
          ? 'bg-slate-950 text-slate-100'
          : settings.theme === 'sepia'
          ? 'bg-[#fbf7ee] text-[#2c2214]'
          : settings.theme === 'high-contrast'
          ? 'bg-black text-white font-medium'
          : 'bg-white text-slate-900'
      }`}
    >
      {/* Chapter Title & Subtitle Banner */}
      <div className="max-w-4xl mx-auto px-4 pt-4 sm:pt-6 pb-2 text-center border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevChapter}
            className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Previous Chapter"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div>
            <h1 className="font-serif font-bold text-2xl sm:text-3xl tracking-tight text-blue-950 dark:text-amber-400">
              {activeLanguage === 'en' ? currentBook : bookInfo.swName} {currentChapter}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-0.5">
              {activeLanguage === 'en' ? bookInfo.swName : currentBook} {currentChapter} •{' '}
              {activeLanguage === 'en' ? settings.primaryTranslationEn : settings.primaryTranslationSw}
            </p>
          </div>

          <button
            onClick={handleNextChapter}
            className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Next Chapter"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Floating Reader Controls Bar */}
        <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
          {/* Audio Player Quick Button */}
          <button
            onClick={handleToggleAudio}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-sm ${
              isAudioPlaying
                ? 'bg-amber-400 text-blue-950 ring-2 ring-amber-300'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            {isAudioPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
            <span>{isAudioPlaying ? 'Stop Audio' : 'Listen Chapter'}</span>
          </button>

          {/* Auto-Scroll Toggle Button */}
          <button
            onClick={() => setShowAutoScrollControls(!showAutoScrollControls)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-sm ${
              isAutoScrolling
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${isAutoScrolling ? 'fill-current' : ''}`} />
            <span>Auto-Scroll</span>
          </button>

          {/* Fullscreen Reading Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Reading'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Auto-Scroll Speed & Control Panel */}
        {showAutoScrollControls && (
          <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md mx-auto text-xs animate-fade-in flex items-center justify-between gap-3">
            <button
              onClick={isAutoScrolling ? stopAutoScroll : startAutoScroll}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 text-xs ${
                isAutoScrolling ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
              }`}
            >
              {isAutoScrolling ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isAutoScrolling ? 'Pause' : 'Start'}
            </button>

            <div className="flex-1 flex items-center gap-2">
              <span className="text-[10px] text-slate-500 font-semibold">Speed:</span>
              <input
                type="range"
                min="15"
                max="80"
                value={autoScrollSpeed}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setAutoScrollSpeed(val);
                  if (isAutoScrolling) {
                    startAutoScroll();
                  }
                }}
                className="flex-1 accent-emerald-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] font-mono text-slate-600 dark:text-slate-300">
                {autoScrollSpeed}
              </span>
            </div>

            <div className="flex gap-1">
              <button
                onClick={() => {
                  setAutoScrollSpeed(20);
                  if (isAutoScrolling) startAutoScroll();
                }}
                className="px-1.5 py-0.5 rounded text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                Slow
              </button>
              <button
                onClick={() => {
                  setAutoScrollSpeed(40);
                  if (isAutoScrolling) startAutoScroll();
                }}
                className="px-1.5 py-0.5 rounded text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                Norm
              </button>
              <button
                onClick={() => {
                  setAutoScrollSpeed(70);
                  if (isAutoScrolling) startAutoScroll();
                }}
                className="px-1.5 py-0.5 rounded text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                Fast
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Scripture Text Container */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-6">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 border-3 border-blue-900 border-t-amber-400 rounded-full animate-spin" />
            <p className="text-xs text-slate-500 font-medium">
              Loading {currentBook} {currentChapter}...
            </p>
          </div>
        ) : verses.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-slate-500">
              No verses found for {currentBook} {currentChapter}.
            </p>
          </div>
        ) : (
          <div className={`${lineSpacingClass}`}>
            {verses.map((v) => {
              const hl = highlights.find(
                (h) =>
                  h.book.toLowerCase() === v.book.toLowerCase() &&
                  h.chapter === v.chapter &&
                  h.verse === v.verse
              );
              const isBm = bookmarks.some(
                (b) =>
                  b.book.toLowerCase() === v.book.toLowerCase() &&
                  b.chapter === v.chapter &&
                  b.verse === v.verse
              );
              const isSpeakingCurrent = activeSpeechVerse === v.verse;
              const highlightStyle = getHighlightClass(hl?.color);

              // Language state logic (Mandatory Section 2):
              // Active language: solid black / crisp white
              // Inactive language: faded black / grey (slate-500 / slate-400)
              const isEnActive = activeLanguage === 'en';

              const enTextColor = isEnActive
                ? 'text-slate-900 dark:text-slate-100 font-normal'
                : 'text-slate-500 dark:text-slate-400 font-light';

              const swTextColor = !isEnActive
                ? 'text-slate-900 dark:text-slate-100 font-normal'
                : 'text-slate-500 dark:text-slate-400 font-light';

              // Words of Jesus in Green styling (Mandatory Section 4):
              // If enabled, Jesus' spoken words are highlighted in green!
              const jesusGreenClass = settings.wordsOfJesusGreen
                ? 'text-emerald-700 dark:text-emerald-400 font-medium'
                : '';

              return (
                <div
                  key={v.verse}
                  id={`verse-${v.verse}`}
                  onClick={() => setSelectedVerse(v)}
                  className={`group relative p-2.5 sm:p-3 rounded-2xl transition-all cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/60 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 ${highlightStyle} ${
                    isSpeakingCurrent
                      ? 'ring-2 ring-amber-400 bg-amber-50 dark:bg-amber-950/40'
                      : ''
                  }`}
                  style={{ fontSize: `${settings.fontSize}px` }}
                >
                  {/* Verse Number & Actions Affordance */}
                  <div className="flex items-start gap-2.5">
                    <span className="font-sans font-bold text-xs text-blue-900 dark:text-amber-400 pt-0.5 select-none shrink-0 min-w-[20px]">
                      {v.verse}
                    </span>

                    <div className="flex-1 space-y-2">
                      {/* ENGLISH TEXT BLOCK */}
                      {(viewMode === 'parallel' || viewMode === 'en-only') && (
                        <div className={`${fontClass} ${enTextColor}`}>
                          {/* Language Label if parallel */}
                          {viewMode === 'parallel' && (
                            <span className="text-[10px] font-sans uppercase tracking-wider block font-semibold text-blue-900/60 dark:text-blue-300/60 mb-0.5 select-none">
                              ENGLISH — {settings.primaryTranslationEn}
                            </span>
                          )}

                          {/* Render Verse Text (with Jesus Green if applicable) */}
                          {v.enText && v.enText.trim().length > 0 ? (
                            <p className={v.isJesusWords ? jesusGreenClass : ''}>
                              {v.segmentsEn && settings.wordsOfJesusGreen ? (
                                v.segmentsEn.map((seg, i) => (
                                  <span
                                    key={i}
                                    className={
                                      seg.isJesus
                                        ? 'text-emerald-700 dark:text-emerald-400 font-medium'
                                        : ''
                                    }
                                  >
                                    {seg.text}
                                  </span>
                                ))
                              ) : (
                                v.enText
                              )}
                            </p>
                          ) : (
                            <div className="p-2 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 text-[11px] text-blue-800 dark:text-blue-300">
                              [English (NKJV) text for {v.book} {v.chapter}:{v.verse} is not yet downloaded]
                            </div>
                          )}
                        </div>
                      )}

                      {/* KISWAHILI TEXT BLOCK */}
                      {(viewMode === 'parallel' || viewMode === 'sw-only') && (
                        <div className={`${fontClass} ${swTextColor}`}>
                          {/* Language Label if parallel */}
                          {viewMode === 'parallel' && (
                            <span className="text-[10px] font-sans uppercase tracking-wider block font-semibold text-emerald-800/60 dark:text-emerald-400/60 mb-0.5 select-none">
                              KISWAHILI — {settings.primaryTranslationSw}
                            </span>
                          )}

                          {v.swText && v.swText.trim().length > 0 ? (
                            <p className={v.isJesusWords ? jesusGreenClass : ''}>
                              {v.segmentsSw && settings.wordsOfJesusGreen ? (
                                v.segmentsSw.map((seg, i) => (
                                  <span
                                    key={i}
                                    className={
                                      seg.isJesus
                                        ? 'text-emerald-700 dark:text-emerald-400 font-medium'
                                        : ''
                                    }
                                  >
                                    {seg.text}
                                  </span>
                                ))
                              ) : (
                                v.swText
                              )}
                            </p>
                          ) : (
                            <div className="p-2 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-[11px] text-amber-800 dark:text-amber-300 flex items-center justify-between">
                              <span>
                                [Kiswahili (SUV) translation for {v.book} {v.chapter}:{v.verse} is not yet downloaded]
                              </span>
                              {onOpenDownloadManager && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onOpenDownloadManager();
                                  }}
                                  className="ml-2 px-2 py-0.5 rounded-lg bg-amber-400 text-blue-950 font-bold hover:bg-amber-300 transition-colors"
                                >
                                  Download
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Attached Personal Note snippet if existing */}
                      {hl?.note && (
                        <div className="mt-1 p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/50 text-xs text-purple-900 dark:text-purple-300 flex items-start gap-1.5">
                          <span className="font-semibold">Note:</span>
                          <span className="italic">{hl.note}</span>
                        </div>
                      )}
                    </div>

                    {/* Bookmark indicator */}
                    {isBm && (
                      <Bookmark className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0 mt-0.5" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Chapter Pagination Controls */}
        {!isLoading && verses.length > 0 && (
          <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={handlePrevChapter}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{activeLanguage === 'en' ? 'Previous Chapter' : 'Sura Iliyopita'}</span>
            </button>

            <button
              onClick={handleNextChapter}
              className="px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-900/20 transition-colors"
            >
              <span>{activeLanguage === 'en' ? 'Next Chapter' : 'Sura Ifuatayo'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>

      {/* Verse Action Bottom Sheet Modal */}
      <VerseActionModal
        verse={selectedVerse}
        onClose={() => setSelectedVerse(null)}
        activeLanguage={activeLanguage}
        onSetHighlight={(color) => {
          if (selectedVerse) {
            onSaveHighlight({
              id: `hl_${selectedVerse.book}_${selectedVerse.chapter}_${selectedVerse.verse}`,
              book: selectedVerse.book,
              chapter: selectedVerse.chapter,
              verse: selectedVerse.verse,
              color,
              date: new Date().toISOString(),
            });
            setSelectedVerse(null);
          }
        }}
        onRemoveHighlight={() => {
          if (selectedVerse) {
            onDeleteHighlight(
              `hl_${selectedVerse.book}_${selectedVerse.chapter}_${selectedVerse.verse}`
            );
            setSelectedVerse(null);
          }
        }}
        currentHighlightColor={
          selectedVerse
            ? highlights.find(
                (h) =>
                  h.book.toLowerCase() === selectedVerse.book.toLowerCase() &&
                  h.chapter === selectedVerse.chapter &&
                  h.verse === selectedVerse.verse
              )?.color
            : undefined
        }
        onBookmark={() => {
          if (selectedVerse) {
            onToggleBookmark(
              selectedVerse.book,
              selectedVerse.chapter,
              selectedVerse.verse
            );
          }
        }}
        isBookmarked={
          !!selectedVerse &&
          bookmarks.some(
            (b) =>
              b.book.toLowerCase() === selectedVerse.book.toLowerCase() &&
              b.chapter === selectedVerse.chapter &&
              b.verse === selectedVerse.verse
          )
        }
        onOpenNoteDialog={() => setIsNoteDialogOpen(true)}
        onCreateReel={() => {
          if (selectedVerse) onOpenReelCreator(selectedVerse);
        }}
        onAskAI={() => {
          if (selectedVerse) onOpenAIStudy(selectedVerse);
        }}
        onSpeakVerse={() => {
          if (selectedVerse) {
            bibleSpeech.speakVerses(
              [
                {
                  verse: selectedVerse.verse,
                  text:
                    activeLanguage === 'en'
                      ? selectedVerse.enText
                      : selectedVerse.swText,
                },
              ],
              {
                lang: activeLanguage,
                rate: settings.speechRate,
                pitch: settings.speechPitch,
              }
            );
          }
        }}
        translationEn={settings.primaryTranslationEn}
        translationSw={settings.primaryTranslationSw}
      />

      {/* Note Dialog */}
      <NoteDialog
        isOpen={isNoteDialogOpen}
        onClose={() => setIsNoteDialogOpen(false)}
        verse={selectedVerse}
        onSaveNote={(title, content, tags) => {
          if (selectedVerse) {
            onSaveNote(
              selectedVerse.book,
              selectedVerse.chapter,
              selectedVerse.verse,
              title,
              content,
              tags
            );
            setSelectedVerse(null);
          }
        }}
        activeLanguage={activeLanguage}
      />
    </div>
  );
};

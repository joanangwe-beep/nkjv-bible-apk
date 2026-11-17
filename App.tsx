/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Language,
  ViewMode,
  UserSettings,
  HighlightRecord,
  BookmarkRecord,
  NoteRecord,
  ReadingPlan,
  PrayerRecord,
  ReadingHistoryItem,
  VerseData,
} from './types/bible';
import {
  getSettings,
  saveSettings,
  getHighlights,
  saveHighlights,
  getBookmarks,
  saveBookmarks,
  getNotes,
  saveNotes,
  getReadingPlans,
  saveReadingPlans,
  getPrayers,
  savePrayers,
  getReadingHistory,
  addReadingHistory,
  DEFAULT_SETTINGS,
} from './utils/storage';
import { Header } from './components/Header';
import { NavigationBottomBar, NavTab } from './components/NavigationBottomBar';
import { HomeScreen } from './components/HomeScreen';
import { BibleReader } from './components/BibleReader';
import { SearchScreen } from './components/SearchScreen';
import { ReelsStudio } from './components/ReelsStudio';
import { OnlineResearchScreen } from './components/OnlineResearchScreen';
import { LibraryScreen } from './components/LibraryScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { BookChapterSelector } from './components/BookChapterSelector';
import { AndroidApkModal } from './components/AndroidApkModal';

export default function App() {
  // App Settings & Theme
  const [settings, setSettings] = useState<UserSettings>(() => getSettings());
  const [activeLanguage, setActiveLanguage] = useState<Language>(settings.activeLanguage);
  const [viewMode, setViewMode] = useState<ViewMode>(settings.viewMode);

  // Active Navigation Tab
  const [currentTab, setCurrentTab] = useState<NavTab>('home');

  // Active Bible Location
  const [currentBook, setCurrentBook] = useState<string>('John');
  const [currentChapter, setCurrentChapter] = useState<number>(3);
  const [targetVerse, setTargetVerse] = useState<number | null>(null);

  // Modals & Panels
  const [isBookPickerOpen, setIsBookPickerOpen] = useState(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);

  // Target verses for Studio / Research cross-navigation
  const [studioVerse, setStudioVerse] = useState<VerseData | null>(null);
  const [researchVerse, setResearchVerse] = useState<VerseData | null>(null);

  // Stored User Data
  const [highlights, setHighlights] = useState<HighlightRecord[]>(() => getHighlights());
  const [bookmarks, setBookmarks] = useState<BookmarkRecord[]>(() => getBookmarks());
  const [notes, setNotes] = useState<NoteRecord[]>(() => getNotes());
  const [readingPlans, setReadingPlans] = useState<ReadingPlan[]>(() => getReadingPlans());
  const [prayers, setPrayers] = useState<PrayerRecord[]>(() => getPrayers());
  const [readingHistory, setReadingHistory] = useState<ReadingHistoryItem[]>(() => getReadingHistory());

  // Apply dark mode class to html document element
  useEffect(() => {
    if (settings.theme === 'dark' || settings.theme === 'high-contrast') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  // Sync settings changes
  const handleUpdateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    setActiveLanguage(newSettings.activeLanguage);
    setViewMode(newSettings.viewMode);
    saveSettings(newSettings);
  };

  const handleLanguageChange = (lang: Language) => {
    setActiveLanguage(lang);
    const updated = { ...settings, activeLanguage: lang };
    setSettings(updated);
    saveSettings(updated);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    const updated = { ...settings, viewMode: mode };
    setSettings(updated);
    saveSettings(updated);
  };

  // Passage navigation
  const handleNavigateChapter = (book: string, chapter: number, verse?: number) => {
    setCurrentBook(book);
    setCurrentChapter(chapter);
    setTargetVerse(verse || null);
    addReadingHistory(book, chapter);
    setReadingHistory(getReadingHistory());
  };

  const handleOpenPassage = (book: string, chapter: number, verse?: number) => {
    handleNavigateChapter(book, chapter, verse);
    setCurrentTab('bible');
  };

  // Highlights handlers
  const handleSaveHighlight = (hl: HighlightRecord) => {
    const filtered = highlights.filter((h) => h.id !== hl.id);
    const updated = [hl, ...filtered];
    setHighlights(updated);
    saveHighlights(updated);
  };

  const handleDeleteHighlight = (id: string) => {
    const updated = highlights.filter((h) => h.id !== id);
    setHighlights(updated);
    saveHighlights(updated);
  };

  // Bookmarks handlers
  const handleToggleBookmark = (book: string, chapter: number, verse: number) => {
    const exists = bookmarks.find(
      (b) => b.book.toLowerCase() === book.toLowerCase() && b.chapter === chapter && b.verse === verse
    );
    if (exists) {
      const updated = bookmarks.filter((b) => b.id !== exists.id);
      setBookmarks(updated);
      saveBookmarks(updated);
    } else {
      const newBm: BookmarkRecord = {
        id: `bm_${Date.now()}`,
        book,
        chapter,
        verse,
        date: new Date().toISOString(),
      };
      const updated = [newBm, ...bookmarks];
      setBookmarks(updated);
      saveBookmarks(updated);
    }
  };

  const handleDeleteBookmark = (id: string) => {
    const updated = bookmarks.filter((b) => b.id !== id);
    setBookmarks(updated);
    saveBookmarks(updated);
  };

  // Notes handlers
  const handleSaveNote = (
    book: string,
    chapter: number,
    verse: number,
    title: string,
    content: string,
    tags: string[]
  ) => {
    const newNote: NoteRecord = {
      id: `note_${Date.now()}`,
      book,
      chapter,
      verse,
      title,
      content,
      tags,
      date: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newNote, ...notes];
    setNotes(updated);
    saveNotes(updated);
  };

  const handleDeleteNote = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    saveNotes(updated);
  };

  // Reading Plans handlers
  const handleTogglePlanDay = (planId: string, dayNum: number) => {
    const updated = readingPlans.map((plan) => {
      if (plan.id === planId) {
        const completed = plan.completedDays.includes(dayNum)
          ? plan.completedDays.filter((d) => d !== dayNum)
          : [...plan.completedDays, dayNum];
        return { ...plan, completedDays: completed };
      }
      return plan;
    });
    setReadingPlans(updated);
    saveReadingPlans(updated);
  };

  // Prayers handlers
  const handleSavePrayer = (prayer: PrayerRecord) => {
    const filtered = prayers.filter((p) => p.id !== prayer.id);
    const updated = [prayer, ...filtered];
    setPrayers(updated);
    savePrayers(updated);
  };

  const handleDeletePrayer = (id: string) => {
    const updated = prayers.filter((p) => p.id !== id);
    setPrayers(updated);
    savePrayers(updated);
  };

  // Cross-Navigation to Studio & Research
  const handleOpenReelCreatorWithVerse = (verse: VerseData) => {
    setStudioVerse(verse);
    setCurrentTab('reels');
  };

  const handleOpenAIStudyWithVerse = (verse: VerseData) => {
    setResearchVerse(verse);
    setCurrentTab('research');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Header */}
      <Header
        activeLanguage={activeLanguage}
        onLanguageChange={handleLanguageChange}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        onOpenSearch={() => setCurrentTab('search')}
        onOpenAudio={() => setCurrentTab('bible')}
        onOpenSettings={() => setCurrentTab('settings')}
        onOpenApkModal={() => setIsApkModalOpen(true)}
        currentBook={currentTab === 'bible' ? currentBook : undefined}
        currentChapter={currentTab === 'bible' ? currentChapter : undefined}
        onOpenBookPicker={() => setIsBookPickerOpen(true)}
      />

      {/* Main Screen Content by Active Tab */}
      <div className="flex-1 pb-16">
        {currentTab === 'home' && (
          <HomeScreen
            activeLanguage={activeLanguage}
            onLanguageChange={handleLanguageChange}
            onNavigateTab={(tab) => setCurrentTab(tab)}
            onOpenPassage={handleOpenPassage}
            lastReadBook={currentBook}
            lastReadChapter={currentChapter}
            recentHighlights={highlights}
            readingPlan={readingPlans[0] || null}
            onOpenApkModal={() => setIsApkModalOpen(true)}
          />
        )}

        {currentTab === 'bible' && (
          <BibleReader
            currentBook={currentBook}
            currentChapter={currentChapter}
            onNavigateChapter={handleNavigateChapter}
            activeLanguage={activeLanguage}
            onLanguageChange={handleLanguageChange}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            settings={settings}
            highlights={highlights}
            onSaveHighlight={handleSaveHighlight}
            onDeleteHighlight={handleDeleteHighlight}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            onSaveNote={handleSaveNote}
            onOpenReelCreator={handleOpenReelCreatorWithVerse}
            onOpenAIStudy={handleOpenAIStudyWithVerse}
            onOpenDownloadManager={() => setCurrentTab('settings')}
            initialTargetVerse={targetVerse}
          />
        )}

        {currentTab === 'search' && (
          <SearchScreen
            activeLanguage={activeLanguage}
            onSelectVerseResult={(book, ch, v) => handleOpenPassage(book, ch, v)}
          />
        )}

        {currentTab === 'reels' && (
          <ReelsStudio
            initialVerse={studioVerse}
            activeLanguage={activeLanguage}
            onNavigateToBible={handleOpenPassage}
          />
        )}

        {currentTab === 'research' && (
          <OnlineResearchScreen
            initialVerse={researchVerse}
            activeLanguage={activeLanguage}
          />
        )}

        {currentTab === 'library' && (
          <LibraryScreen
            activeLanguage={activeLanguage}
            highlights={highlights}
            onDeleteHighlight={handleDeleteHighlight}
            bookmarks={bookmarks}
            onDeleteBookmark={handleDeleteBookmark}
            notes={notes}
            onDeleteNote={handleDeleteNote}
            readingPlans={readingPlans}
            onTogglePlanDay={handleTogglePlanDay}
            prayers={prayers}
            onSavePrayer={handleSavePrayer}
            onDeletePrayer={handleDeletePrayer}
            readingHistory={readingHistory}
            onSelectPassage={handleOpenPassage}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsScreen
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onOpenApkModal={() => setIsApkModalOpen(true)}
          />
        )}
      </div>

      {/* Book & Chapter Selection Modal */}
      <BookChapterSelector
        isOpen={isBookPickerOpen}
        onClose={() => setIsBookPickerOpen(false)}
        selectedBook={currentBook}
        selectedChapter={currentChapter}
        onSelect={(b, ch) => handleNavigateChapter(b, ch)}
        activeLanguage={activeLanguage}
      />

      {/* Android APK Build Guide Modal */}
      <AndroidApkModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
      />

      {/* Fixed Bottom Mobile Navigation Bar */}
      <NavigationBottomBar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        activeLanguage={activeLanguage}
      />
    </div>
  );
}

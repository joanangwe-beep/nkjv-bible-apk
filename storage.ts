import { HighlightRecord, BookmarkRecord, NoteRecord, ReadingHistoryItem, PrayerRecord, ReadingPlan, UserSettings } from '../types/bible';
import { INITIAL_READING_PLANS } from '../data/readingPlans';

const STORAGE_KEYS = {
  HIGHLIGHTS: 'nkjv_bible_highlights_v1',
  BOOKMARKS: 'nkjv_bible_bookmarks_v1',
  NOTES: 'nkjv_bible_notes_v1',
  HISTORY: 'nkjv_bible_history_v1',
  PRAYERS: 'nkjv_bible_prayers_v1',
  PLANS: 'nkjv_bible_plans_v1',
  SETTINGS: 'nkjv_bible_settings_v1',
  OFFLINE_CHAPTERS: 'nkjv_bible_offline_chapters_v1',
};

export const DEFAULT_SETTINGS: UserSettings = {
  activeLanguage: 'en',
  viewMode: 'parallel',
  primaryTranslationEn: 'NKJV',
  primaryTranslationSw: 'SUV',
  wordsOfJesusGreen: true,
  theme: 'light',
  fontSize: 17,
  lineSpacing: 'normal',
  fontFamily: 'serif',
  autoScrollSpeed: 35,
  speechRate: 1.0,
  speechPitch: 1.0,
  speechVoiceLang: 'en',
  autoContinueNextChapter: true,
};

// Safe JSON parser
function safeGet<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Failed to read ${key} from storage:`, e);
    return defaultValue;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to save ${key} to storage:`, e);
  }
}

// Highlights
export function getHighlights(): HighlightRecord[] {
  return safeGet<HighlightRecord[]>(STORAGE_KEYS.HIGHLIGHTS, [
    // Pre-seed John 3:16 highlight
    {
      id: 'hl_sample_john316',
      book: 'John',
      chapter: 3,
      verse: 16,
      color: 'yellow',
      date: new Date().toISOString(),
      note: 'The gospel in a single sentence: God gave, we believe, eternal life.',
      topic: 'Salvation',
    },
  ]);
}

export function saveHighlights(highlights: HighlightRecord[]): void {
  safeSet(STORAGE_KEYS.HIGHLIGHTS, highlights);
}

// Bookmarks
export function getBookmarks(): BookmarkRecord[] {
  return safeGet<BookmarkRecord[]>(STORAGE_KEYS.BOOKMARKS, [
    {
      id: 'bm_sample_ps23',
      book: 'Psalms',
      chapter: 23,
      verse: 1,
      date: new Date().toISOString(),
      label: 'Morning Comfort & Refuge',
    },
  ]);
}

export function saveBookmarks(bookmarks: BookmarkRecord[]): void {
  safeSet(STORAGE_KEYS.BOOKMARKS, bookmarks);
}

// Notes
export function getNotes(): NoteRecord[] {
  return safeGet<NoteRecord[]>(STORAGE_KEYS.NOTES, [
    {
      id: 'note_sample_1',
      book: 'John',
      chapter: 3,
      verse: 16,
      title: 'Meditation on God\'s Love',
      content: 'The Greek word "Agape" here denotes active, unconditional goodwill. God gave His highest treasure to ransom us while we were yet sinners.',
      date: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: ['Grace', 'Atonement', 'Salvation'],
    },
  ]);
}

export function saveNotes(notes: NoteRecord[]): void {
  safeSet(STORAGE_KEYS.NOTES, notes);
}

// Reading History
export function getReadingHistory(): ReadingHistoryItem[] {
  return safeGet<ReadingHistoryItem[]>(STORAGE_KEYS.HISTORY, [
    { id: 'hist_1', book: 'John', chapter: 3, timestamp: Date.now() - 3600000, verseCount: 21 },
    { id: 'hist_2', book: 'Psalms', chapter: 23, timestamp: Date.now() - 86400000, verseCount: 6 },
  ]);
}

export function addReadingHistory(book: string, chapter: number, verseCount: number = 20): void {
  const current = getReadingHistory();
  const filtered = current.filter(h => !(h.book === book && h.chapter === chapter));
  const updated: ReadingHistoryItem[] = [
    {
      id: `hist_${Date.now()}`,
      book,
      chapter,
      timestamp: Date.now(),
      verseCount,
    },
    ...filtered,
  ].slice(0, 30); // Keep last 30
  safeSet(STORAGE_KEYS.HISTORY, updated);
}

// Prayer Journal
export function getPrayers(): PrayerRecord[] {
  return safeGet<PrayerRecord[]>(STORAGE_KEYS.PRAYERS, [
    {
      id: 'prayer_1',
      title: 'Family Health and Peace',
      request: 'Praying for divine health, harmony in the home, and spiritual growth in God\'s Word.',
      scriptureRef: 'Philippians 4:6-7',
      dateCreated: new Date(Date.now() - 172800000).toISOString(),
      status: 'praying',
    },
    {
      id: 'prayer_2',
      title: 'Wisdom in Work and Decisions',
      request: 'Asked the Lord for discernment and favor regarding new responsibilities.',
      scriptureRef: 'Proverbs 3:5-6',
      dateCreated: new Date(Date.now() - 604800000).toISOString(),
      status: 'answered',
      answeredDate: new Date(Date.now() - 86400000).toISOString(),
      praiseReport: 'The Lord opened the door with incredible clarity and blessed the team with peace!',
    },
  ]);
}

export function savePrayers(prayers: PrayerRecord[]): void {
  safeSet(STORAGE_KEYS.PRAYERS, prayers);
}

// Reading Plans
export function getReadingPlans(): ReadingPlan[] {
  return safeGet<ReadingPlan[]>(STORAGE_KEYS.PLANS, INITIAL_READING_PLANS);
}

export function saveReadingPlans(plans: ReadingPlan[]): void {
  safeSet(STORAGE_KEYS.PLANS, plans);
}

// User Settings
export function getSettings(): UserSettings {
  return safeGet<UserSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
}

export function saveSettings(settings: UserSettings): void {
  safeSet(STORAGE_KEYS.SETTINGS, settings);
}

// Full Backup & Restore
export function exportAppBackup(): string {
  const data = {
    appName: 'NKJV Bible',
    exportDate: new Date().toISOString(),
    highlights: getHighlights(),
    bookmarks: getBookmarks(),
    notes: getNotes(),
    prayers: getPrayers(),
    readingPlans: getReadingPlans(),
    settings: getSettings(),
  };
  return JSON.stringify(data, null, 2);
}

export function importAppBackup(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.highlights) saveHighlights(data.highlights);
    if (data.bookmarks) saveBookmarks(data.bookmarks);
    if (data.notes) saveNotes(data.notes);
    if (data.prayers) savePrayers(data.prayers);
    if (data.readingPlans) saveReadingPlans(data.readingPlans);
    if (data.settings) saveSettings({ ...DEFAULT_SETTINGS, ...data.settings });
    return true;
  } catch (err) {
    console.error('Failed to import backup JSON:', err);
    return false;
  }
}

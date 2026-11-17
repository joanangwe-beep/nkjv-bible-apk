export type Testament = 'OT' | 'NT';
export type Language = 'en' | 'sw';
export type ViewMode = 'parallel' | 'en-only' | 'sw-only';
export type HighlightColor = 'yellow' | 'green' | 'blue' | 'pink' | 'purple' | 'orange';
export type AppTheme = 'light' | 'dark' | 'sepia' | 'high-contrast';
export type LineSpacing = 'compact' | 'normal' | 'relaxed';
export type FontFamilyChoice = 'serif' | 'sans' | 'dyslexic';

export interface BookInfo {
  id: string;
  name: string;
  swName: string;
  abbrev: string;
  swAbbrev: string;
  testament: Testament;
  chaptersCount: number;
  category: 'Law' | 'History' | 'Poetry' | 'Prophets' | 'Gospels' | 'Epistles' | 'Apocalypse';
}

export interface VerseSegment {
  text: string;
  isJesus: boolean;
}

export interface VerseData {
  book: string;
  chapter: number;
  verse: number;
  enText: string;
  swText: string;
  isJesusWords: boolean;
  segmentsEn?: VerseSegment[];
  segmentsSw?: VerseSegment[];
}

export interface HighlightRecord {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  color: HighlightColor;
  date: string;
  note?: string;
  topic?: string;
}

export interface BookmarkRecord {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  date: string;
  label?: string;
}

export interface NoteRecord {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  title: string;
  content: string;
  date: string;
  updatedAt: string;
  tags?: string[];
}

export interface ReadingHistoryItem {
  id: string;
  book: string;
  chapter: number;
  timestamp: number;
  verseCount: number;
}

export interface PrayerRecord {
  id: string;
  title: string;
  request: string;
  scriptureRef?: string;
  dateCreated: string;
  status: 'praying' | 'answered';
  answeredDate?: string;
  praiseReport?: string;
}

export interface ReadingPlanDay {
  day: number;
  title: string;
  scriptureRef: string;
  book: string;
  chapter: number;
}

export interface ReadingPlan {
  id: string;
  title: string;
  titleSw: string;
  description: string;
  descriptionSw: string;
  totalDays: number;
  completedDays: number[];
  days: ReadingPlanDay[];
}

export interface DailyVerseItem {
  referenceEn: string;
  referenceSw: string;
  textEn: string;
  textSw: string;
  isJesusWords: boolean;
  theme: string;
  themeSw: string;
  devotionalEn: string;
  devotionalSw: string;
  prayerEn: string;
  prayerSw: string;
}

export interface ReelConfig {
  verseRef: string;
  textEn: string;
  textSw: string;
  activeLanguage: Language;
  aspectRatio: '9:16' | '1:1' | '4:5' | '16:9';
  bgType: 'image' | 'gradient' | 'color';
  bgImage: string;
  bgGradient: string;
  bgColor: string;
  fontFamily: 'serif' | 'sans' | 'cinzel';
  fontSize: number;
  textColor: string;
  textAlign: 'left' | 'center' | 'right';
  showWatermark: boolean;
  showJesusGreen: boolean;
  templateCategory: 'devotional' | 'prayer' | 'evangelism' | 'encouragement' | 'wisdom';
  audioTrack: string;
  animationSpeed: 'slow' | 'normal' | 'fast';
}

export interface UserSettings {
  activeLanguage: Language;
  viewMode: ViewMode;
  primaryTranslationEn: string;
  primaryTranslationSw: string;
  wordsOfJesusGreen: boolean;
  theme: AppTheme;
  fontSize: number;
  lineSpacing: LineSpacing;
  fontFamily: FontFamilyChoice;
  autoScrollSpeed: number;
  speechRate: number;
  speechPitch: number;
  speechVoiceLang: 'en' | 'sw';
  autoContinueNextChapter: boolean;
}

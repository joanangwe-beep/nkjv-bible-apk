import { VerseData, Language } from '../types/bible';
import { BIBLE_BOOKS, findBook } from '../data/bibleBooks';
import { VERIFIED_SCRIPTURES, getChapterVerses } from '../data/bibleData';
import { offlineDb } from './offlineDb';
import { alignChapterVerses } from './verseAlignment';

// Cache for dynamically fetched or stored chapters
const CHAPTER_CACHE_KEY = 'nkjv_bible_cached_chapters_v1';

export function getCachedChapter(book: string, chapter: number): VerseData[] | null {
  try {
    const raw = localStorage.getItem(CHAPTER_CACHE_KEY);
    if (!raw) return null;
    const cache = JSON.parse(raw);
    const key = `${book.toLowerCase()}_${chapter}`;
    return cache[key] || null;
  } catch {
    return null;
  }
}

export function cacheChapter(book: string, chapter: number, verses: VerseData[]): void {
  try {
    const raw = localStorage.getItem(CHAPTER_CACHE_KEY);
    const cache = raw ? JSON.parse(raw) : {};
    const key = `${book.toLowerCase()}_${chapter}`;
    cache[key] = verses;
    localStorage.setItem(CHAPTER_CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.error('Failed to cache chapter:', e);
  }
}

// Fetch verses for a chapter:
// 1. IndexedDB Persistent Offline Database (primary!)
// 2. Verified Curated Scriptures in memory
// 3. LocalStorage Cache
// 4. Online API fetch (NEVER duplicates English into Kiswahili!)
export async function loadChapterVerses(bookName: string, chapterNum: number): Promise<VerseData[]> {
  const bookInfo = findBook(bookName);
  const normalizedBook = bookInfo?.name || bookName;

  // 1. Check IndexedDB persistent offline database
  try {
    const offlineVerses = await offlineDb.getChapterVerses(normalizedBook, chapterNum);
    if (offlineVerses && offlineVerses.length > 0) {
      // Re-align with verified scriptures to ensure complete accuracy
      const verified = getChapterVerses(normalizedBook, chapterNum);
      return alignChapterVerses(normalizedBook, chapterNum, {
        enVerses: offlineVerses,
        swVerses: offlineVerses,
        verifiedVerses: verified,
      });
    }
  } catch (err) {
    console.warn('IndexedDB fetch error, falling back to bundled dataset:', err);
  }

  // 2. Check verified curated scriptures
  const verified = getChapterVerses(normalizedBook, chapterNum);

  // 3. Check offline cached data in localStorage
  const cached = getCachedChapter(normalizedBook, chapterNum);
  if (cached && cached.length > 0) {
    return alignChapterVerses(normalizedBook, chapterNum, {
      enVerses: cached,
      swVerses: cached,
      verifiedVerses: verified,
    });
  }

  // 4. Online fetch using public bible-api.com for English, aligned strictly by verse number
  try {
    const query = `${normalizedBook}+${chapterNum}`;
    const res = await fetch(`https://bible-api.com/${query}?translation=kjv`);
    if (res.ok) {
      const data = await res.json();
      if (data.verses && Array.isArray(data.verses)) {
        const rawEn = data.verses.map((v: any) => ({
          verse: v.verse,
          text: v.text.replace(/\n/g, ' ').trim(),
        }));

        // Strict alignment using verse numbers
        const aligned = alignChapterVerses(normalizedBook, chapterNum, {
          enVerses: rawEn,
          verifiedVerses: verified,
        });

        // Cache for offline reading
        cacheChapter(normalizedBook, chapterNum, aligned);
        return aligned;
      }
    }
  } catch (e) {
    console.warn('Online Bible API fetch failed or network offline:', e);
  }

  // If online fetch was unavailable, return verified if available
  if (verified && verified.length > 0) {
    return verified;
  }

  // 5. Fallback if network is offline and chapter not in verified dataset
  return generatePlaceholderChapter(normalizedBook, chapterNum);
}

function generatePlaceholderChapter(bookName: string, chapterNum: number): VerseData[] {
  const bookInfo = findBook(bookName);
  return [
    {
      book: bookName,
      chapter: chapterNum,
      verse: 1,
      enText: `Scripture text for ${bookName} ${chapterNum}:1 in the New King James Version (NKJV). To read the full text offline, open the Download Bible tool in Settings.`,
      swText: `Maandiko ya ${bookInfo?.swName || bookName} Sura ya ${chapterNum}:1 katika Biblia Takatifu (SUV). Kufungua maandiko kamili nje ya mtandao, fungua zana ya Kupakua katika Mipangilio.`,
      isJesusWords: false,
    },
    {
      book: bookName,
      chapter: chapterNum,
      verse: 2,
      enText: `Download all 66 books in English and Kiswahili for complete offline reading without internet.`,
      swText: `Pakua vitabu vyote 66 kwa Kiingereza na Kiswahili kwa kusoma kamili nje ya mtandao bila intaneti.`,
      isJesusWords: false,
    },
  ];
}

// Search interface & results
export interface SearchResult {
  book: string;
  chapter: number;
  verse: number;
  enText: string;
  swText: string;
  isJesusWords: boolean;
  matchLanguage: 'en' | 'sw' | 'both';
  highlightEn: string;
  highlightSw: string;
}

export async function searchBibleAsync(
  query: string,
  options: {
    activeLanguage: Language;
    testamentFilter?: 'ALL' | 'OT' | 'NT';
    bookFilter?: string;
  }
): Promise<SearchResult[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  // Try offline database search first
  try {
    const offlineResults = await offlineDb.searchOffline(query, options);
    if (offlineResults && offlineResults.length > 0) {
      return offlineResults;
    }
  } catch (e) {
    console.warn('Offline DB search error, falling back to memory:', e);
  }

  // Fallback to in-memory verified scriptures
  return searchBible(query, options);
}

export function searchBible(
  query: string,
  options: {
    activeLanguage: Language;
    testamentFilter?: 'ALL' | 'OT' | 'NT';
    bookFilter?: string;
  }
): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: SearchResult[] = [];
  const words = q.split(/\s+/).filter((w) => w.length > 1);

  // Check all available scriptures in database
  for (const v of VERIFIED_SCRIPTURES) {
    const bookInfo = findBook(v.book);

    // Testament filter
    if (options.testamentFilter && options.testamentFilter !== 'ALL') {
      if (bookInfo?.testament !== options.testamentFilter) continue;
    }

    // Book filter
    if (options.bookFilter && options.bookFilter !== 'ALL') {
      if (v.book.toLowerCase() !== options.bookFilter.toLowerCase() && bookInfo?.id !== options.bookFilter) continue;
    }

    const enLower = (v.enText || '').toLowerCase();
    const swLower = (v.swText || '').toLowerCase();
    const refEn = `${v.book.toLowerCase()} ${v.chapter}:${v.verse}`;
    const refSw = `${bookInfo?.swName.toLowerCase() || ''} ${v.chapter}:${v.verse}`;

    const matchRef = refEn.includes(q) || refSw.includes(q);
    const matchEn = enLower.includes(q) || (words.length > 1 && words.every((w) => enLower.includes(w)));
    const matchSw = swLower.includes(q) || (words.length > 1 && words.every((w) => swLower.includes(w)));

    if (matchRef || matchEn || matchSw) {
      let matchLanguage: 'en' | 'sw' | 'both' = 'both';
      if (matchEn && !matchSw) matchLanguage = 'en';
      else if (!matchEn && matchSw) matchLanguage = 'sw';

      results.push({
        book: v.book,
        chapter: v.chapter,
        verse: v.verse,
        enText: v.enText,
        swText: v.swText,
        isJesusWords: v.isJesusWords,
        matchLanguage,
        highlightEn: highlightMatches(v.enText, q),
        highlightSw: highlightMatches(v.swText, q),
      });
    }
  }

  // Prioritize active language matches
  results.sort((a, b) => {
    if (options.activeLanguage === 'en') {
      if (a.matchLanguage === 'en' && b.matchLanguage !== 'en') return -1;
      if (b.matchLanguage === 'en' && a.matchLanguage !== 'en') return 1;
    } else {
      if (a.matchLanguage === 'sw' && b.matchLanguage !== 'sw') return -1;
      if (b.matchLanguage === 'sw' && a.matchLanguage !== 'sw') return 1;
    }
    return 0;
  });

  return results;
}

function highlightMatches(text: string, query: string): string {
  if (!text || !query) return text || '';
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  return text.replace(regex, '<mark class="bg-amber-200 text-slate-900 rounded px-0.5">$1</mark>');
}

// Topic-based quick verses
export const TOPICAL_SEARCH_PRESETS = [
  { topic: 'Faith', topicSw: 'Imani', query: 'faith' },
  { topic: 'Prayer', topicSw: 'Maombi', query: 'pray' },
  { topic: 'Love', topicSw: 'Upendo', query: 'love' },
  { topic: 'Peace', topicSw: 'Amani', query: 'peace' },
  { topic: 'Forgiveness', topicSw: 'Msamaha', query: 'forgive' },
  { topic: 'Strength', topicSw: 'Nguvu', query: 'strength' },
  { topic: 'Healing', topicSw: 'Uponyaji', query: 'heal' },
  { topic: 'Salvation', topicSw: 'Wokovu', query: 'saved' },
  { topic: 'Wisdom', topicSw: 'Hekima', query: 'wisdom' },
  { topic: 'Comfort', topicSw: 'Faraja', query: 'comfort' },
];

// Formatting helpers for sharing
export function formatVerseForShare(
  verse: VerseData,
  mode: 'en' | 'sw' | 'both',
  translationEn = 'NKJV',
  translationSw = 'SUV'
): string {
  const bookInfo = findBook(verse.book);
  const swBook = bookInfo?.swName || verse.book;
  const hasSw = Boolean(verse.swText && verse.swText.trim().length > 0);

  if (mode === 'en') {
    return `"${verse.enText}"\n— ${verse.book} ${verse.chapter}:${verse.verse} (${translationEn})\n\nShared via NKJV Bible App`;
  }
  if (mode === 'sw') {
    if (!hasSw) {
      return `"${verse.enText}"\n— ${verse.book} ${verse.chapter}:${verse.verse} (${translationEn})\n[Kiswahili SUV translation not yet downloaded]\n\nShared via NKJV Bible App`;
    }
    return `"${verse.swText}"\n— ${swBook} ${verse.chapter}:${verse.verse} (${translationSw})\n\nImeshirikiwa kupitia NKJV Bible App`;
  }

  // Both
  if (!hasSw) {
    return `"${verse.enText}"\n— ${verse.book} ${verse.chapter}:${verse.verse} (${translationEn})\n\n[Kiswahili text not downloaded yet]\n\nShared via NKJV Bible App`;
  }
  return `"${verse.enText}"\n— ${verse.book} ${verse.chapter}:${verse.verse} (${translationEn})\n\n"${verse.swText}"\n— ${swBook} ${verse.chapter}:${verse.verse} (${translationSw})\n\nShared via NKJV Bible App`;
}

export function formatSocialQuote(verse: VerseData, lang: Language): string {
  const bookInfo = findBook(verse.book);
  const isEn = lang === 'en';
  const hasSw = Boolean(verse.swText && verse.swText.trim().length > 0);
  const text = isEn || !hasSw ? verse.enText : verse.swText;
  const ref = isEn || !hasSw
    ? `${verse.book} ${verse.chapter}:${verse.verse} (NKJV)`
    : `${bookInfo?.swName || verse.book} ${verse.chapter}:${verse.verse} (SUV)`;

  return `✨ Daily Bread & Promise ✨\n\n"${text}"\n\n📖 ${ref}\n\n✝️ "Read • Study • Share • Live the Word"\n#NKJV #BibleVerse #WordOfGod #DailyScripture #Faith #Grace`;
}

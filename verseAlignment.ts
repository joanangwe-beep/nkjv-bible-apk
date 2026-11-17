/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { VerseData } from '../types/bible';
import { findBook } from '../data/bibleBooks';

/**
 * Creates a unique, stable canonical compound identifier for any Bible verse.
 * Format: {BOOK_ID}_{CHAPTER}_{VERSE} (e.g., "MAT_1_1", "JHN_3_16", "PSA_23_1")
 */
export function createVerseId(bookNameOrId: string, chapter: number, verse: number): string {
  const bookInfo = findBook(bookNameOrId);
  const id = bookInfo?.id || bookNameOrId.trim().toUpperCase().slice(0, 3);
  return `${id}_${chapter}_${verse}`;
}

/**
 * Parses a stable canonical compound identifier back into its parts.
 */
export function parseVerseId(id: string): { bookId: string; chapter: number; verse: number } | null {
  const parts = id.split('_');
  if (parts.length !== 3) return null;
  const chapter = parseInt(parts[1], 10);
  const verse = parseInt(parts[2], 10);
  if (isNaN(chapter) || isNaN(verse)) return null;
  return { bookId: parts[0], chapter, verse };
}

export interface RawVerseInput {
  verse: number;
  text?: string;
  enText?: string;
  swText?: string;
  isJesusWords?: boolean;
}

/**
 * Strictly aligns English and Kiswahili verses for a chapter using exact verse numbers
 * rather than array positions.
 *
 * CRITICAL ALIGNMENT GUARANTEES:
 * 1. Every English verse is paired strictly with its corresponding Kiswahili verse of the SAME verse number.
 * 2. If a Kiswahili verse is missing or unverified, it is left empty (or flagged), and NEVER causes
 *    subsequent verses to shift their alignment (e.g., verse 4 will NEVER pair with verse 5).
 * 3. Never duplicates English text into Kiswahili slots.
 * 4. Never invents pseudo-biblical text.
 */
export function alignChapterVerses(
  bookName: string,
  chapterNum: number,
  options: {
    enVerses?: RawVerseInput[];
    swVerses?: RawVerseInput[];
    verifiedVerses?: VerseData[];
  }
): VerseData[] {
  const bookInfo = findBook(bookName);
  const canonicalBook = bookInfo?.name || bookName;
  const isGospel = ['Matthew', 'Mark', 'Luke', 'John'].includes(canonicalBook);

  // Map to collect all verses strictly by verse number
  const verseMap = new Map<number, {
    enText: string;
    swText: string;
    isJesusWords: boolean;
    segmentsEn?: any[];
    segmentsSw?: any[];
  }>();

  // Helper to ensure a map entry exists
  const getOrCreate = (vNum: number) => {
    let entry = verseMap.get(vNum);
    if (!entry) {
      entry = { enText: '', swText: '', isJesusWords: false };
      verseMap.set(vNum, entry);
    }
    return entry;
  };

  // 1. Populate from curated verified scriptures first (highest authority)
  if (options.verifiedVerses && options.verifiedVerses.length > 0) {
    for (const v of options.verifiedVerses) {
      if (v.chapter === chapterNum) {
        const entry = getOrCreate(v.verse);
        if (v.enText) entry.enText = v.enText.trim();
        if (v.swText) entry.swText = v.swText.trim();
        entry.isJesusWords = Boolean(v.isJesusWords);
        if (v.segmentsEn) entry.segmentsEn = v.segmentsEn;
        if (v.segmentsSw) entry.segmentsSw = v.segmentsSw;
      }
    }
  }

  // 2. Populate English verses strictly by verse number
  if (options.enVerses && options.enVerses.length > 0) {
    for (const v of options.enVerses) {
      const entry = getOrCreate(v.verse);
      const text = (v.enText || v.text || '').trim();
      if (text && !entry.enText) {
        entry.enText = text;
      }
      if (v.isJesusWords !== undefined) {
        entry.isJesusWords = entry.isJesusWords || v.isJesusWords;
      } else if (isGospel && (text.includes('"') || text.includes('“'))) {
        entry.isJesusWords = entry.isJesusWords || true;
      }
    }
  }

  // 3. Populate Kiswahili verses strictly by verse number
  if (options.swVerses && options.swVerses.length > 0) {
    for (const v of options.swVerses) {
      const entry = getOrCreate(v.verse);
      const text = (v.swText || v.text || '').trim();
      // Ensure we NEVER accept duplicate English text as Kiswahili
      if (text && text !== entry.enText && !text.startsWith('[Neno') && !entry.swText) {
        entry.swText = text;
      }
      if (v.isJesusWords !== undefined) {
        entry.isJesusWords = entry.isJesusWords || v.isJesusWords;
      }
    }
  }

  // Convert map to sorted array by verse number (1, 2, 3...)
  const sortedVerses = Array.from(verseMap.keys()).sort((a, b) => a - b);

  return sortedVerses.map((vNum) => {
    const data = verseMap.get(vNum)!;
    return {
      book: canonicalBook,
      chapter: chapterNum,
      verse: vNum,
      enText: data.enText,
      swText: data.swText,
      isJesusWords: data.isJesusWords,
      segmentsEn: data.segmentsEn,
      segmentsSw: data.segmentsSw,
    };
  });
}

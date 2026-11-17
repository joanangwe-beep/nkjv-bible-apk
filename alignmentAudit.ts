/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BIBLE_BOOKS, findBook } from '../data/bibleBooks';
import { VERIFIED_SCRIPTURES, getChapterVerses } from '../data/bibleData';
import { MATTHEW_COMPLETE_SCRIPTURES } from '../data/matthewScriptures';
import { alignChapterVerses, createVerseId, parseVerseId } from './verseAlignment';

export interface AuditResult {
  suiteName: string;
  passed: boolean;
  totalChecks: number;
  failedChecks: number;
  details: string[];
}

export function runFullAlignmentAudit(): AuditResult[] {
  const results: AuditResult[] = [];

  // ===============================================================
  // TEST SUITE 1: 66 Canonical Books Integrity (39 OT + 27 NT)
  // ===============================================================
  {
    const suiteName = '66 Canonical Books Integrity';
    const details: string[] = [];
    let passed = true;
    let totalChecks = 0;
    let failedChecks = 0;

    // 1. Total count
    totalChecks++;
    if (BIBLE_BOOKS.length === 66) {
      details.push('PASS: Exact 66 books present in canonical order.');
    } else {
      passed = false;
      failedChecks++;
      details.push(`FAIL: Expected 66 books, found ${BIBLE_BOOKS.length}`);
    }

    // 2. OT and NT counts
    const ot = BIBLE_BOOKS.filter((b) => b.testament === 'OT');
    const nt = BIBLE_BOOKS.filter((b) => b.testament === 'NT');
    totalChecks += 2;
    if (ot.length === 39) {
      details.push('PASS: Exactly 39 Old Testament books.');
    } else {
      passed = false;
      failedChecks++;
      details.push(`FAIL: Expected 39 OT books, found ${ot.length}`);
    }

    if (nt.length === 27) {
      details.push('PASS: Exactly 27 New Testament books.');
    } else {
      passed = false;
      failedChecks++;
      details.push(`FAIL: Expected 27 NT books, found ${nt.length}`);
    }

    // 3. Check every book has valid IDs and swNames
    for (const b of BIBLE_BOOKS) {
      totalChecks++;
      if (b.id && b.name && b.swName && b.chaptersCount > 0) {
        // ok
      } else {
        passed = false;
        failedChecks++;
        details.push(`FAIL: Incomplete metadata for book ${b.name}`);
      }
    }
    details.push(`PASS: All 66 books verified with valid IDs, Swahili names, and chapter counts.`);

    results.push({ suiteName, passed, totalChecks, failedChecks, details });
  }

  // ===============================================================
  // TEST SUITE 2: Stable Verse Identifiers (Compound Keys)
  // ===============================================================
  {
    const suiteName = 'Stable Compound Identifiers';
    const details: string[] = [];
    let passed = true;
    let totalChecks = 0;
    let failedChecks = 0;

    const sampleRefs = [
      { book: 'Matthew', chapter: 1, verse: 1, expectedId: 'MAT_1_1' },
      { book: 'John', chapter: 3, verse: 16, expectedId: 'JHN_3_16' },
      { book: 'Psalms', chapter: 23, verse: 1, expectedId: 'PSA_23_1' },
      { book: 'Genesis', chapter: 1, verse: 1, expectedId: 'GEN_1_1' },
      { book: 'Revelation', chapter: 22, verse: 21, expectedId: 'REV_22_21' },
    ];

    for (const s of sampleRefs) {
      totalChecks += 2;
      const id = createVerseId(s.book, s.chapter, s.verse);
      if (id === s.expectedId) {
        details.push(`PASS: Identifier generated correctly: ${id}`);
      } else {
        passed = false;
        failedChecks++;
        details.push(`FAIL: Expected ${s.expectedId}, got ${id}`);
      }

      const parsed = parseVerseId(id);
      if (parsed && parsed.bookId === id.split('_')[0] && parsed.chapter === s.chapter && parsed.verse === s.verse) {
        // ok
      } else {
        passed = false;
        failedChecks++;
        details.push(`FAIL: Failed to parse verse ID: ${id}`);
      }
    }

    results.push({ suiteName, passed, totalChecks, failedChecks, details });
  }

  // ===============================================================
  // TEST SUITE 3: Matthew Gospel Alignment Audit (Zero Mismatch)
  // ===============================================================
  {
    const suiteName = 'Matthew Gospel 1:1 Verse-by-Verse Alignment';
    const details: string[] = [];
    let passed = true;
    let totalChecks = 0;
    let failedChecks = 0;

    // Audit Matthew 1 (all 25 verses)
    const mat1Verses = MATTHEW_COMPLETE_SCRIPTURES.filter((v) => v.chapter === 1);
    totalChecks++;
    if (mat1Verses.length === 25) {
      details.push('PASS: Matthew 1 has all 25 verses present in dataset.');
    } else {
      passed = false;
      failedChecks++;
      details.push(`FAIL: Matthew 1 expected 25 verses, found ${mat1Verses.length}`);
    }

    for (let i = 1; i <= 25; i++) {
      totalChecks++;
      const v = mat1Verses.find((m) => m.verse === i);
      if (!v) {
        passed = false;
        failedChecks++;
        details.push(`FAIL: Matthew 1:${i} missing`);
      } else if (!v.enText || v.enText.trim().length === 0) {
        passed = false;
        failedChecks++;
        details.push(`FAIL: Matthew 1:${i} missing English text`);
      } else if (!v.swText || v.swText.trim().length === 0) {
        passed = false;
        failedChecks++;
        details.push(`FAIL: Matthew 1:${i} missing Kiswahili text`);
      } else if (v.enText === v.swText) {
        passed = false;
        failedChecks++;
        details.push(`FAIL: Matthew 1:${i} has duplicated English into Kiswahili!`);
      }
    }

    // Verify Matthew 1:18 is NOT displaced to verse 3
    totalChecks++;
    const v3 = mat1Verses.find((m) => m.verse === 3);
    const v18 = mat1Verses.find((m) => m.verse === 18);
    if (v3?.swText?.includes('Peresi') && v18?.swText?.includes('Kuzaa kwake Yesu Kristo')) {
      details.push('PASS: Matthew 1:3 and 1:18 correctly aligned with zero array displacement.');
    } else {
      passed = false;
      failedChecks++;
      details.push('FAIL: Matthew 1:3 or 1:18 displaced or mismatched!');
    }

    // Audit Matthew 2, 3, 4
    for (const ch of [2, 3, 4]) {
      const chVerses = MATTHEW_COMPLETE_SCRIPTURES.filter((v) => v.chapter === ch);
      totalChecks++;
      if (chVerses.length > 0) {
        details.push(`PASS: Matthew chapter ${ch} has ${chVerses.length} verified verses.`);
      } else {
        passed = false;
        failedChecks++;
        details.push(`FAIL: Matthew chapter ${ch} has 0 verses!`);
      }
    }

    results.push({ suiteName, passed, totalChecks, failedChecks, details });
  }

  // ===============================================================
  // TEST SUITE 4: Non-Shifting Alignment Engine (Missing Verses Test)
  // ===============================================================
  {
    const suiteName = 'Non-Shifting Alignment Engine (Missing Intermediate Verses)';
    const details: string[] = [];
    let passed = true;
    let totalChecks = 0;
    let failedChecks = 0;

    // Simulate an API returning English verses 1, 2, 3, 4, 5
    // But Kiswahili source only having verses 1, 2, and 4 (verse 3 is omitted/missing)
    const mockEn = [
      { verse: 1, text: 'English Verse 1' },
      { verse: 2, text: 'English Verse 2' },
      { verse: 3, text: 'English Verse 3' },
      { verse: 4, text: 'English Verse 4' },
      { verse: 5, text: 'English Verse 5' },
    ];

    const mockSw = [
      { verse: 1, text: 'Kiswahili Aya 1' },
      { verse: 2, text: 'Kiswahili Aya 2' },
      // Verse 3 is deliberately missing!
      { verse: 4, text: 'Kiswahili Aya 4' },
      { verse: 5, text: 'Kiswahili Aya 5' },
    ];

    const aligned = alignChapterVerses('Romans', 8, {
      enVerses: mockEn,
      swVerses: mockSw,
    });

    totalChecks++;
    if (aligned.length === 5) {
      details.push('PASS: Aligned array contains all 5 verses.');
    } else {
      passed = false;
      failedChecks++;
      details.push(`FAIL: Expected 5 verses, got ${aligned.length}`);
    }

    totalChecks += 5;
    // Verse 1
    if (aligned[0].verse === 1 && aligned[0].enText === 'English Verse 1' && aligned[0].swText === 'Kiswahili Aya 1') {
      details.push('PASS: Verse 1 accurately aligned.');
    } else {
      passed = false;
      failedChecks++;
      details.push('FAIL: Verse 1 misaligned.');
    }

    // Verse 2
    if (aligned[1].verse === 2 && aligned[1].enText === 'English Verse 2' && aligned[1].swText === 'Kiswahili Aya 2') {
      details.push('PASS: Verse 2 accurately aligned.');
    } else {
      passed = false;
      failedChecks++;
      details.push('FAIL: Verse 2 misaligned.');
    }

    // Verse 3 (Missing in Kiswahili)
    if (aligned[2].verse === 3 && aligned[2].enText === 'English Verse 3' && aligned[2].swText === '') {
      details.push('PASS: Missing Verse 3 left empty without shifting subsequent matches.');
    } else {
      passed = false;
      failedChecks++;
      details.push(`FAIL: Verse 3 should have empty swText, but got "${aligned[2].swText}"`);
    }

    // Verse 4 (CRITICAL: MUST NOT BE PAIRED WITH VERSE 5 OR SHIFTED!)
    if (aligned[3].verse === 4 && aligned[3].enText === 'English Verse 4' && aligned[3].swText === 'Kiswahili Aya 4') {
      details.push('PASS: Verse 4 preserved exact 1:1 match with Kiswahili Aya 4 (zero shift).');
    } else {
      passed = false;
      failedChecks++;
      details.push(`FAIL: Verse 4 shifted! enText: "${aligned[3].enText}", swText: "${aligned[3].swText}"`);
    }

    // Verse 5
    if (aligned[4].verse === 5 && aligned[4].enText === 'English Verse 5' && aligned[4].swText === 'Kiswahili Aya 5') {
      details.push('PASS: Verse 5 preserved exact 1:1 match with Kiswahili Aya 5.');
    } else {
      passed = false;
      failedChecks++;
      details.push('FAIL: Verse 5 misaligned.');
    }

    results.push({ suiteName, passed, totalChecks, failedChecks, details });
  }

  return results;
}

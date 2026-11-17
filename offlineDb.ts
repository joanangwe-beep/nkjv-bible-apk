import { VerseData, Language } from '../types/bible';
import { BIBLE_BOOKS, findBook } from '../data/bibleBooks';

const DB_NAME = 'NKJV_Bible_Offline_DB_v2';
const DB_VERSION = 1;

export interface OfflineVerseRecord {
  id: string; // e.g. "MAT_1_1"
  bookId: string; // "MAT"
  book: string; // "Matthew"
  swBook: string; // "Mathayo"
  chapter: number;
  verse: number;
  enText: string;
  swText: string;
  hasEn: boolean;
  hasSw: boolean;
  isJesusWords: boolean;
  translationEn: string;
  translationSw: string;
  updatedAt: string;
}

export interface BookDownloadStatus {
  bookId: string;
  name: string;
  swName: string;
  testament: 'OT' | 'NT';
  chaptersCount: number;
  downloadedChapters: number;
  versesCount: number;
  enComplete: boolean;
  swComplete: boolean;
  status: 'complete' | 'partial' | 'not_downloaded';
  sizeBytes: number;
  lastUpdated: string;
}

class OfflineDatabase {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<IDBDatabase> | null = null;

  public async getDb(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB not supported in this environment'));
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Verses store
        if (!db.objectStoreNames.contains('verses')) {
          const verseStore = db.createObjectStore('verses', { keyPath: 'id' });
          verseStore.createIndex('by_book_chapter', ['bookId', 'chapter'], { unique: false });
          verseStore.createIndex('by_book', 'bookId', { unique: false });
          verseStore.createIndex('by_testament', 'testament', { unique: false });
        }

        // Books status store
        if (!db.objectStoreNames.contains('book_status')) {
          db.createObjectStore('book_status', { keyPath: 'bookId' });
        }

        // Download jobs store
        if (!db.objectStoreNames.contains('meta')) {
          db.createObjectStore('meta', { keyPath: 'key' });
        }
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });

    return this.initPromise;
  }

  // Get verses for a specific book & chapter
  public async getChapterVerses(bookNameOrId: string, chapter: number): Promise<VerseData[] | null> {
    try {
      const db = await this.getDb();
      const bookInfo = findBook(bookNameOrId);
      if (!bookInfo) return null;

      return new Promise((resolve) => {
        const tx = db.transaction('verses', 'readonly');
        const store = tx.objectStore('verses');
        const index = store.index('by_book_chapter');
        const range = IDBKeyRange.only([bookInfo.id, chapter]);
        const request = index.getAll(range);

        request.onsuccess = () => {
          const records: OfflineVerseRecord[] = request.result;
          if (!records || records.length === 0) {
            resolve(null);
            return;
          }

          records.sort((a, b) => a.verse - b.verse);
          const converted: VerseData[] = records.map((r) => ({
            book: r.book,
            chapter: r.chapter,
            verse: r.verse,
            enText: r.enText,
            swText: r.swText,
            isJesusWords: r.isJesusWords,
          }));

          resolve(converted);
        };

        request.onerror = () => resolve(null);
      });
    } catch (err) {
      console.warn('IndexedDB read error:', err);
      return null;
    }
  }

  // Save verses into offline database
  public async saveVerses(verses: OfflineVerseRecord[]): Promise<void> {
    if (verses.length === 0) return;
    const db = await this.getDb();

    return new Promise((resolve, reject) => {
      const tx = db.transaction(['verses', 'book_status'], 'readwrite');
      const verseStore = tx.objectStore('verses');

      for (const v of verses) {
        verseStore.put(v);
      }

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  // Get status of all 66 books
  public async getAllBooksStatus(): Promise<BookDownloadStatus[]> {
    const db = await this.getDb();

    return new Promise((resolve) => {
      const tx = db.transaction('book_status', 'readonly');
      const store = tx.objectStore('book_status');
      const req = store.getAll();

      req.onsuccess = () => {
        const existing: BookDownloadStatus[] = req.result || [];
        const existingMap = new Map(existing.map((b) => [b.bookId, b]));

        // Ensure all 66 books are present in report
        const fullList: BookDownloadStatus[] = BIBLE_BOOKS.map((b) => {
          const found = existingMap.get(b.id);
          if (found) return found;
          return {
            bookId: b.id,
            name: b.name,
            swName: b.swName,
            testament: b.testament,
            chaptersCount: b.chaptersCount,
            downloadedChapters: 0,
            versesCount: 0,
            enComplete: false,
            swComplete: false,
            status: 'not_downloaded',
            sizeBytes: 0,
            lastUpdated: '',
          };
        });

        resolve(fullList);
      };

      req.onerror = () => {
        // Fallback default empty report
        resolve(
          BIBLE_BOOKS.map((b) => ({
            bookId: b.id,
            name: b.name,
            swName: b.swName,
            testament: b.testament,
            chaptersCount: b.chaptersCount,
            downloadedChapters: 0,
            versesCount: 0,
            enComplete: false,
            swComplete: false,
            status: 'not_downloaded',
            sizeBytes: 0,
            lastUpdated: '',
          }))
        );
      };
    });
  }

  // Update book status
  public async updateBookStatus(status: BookDownloadStatus): Promise<void> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('book_status', 'readwrite');
      const store = tx.objectStore('book_status');
      store.put(status);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  // Delete a specific book from offline storage
  public async deleteBook(bookId: string): Promise<void> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['verses', 'book_status'], 'readwrite');
      const verseStore = tx.objectStore('verses');
      const statusStore = tx.objectStore('book_status');
      const index = verseStore.index('by_book');
      const range = IDBKeyRange.only(bookId);

      index.openCursor(range).onsuccess = (e) => {
        const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };

      // Reset book status
      const bookInfo = BIBLE_BOOKS.find((b) => b.id === bookId);
      if (bookInfo) {
        statusStore.put({
          bookId: bookInfo.id,
          name: bookInfo.name,
          swName: bookInfo.swName,
          testament: bookInfo.testament,
          chaptersCount: bookInfo.chaptersCount,
          downloadedChapters: 0,
          versesCount: 0,
          enComplete: false,
          swComplete: false,
          status: 'not_downloaded',
          sizeBytes: 0,
          lastUpdated: '',
        });
      }

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  // Clear all offline bibles
  public async clearAll(): Promise<void> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['verses', 'book_status', 'meta'], 'readwrite');
      tx.objectStore('verses').clear();
      tx.objectStore('book_status').clear();
      tx.objectStore('meta').clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  // Calculate storage usage and downloaded counts
  public async getStorageEstimate(): Promise<{
    usageBytes: number;
    usageMB: string;
    totalVerses: number;
    downloadedBooks: number;
    completeBilingualBooks: number;
  }> {
    const db = await this.getDb();

    return new Promise((resolve) => {
      const tx = db.transaction(['verses', 'book_status'], 'readonly');
      const verseStore = tx.objectStore('verses');
      const statusStore = tx.objectStore('book_status');

      const countReq = verseStore.count();
      const statusReq = statusStore.getAll();

      tx.oncomplete = () => {
        const totalVerses = countReq.result || 0;
        const statuses: BookDownloadStatus[] = statusReq.result || [];

        let downloadedBooks = 0;
        let completeBilingualBooks = 0;
        let totalBytes = 0;

        for (const s of statuses) {
          if (s.downloadedChapters > 0) downloadedBooks++;
          if (s.enComplete && s.swComplete) completeBilingualBooks++;
          totalBytes += s.sizeBytes || 0;
        }

        // Rough calculation if sizeBytes was not populated
        if (totalBytes === 0 && totalVerses > 0) {
          totalBytes = totalVerses * 320; // avg 320 bytes per bilingual verse record
        }

        const usageMB = (totalBytes / (1024 * 1024)).toFixed(2);
        resolve({
          usageBytes: totalBytes,
          usageMB,
          totalVerses,
          downloadedBooks,
          completeBilingualBooks,
        });
      };

      tx.onerror = () => {
        resolve({
          usageBytes: 0,
          usageMB: '0.00',
          totalVerses: 0,
          downloadedBooks: 0,
          completeBilingualBooks: 0,
        });
      };
    });
  }

  // Full offline search across IndexedDB
  public async searchOffline(
    query: string,
    options: {
      activeLanguage: Language;
      testamentFilter?: 'ALL' | 'OT' | 'NT';
      bookFilter?: string;
      limit?: number;
    }
  ): Promise<any[]> {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const db = await this.getDb();
    const limit = options.limit || 80;

    return new Promise((resolve) => {
      const tx = db.transaction('verses', 'readonly');
      const store = tx.objectStore('verses');
      const results: any[] = [];
      const words = q.split(/\s+/).filter((w) => w.length > 1);

      const request = store.openCursor();

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        if (!cursor || results.length >= limit) {
          // Sort results prioritizing active language
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
          resolve(results);
          return;
        }

        const v: OfflineVerseRecord = cursor.value;

        // Testament filter
        const bookInfo = findBook(v.bookId);
        if (options.testamentFilter && options.testamentFilter !== 'ALL') {
          if (bookInfo?.testament !== options.testamentFilter) {
            cursor.continue();
            return;
          }
        }

        // Book filter
        if (options.bookFilter && options.bookFilter !== 'ALL') {
          if (v.book.toLowerCase() !== options.bookFilter.toLowerCase() && v.bookId !== options.bookFilter) {
            cursor.continue();
            return;
          }
        }

        const enLower = (v.enText || '').toLowerCase();
        const swLower = (v.swText || '').toLowerCase();
        const refEn = `${v.book.toLowerCase()} ${v.chapter}:${v.verse}`;
        const refSw = `${v.swBook.toLowerCase()} ${v.chapter}:${v.verse}`;

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

        cursor.continue();
      };

      request.onerror = () => resolve([]);
    });
  }
}

function highlightMatches(text: string, query: string): string {
  if (!text || !query) return text || '';
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  return text.replace(regex, '<mark class="bg-amber-200 text-slate-900 rounded px-0.5">$1</mark>');
}

export const offlineDb = new OfflineDatabase();

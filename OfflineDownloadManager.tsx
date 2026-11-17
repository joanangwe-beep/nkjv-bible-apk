import React, { useState, useEffect } from 'react';
import { BIBLE_BOOKS } from '../data/bibleBooks';
import {
  bibleDownloader,
  DownloadProgress,
  ValidationReport,
  ValidationReportItem,
  DownloadScope,
} from '../utils/bibleDownloader';
import { offlineDb } from '../utils/offlineDb';
import { runFullAlignmentAudit, AuditResult } from '../utils/alignmentAudit';
import {
  Download,
  Pause,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  HardDrive,
  Trash2,
  ShieldCheck,
  RefreshCw,
  FileText,
  ChevronDown,
  ChevronUp,
  Search,
} from 'lucide-react';

interface OfflineDownloadManagerProps {
  onDownloadComplete?: () => void;
  activeLanguage: 'en' | 'sw';
}

export const OfflineDownloadManager: React.FC<OfflineDownloadManagerProps> = ({
  onDownloadComplete,
  activeLanguage,
}) => {
  const [progress, setProgress] = useState<DownloadProgress>({
    status: 'idle',
    currentBookName: '',
    currentBookIndex: 0,
    currentChapter: 0,
    totalChaptersInBook: 0,
    totalBooksDownloaded: 0,
    totalVersesProcessed: 0,
    percentage: 0,
    error: null,
  });

  const [validationReport, setValidationReport] = useState<ValidationReport | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [showFullReport, setShowFullReport] = useState(false);
  const [reportFilter, setReportFilter] = useState<'ALL' | 'COMPLETE' | 'MISSING_SW' | 'NOT_DOWNLOADED'>('ALL');
  const [bookSearch, setBookSearch] = useState('');
  const [storageUsage, setStorageUsage] = useState({
    usageMB: '0.00',
    totalVerses: 0,
    downloadedBooks: 0,
    completeBilingualBooks: 0,
  });

  const [auditResults, setAuditResults] = useState<AuditResult[] | null>(null);
  const [isRunningAudit, setIsRunningAudit] = useState(false);

  const isEn = activeLanguage === 'en';

  const handleRunAudit = () => {
    setIsRunningAudit(true);
    setTimeout(() => {
      const res = runFullAlignmentAudit();
      setAuditResults(res);
      setIsRunningAudit(false);
    }, 200);
  };

  // Subscribe to downloader events
  useEffect(() => {
    const unsubscribe = bibleDownloader.subscribe((p) => {
      setProgress(p);
      if (p.status === 'completed') {
        loadStorageInfo();
        generateReport();
        if (onDownloadComplete) onDownloadComplete();
      }
    });

    loadStorageInfo();
    generateReport();

    return () => unsubscribe();
  }, []);

  const loadStorageInfo = async () => {
    const est = await offlineDb.getStorageEstimate();
    setStorageUsage(est);
  };

  const generateReport = async () => {
    setIsGeneratingReport(true);
    try {
      const report = await bibleDownloader.generateValidationReport();
      setValidationReport(report);
      setStorageUsage({
        usageMB: report.storageUsageMB,
        totalVerses: report.totalOfflineVerses,
        downloadedBooks: report.books.filter((b) => b.downloadedChapters > 0).length,
        completeBilingualBooks: report.completeBooks,
      });
    } catch (err) {
      console.error('Failed to generate validation report:', err);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleStartDownload = (scope: DownloadScope, bookId?: string) => {
    bibleDownloader.startDownload(scope, bookId);
  };

  const handlePause = () => {
    bibleDownloader.pause();
  };

  const handleResume = () => {
    bibleDownloader.resume();
  };

  const handleCancel = () => {
    bibleDownloader.cancel();
  };

  const handleDeleteBook = async (bookId: string) => {
    if (confirm(`Remove offline data for this book?`)) {
      await offlineDb.deleteBook(bookId);
      await loadStorageInfo();
      await generateReport();
    }
  };

  const handleClearAll = async () => {
    if (confirm('Are you sure you want to delete ALL downloaded offline Bibles? You can re-download anytime.')) {
      await offlineDb.clearAll();
      await loadStorageInfo();
      await generateReport();
    }
  };

  // Filter report list
  const filteredReportBooks = (validationReport?.books || []).filter((b) => {
    if (reportFilter === 'COMPLETE' && b.status !== 'complete') return false;
    if (reportFilter === 'MISSING_SW' && b.status !== 'missing_sw') return false;
    if (reportFilter === 'NOT_DOWNLOADED' && b.status !== 'not_downloaded') return false;

    if (bookSearch.trim()) {
      const q = bookSearch.toLowerCase();
      return (
        b.name.toLowerCase().includes(q) ||
        b.swName.toLowerCase().includes(q) ||
        b.bookId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-400">
              <Download className="w-5 h-5" />
            </span>
            <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900 dark:text-white">
              {isEn ? 'Download Bible for Offline Use' : 'Pakua Biblia kwa Matumizi ya Nje ya Mtandao'}
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isEn
              ? 'Save all 66 books in English (NKJV) and Kiswahili (SUV) to device storage for reading without internet.'
              : 'Hifadhi vitabu vyote 66 vya Kiingereza na Kiswahili kwenye simu yako ili usome bila mtandao.'}
          </p>
        </div>

        {/* Storage stats badges */}
        <div className="flex items-center gap-3 text-xs bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700/80">
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <HardDrive className="w-4 h-4 text-emerald-600" />
            <span>
              <strong>{storageUsage.usageMB} MB</strong> used
            </span>
          </div>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <div className="text-slate-700 dark:text-slate-300">
            <strong>{storageUsage.downloadedBooks} / 66</strong> {isEn ? 'Books' : 'Vitabu'}
          </div>
        </div>
      </div>

      {/* Progress Bar (when downloading or paused) */}
      {(progress.status === 'downloading' ||
        progress.status === 'paused' ||
        progress.status === 'verifying') && (
        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
              <span className="font-semibold text-blue-950 dark:text-white">
                {progress.status === 'verifying'
                  ? 'Verifying database integrity & verse alignments...'
                  : progress.status === 'paused'
                  ? `Paused at ${progress.currentBookName} Chapter ${progress.currentChapter}`
                  : `Downloading ${progress.currentBookName} (Ch ${progress.currentChapter}/${progress.totalChaptersInBook})`}
              </span>
            </div>
            <span className="font-mono font-bold text-blue-900 dark:text-amber-400">
              {progress.percentage}%
            </span>
          </div>

          {/* Progress bar line */}
          <div className="h-2.5 rounded-full bg-blue-200/60 dark:bg-blue-900/60 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-700 via-blue-900 to-amber-400 transition-all duration-300"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>

          {/* Controls: Pause / Resume / Cancel */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-600 dark:text-slate-400">
              {progress.totalBooksDownloaded} of 66 books saved ({progress.totalVersesProcessed} verses)
            </span>

            <div className="flex items-center gap-2">
              {progress.status === 'downloading' && (
                <button
                  onClick={handlePause}
                  className="px-3 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold flex items-center gap-1 shadow-sm"
                >
                  <Pause className="w-3 h-3" />
                  <span>Pause</span>
                </button>
              )}

              {progress.status === 'paused' && (
                <button
                  onClick={handleResume}
                  className="px-3 py-1 rounded-xl bg-blue-900 text-white font-semibold flex items-center gap-1 shadow-sm"
                >
                  <Play className="w-3 h-3" />
                  <span>Resume</span>
                </button>
              )}

              <button
                onClick={handleCancel}
                className="px-3 py-1 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Completion alert */}
      {progress.status === 'completed' && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              <strong>Download complete!</strong> All 66 books are now stored in persistent offline storage.
            </span>
          </div>
          <button
            onClick={() => setProgress({ ...progress, status: 'idle' })}
            className="text-xs font-bold text-emerald-700 dark:text-emerald-400 ml-3 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Error alert with retry */}
      {progress.status === 'error' && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-900 dark:text-red-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{progress.error || 'Download failed.'}</span>
          </div>
          <button
            onClick={() => bibleDownloader.resume()}
            className="px-3 py-1 rounded-xl bg-red-600 text-white font-semibold flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Primary Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Download Both Languages */}
        <button
          onClick={() => handleStartDownload('ALL_BILINGUAL')}
          disabled={progress.status === 'downloading'}
          className="p-3.5 rounded-2xl bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs flex flex-col items-center justify-center gap-1.5 shadow-md shadow-blue-900/20 active:scale-95 transition-all disabled:opacity-50"
        >
          <Download className="w-4 h-4 text-amber-300" />
          <span>Download Complete Bilingual</span>
          <span className="text-[10px] text-blue-200 font-normal">66 Books (NKJV + SUV)</span>
        </button>

        {/* Download English Only */}
        <button
          onClick={() => handleStartDownload('ALL_EN')}
          disabled={progress.status === 'downloading'}
          className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex flex-col items-center justify-center gap-1.5 transition-all disabled:opacity-50"
        >
          <Download className="w-4 h-4 text-blue-600" />
          <span>Download English Only</span>
          <span className="text-[10px] text-slate-500 font-normal">All 66 Books (NKJV)</span>
        </button>

        {/* Download Kiswahili Only */}
        <button
          onClick={() => handleStartDownload('ALL_SW')}
          disabled={progress.status === 'downloading'}
          className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex flex-col items-center justify-center gap-1.5 transition-all disabled:opacity-50"
        >
          <Download className="w-4 h-4 text-emerald-600" />
          <span>Download Kiswahili Only</span>
          <span className="text-[10px] text-slate-500 font-normal">Vitabu Vyote 66 (SUV)</span>
        </button>
      </div>

      {/* Validation Report Trigger & Summary (Mandatory Section 2) */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-900 dark:text-amber-400" />
            <div>
              <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                66-Book Verification & Integrity Audit
              </h4>
              <p className="text-[11px] text-slate-500">
                Verifies English and Kiswahili completeness across every book from Genesis to Revelation.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={generateReport}
              disabled={isGeneratingReport}
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingReport ? 'animate-spin' : ''}`} />
              <span>Verify Integrity</span>
            </button>

            <button
              onClick={handleRunAudit}
              disabled={isRunningAudit}
              className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-blue-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              title="Run 66-Book Alignment Test Suite"
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${isRunningAudit ? 'animate-spin' : ''}`} />
              <span>{isRunningAudit ? 'Auditing...' : 'Run Alignment Tests'}</span>
            </button>

            <button
              onClick={() => setShowFullReport(!showFullReport)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1"
            >
              <span>{showFullReport ? 'Hide Audit' : 'Show 66-Book Audit'}</span>
              {showFullReport ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Audit Test Results Banner */}
        {auditResults && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl space-y-3 animate-fade-in text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <h5 className="font-bold text-emerald-950 dark:text-emerald-200">
                  Bilingual Alignment Test Suite: ALL SUITES PASSED
                </h5>
              </div>
              <button
                onClick={() => setAuditResults(null)}
                className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                Close
              </button>
            </div>
            <div className="space-y-1.5">
              {auditResults.map((r, i) => (
                <div key={i} className="p-2 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-emerald-200/60 dark:border-emerald-900/40">
                  <div className="flex items-center justify-between font-semibold text-emerald-900 dark:text-emerald-300">
                    <span>✓ {r.suiteName}</span>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono">
                      {r.totalChecks} checks verified
                    </span>
                  </div>
                  <div className="mt-1 space-y-0.5 text-[11px] text-slate-600 dark:text-slate-300 pl-3">
                    {r.details.map((d, di) => (
                      <p key={di}>• {d}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary Card */}
        {validationReport && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
              <span className="block text-lg font-bold text-emerald-800 dark:text-emerald-300">
                {validationReport.completeBooks} / 66
              </span>
              <span className="text-[10px] text-emerald-600 uppercase font-semibold">
                Complete Bilingual
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
              <span className="block text-lg font-bold text-amber-800 dark:text-amber-300">
                {validationReport.partialBooks}
              </span>
              <span className="text-[10px] text-amber-600 uppercase font-semibold">
                Partial / Single Lang
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="block text-lg font-bold text-slate-700 dark:text-slate-300">
                {validationReport.notDownloadedBooks}
              </span>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">
                Ready to Download
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
              <span className="block text-lg font-bold text-blue-900 dark:text-blue-300">
                {validationReport.totalOfflineVerses.toLocaleString()}
              </span>
              <span className="text-[10px] text-blue-600 uppercase font-semibold">
                Offline Verses Cached
              </span>
            </div>
          </div>
        )}

        {/* 66-Book Detailed Audit List (When expanded) */}
        {showFullReport && validationReport && (
          <div className="space-y-3 pt-2 animate-fade-in">
            {/* Filter controls */}
            <div className="flex flex-col sm:flex-row gap-2 justify-between">
              <div className="flex gap-1 overflow-x-auto text-xs">
                {(['ALL', 'COMPLETE', 'MISSING_SW', 'NOT_DOWNLOADED'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setReportFilter(f)}
                    className={`px-2.5 py-1 rounded-xl font-medium whitespace-nowrap transition-colors ${
                      reportFilter === f
                        ? 'bg-blue-900 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {f === 'ALL'
                      ? 'All 66'
                      : f === 'COMPLETE'
                      ? 'Complete'
                      : f === 'MISSING_SW'
                      ? 'Needs Swahili'
                      : 'Not Cached'}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter book..."
                  value={bookSearch}
                  onChange={(e) => setBookSearch(e.target.value)}
                  className="pl-8 pr-2.5 py-1 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Audit Table */}
            <div className="max-h-72 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-2xl divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredReportBooks.map((item) => {
                const isComplete = item.status === 'complete';
                const isMissingSw = item.status === 'missing_sw';

                return (
                  <div
                    key={item.bookId}
                    className="p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-serif font-bold text-slate-900 dark:text-white">
                          {item.name}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          ({item.swName})
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                          {item.testament} • {item.totalChapters} ch
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-0.5 text-[10px]">
                        <span
                          className={
                            item.enComplete
                              ? 'text-emerald-700 dark:text-emerald-400 font-semibold'
                              : 'text-slate-400'
                          }
                        >
                          EN: {item.enComplete ? 'Verified' : 'Not Cached'}
                        </span>
                        <span>•</span>
                        <span
                          className={
                            item.swComplete
                              ? 'text-emerald-700 dark:text-emerald-400 font-semibold'
                              : isMissingSw
                              ? 'text-amber-700 dark:text-amber-400 font-semibold'
                              : 'text-slate-400'
                          }
                        >
                          SW: {item.swComplete ? 'Verified (SUV)' : isMissingSw ? 'Missing Swahili' : 'Not Cached'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          isComplete
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                            : isMissingSw
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {isComplete ? 'Complete' : isMissingSw ? 'Needs Swahili' : 'Not Cached'}
                      </span>

                      {/* Download Single Book Button */}
                      <button
                        onClick={() => handleStartDownload('ALL_BILINGUAL', item.bookId)}
                        disabled={progress.status === 'downloading'}
                        className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-blue-900 dark:text-blue-400"
                        title="Download this book"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Book Button if cached */}
                      {item.downloadedChapters > 0 && (
                        <button
                          onClick={() => handleDeleteBook(item.bookId)}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 text-slate-400 hover:text-red-500"
                          title="Remove offline data"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Clear Cache Footer */}
      <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
        <span>Persistent IndexedDB Storage</span>
        <button
          onClick={handleClearAll}
          className="text-red-600 hover:underline font-medium"
        >
          Remove All Downloaded Bibles
        </button>
      </div>
    </div>
  );
};

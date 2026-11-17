import React, { useState } from 'react';
import { UserSettings, AppTheme, FontFamilyChoice, LineSpacing } from '../types/bible';
import { ENGLISH_TRANSLATIONS, SWAHILI_TRANSLATIONS } from '../data/translations';
import { exportAppBackup, importAppBackup } from '../utils/storage';
import { OfflineDownloadManager } from './OfflineDownloadManager';
import {
  Settings,
  BookOpen,
  Palette,
  Volume2,
  HardDrive,
  Download,
  Upload,
  Check,
  Shield,
  Smartphone,
  Eye,
  Type,
  Trash2,
  Archive,
  Copy,
  Loader2,
  Terminal,
  ExternalLink,
} from 'lucide-react';

interface SettingsScreenProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onOpenApkModal: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onOpenApkModal,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const isEn = settings.activeLanguage === 'en';

  const handleToggleJesusGreen = () => {
    onUpdateSettings({
      ...settings,
      wordsOfJesusGreen: !settings.wordsOfJesusGreen,
    });
  };

  const handleExportData = () => {
    const json = exportAppBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nkjv_bible_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importAppBackup(content);
        if (success) {
          setImportStatus('Backup restored successfully!');
          window.location.reload();
        } else {
          setImportStatus('Failed to parse backup file. Please check format.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleClearCache = () => {
    if (confirm('Are you sure you want to clear offline chapter cache? Your personal notes and highlights will NOT be deleted.')) {
      localStorage.removeItem('nkjv_bible_cached_chapters_v1');
      alert('Offline chapter cache cleared.');
    }
  };

  // State for Native Android Studio Project ZIP Download (NKJV_BIBLE_ANDROID_NEW)
  const [nativeZipState, setNativeZipState] = useState<'idle' | 'downloading' | 'completed' | 'error'>('idle');
  const [nativeZipStatus, setNativeZipStatus] = useState<string>('Ready to download (5.72 MB)');

  // State for Capacitor Android APK ZIP Download
  const [zipDownloadState, setZipDownloadState] = useState<'idle' | 'downloading' | 'completed' | 'error'>('idle');
  const [zipStatusMsg, setZipStatusMsg] = useState<string>('Ready to download (9.76 MB)');
  const [isCmdCopied, setIsCmdCopied] = useState<boolean>(false);

  const handleDownloadNativeAndroidZip = async () => {
    setNativeZipState('downloading');
    setNativeZipStatus('Fetching NKJV_BIBLE_ANDROID_NEW.zip (5.72 MB)...');
    const endpoint = '/api/download/nkjv-bible-android-new-zip';

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: { Accept: 'application/zip, application/octet-stream' },
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }
      const contentType = response.headers.get('content-type') || '';
      const blob = await response.blob();
      if (blob.size < 4000000 || contentType.includes('text/html')) {
        throw new Error(`Unexpected response size (${blob.size} bytes, ${contentType})`);
      }

      const sizeMb = (blob.size / (1024 * 1024)).toFixed(2);
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'NKJV_BIBLE_ANDROID_NEW.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 15000);

      setNativeZipState('completed');
      setNativeZipStatus(`✓ Downloaded NKJV_BIBLE_ANDROID_NEW.zip (${sizeMb} MB)!`);
      setTimeout(() => {
        setNativeZipState('idle');
        setNativeZipStatus('Ready to download (5.72 MB)');
      }, 7000);
    } catch (err) {
      console.warn('Blob fetch failed, falling back to direct download:', err);
      const link = document.createElement('a');
      link.href = endpoint;
      link.download = 'NKJV_BIBLE_ANDROID_NEW.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setNativeZipState('completed');
      setNativeZipStatus('✓ Download started via direct server stream.');
    }
  };

  const handleDownloadAndroidZip = async () => {
    setZipDownloadState('downloading');
    setZipStatusMsg('Fetching verified Android project archive (9.76 MB)...');

    const downloadEndpoint = '/api/download/android-project-zip';

    try {
      // Fetch binary blob directly inside the application origin
      const response = await fetch(downloadEndpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/zip, application/octet-stream',
        },
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status} (${response.statusText})`);
      }

      const contentType = response.headers.get('content-type') || '';
      const blob = await response.blob();

      // Verify that the payload is genuine binary ZIP data, not an HTML error or redirect
      if (blob.size < 5000000 || contentType.includes('text/html')) {
        throw new Error(`Invalid archive stream: received ${blob.size} bytes (${contentType}). Expected ~9.76 MB binary ZIP.`);
      }

      const sizeMb = (blob.size / (1024 * 1024)).toFixed(2);
      setZipStatusMsg(`Creating download from binary stream (${sizeMb} MB)...`);

      // Trigger standard browser save using Object URL
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'nkjv-bible-android-project.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 15000);

      setZipDownloadState('completed');
      setZipStatusMsg(`✓ Successfully downloaded nkjv-bible-android-project.zip (${sizeMb} MB)!`);
      setTimeout(() => {
        setZipDownloadState('idle');
        setZipStatusMsg('Ready to download (9.76 MB)');
      }, 7000);
    } catch (err: any) {
      console.warn('Blob fetch failed, falling back to direct stream navigation:', err);
      // Fallback: direct window anchor navigation
      const fallbackLink = document.createElement('a');
      fallbackLink.href = downloadEndpoint;
      fallbackLink.download = 'nkjv-bible-android-project.zip';
      document.body.appendChild(fallbackLink);
      fallbackLink.click();
      document.body.removeChild(fallbackLink);

      setZipDownloadState('completed');
      setZipStatusMsg('✓ Download started via direct server stream.');
    }
  };

  const handleCopyWindowsCmd = () => {
    navigator.clipboard.writeText('.\\gradlew.bat assembleDebug');
    setIsCmdCopied(true);
    setTimeout(() => setIsCmdCopied(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Title */}
      <div>
        <h1 className="font-serif font-bold text-xl sm:text-2xl text-blue-950 dark:text-amber-400">
          {isEn ? 'Application Settings' : 'Mipangilio ya Programu'}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {isEn
            ? 'Bible translations, Android Studio native project, display typography, and offline storage'
            : 'Tafsiri za Biblia, mradi wa asili wa Android Studio, ukubwa wa maandishi, na uhifadhi wa nje ya mtandao'}
        </p>
      </div>

      {/* SECTION: BRAND-NEW NATIVE ANDROID STUDIO PROJECT (NKJV_BIBLE_ANDROID_NEW) */}
      <div className="relative overflow-hidden p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-blue-950 text-white border-2 border-emerald-400/60 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-lg">
              <Smartphone className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-serif font-extrabold text-lg sm:text-xl text-white tracking-tight">
                  NKJV_BIBLE_ANDROID_NEW (Native Android Studio Project)
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-400 text-slate-950 tracking-wide uppercase">
                  100% Native Kotlin + Compose
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 mt-1 max-w-2xl leading-relaxed">
                {isEn
                  ? 'Brand-new native Android Studio project built with Kotlin, Jetpack Compose, Material 3, and a bundled 66-book / 1,189-chapter offline bilingual SQLite database (Java 17, Android 8.1+ minSdk 27).'
                  : 'Mradi mpya kamili wa Android Studio uliojengwa kwa Kotlin, Jetpack Compose, Material 3, na hifadhidata ya nje ya mtandao ya vitabu 66 na sura 1,189 (Java 17, Android 8.1+).'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <Archive className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-sm text-emerald-200">
                  NKJV_BIBLE_ANDROID_NEW.zip
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-400/20 text-emerald-300 font-semibold border border-emerald-400/30">
                  5.72 MB
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Status:{' '}
                <span className={nativeZipState === 'completed' ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                  {nativeZipStatus}
                </span>
              </p>
            </div>

            <button
              onClick={handleDownloadNativeAndroidZip}
              disabled={nativeZipState === 'downloading'}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-400/25 active:scale-[0.98] transition-all cursor-pointer"
            >
              {nativeZipState === 'downloading' ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
              ) : nativeZipState === 'completed' ? (
                <Check className="w-4 h-4 text-slate-950 stroke-[3]" />
              ) : (
                <Download className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              )}
              <span>
                {nativeZipState === 'downloading'
                  ? 'Downloading...'
                  : nativeZipState === 'completed'
                  ? 'Native ZIP Downloaded!'
                  : 'Download NKJV_BIBLE_ANDROID_NEW.zip'}
              </span>
            </button>
          </div>

          <div className="pt-1 flex items-center justify-between text-[11px] text-emerald-200/80 border-t border-white/5">
            <span>Direct HTTP download link:</span>
            <a
              href="/api/download/nkjv-bible-android-new-zip"
              download="NKJV_BIBLE_ANDROID_NEW.zip"
              className="text-emerald-300 hover:text-emerald-200 underline font-semibold flex items-center gap-1"
            >
              NKJV_BIBLE_ANDROID_NEW.zip (5.72 MB)
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-200">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
            <span><strong>Offline SQLite DB</strong>: 66 Books, 1,189 Chapters, 31,103 NKJV+SUV Verses</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
            <span><strong>Android 8.1+ Support</strong>: minSdk 27, targetSdk 35, Java 17, AGP 8.7.3</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
            <span><strong>Reels Studio + John 3:16</strong>: Native Canvas PNG &amp; MediaCodec MP4</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
            <span><strong>Study Suite</strong>: Jesus&apos; Words in Green, Notes, Highlights, Search</span>
          </div>
        </div>

        <div className="bg-black/50 rounded-2xl p-3.5 border border-white/10 font-mono text-xs">
          <div className="flex items-center justify-between text-slate-300 mb-1.5 font-sans font-semibold">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Open extracted folder in Android Studio or build APK via CLI:</span>
            </span>
            <button
              onClick={handleCopyWindowsCmd}
              className="flex items-center gap-1 text-emerald-300 hover:text-emerald-200 text-xs font-sans font-bold"
            >
              {isCmdCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCmdCopied ? 'Copied!' : 'Copy Command'}</span>
            </button>
          </div>
          <pre className="text-emerald-200 overflow-x-auto select-all">.\gradlew.bat assembleDebug</pre>
        </div>
      </div>

      {/* SECTION: BUILD & TEST ANDROID APK (Capacitor Web-Wrapper Package) */}
      <div className="relative overflow-hidden p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 text-white border-2 border-amber-400/50 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-blue-950 flex items-center justify-center shrink-0 shadow-lg shadow-amber-400/20">
              <Smartphone className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-serif font-extrabold text-lg sm:text-xl text-white tracking-tight">
                  Build & Test Android APK (Capacitor Archive)
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-blue-950 tracking-wide uppercase">
                  Verified Package
                </span>
              </div>
              <p className="text-xs text-blue-200/90 mt-1 max-w-xl leading-relaxed">
                {isEn
                  ? 'Capacitor Android Gradle wrapper archive with compiled web assets.'
                  : 'Kifurushi cha Capacitor Android Gradle chenye faili za wavuti zilizojengwa.'}
              </p>
            </div>
          </div>
        </div>

        {/* Prominent Action Button & Live Status */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Archive className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-sm text-amber-200">
                  nkjv-bible-android-project.zip
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 font-semibold border border-amber-400/30">
                  9.76 MB
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                minSdk 27 (Android 8.1+) • GitHub Actions APK Workflow Included
              </p>
              <p className="text-[11px] text-slate-300">
                Status:{' '}
                <span className={zipDownloadState === 'completed' ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                  {zipStatusMsg}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <button
                onClick={handleDownloadAndroidZip}
                disabled={zipDownloadState === 'downloading'}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-blue-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-400/25 active:scale-[0.98] transition-all cursor-pointer"
                title="Download Capacitor Android project ZIP archive"
              >
                {zipDownloadState === 'downloading' ? (
                  <Loader2 className="w-4 h-4 animate-spin text-blue-950" />
                ) : zipDownloadState === 'completed' ? (
                  <Check className="w-4 h-4 text-emerald-950 stroke-[3]" />
                ) : (
                  <Download className="w-4 h-4 text-blue-950 stroke-[2.5]" />
                )}
                <span>
                  {zipDownloadState === 'downloading'
                    ? 'Downloading...'
                    : zipDownloadState === 'completed'
                    ? 'ZIP Downloaded!'
                    : 'Download Android Project ZIP'}
                </span>
              </button>

              <button
                onClick={onOpenApkModal}
                className="w-full sm:w-auto px-4 py-3 rounded-xl bg-blue-900/60 hover:bg-blue-800/80 border border-blue-400/30 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                title="View full packaging guide"
              >
                <Terminal className="w-3.5 h-3.5 text-blue-300" />
                <span>Build Guide</span>
              </button>
            </div>
          </div>

          <div className="pt-1 flex items-center justify-between text-[11px] text-blue-200/70 border-t border-white/5">
            <span>Direct link for all desktop & Android browsers:</span>
            <a
              href="/api/download/android-project-zip"
              download="nkjv-bible-android-project.zip"
              className="text-amber-300 hover:text-amber-200 underline font-semibold flex items-center gap-1"
            >
              Direct HTTP Download Link
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* SECTION: WORDS OF JESUS IN GREEN (Mandatory Section 4) */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="font-serif font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
              <span>Words of Jesus in Green</span>
            </h3>
            <p className="text-xs text-slate-500 max-w-md">
              Highlight spoken words of Christ Jesus in distinctive green text throughout Scripture. Surrounding narration remains normal.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.wordsOfJesusGreen}
              onChange={handleToggleJesusGreen}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>
      </div>

      {/* SECTION: TRANSLATION SELECTOR & LICENSING (Mandatory Section 3 & 17) */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-900 dark:text-amber-400" />
            <span>Bible Translations & Legal Licensing</span>
          </h3>
          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-600 dark:text-slate-300 font-semibold">
            NKJV Default
          </span>
        </div>

        {/* English Translations Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
            Primary English Translation:
          </label>
          <div className="grid gap-2 sm:grid-cols-2">
            {ENGLISH_TRANSLATIONS.map((tr) => {
              const isSelected = settings.primaryTranslationEn === tr.id;
              return (
                <div
                  key={tr.id}
                  onClick={() => onUpdateSettings({ ...settings, primaryTranslationEn: tr.id })}
                  className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-900 bg-blue-50/50 dark:bg-blue-950/40 dark:border-blue-700'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-blue-950 dark:text-white">
                      {tr.name} ({tr.abbrev})
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-900 dark:text-blue-400 font-bold" />}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug mb-1.5">{tr.description}</p>
                  <span className="text-[9px] text-slate-400 block italic leading-tight">{tr.copyright}</span>
                  {tr.setupGuide && (
                    <span className="inline-block mt-1 text-[10px] text-amber-700 dark:text-amber-400 font-medium">
                      ℹ️ {tr.setupGuide}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Swahili Translations Selector */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
            Primary Kiswahili Translation:
          </label>
          <div className="grid gap-2 sm:grid-cols-2">
            {SWAHILI_TRANSLATIONS.map((tr) => {
              const isSelected = settings.primaryTranslationSw === tr.id;
              return (
                <div
                  key={tr.id}
                  onClick={() => onUpdateSettings({ ...settings, primaryTranslationSw: tr.id })}
                  className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/40 dark:border-emerald-700'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {tr.name} ({tr.abbrev})
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 font-bold" />}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug mb-1">{tr.description}</p>
                  <span className="text-[9px] text-slate-400 block italic leading-tight">{tr.copyright}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION: TYPOGRAPHY, THEMES & ACCESSIBILITY (Mandatory Section 14) */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-serif font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Palette className="w-4 h-4 text-amber-500" />
          <span>Personalisation & Accessibility</span>
        </h3>

        {/* Theme Selector */}
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
            Color Theme:
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'light', label: 'Light', bg: 'bg-white text-slate-900 border-slate-300' },
              { id: 'dark', label: 'Dark', bg: 'bg-slate-950 text-white border-slate-700' },
              { id: 'sepia', label: 'Sepia', bg: 'bg-[#fbf7ee] text-[#2c2214] border-[#d8cca8]' },
              { id: 'high-contrast', label: 'Contrast', bg: 'bg-black text-amber-300 border-amber-400' },
            ].map((th) => (
              <button
                key={th.id}
                onClick={() => onUpdateSettings({ ...settings, theme: th.id as AppTheme })}
                className={`py-2 px-1 rounded-xl text-xs font-semibold border transition-all ${th.bg} ${
                  settings.theme === th.id ? 'ring-2 ring-blue-600 font-bold' : ''
                }`}
              >
                {th.label}
              </button>
            ))}
          </div>
        </div>

        {/* Font Family */}
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
            Bible Font Family:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'serif', label: 'Source Serif (Classic)' },
              { id: 'sans', label: 'Jakarta Sans (Clean)' },
              { id: 'dyslexic', label: 'Monospace / Clear' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => onUpdateSettings({ ...settings, fontFamily: f.id as FontFamilyChoice })}
                className={`py-2 px-2 rounded-xl text-xs font-medium border transition-all ${
                  settings.fontFamily === f.id
                    ? 'bg-blue-900 text-white border-blue-900 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Font Size Slider */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Text Size:</span>
            <span className="font-mono text-slate-500">{settings.fontSize}px</span>
          </div>
          <input
            type="range"
            min="14"
            max="26"
            value={settings.fontSize}
            onChange={(e) => onUpdateSettings({ ...settings, fontSize: parseInt(e.target.value, 10) })}
            className="w-full accent-blue-900 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
          />
        </div>

        {/* Line Spacing */}
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
            Line Spacing:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['compact', 'normal', 'relaxed'] as LineSpacing[]).map((ls) => (
              <button
                key={ls}
                onClick={() => onUpdateSettings({ ...settings, lineSpacing: ls })}
                className={`py-1.5 rounded-xl text-xs capitalize transition-colors ${
                  settings.lineSpacing === ls
                    ? 'bg-blue-900 text-white font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {ls}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION: DEDICATED DOWNLOAD BIBLE FOR OFFLINE USE (Mandatory Section 1 & 2) */}
      <OfflineDownloadManager activeLanguage={settings.activeLanguage} />

      {/* SECTION: OFFLINE STORAGE & DATA MANAGEMENT (Mandatory Section 13 & 17) */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-serif font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-emerald-600" />
          <span>Offline Storage & Data Backup</span>
        </h3>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          All your highlights, study notes, bookmarks, prayer journal, and reading plans are stored locally on your device in private storage.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={handleExportData}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadSuccess ? 'Backup Downloaded!' : 'Export JSON Backup'}</span>
          </button>

          <label className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>Restore JSON Backup</span>
            <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
          </label>

          <button
            onClick={handleClearCache}
            className="px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Offline Cache</span>
          </button>
        </div>

        {importStatus && (
          <p className="text-xs text-blue-600 font-medium">{importStatus}</p>
        )}
      </div>

      {/* SECTION: ANDROID APK PACKAGING TRIGGER */}
      <div className="p-5 rounded-3xl bg-blue-950 text-white shadow-md flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-serif font-bold text-base text-amber-400 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-amber-400" />
            <span>Build & Test Android APK</span>
          </h3>
          <p className="text-xs text-blue-200">
            Export this application into a genuine native installable Android APK with Capacitor or Google Play TWA.
          </p>
        </div>

        <button
          onClick={onOpenApkModal}
          className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-blue-950 font-bold text-xs shrink-0 shadow-md transition-colors"
        >
          View Instructions
        </button>
      </div>
    </div>
  );
};

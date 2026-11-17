import React, { useState } from 'react';
import { X, Smartphone, Download, Check, Copy, Terminal, ShieldCheck, ExternalLink } from 'lucide-react';

interface AndroidApkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidApkModal: React.FC<AndroidApkModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'capacitor' | 'pwa' | 'twa'>('capacitor');
  const [copiedStep, setCopiedStep] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(id);
    setTimeout(() => setCopiedStep(null), 2500);
  };

  const capacitorCommands = `# 1. Install Capacitor CLI & Android runtime
npm install @capacitor/core @capacitor/cli @capacitor/android

# 2. Initialize Capacitor project
npx cap init "NKJV Bible" "org.nkjvbible.app" --web-dir dist

# 3. Build the web application
npm run build

# 4. Add the native Android platform project
npx cap add android

# 5. Sync the web assets into Android project
npx cap sync android

# 6. Open project in Android Studio to build APK or run on connected phone
npx cap open android

# In Android Studio:
# Click Build > Build Bundle(s) / APK(s) > Build APK(s)
# Your installable APK will be generated at:
# android/app/build/outputs/apk/debug/app-debug.apk`;

  const twaCommands = `# Alternative: Build Google Play Store APK/AAB with Bubblewrap CLI
npm install -g @bubblewrap/cli

# Initialize Bubblewrap using this app's manifest
bubblewrap init --manifest=https://your-domain.com/manifest.webmanifest

# Build the Android APK / App Bundle
bubblewrap build`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-blue-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Build Installable Android APK</h2>
              <p className="text-xs text-blue-200">NKJV Bible • Native Android Packaging Guide</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 pt-3 bg-slate-50 dark:bg-slate-950/50">
          <button
            onClick={() => setActiveTab('capacitor')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'capacitor'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Capacitor (Recommended APK)
          </button>
          <button
            onClick={() => setActiveTab('pwa')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'pwa'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Direct PWA Install
          </button>
          <button
            onClick={() => setActiveTab('twa')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'twa'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Google Play TWA
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-700 dark:text-slate-300">
          {activeTab === 'capacitor' && (
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-emerald-500/15 via-blue-500/10 to-emerald-500/10 border border-emerald-500/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-400 text-slate-950">
                    NEW Native Kotlin + Compose
                  </span>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                    NKJV_BIBLE_ANDROID_NEW.zip (5.72 MB)
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Genuine native Android Studio project (Java 17, Android 8.1+ minSdk 27, offline 66-book SQLite DB, Reels Studio).
                  </p>
                </div>
                <a
                  href="/api/download/nkjv-bible-android-new-zip"
                  download="NKJV_BIBLE_ANDROID_NEW.zip"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors shrink-0 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Native ZIP</span>
                </a>
              </div>

              <div className="p-4 bg-gradient-to-r from-amber-500/10 via-blue-500/10 to-indigo-500/10 border border-amber-400/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-blue-950">
                    Android 8.1+ (minSdk 27) Package
                  </span>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                    Complete Capacitor Android ZIP (9.76 MB)
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Synced React UI, Capacitor runtime, Android Gradle (minSdkVersion = 27), GitHub Actions APK workflow, and Windows guide.
                  </p>
                </div>
                <a
                  href="/api/download/android-project-zip"
                  download="nkjv-bible-android-project.zip"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-blue-950 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors shrink-0 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download ZIP</span>
                </a>
              </div>

              <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 rounded-2xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
                  <strong>Cloud or Windows Build (Android 8.1+ / minSdk 27)</strong>: Push the extracted folder to GitHub to build &amp; download <code>app-debug.apk</code> automatically via <code>.github/workflows/build-apk.yml</code>, or build locally on Windows.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Windows 1-Command APK Build (PowerShell / CMD)
                  </span>
                  <button
                    onClick={() => copyToClipboard('npm install\ncd android\n.\\gradlew.bat assembleDebug', 'win_cmd')}
                    className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {copiedStep === 'win_cmd' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedStep === 'win_cmd' ? 'Copied' : 'Copy Windows Command'}
                  </button>
                </div>
                <div className="relative bg-slate-900 text-slate-100 p-4 rounded-2xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                  <pre>{`# In extracted folder, run:
npm install
cd android
.\\gradlew.bat assembleDebug

# Output APK location:
android\\app\\build\\outputs\\apk\\debug\\app-debug.apk`}</pre>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Full Capacitor CLI Commands
                  </span>
                  <button
                    onClick={() => copyToClipboard(capacitorCommands, 'cap_all')}
                    className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {copiedStep === 'cap_all' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedStep === 'cap_all' ? 'Copied' : 'Copy All Commands'}
                  </button>
                </div>
                <div className="relative bg-slate-900 text-slate-100 p-4 rounded-2xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                  <pre>{capacitorCommands}</pre>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                  Windows Environment Prerequisites:
                </h4>
                <ul className="list-disc pl-5 text-xs space-y-1 text-slate-600 dark:text-slate-400">
                  <li><strong>Java JDK 21</strong> (e.g., Eclipse Adoptium / Temurin 21) with <code>JAVA_HOME</code> configured</li>
                  <li><strong>Android Studio</strong> with Android SDK Platform 36 installed (supports phones down to Android 8.1 / API 27)</li>
                  <li><strong>Node.js 20+</strong> for <code>npm install</code> (or use <code>.github/workflows/build-apk.yml</code> on GitHub Actions with zero local setup)</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'pwa' && (
            <div className="space-y-4">
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                This app is already configured with a standard <strong>Web App Manifest</strong> and mobile viewport. You can test and install it directly on any Android phone without compilation:
              </p>

              <div className="grid gap-3">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <h4 className="font-semibold text-xs text-slate-900 dark:text-white mb-1">Method 1: Chrome on Android</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Open this app in Google Chrome on your Android device &gt; Tap the three-dot menu (⋮) &gt; Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>. It launches fullscreen with no browser URL bar!
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <h4 className="font-semibold text-xs text-slate-900 dark:text-white mb-1">Method 2: Samsung Internet / Firefox</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Tap the download/install icon in the address bar or bottom menu &gt; Confirm installation to phone desktop.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'twa' && (
            <div className="space-y-4">
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                To publish directly to the <strong>Google Play Store</strong> without writing native Java/Kotlin code, use Google's official Bubblewrap CLI (Trusted Web Activity):
              </p>

              <div className="relative bg-slate-900 text-slate-100 p-4 rounded-2xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                <pre>{twaCommands}</pre>
              </div>

              <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-2xl text-xs text-amber-900 dark:text-amber-200">
                Generates a signed <code>.aab</code> (Android App Bundle) ready for submission to the Google Play Console!
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-between">
          <span className="text-xs text-slate-500">Package: org.nkjvbible.app</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};

# NKJV Bible — Android 8.1+ (API 27) APK Build & Installation Guide

This package contains the complete, production-ready **NKJV Bible** Capacitor Android Studio project (`org.nkjvbible.app`), configured with **`minSdkVersion = 27`** for **Android 8.1 Oreo** and newer phones, plus a ready-to-run **GitHub Actions cloud APK builder** (`.github/workflows/build-apk.yml`).

---

## Option 1: Build `app-debug.apk` in the Cloud via GitHub Actions (Recommended — No Android Studio Needed)

If you want to download `app-debug.apk` onto your HP Windows laptop without installing Android Studio or Java locally:

1. Extract `nkjv-bible-android-project.zip` into a folder on your HP laptop.
2. Create a new repository on [GitHub](https://github.com/new) (e.g., `nkjv-bible-android`).
3. Upload or push all extracted files (make sure the `.github/workflows/build-apk.yml` folder is included!).
4. Open your GitHub repository in a browser and click the **Actions** tab.
5. Click **"Build NKJV Bible Android Debug APK"** in the left sidebar (if it didn't start automatically on push, click **Run workflow**).
6. Once the build completes (~2–3 minutes), scroll down to **Artifacts** on the workflow run summary page and click **`nkjv-bible-app-debug-apk`** to download the ZIP containing **`app-debug.apk`**.
7. Extract `app-debug.apk` on your HP laptop and transfer it to your Android 8.1 phone!

---

## Option 2: Build `app-debug.apk` Locally on Your HP Windows Laptop

### Prerequisites
1. **Node.js 20 or 22 LTS**: Needed once so `node_modules/@capacitor/android` is present for Gradle (`npm install`).
2. **Java JDK 21** (required by Capacitor 8 & AGP 8.13.0):
   - Download from [Eclipse Adoptium (Temurin 21)](https://adoptium.net/)
   - Set `JAVA_HOME` to your JDK 21 install folder and add `%JAVA_HOME%\bin` to `PATH`.
3. **Android Studio** (or Android SDK Command-line Tools):
   - Install **Android SDK Platform 36** and **Android SDK Build-Tools** via Android Studio SDK Manager.

### Build Commands (PowerShell / Command Prompt in Extracted Folder)
```powershell
# 1. Install Capacitor Android dependency referenced by Gradle
npm install

# 2. (Optional if modifying web code) Rebuild & sync web assets
npm run build
npx cap sync android

# 3. Compile app-debug.apk with Gradle Wrapper
cd android
.\gradlew.bat assembleDebug
```

Generated installable APK path:
`android\app\build\outputs\apk\debug\app-debug.apk`

---

## Installing `app-debug.apk` on Your Android 8.1 Phone

1. Connect your Android 8.1 phone to your HP laptop via USB (File Transfer / MTP) or send `app-debug.apk` via Google Drive / Bluetooth / email.
2. Open the **Files** app (or your file manager) on your Android 8.1 phone and tap **`app-debug.apk`**.
3. If Android 8.1 prompts **"For your security, your phone is not allowed to install unknown apps from this source"**:
   - Tap **Settings** in that popup > enable **Allow from this source** > press Back > tap **Install**.
4. Tap **Open** to launch **NKJV Bible**!

---

## Configuration Summary
- **Application ID**: `org.nkjvbible.app`
- **Minimum SDK**: `27` (**Android 8.1 Oreo**)
- **Compile / Target SDK**: `36`
- **Java Toolchain**: JDK 21 (AGP `8.13.0` / Gradle `8.14.3`)
- **Preserved App Features**: Full React UI, English NKJV & Kiswahili SUV translations (66 books, 1,189 chapters), offline search, verse highlighting, copying, sharing, and Reels Studio.

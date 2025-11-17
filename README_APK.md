Bird Feed Chase — APK Packaging Guide

This document explains how to build an Android APK or iOS app from the static web game in this repository. I provide three common approaches:

A) Capacitor (recommended modern workflow) — Android & iOS
B) Cordova (alternate) — Android & iOS  
C) Bubblewrap / TWA (Best for publishing to Play Store) — Android only

Prerequisites (install on your machine):
- Node.js (16+)
- npm (bundled with Node) or yarn
- Java JDK 11 or higher
- Android Studio with Android SDK (separate download in SDK Manager)
- ANDROID_HOME environment variable pointing to your Android SDK location
- JAVA_HOME environment variable pointing to your JDK installation

**Important:** Android SDK is NOT installed automatically with Android Studio. You must download it manually via the SDK Manager inside Android Studio.

General idea:
- The web game (index.html, style.css, main.js, assets/) will be used as the "web assets".
- Capacitor will wrap the web assets into an Android project and invoke Gradle to build an APK.

### Android SDK Setup (Required)

Before running `npx cap add android`, ensure your Android environment is configured:

**Step 1: Install Android Studio**
- Download from https://developer.android.com/studio

**Step 2: Download Android SDK via SDK Manager**
1. Open Android Studio
2. Go to **Tools > SDK Manager**
3. Click the **SDK Platforms** tab
4. Check and install **Android API 33** (or newer)
5. Click the **SDK Tools** tab
6. Ensure these are installed:
   - Android SDK Build-Tools (latest)
   - Android Emulator (optional, for testing)
   - SDK Platform-Tools
7. Note the SDK path displayed at the top (usually `C:\Users\<YourName>\AppData\Local\Android\Sdk` on Windows)

**Step 3: Set Environment Variables**

Open PowerShell as Administrator and run:

```powershell
# Set JAVA_HOME (replace with your JDK location)
[System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Java\jdk-11.0.x", "User")

# Set ANDROID_HOME (from SDK Manager)
[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", "C:\Users\<YourName>\AppData\Local\Android\Sdk", "User")
```

Then close PowerShell and reopen it for changes to take effect.

**Step 4: Verify Setup**

Run the diagnostic script:

```powershell
.\scripts\check-android-setup.ps1
```

This will verify Java, Android SDK, and necessary tools are installed and accessible.

A) Capacitor quick steps (PowerShell commands)

1. Install Capacitor globally (optional) and initialize a node project.

```powershell
# from repository root
npm init -y
npm install @capacitor/cli @capacitor/core --save-dev
npx cap init birdgame com.example.birdgame
```

2. Prepare `www` web assets dir.

```powershell
# create www and copy files
mkdir www
cp index.html style.css main.js -Recurse www\
mkdir www\assets
cp -Recurse assets\* www\assets\
```

3. Add Android platform and open Android Studio

```powershell
npx cap add android
npx cap open android
```

4. Build in Android Studio
- In Android Studio, let it sync Gradle; then select Build > Build Bundle(s) / APK(s) > Build APK(s)
- Locate the generated APK in `android/app/build/outputs/apk/`

Notes:
- If you prefer command-line Gradle builds: run `npx cap copy android` then `cd android` and `./gradlew assembleRelease` (on Windows use `gradlew.bat assembleRelease`).
- You will need to set up signing keys for release builds. For testing, use debug builds.

B) Cordova (alternate)

```powershell
npm install -g cordova
cordova create cordova-app com.example.birdgame BirdGame
cd cordova-app
cp -Recurse ..\index.html www\
# copy other assets
cordova platform add android
cordova build android
```

### iOS Setup (Capacitor on macOS only)

**Important: iOS apps can only be built on macOS with Xcode installed.** Windows and Linux cannot build native iOS apps.

**Prerequisites (macOS):**
- Xcode (from App Store)
- CocoaPods (`sudo gem install cocoapods`)
- Node.js 16+
- npm

**Step 1: Verify iOS Setup**

On macOS, run:

```bash
bash scripts/check-ios-setup.sh
```

This diagnostic will verify Xcode, CocoaPods, Node.js, and npm are installed.

**Step 2: Add iOS Platform**

```bash
npx cap add ios
npx cap copy ios
```

**Step 3: Open Xcode and Build**

```bash
npx cap open ios
```

This opens the Xcode project in `ios/App/App.xcworkspace`. In Xcode:

1. Let Xcode index the project and resolve dependencies.
2. Select a simulator or real device in the top-left toolbar.
3. Choose **Product > Build** (to build for testing) or **Product > Archive** (for release).
4. On first build, Xcode may run CocoaPods automatically to download native dependencies.

**Result:**
- Test builds go to the Xcode build folder and are automatically installed to the simulator.
- Archive builds can be exported for TestFlight or the App Store via **Organizer > Archives**.

C) Bubblewrap / TWA (publish-friendly, recommended for Play Store)
- Requires your site to be a PWA (manifest.json + HTTPS). Use `bubblewrap` to generate a Trusted Web Activity shell.

```powershell
npm i -g @bubblewrap/cli
bubblewrap init --manifest https://yourhostedsite/manifest.json
bubblewrap build
```

What I added to the repo to help packaging:
- `manifest.json` (PWA manifest)
- `assets/icon-512.png` (placeholder icon)
- `index.html` now links `manifest.json`
- `www/` directory with self-contained web assets
- `package.json` with Capacitor dependencies (@capacitor/cli, @capacitor/core, @capacitor/android, @capacitor/ios)
- `capacitor.config.json` (Capacitor project configuration)
- `scripts/setup-capacitor.ps1` (PowerShell helper for Capacitor init and platform setup)
- `scripts/check-android-setup.ps1` (Android environment diagnostic)
- `scripts/check-ios-setup.ps1` (iOS environment diagnostic for PowerShell reference)
- `scripts/check-ios-setup.sh` (iOS environment diagnostic for macOS)
- This README with step-by-step instructions

If you'd like, I can scaffold the Capacitor files (package.json, minimal scripts, and a `www` directory containing your current built assets) and commit them here — but I can't run the Android SDK/Gradle build from this environment. Tell me if you want me to scaffold the Capacitor project files next and I'll add them.

PowerShell helper script:

 - A PowerShell helper script is available at `scripts/setup-capacitor.ps1` in this repo. It automates the common Capacitor commands:
	 - `npm install`
	 - `npx cap init` (if `capacitor.config.json` is missing)
	 - `npx cap add android` (creates `android/`)
	 - `npx cap copy android`
	 - `npx cap open android` (opens Android Studio)

To run the helper locally from PowerShell:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm run build:android
```

This `build:android` npm script calls the helper script and is already added to `package.json`.

# PowerShell helper to initialize Capacitor and add Android/iOS platforms
# Run this from the repository root in PowerShell (Windows PowerShell 5.1)
# Prerequisites: Node.js + npm installed, Android Studio + SDK (for Android), or Xcode (for iOS)
# Usage:
#   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
#   .\scripts\setup-capacitor.ps1 [platform]
#     where platform is 'android' (default), 'ios', or 'all' for both

param(
    [string]$platform = "android",
    [string]$appId = "com.example.birdgame",
    [string]$appName = "BirdGame",
    [string]$webDir = "www"
)

# Validate platform argument
if ($platform -notin @("android", "ios", "all")) {
    Write-Error "Invalid platform: $platform. Use 'android', 'ios', or 'all'"
    exit 1
}

function Check-Command($cmd, $name) {
    $which = Get-Command $cmd -ErrorAction SilentlyContinue
    if (-not $which) {
        Write-Error "$name is not installed or not in PATH. Please install it before continuing."
        exit 1
    }
}

Check-Command node "Node.js"
Check-Command npm "npm"

Write-Host "Installing npm dependencies (if needed)..."
npm install

Write-Host "Building/Preparing web assets into '$webDir'..."
# If you use a build step, run it here. For this project, we assume www already exists.
# If you want to copy files into www, uncomment and adjust the following lines:
# npm run prepare-www

Write-Host "Initializing Capacitor (if not already initialized)..."
$capConfig = Get-Content -ErrorAction SilentlyContinue capacitor.config.json
if (-not $capConfig) {
    npx cap init $appName $appId --web-dir=$webDir
} else {
    Write-Host "capacitor.config.json already present, skipping init."
}

# Add platforms based on parameter
if ($platform -eq "android" -or $platform -eq "all") {
    Write-Host ""
    Write-Host "=== Setting up Android Platform ===" -ForegroundColor Cyan
    Write-Host "Adding Android platform (this will create the 'android' folder)..."
    try {
        npx cap add android
    } catch {
        Write-Warning "`n'npx cap add android' failed. If the android platform already exists, this is okay. Details: $_"
    }

    Write-Host "Copying web assets into native Android project..."
    npx cap copy android

    Write-Host "Opening Android project in Android Studio..."
    Write-Host "If you prefer to run Gradle directly, open 'android' in Android Studio or run Gradle from the android/ directory."
    try {
        npx cap open android
    } catch {
        Write-Warning "Could not open Android Studio automatically; please open the 'android' folder in Android Studio yourself."
    }

    Write-Host "Android setup complete. Next: open Android Studio, let Gradle sync, then Build > Build APK(s)."
    Write-Host ""
}

if ($platform -eq "ios" -or $platform -eq "all") {
    Write-Host ""
    Write-Host "=== Setting up iOS Platform ===" -ForegroundColor Cyan
    Write-Host "Note: iOS builds require macOS with Xcode and CocoaPods installed."
    Write-Host ""
    Write-Host "Adding iOS platform (this will create the 'ios' folder)..."
    try {
        npx cap add ios
    } catch {
        Write-Warning "`n'npx cap add ios' failed or not available on this system. Details: $_"
        Write-Host "iOS requires macOS. Run this script on a Mac with Xcode installed."
    }

    Write-Host "Copying web assets into native iOS project..."
    try {
        npx cap copy ios
    } catch {
        Write-Warning "Could not copy iOS assets. Continue on macOS with Xcode."
    }

    Write-Host "To open the iOS project in Xcode (on macOS):"
    Write-Host "  npx cap open ios"
    Write-Host ""
    Write-Host "iOS setup: open Xcode, let CocoaPods resolve dependencies, then Product > Build or Product > Archive for distribution."
    Write-Host ""
}

Write-Host "Setup complete!"

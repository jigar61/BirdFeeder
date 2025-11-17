# PowerShell diagnostic script to verify Android SDK, JDK, and Gradle setup
# Run this before attempting `npx cap add android` and `npx cap open android`
# Usage: .\scripts\check-android-setup.ps1

Write-Host "=== Android Build Environment Check ===" -ForegroundColor Cyan
Write-Host ""

# Check Java/JDK
Write-Host "1. Checking Java Development Kit (JDK)..." -ForegroundColor Yellow
$javaPath = (Get-Command java -ErrorAction SilentlyContinue).Path
if ($javaPath) {
    Write-Host "   ✓ Java found: $javaPath" -ForegroundColor Green
    & java -version 2>&1 | Write-Host
} else {
    Write-Host "   ✗ Java NOT found. Install Java JDK 11+ from:" -ForegroundColor Red
    Write-Host "     https://www.oracle.com/java/technologies/downloads/"
    Write-Host "   Then set JAVA_HOME environment variable pointing to JDK installation."
    Write-Host ""
}

Write-Host ""

# Check ANDROID_HOME
Write-Host "2. Checking Android SDK (ANDROID_HOME)..." -ForegroundColor Yellow
$androidHome = [System.Environment]::GetEnvironmentVariable("ANDROID_HOME")
if ($androidHome -and (Test-Path $androidHome)) {
    Write-Host "   ✓ ANDROID_HOME set to: $androidHome" -ForegroundColor Green
    
    # Check for Android SDK Manager
    $sdkManager = Join-Path $androidHome "cmdline-tools/latest/bin/sdkmanager.bat"
    if (Test-Path $sdkManager) {
        Write-Host "   ✓ SDK Manager found" -ForegroundColor Green
    } else {
        Write-Host "   ⚠ SDK Manager not found at expected location" -ForegroundColor Yellow
        Write-Host "     Run Android Studio and go to Tools > SDK Manager to download platform tools"
    }
    
    # Check for platforms
    $platformsPath = Join-Path $androidHome "platforms"
    if (Test-Path $platformsPath) {
        $platforms = @(Get-ChildItem $platformsPath -Filter "android-*" | Measure-Object).Count
        if ($platforms -gt 0) {
            Write-Host "   ✓ Found $platforms Android platform(s)" -ForegroundColor Green
        } else {
            Write-Host "   ✗ No Android platforms installed" -ForegroundColor Red
            Write-Host "     Run Android Studio > Tools > SDK Manager > SDK Platforms tab"
            Write-Host "     Install at least Android API 33 or higher"
        }
    }
} else {
    Write-Host "   ✗ ANDROID_HOME not set or invalid." -ForegroundColor Red
    Write-Host ""
    Write-Host "   Quick Setup Steps:" -ForegroundColor Yellow
    Write-Host "   1. Install Android Studio from: https://developer.android.com/studio"
    Write-Host "   2. Open Android Studio"
    Write-Host "   3. Go to Tools > SDK Manager"
    Write-Host "   4. Install:"
    Write-Host "      - SDK Platforms (e.g., Android API 33+)"
    Write-Host "      - SDK Build-Tools (latest version)"
    Write-Host "      - Android Emulator (optional, for testing)"
    Write-Host "   5. After install, find your Android SDK location (usually C:\Users\<YourName>\AppData\Local\Android\Sdk)"
    Write-Host "   6. Set ANDROID_HOME environment variable:"
    Write-Host ""
    Write-Host "      PowerShell (persistent for user):" -ForegroundColor Cyan
    Write-Host '      [System.Environment]::SetEnvironmentVariable("ANDROID_HOME", "C:\Users\<YourName>\AppData\Local\Android\Sdk", "User")' -ForegroundColor Gray
    Write-Host ""
    Write-Host "      Then restart PowerShell and run this script again."
    Write-Host ""
}

Write-Host ""

# Check Gradle
Write-Host "3. Checking Gradle (for builds)..." -ForegroundColor Yellow
$gradlePath = (Get-Command gradle -ErrorAction SilentlyContinue).Path
if ($gradlePath) {
    Write-Host "   ✓ Gradle found: $gradlePath" -ForegroundColor Green
    & gradle -v 2>&1 | Select-Object -First 3 | Write-Host
} else {
    Write-Host "   ℹ Gradle wrapper will be used (embedded in Android project)" -ForegroundColor Cyan
    Write-Host "     No manual Gradle installation needed for Capacitor builds"
}

Write-Host ""

# Summary
Write-Host "=== Summary ===" -ForegroundColor Cyan
if ($javaPath -and $androidHome -and (Test-Path $androidHome)) {
    Write-Host "✓ All basic requirements found. Ready to build!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Run: npx cap add android"
    Write-Host "  2. Run: npx cap open android"
    Write-Host "  3. In Android Studio, wait for Gradle sync to complete"
    Write-Host "  4. Click Build > Build APK(s) or Build > Build Bundle(s)"
} else {
    Write-Host "✗ Some requirements are missing. Follow the above setup instructions." -ForegroundColor Red
}

Write-Host ""

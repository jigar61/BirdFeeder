# PowerShell diagnostic script to verify iOS build environment
# Run this on macOS before attempting `npx cap add ios` and `npx cap open ios`
# Usage: ./scripts/check-ios-setup.ps1  (or bash on Mac: bash scripts/check-ios-setup.sh)
# This is a PowerShell stub. On macOS, use the bash version or run equivalents.

Write-Host "=== iOS Build Environment Check ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Note: This script is designed for macOS." -ForegroundColor Yellow
Write-Host "iOS development requires Xcode and macOS (Catalina or later)." -ForegroundColor Yellow
Write-Host ""

# Detect OS
$isWindows = $PSVersionTable.Platform -eq "Win32NT" -or -not $PSVersionTable.Platform
$isMac = $PSVersionTable.Platform -eq "Unix" -and (uname -s) -eq "Darwin"

if ($isWindows) {
    Write-Host "✗ iOS builds are only available on macOS." -ForegroundColor Red
    Write-Host ""
    Write-Host "If you are on macOS, open Terminal and run:" -ForegroundColor Cyan
    Write-Host "  bash scripts/check-ios-setup.sh" -ForegroundColor Gray
    exit 0
}

Write-Host "1. Checking Xcode..." -ForegroundColor Yellow
$xcodeSelect = (& which xcode-select 2>/dev/null)
if ($xcodeSelect) {
    & xcode-select --print-path
    Write-Host "   ✓ Xcode Command Line Tools found" -ForegroundColor Green
    & xcodebuild -version 2>&1 | Select-Object -First 2 | Write-Host
} else {
    Write-Host "   ✗ Xcode NOT found." -ForegroundColor Red
    Write-Host "   Install from: https://developer.apple.com/download/all/" -ForegroundColor Yellow
    Write-Host "   Or install Xcode from App Store, then run: xcode-select --install" -ForegroundColor Yellow
}

Write-Host ""

Write-Host "2. Checking CocoaPods..." -ForegroundColor Yellow
$cocoapods = (& which pod 2>/dev/null)
if ($cocoapods) {
    Write-Host "   ✓ CocoaPods found: $cocoapods" -ForegroundColor Green
    & pod --version | Write-Host
} else {
    Write-Host "   ✗ CocoaPods NOT found." -ForegroundColor Red
    Write-Host "   Install with: sudo gem install cocoapods" -ForegroundColor Yellow
}

Write-Host ""

Write-Host "3. Checking Node.js..." -ForegroundColor Yellow
$node = (Get-Command node -ErrorAction SilentlyContinue)
if ($node) {
    Write-Host "   ✓ Node.js found: $($node.Path)" -ForegroundColor Green
    & node -v | Write-Host
} else {
    Write-Host "   ✗ Node.js NOT found." -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host "To build iOS apps, ensure all three are installed:" -ForegroundColor Yellow
Write-Host "  1. Xcode (from App Store or Apple Developer website)" -ForegroundColor Gray
Write-Host "  2. CocoaPods (sudo gem install cocoapods)" -ForegroundColor Gray
Write-Host "  3. Node.js and npm" -ForegroundColor Gray
Write-Host ""
Write-Host "After setup, run:" -ForegroundColor Yellow
Write-Host "  npx cap add ios" -ForegroundColor Gray
Write-Host "  npx cap open ios" -ForegroundColor Gray
Write-Host ""

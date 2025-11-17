#!/bin/bash
# Bash diagnostic script to verify iOS build environment on macOS
# Run this before attempting `npx cap add ios` and `npx cap open ios`
# Usage: bash scripts/check-ios-setup.sh

echo "=== iOS Build Environment Check ==="
echo ""

# Check Xcode
echo "1. Checking Xcode..."
if xcode-select -p &> /dev/null; then
    echo "   ✓ Xcode Command Line Tools found at: $(xcode-select -p)"
    xcodebuild -version | head -2
else
    echo "   ✗ Xcode NOT found."
    echo "   Install from: https://developer.apple.com/download/all/"
    echo "   Or install Xcode from App Store, then run: xcode-select --install"
fi

echo ""

# Check CocoaPods
echo "2. Checking CocoaPods..."
if command -v pod &> /dev/null; then
    echo "   ✓ CocoaPods found: $(which pod)"
    pod --version
else
    echo "   ✗ CocoaPods NOT found."
    echo "   Install with: sudo gem install cocoapods"
fi

echo ""

# Check Node.js
echo "3. Checking Node.js..."
if command -v node &> /dev/null; then
    echo "   ✓ Node.js found: $(which node)"
    node -v
else
    echo "   ✗ Node.js NOT found."
    echo "   Install from: https://nodejs.org/"
fi

echo ""

# Check npm
echo "4. Checking npm..."
if command -v npm &> /dev/null; then
    echo "   ✓ npm found: $(which npm)"
    npm -v
else
    echo "   ✗ npm NOT found."
fi

echo ""
echo "=== Summary ==="
echo "To build iOS apps, ensure all components are installed:"
echo "  1. Xcode (from App Store or Apple Developer website)"
echo "  2. CocoaPods (sudo gem install cocoapods)"
echo "  3. Node.js and npm"
echo ""
echo "After setup, run:"
echo "  npx cap add ios"
echo "  npx cap open ios"
echo ""

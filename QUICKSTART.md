# Bird Game - Quick Start Guide

## 🎮 Running the Game

### **Option 1: Development Mode (Local Browser)**

```bash
# Install dependencies (if not already done)
npm install

# Build TypeScript
npm run build

# Open dist/index.html in your browser
# Or use a local web server:
npx http-server dist
```

Then navigate to `http://localhost:8080` in your browser.

### **Option 2: Android Device (Tablet)**

```bash
# Build everything and prepare for Android
npm run prepare-www

# Copy to Android native project
npx cap copy android

# Build debug APK
cd android
./gradlew assembleDebug

# Install on device
adb install -r app/build/outputs/apk/debug/app-debug.apk

# Or open in Android Studio
npx cap open android
```

## 📂 Project Structure

```
BirdGame/
├── src/                 # TypeScript source files
│   ├── index.ts        # Entry point
│   ├── game.ts         # Main game engine
│   ├── bird.ts         # Bird class & AI
│   ├── renderer.ts     # Drawing functions
│   ├── collision.ts    # Collision system
│   ├── config.ts       # Game configuration
│   └── types.ts        # TypeScript types
│
├── dist/               # Compiled JavaScript (generated)
│   ├── *.js           # Compiled modules
│   ├── *.d.ts         # Type definitions
│   ├── index.html     # Game HTML
│   └── style.css      # Game styles
│
├── android/           # Native Android app
├── assets/            # Game assets (images, sounds)
├── index.html         # Source HTML template
├── style.css          # Source CSS
├── tsconfig.json      # TypeScript configuration
└── package.json       # Project dependencies
```

## 🔧 Build Commands

| Command | Purpose |
|---------|---------|
| `npm run build` | Compile TypeScript → dist/ |
| `npm run watch` | Auto-recompile on file changes |
| `npm run prepare-www` | Build + prepare for Android |
| `npm run cap:copy` | Deploy web assets to Android |
| `npm run build:android` | Full Android build pipeline |

## 🎯 Game Controls

**Keyboard:**
- Arrow Keys or WASD to move your bird
- Click/Touch and drag to control direction

**Touch/Mobile:**
- Tap and drag your bird to move
- Pointer events supported for WebView

## ✨ Game Features

- **5 Bird Species**: Hawk, Dove, Sparrow, Chickadee, Crow
- **2 Ground Animals**: Squirrel, Cat
- **Predator-Prey System**: Complex food chain mechanics
- **AI Behaviors**: Each species has unique hunting/fleeing patterns
- **Touch & Keyboard Controls**: Works on desktop and tablet
- **Animated Sprites**: Running/flying animations
- **Expressive Faces**: Angry Birds-style cartoon appearance

## 📝 Development

To modify the game:

1. Edit files in `src/` directory
2. Run `npm run watch` for live recompilation
3. Refresh browser to see changes
4. For Android: `npm run prepare-www && npx cap copy android`

## 🚀 Deployment

1. Ensure all changes are built: `npm run build`
2. For Android: `npm run prepare-www` then build APK
3. Test in browser first: use `dist/index.html`
4. Deploy APK to Android devices as needed

## 📋 Project Files to Keep

Essential files:
- `src/` - All TypeScript source (critical!)
- `tsconfig.json` - TypeScript config
- `package.json` - Dependencies
- `index.html` - HTML template
- `style.css` - Styles
- `assets/` - Game images
- `android/` - Native app

Safe to delete/ignore:
- `dist/` - Auto-generated (rebuild with `npm run build`)
- `node_modules/` - Auto-generated (`npm install`)
- `.vscode/` - Editor settings (optional)
- Build output files

Enjoy the game! 🎮

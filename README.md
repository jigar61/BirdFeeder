# Bird Feed Chase

A fun, interactive bird-feeding game where you control a bird and compete with other birds and predators to eat seeds from a feeder. Available on web, Android, and iOS.

## 🎮 Gameplay

### Objective
Eat as many seeds as possible while avoiding predators (hawks, crows, cats) and competing with other birds (doves, sparrows, chickadees, squirrels).

### How to Play

**Desktop/Web:**
- Use **Arrow Keys** or **WASD** to move your bird
- Move near the feeder to eat seeds
- Different bird species eat different amounts of seeds

**Mobile (Touch):**
- **Drag** your bird around the screen to move it
- The config screen hides automatically when you start
- Rotate your device for more playing area (landscape mode supported)

### Bird Species

| Bird | Speed | Seeds Eaten | Special Ability |
|------|-------|-------------|-----------------|
| **Hawk** | Fast | 0 (hunts birds) | Hunts all birds except crows and cats |
| **Dove** | Medium | 10 | Peaceful, eats the most seeds |
| **Sparrow** | Fast | 2 | Quick and agile |
| **Chickadee** | Fast | 1 | Tiny but speedy |
| **Crow** | Very Fast | 0 (hunts) | Hunts hawks |
| **Squirrel** | Medium | 1 | Ground-level forager |
| **Cat** | Very Fast | 0 (hunts) | Hunts all ground birds |

### Game Rules

- Only **Chickadees, Doves, Sparrows, and Squirrels** can eat seeds
- Each species has a **maximum seeds limit** (enforced per-bird)
- Hawks, Crows, and Cats hunt other birds (no seed-eating)
- Game ends when all seeds are eaten or you choose to stop
- Score increases with each seed eaten

## 🚀 Getting Started

### Prerequisites

- **Node.js** 16+ (download from [nodejs.org](https://nodejs.org/))
- **Git** (for version control and GitHub)
- **For iOS deployment:** GitHub account (free builds on GitHub Actions)
- **For Android:** Android Studio (optional; Capacitor handles building)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/jigar61/BirdGame.git
cd BirdGame
```

2. **Install dependencies:**
```bash
npm install
```

3. **Build the TypeScript code:**
```bash
npm run build
```

4. **Run on web (localhost):**
```bash
npm run watch
```
Then open `http://localhost:5000` (or your local dev server) in a browser.

## 📱 Mobile Deployment

### Android

1. **Prepare the web build:**
```bash
npm run prepare-www
```

2. **Sync with Capacitor:**
```bash
npx cap copy android
npx cap sync android
```

3. **Open Android Studio:**
```bash
npx cap open android
```

4. **Build and run:**
   - Select your device/emulator in Android Studio
   - Click **Run** (green play button)
   - Or build an APK: **Build → Build Bundle(s) / APK(s)**

### iOS

iOS builds happen automatically on GitHub Actions (no Xcode needed on Windows):

1. **Push your code to GitHub:**
```bash
git add .
git commit -m "Your message"
git push origin master
```

2. **Wait for the build** (10-15 minutes)

3. **Download the `.ipa`** from GitHub Actions Artifacts

4. **Deploy via TestFlight or App Store** using [App Store Connect](https://appstoreconnect.apple.com/)

For detailed iOS instructions, see [`GITHUB_ACTIONS_iOS.md`](./GITHUB_ACTIONS_iOS.md).

## 🛠 Development

### Project Structure

```
BirdGame/
├── src/
│   ├── game.ts          # Main game loop, input handling, game logic
│   ├── bird.ts          # Bird class, AI, movement logic
│   ├── renderer.ts      # Canvas rendering for all bird species
│   ├── collision.ts     # Collision detection and predator-prey logic
│   ├── config.ts        # Bird species config, speed, seed limits
│   ├── types.ts         # TypeScript type definitions
│   └── index.ts         # Entry point, UI event handlers
├── index.html           # Game UI and canvas
├── style.css            # Styling
├── manifest.json        # PWA manifest
├── assets/              # Bird sprites, feeder image, backgrounds
├── dist/                # Compiled JavaScript (generated)
├── www/                 # Web assets for Capacitor (generated)
├── android/             # Android Capacitor project
├── ios/                 # iOS Capacitor project
├── package.json         # Dependencies and scripts
└── tsconfig.json        # TypeScript config
```

### Available Scripts

| Command | Purpose |
|---------|---------|
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run watch` | Watch TypeScript files and rebuild on changes |
| `npm run prepare-www` | Build + prepare web assets for mobile apps |
| `npx cap copy android` | Sync web build to Android project |
| `npx cap copy ios` | Sync web build to iOS project |
| `npx cap sync android` | Copy + update Android plugins |
| `npx cap sync ios` | Copy + update iOS plugins |
| `npx cap open android` | Open Android Studio |
| `npx cap open ios` | Open Xcode |

### Game Configuration

Edit `src/config.ts` to customize:
- Bird species attributes (speed, aggression, radius)
- Seed-eating limits per species
- Global speed scale for overall game pace
- Sprite animation frames

Example:
```typescript
export const SPECIES_INFO = {
  hawk: { color: '#8B0000', radius: 14, speed: 1.6, aggression: 1.0 },
  dove: { color: '#B0C4DE', radius: 10, speed: 1.2, aggression: 0.2 },
  // ... more species
};

export function getMaxSeedsForType(type: SpeciesType): number {
  switch (type) {
    case 'chickadee': return 1;
    case 'dove': return 10;
    case 'sparrow': return 2;
    // ... more species
  }
}
```

## 🎨 Customization

### Change the Player Bird

Edit `src/index.ts` to change the default selected bird:
```typescript
const speciesSelect = document.getElementById('species') as HTMLSelectElement;
if (speciesSelect) speciesSelect.value = 'dove'; // Change this
```

### Adjust Game Difficulty

In `src/config.ts`, modify `GLOBAL_SPEED_SCALE`:
```typescript
export const GLOBAL_SPEED_SCALE = 0.6; // Lower = slower, Higher = faster
```

### Add More Seeds

The UI allows 50, 100, 200, or 500 seeds. Edit `index.html` to add more options:
```html
<option value="1000">1000 Seeds</option>
```

## 🐛 Troubleshooting

### Game won't compile
```bash
npm install
npm run build
```
Check `dist/` folder for compiled JavaScript.

### Mobile app won't load
1. Ensure `www/` folder exists with all files:
```bash
npm run prepare-www
```
2. Sync again:
```bash
npx cap sync android
npx cap sync ios
```

### Birds are squished on rotate
The game now auto-detects orientation changes. If it doesn't work:
- Clear the app cache
- Rebuild and redeploy

### Drag movement is laggy
On mobile, the game directly follows your finger for seamless movement. If lag persists:
- Close other apps
- Update to latest browser version
- Try landscape mode for better performance

## 📚 Technical Details

### Technologies Used

- **TypeScript** – Type-safe JavaScript
- **HTML5 Canvas** – Game rendering
- **Capacitor** – Native iOS/Android wrapper
- **GitHub Actions** – Automated iOS builds on macOS

### Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome for Android)

### Performance

- 60 FPS target (DOM-based HUD, canvas-based game)
- Optimized collision detection
- Efficient sprite rendering with frame caching

## 🤝 Contributing

Feel free to fork and submit pull requests! Some ideas:

- New bird species with unique behaviors
- Sound effects and music
- Leaderboard/scoring system
- Difficulty modes
- Power-ups or special events
- Alternative art styles

## 📄 License

This project is open source. Check the repository for license details.

## 🎯 Roadmap

- [ ] Sound effects (eating, predator sounds)
- [ ] Pause/resume button
- [ ] Settings menu (difficulty, graphics, sound)
- [ ] Cloud save system
- [ ] Leaderboards (local and online)
- [ ] Additional bird species
- [ ] Seasonal themes

## 📞 Support

For bugs, questions, or feature requests:
1. Check existing [GitHub Issues](https://github.com/jigar61/BirdGame/issues)
2. Create a new issue with details and screenshots
3. Include your device/browser info for mobile issues

## 🙏 Credits

Built with ❤️ using Capacitor and TypeScript.

Game inspired by classic bird-feeding simulations. Sprites and assets created for this project.

---

**Happy bird feeding! 🐦**

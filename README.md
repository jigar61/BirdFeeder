Bird Feed Chase — Simple HTML5 bird chase game

Overview
- A lightweight browser game where birds appear at a feeder and chase each other.
- Species: hawk, dove, sparrow, chickadee. The player picks which bird to be.

How to run
1. Open `index.html` in a modern browser (Chrome, Edge, Firefox).
2. Choose a species from the dropdown and click "Start Game".
3. Move using arrow keys or WASD. Hawks are predators; doves tend to flee hawks.

Files
- `index.html` — main page and UI.
- `style.css` — basic styling.
- `main.js` — game logic, birds, AI, rendering.
 - `assets/` — simple SVG placeholders for species and feeder (used by `main.js`).

Next steps (optional)
- Add sprite images for species instead of colored circles.
 - Replace the simple SVG placeholders in `assets/` with your preferred sprites (PNG sprite sheets or higher-detail art). Update `ASSET_MANIFEST` in `main.js` if you change filenames.
- Improve AI/pursuit behaviors and add animations.
- Add a proper game-over screen and persistent high score.

License
- Free to modify and use for learning or prototyping.

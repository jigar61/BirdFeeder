const fs = require('fs');
const path = require('path');

// Simple bundler to concatenate ES modules
const srcDir = path.join(__dirname, '../src');
const distDir = path.join(__dirname, '../dist');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy index.html and style.css to dist
fs.copyFileSync(
  path.join(__dirname, '../index.html'),
  path.join(distDir, 'index.html')
);

fs.copyFileSync(
  path.join(__dirname, '../style.css'),
  path.join(distDir, 'style.css')
);

// For now, we'll use ES modules directly in browsers
// Modern browsers support ES modules natively
const gameJs = fs.readFileSync(path.join(distDir, 'index.js'), 'utf-8');
fs.writeFileSync(path.join(distDir, 'game.js'), gameJs);

console.log('Bundle complete!');

#!/usr/bin/env node
/**
 * Cross-platform build helper: copies static assets to dist/
 * Replaces Windows-only PowerShell commands
 */

const fs = require('fs');
const path = require('path');

function copyFileSync(src, dest) {
  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.copyFileSync(src, dest);
}

function copyDirSync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const files = fs.readdirSync(src);
  for (const file of files) {
    const srcFile = path.join(src, file);
    const destFile = path.join(dest, file);
    
    if (fs.statSync(srcFile).isDirectory()) {
      copyDirSync(srcFile, destFile);
    } else {
      copyFileSync(srcFile, destFile);
    }
  }
}

try {
  // Ensure dist directory exists
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
  }

  // Copy HTML, CSS, manifest
  copyFileSync('index.html', 'dist/index.html');
  copyFileSync('style.css', 'dist/style.css');
  copyFileSync('manifest.json', 'dist/manifest.json');

  // Copy assets directory
  if (fs.existsSync('assets')) {
    copyDirSync('assets', 'dist/assets');
  }

  console.log('✓ Assets copied to dist/');
} catch (err) {
  console.error('✗ Failed to copy assets:', err.message);
  process.exit(1);
}

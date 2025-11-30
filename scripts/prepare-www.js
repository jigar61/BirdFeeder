#!/usr/bin/env node
/**
 * Cross-platform prepare-www helper
 * Prepares web assets for Capacitor by copying from dist/ to www/
 */

const fs = require('fs');
const path = require('path');

function removeDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach(file => {
      const curPath = path.join(dirPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        removeDir(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dirPath);
  }
}

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
  // Remove old www directory
  removeDir('www');
  
  // Create new www directory
  fs.mkdirSync('www', { recursive: true });
  
  // Copy HTML, CSS, manifest
  copyFileSync('dist/index.html', 'www/index.html');
  copyFileSync('dist/style.css', 'www/style.css');
  copyFileSync('dist/manifest.json', 'www/manifest.json');
  
  // Copy all JS files from dist
  const files = fs.readdirSync('dist');
  for (const file of files) {
    if (file.endsWith('.js')) {
      copyFileSync(path.join('dist', file), path.join('www', file));
    }
  }
  
  // Copy assets directory
  if (fs.existsSync('dist/assets')) {
    copyDirSync('dist/assets', 'www/assets');
  }
  
  console.log('✓ Web assets prepared in www/');
} catch (err) {
  console.error('✗ Failed to prepare www:', err.message);
  process.exit(1);
}

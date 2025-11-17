// Simple bird chase game - single file JS
const canvas = document.getElementById('game');
if (!canvas) {
  console.error('Canvas element not found!');
} else {
  console.log('Canvas found, starting game');
}
const ctx = canvas.getContext('2d');
let W = canvas.width = window.innerWidth;
let H = canvas.height = window.innerHeight;

const speciesInfo = {
  hawk: { color: '#8B0000', radius: 14, speed: 1.6, aggression: 1.0 },
  dove: { color: '#B0C4DE', radius: 10, speed: 1.2, aggression: 0.2 },
  sparrow: { color: '#A0522D', radius: 9, speed: 1.4, aggression: 0.6 },
  chickadee: { color: '#222222', radius: 7, speed: 1.5, aggression: 0.5 },
  crow: { color: '#1a1a1a', radius: 16, speed: 2.0, aggression: 1.0 },
  squirrel: { color: '#8B4513', radius: 12, speed: 1.3, aggression: 0.3 },
  cat: { color: '#D2691E', radius: 15, speed: 1.7, aggression: 1.2 }
};

// Local asset manifest - only feeder needs loading now
const ASSET_MANIFEST = {
  feeder: 'assets/feeder_cartoon.svg'
};

// Animation frame info
const SPRITE_FRAMES = {
  hawk: 4,
  dove: 4,
  sparrow: 4,
  chickadee: 4,
  crow: 4,
  squirrel: 2,
  cat: 3
};

// Bird drawing functions (procedural canvas drawing)
function drawHawk(ctx, x, y, frame, size) {
  ctx.save();
  ctx.translate(x, y);
  
  // Calculate wing angle based on frame (0-3) for smooth flapping motion
  const wingAngle = (frame / 3) * Math.PI * 2; // Full rotation through frames
  const wingUp = Math.sin(wingAngle); // -1 to 1, for up/down motion
  
  // Body
  ctx.fillStyle = '#8B0000';
  ctx.beginPath();
  ctx.ellipse(0, 0, size*0.5, size*0.65, 0, 0, Math.PI*2);
  ctx.fill();
  
  // Body shading
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.beginPath();
  ctx.ellipse(size*0.15, size*0.2, size*0.3, size*0.4, 0, 0, Math.PI*2);
  ctx.fill();
  
  // Head
  ctx.fillStyle = '#7a1f1f';
  ctx.beginPath();
  ctx.arc(0, -size*0.4, size*0.35, 0, Math.PI*2);
  ctx.fill();
  
  // Eye white (large)
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(size*0.15, -size*0.5, size*0.15, 0, Math.PI*2);
  ctx.fill();
  
  // Pupil (large and dark)
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(size*0.18, -size*0.48, size*0.08, 0, Math.PI*2);
  ctx.fill();
  
  // Eye shine
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(size*0.21, -size*0.51, size*0.04, 0, Math.PI*2);
  ctx.fill();
  
  // Angry eyebrow
  ctx.strokeStyle = '#000';
  ctx.lineWidth = size*0.08;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(size*0.02, -size*0.62);
  ctx.quadraticCurveTo(size*0.15, -size*0.68, size*0.28, -size*0.62);
  ctx.stroke();
  
  // Beak (thicker and more prominent)
  ctx.fillStyle = '#d4a55f';
  ctx.beginPath();
  ctx.moveTo(size*0.2, -size*0.42);
  ctx.lineTo(size*0.5, -size*0.58);
  ctx.lineTo(size*0.2, -size*0.32);
  ctx.fill();
  
  // Beak shading
  ctx.fillStyle = '#b8860b';
  ctx.beginPath();
  ctx.moveTo(size*0.2, -size*0.42);
  ctx.lineTo(size*0.5, -size*0.58);
  ctx.lineTo(size*0.35, -size*0.45);
  ctx.fill();
  
  // Left wing - flapping motion
  ctx.strokeStyle = '#6a1010';
  ctx.lineWidth = size*0.12;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-size*0.25, -size*0.1);
  ctx.quadraticCurveTo(-size*0.5, -size*0.4 + wingUp*size*0.3, -size*0.6, -size*0.2 + wingUp*size*0.2);
  ctx.stroke();
  
  // Right wing - flapping motion
  ctx.beginPath();
  ctx.moveTo(size*0.25, -size*0.1);
  ctx.quadraticCurveTo(size*0.5, -size*0.4 + wingUp*size*0.3, size*0.6, -size*0.2 + wingUp*size*0.2);
  ctx.stroke();
  
  ctx.restore();
}

function drawDove(ctx, x, y, frame, size) {
  ctx.save();
  ctx.translate(x, y);
  
  // Calculate wing angle based on frame
  const wingAngle = (frame / 3) * Math.PI * 2;
  const wingUp = Math.sin(wingAngle);
  
  // Body
  ctx.fillStyle = '#B0C4DE';
  ctx.beginPath();
  ctx.ellipse(0, 0, size*0.5, size*0.6, 0, 0, Math.PI*2);
  ctx.fill();
  
  // Head
  ctx.fillStyle = '#c8d8f0';
  ctx.beginPath();
  ctx.arc(0, -size*0.35, size*0.32, 0, Math.PI*2);
  ctx.fill();
  
  // Head shading
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.beginPath();
  ctx.arc(size*0.12, -size*0.2, size*0.25, 0, Math.PI*2);
  ctx.fill();
  
  // Eye white (large)
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(size*0.12, -size*0.45, size*0.13, 0, Math.PI*2);
  ctx.fill();
  
  // Pupil
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.arc(size*0.14, -size*0.43, size*0.07, 0, Math.PI*2);
  ctx.fill();
  
  // Eye shine
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(size*0.17, -size*0.46, size*0.03, 0, Math.PI*2);
  ctx.fill();
  
  // Beak (more pronounced)
  ctx.fillStyle = '#d4a574';
  ctx.beginPath();
  ctx.moveTo(size*0.18, -size*0.4);
  ctx.lineTo(size*0.38, -size*0.5);
  ctx.lineTo(size*0.18, -size*0.3);
  ctx.fill();
  
  // Beak shading
  ctx.fillStyle = '#9d7d5a';
  ctx.beginPath();
  ctx.moveTo(size*0.18, -size*0.4);
  ctx.lineTo(size*0.38, -size*0.5);
  ctx.lineTo(size*0.28, -size*0.4);
  ctx.fill();
  
  // Wings - flapping
  ctx.strokeStyle = '#7b99b8';
  ctx.lineWidth = size*0.1;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-size*0.2, -size*0.05);
  ctx.quadraticCurveTo(-size*0.42, -size*0.35 + wingUp*size*0.25, -size*0.55, -size*0.15 + wingUp*size*0.15);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(size*0.2, -size*0.05);
  ctx.quadraticCurveTo(size*0.42, -size*0.35 + wingUp*size*0.25, size*0.55, -size*0.15 + wingUp*size*0.15);
  ctx.stroke();
  
  ctx.restore();
}

function drawSparrow(ctx, x, y, frame, size) {
  ctx.save();
  ctx.translate(x, y);
  
  // Calculate wing angle based on frame
  const wingAngle = (frame / 3) * Math.PI * 2;
  const wingUp = Math.sin(wingAngle);
  
  // Body
  ctx.fillStyle = '#A0522D';
  ctx.beginPath();
  ctx.ellipse(0, 0, size*0.48, size*0.55, 0, 0, Math.PI*2);
  ctx.fill();
  
  // Head
  ctx.fillStyle = '#8b6f47';
  ctx.beginPath();
  ctx.arc(0, -size*0.32, size*0.3, 0, Math.PI*2);
  ctx.fill();
  
  // Head shading
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.beginPath();
  ctx.arc(size*0.1, -size*0.15, size*0.22, 0, Math.PI*2);
  ctx.fill();
  
  // Eye white (large)
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(size*0.1, -size*0.42, size*0.12, 0, Math.PI*2);
  ctx.fill();
  
  // Pupil
  ctx.fillStyle = '#111';
  ctx.beginPath();
  ctx.arc(size*0.12, -size*0.4, size*0.07, 0, Math.PI*2);
  ctx.fill();
  
  // Eye shine
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(size*0.14, -size*0.43, size*0.03, 0, Math.PI*2);
  ctx.fill();
  
  // Beak (more pronounced)
  ctx.fillStyle = '#e6b27a';
  ctx.beginPath();
  ctx.moveTo(size*0.15, -size*0.37);
  ctx.lineTo(size*0.35, -size*0.47);
  ctx.lineTo(size*0.15, -size*0.27);
  ctx.fill();
  
  // Beak shading
  ctx.fillStyle = '#c89060';
  ctx.beginPath();
  ctx.moveTo(size*0.15, -size*0.37);
  ctx.lineTo(size*0.35, -size*0.47);
  ctx.lineTo(size*0.25, -size*0.37);
  ctx.fill();
  
  // Wings - flapping
  ctx.strokeStyle = '#8b5a39';
  ctx.lineWidth = size*0.11;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-size*0.22, -size*0.08);
  ctx.quadraticCurveTo(-size*0.44, -size*0.38 + wingUp*size*0.28, -size*0.57, -size*0.18 + wingUp*size*0.18);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(size*0.22, -size*0.08);
  ctx.quadraticCurveTo(size*0.44, -size*0.38 + wingUp*size*0.28, size*0.57, -size*0.18 + wingUp*size*0.18);
  ctx.stroke();
  
  ctx.restore();
}

function drawChickadee(ctx, x, y, frame, size) {
  ctx.save();
  ctx.translate(x, y);
  
  // Calculate wing angle based on frame
  const wingAngle = (frame / 3) * Math.PI * 2;
  const wingUp = Math.sin(wingAngle);
  
  // Back (black)
  ctx.fillStyle = '#222222';
  ctx.beginPath();
  ctx.ellipse(0, size*0.08, size*0.48, size*0.58, 0, 0, Math.PI*2);
  ctx.fill();
  
  // Belly (white)
  ctx.fillStyle = '#f5f5f5';
  ctx.beginPath();
  ctx.ellipse(0, size*0.15, size*0.3, size*0.35, 0, 0, Math.PI*2);
  ctx.fill();
  
  // Head (black)
  ctx.fillStyle = '#111';
  ctx.beginPath();
  ctx.arc(0, -size*0.3, size*0.32, 0, Math.PI*2);
  ctx.fill();
  
  // Cheek patches (white)
  ctx.fillStyle = '#f5f5f5';
  ctx.beginPath();
  ctx.arc(-size*0.15, -size*0.25, size*0.15, 0, Math.PI*2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(size*0.15, -size*0.25, size*0.15, 0, Math.PI*2);
  ctx.fill();
  
  // Eye white (large and prominent)
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(size*0.1, -size*0.4, size*0.12, 0, Math.PI*2);
  ctx.fill();
  
  // Pupil
  ctx.fillStyle = '#111';
  ctx.beginPath();
  ctx.arc(size*0.12, -size*0.38, size*0.07, 0, Math.PI*2);
  ctx.fill();
  
  // Eye shine
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(size*0.14, -size*0.41, size*0.03, 0, Math.PI*2);
  ctx.fill();
  
  // Beak (stronger)
  ctx.fillStyle = '#d4a574';
  ctx.beginPath();
  ctx.moveTo(size*0.18, -size*0.33);
  ctx.lineTo(size*0.4, -size*0.42);
  ctx.lineTo(size*0.18, -size*0.24);
  ctx.fill();
  
  // Beak shading
  ctx.fillStyle = '#a68557';
  ctx.beginPath();
  ctx.moveTo(size*0.18, -size*0.33);
  ctx.lineTo(size*0.4, -size*0.42);
  ctx.lineTo(size*0.29, -size*0.33);
  ctx.fill();
  
  // Wings - flapping
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = size*0.11;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-size*0.2, 0);
  ctx.quadraticCurveTo(-size*0.45, -size*0.35 + wingUp*size*0.3, -size*0.6, -size*0.1 + wingUp*size*0.2);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(size*0.2, 0);
  ctx.quadraticCurveTo(size*0.45, -size*0.35 + wingUp*size*0.3, size*0.6, -size*0.1 + wingUp*size*0.2);
  ctx.stroke();
  
  ctx.restore();
}

function drawCrow(ctx, x, y, frame, size) {
  ctx.save();
  ctx.translate(x, y);
  
  // Calculate wing angle based on frame
  const wingAngle = (frame / 3) * Math.PI * 2;
  const wingUp = Math.sin(wingAngle);
  
  // Body (dark gray/black)
  ctx.fillStyle = '#2a2a2a';
  ctx.beginPath();
  ctx.ellipse(0, 0, size*0.52, size*0.68, 0, 0, Math.PI*2);
  ctx.fill();
  
  // Head (very dark)
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath();
  ctx.arc(0, -size*0.35, size*0.36, 0, Math.PI*2);
  ctx.fill();
  
  // Eye white (large and menacing)
  ctx.fillStyle = '#ffaa00';
  ctx.beginPath();
  ctx.arc(size*0.14, -size*0.42, size*0.13, 0, Math.PI*2);
  ctx.fill();
  
  // Pupil (large and dark)
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath();
  ctx.arc(size*0.16, -size*0.4, size*0.08, 0, Math.PI*2);
  ctx.fill();
  
  // Eye shine
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(size*0.19, -size*0.43, size*0.04, 0, Math.PI*2);
  ctx.fill();
  
  // Menacing eyebrow
  ctx.strokeStyle = '#ff8800';
  ctx.lineWidth = size*0.08;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(size*0.01, -size*0.58);
  ctx.quadraticCurveTo(size*0.14, -size*0.65, size*0.27, -size*0.58);
  ctx.stroke();
  
  // Beak (larger and more prominent)
  ctx.fillStyle = '#ff8800';
  ctx.beginPath();
  ctx.moveTo(size*0.22, -size*0.36);
  ctx.lineTo(size*0.48, -size*0.5);
  ctx.lineTo(size*0.22, -size*0.26);
  ctx.fill();
  
  // Beak shading
  ctx.fillStyle = '#cc6600';
  ctx.beginPath();
  ctx.moveTo(size*0.22, -size*0.36);
  ctx.lineTo(size*0.48, -size*0.5);
  ctx.lineTo(size*0.35, -size*0.36);
  ctx.fill();
  
  // Wings - flapping
  ctx.strokeStyle = '#0f0f0f';
  ctx.lineWidth = size*0.13;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-size*0.25, -size*0.05);
  ctx.quadraticCurveTo(-size*0.52, -size*0.42 + wingUp*size*0.32, -size*0.68, -size*0.15 + wingUp*size*0.22);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(size*0.25, -size*0.05);
  ctx.quadraticCurveTo(size*0.52, -size*0.42 + wingUp*size*0.32, size*0.68, -size*0.15 + wingUp*size*0.22);
  ctx.stroke();
  
  ctx.restore();
}

function drawSquirrel(ctx, x, y, frame, size) {
  ctx.save();
  ctx.translate(x, y);
  
  // Animate legs based on frame (running/walking motion)
  const legOffset = Math.sin(frame * Math.PI / 2) * size * 0.15; // oscillate leg position
  const legCompression = 0.8 + Math.abs(Math.sin(frame * Math.PI / 2)) * 0.2; // body bobs slightly
  
  // Body
  ctx.fillStyle = '#8B4513';
  ctx.beginPath();
  ctx.ellipse(0, size*0.1 * legCompression, size*0.5, size*0.6, 0, 0, Math.PI*2);
  ctx.fill();
  
  // Front left leg
  ctx.fillStyle = '#6B3410';
  ctx.fillRect(-size*0.15, size*0.35, size*0.08, size*0.25 + legOffset);
  
  // Front right leg
  ctx.fillRect(size*0.07, size*0.35, size*0.08, size*0.25 - legOffset);
  
  // Back left leg
  ctx.fillRect(-size*0.2, size*0.35, size*0.08, size*0.25 - legOffset);
  
  // Back right leg
  ctx.fillRect(size*0.12, size*0.35, size*0.08, size*0.25 + legOffset);
  
  // Head
  ctx.fillStyle = '#A0522D';
  ctx.beginPath();
  ctx.arc(0, -size*0.3, size*0.35, 0, Math.PI*2);
  ctx.fill();
  
  // Ears (tufted)
  ctx.fillStyle = '#8B4513';
  ctx.beginPath();
  ctx.arc(-size*0.25, -size*0.55, size*0.15, 0, Math.PI*2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(size*0.25, -size*0.55, size*0.15, 0, Math.PI*2);
  ctx.fill();
  
  // Eyes
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(-size*0.12, -size*0.35, size*0.12, 0, Math.PI*2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(size*0.12, -size*0.35, size*0.12, 0, Math.PI*2);
  ctx.fill();
  
  // Pupils (large and expressive)
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(-size*0.12, -size*0.33, size*0.08, 0, Math.PI*2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(size*0.12, -size*0.33, size*0.08, 0, Math.PI*2);
  ctx.fill();
  
  // Eye shines
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(-size*0.09, -size*0.36, size*0.04, 0, Math.PI*2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(size*0.15, -size*0.36, size*0.04, 0, Math.PI*2);
  ctx.fill();
  
  // Bushy tail (curved, slightly animated)
  ctx.strokeStyle = '#654321';
  ctx.lineWidth = size*0.2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(size*0.25, size*0.2);
  const tailWag = Math.sin(frame * Math.PI / 3) * size * 0.1;
  ctx.quadraticCurveTo(size*0.6 + tailWag, size*0.5, size*0.55 + tailWag, size*0.95);
  ctx.stroke();
  
  ctx.restore();
}

function drawCat(ctx, x, y, frame, size) {
  ctx.save();
  ctx.translate(x, y);
  
  // Animate legs based on frame (running/walking motion)
  const legOffset = Math.sin(frame * Math.PI / 2) * size * 0.15; // oscillate leg position
  const legCompression = 0.85 + Math.abs(Math.sin(frame * Math.PI / 2)) * 0.15; // body bobs slightly when running
  
  // Body
  ctx.fillStyle = '#D2691E';
  ctx.beginPath();
  ctx.ellipse(0, size*0.05 * legCompression, size*0.5, size*0.65, 0, 0, Math.PI*2);
  ctx.fill();
  
  // Front left leg
  ctx.fillStyle = '#A0481A';
  ctx.fillRect(-size*0.15, size*0.35, size*0.08, size*0.3 + legOffset);
  
  // Front right leg
  ctx.fillRect(size*0.07, size*0.35, size*0.08, size*0.3 - legOffset);
  
  // Back left leg
  ctx.fillRect(-size*0.2, size*0.35, size*0.08, size*0.3 - legOffset);
  
  // Back right leg
  ctx.fillRect(size*0.12, size*0.35, size*0.08, size*0.3 + legOffset);
  
  // Head
  ctx.fillStyle = '#CD853F';
  ctx.beginPath();
  ctx.arc(0, -size*0.32, size*0.38, 0, Math.PI*2);
  ctx.fill();
  
  // Ears (pointed triangles)
  ctx.fillStyle = '#D2691E';
  ctx.beginPath();
  ctx.moveTo(-size*0.2, -size*0.62);
  ctx.lineTo(-size*0.35, -size*0.85);
  ctx.lineTo(-size*0.05, -size*0.58);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(size*0.2, -size*0.62);
  ctx.lineTo(size*0.35, -size*0.85);
  ctx.lineTo(size*0.05, -size*0.58);
  ctx.fill();
  
  // Eyes (bright yellow/green - large)
  ctx.fillStyle = '#ffdd00';
  ctx.beginPath();
  ctx.arc(-size*0.15, -size*0.38, size*0.13, 0, Math.PI*2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(size*0.15, -size*0.38, size*0.13, 0, Math.PI*2);
  ctx.fill();
  
  // Pupils (vertical slit - more expressive)
  ctx.fillStyle = '#000';
  ctx.fillRect(-size*0.17, -size*0.43, size*0.04, size*0.1);
  ctx.fillRect(size*0.13, -size*0.43, size*0.04, size*0.1);
  ctx.fill();
  
  // Whiskers
  ctx.strokeStyle = '#999';
  ctx.lineWidth = size*0.05;
  ctx.lineCap = 'round';
  for(let i = -1; i <= 1; i++) {
    ctx.beginPath();
    ctx.moveTo(size*0.15, -size*0.28 + i*size*0.1);
    ctx.lineTo(size*0.45, -size*0.28 + i*size*0.1);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-size*0.15, -size*0.28 + i*size*0.1);
    ctx.lineTo(-size*0.45, -size*0.28 + i*size*0.1);
    ctx.stroke();
  }
  
  // Tail (curved, slightly animated)
  ctx.strokeStyle = '#A0522D';
  ctx.lineWidth = size*0.15;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(size*0.35, size*0.15);
  const tailWag = Math.sin(frame * Math.PI / 3) * size * 0.1;
  ctx.quadraticCurveTo(size*0.65 + tailWag, size*0.3, size*0.6 + tailWag, size*0.8);
  ctx.stroke();
  
  ctx.restore();
}

const birdDrawers = {
  hawk: drawHawk,
  dove: drawDove,
  sparrow: drawSparrow,
  chickadee: drawChickadee,
  crow: drawCrow,
  squirrel: drawSquirrel,
  cat: drawCat
};

const assets = {};
let assetsLoaded = false;
function preloadAssets(cb){
  const keys = Object.keys(ASSET_MANIFEST);
  if(keys.length === 0){ assetsLoaded = true; cb && cb(); return; }
  let loaded = 0;
  for(const k of keys){
    const img = new Image();
    img.src = ASSET_MANIFEST[k];
    img.onload = ()=>{ assets[k] = img; loaded++; if(loaded === keys.length){ assetsLoaded = true; cb && cb(); } };
    img.onerror = (e)=>{ console.warn('Failed to load', ASSET_MANIFEST[k], e); loaded++; if(loaded === keys.length){ assetsLoaded = true; cb && cb(); } };
  }
}


let birds = [];
let player = null;
let score = 0;
let lastSpawn = 0;
let running = false;
let keys = {};
let crowSpawned = false; // Track if crow has been spawned yet
let seeds = []; // Array of seed objects at the feeder
let totalSeeds = 100; // Starting seeds at feeder
let configuredSeeds = 100; // Configurable seed count

class Bird {
  constructor(x, y, type, isPlayer=false){
    this.x = x; this.y = y;
    this.vx = (Math.random()-0.5)*0.5; this.vy = (Math.random()-0.5)*0.5;
    this.type = type; this.isPlayer = isPlayer;
    const info = speciesInfo[type];
    this.color = info.color; this.radius = info.radius; this.speed = info.speed; this.aggression = info.aggression;
    this.id = Math.random().toString(36).slice(2,9);
    this.alive = true;
    this.wanderTimer = Math.random()*3;
    this._bobPhase = Math.random() * Math.PI * 2;
    this._frameTime = 0;
    this._currentFrame = 0;
    this.killCount = 0; // Track kills for hawks (triggers crow spawn at 10)
    this.crowSpawnTime = 0; // Track when this crow was spawned (for timeout)
    this.seedsEaten = 0; // Track seeds eaten by this bird
    this.atFeeder = false; // Track if bird is currently at the feeder
    this.hasLeftFeeder = false; // Track if bird has already left after eating
    this.flyOutTarget = null; // target point when crow leaves
    this.flyOutStarted = false;
    // Ground offset for animals that must stay on the ground (squirrels/cats)
    if(this.type === 'cat' || this.type === 'squirrel'){
      this._groundOffset = Math.random() * 40;
    }
    
    // Perching behavior (for birds only, not cats/squirrels)
    this.isPerched = false; // Is the bird currently on the ground?
    this.perchTime = 0; // How long has the bird been perched?
    this.lastFlightTime = performance.now(); // When did the bird last fly?
    this.perchPosition = null; // Where is the bird perched?
  }

  update(dt){
    if(!this.alive) return;
    
    // Cats and squirrels don't perch
    const canPerch = (this.type !== 'cat' && this.type !== 'squirrel' && !this.isPlayer);
    
    // Ground-only animals (cats/squirrels) must stay on the ground level
    if(this.type === 'cat' || this.type === 'squirrel'){
      if(this._groundOffset === undefined) this._groundOffset = Math.random() * 40;
      const groundY = H * 0.65 + this._groundOffset;
      this.y = groundY; // lock vertical position
      this.vy = 0; // prevent vertical velocity
      // Continue with horizontal AI, do not return so they still get horizontal movement updates
    }
    // Perching behavior: after flying for 2-3 minutes, land on ground
    if(canPerch && !this.isPerched){
      const flightDuration = (performance.now() - this.lastFlightTime) / 1000;
      if(flightDuration > 120 + Math.random() * 60){ // 2-3 minutes
        this.isPerched = true;
        this.perchTime = 0;
        this.perchPosition = { x: this.x, y: H * 0.6 + Math.random() * 40 }; // Land on grass
        this.vx = 0;
        this.vy = 0;
      }
    }
    
    // If perched, stay in place and increment perch time
    if(this.isPerched && canPerch){
      this.perchTime += dt;
      // After 30-45 seconds on ground, take off again
      if(this.perchTime > 30 + Math.random() * 15){
        this.isPerched = false;
        this.lastFlightTime = performance.now();
        this.perchPosition = null;
      } else {
        // Stay at perch position
        this.x = this.perchPosition.x;
        this.y = this.perchPosition.y;
        return; // Don't apply normal AI while perched
      }
    }
    
    // Crow behavior: if crow hasn't caught a hawk within 60 seconds, begin flying out
    if(this.type === 'crow' && this.crowSpawnTime > 0){
      const timeSinceCrowSpawn = (performance.now() - this.crowSpawnTime) / 1000;
      if(timeSinceCrowSpawn > 60 && !this.flyOutStarted){
        // choose an off-screen exit point and start flying there
        const edge = Math.random() * 4;
        let tx, ty;
        if(edge < 1){ tx = Math.random() * W; ty = -200; }
        else if(edge < 2){ tx = Math.random() * W; ty = H + 200; }
        else if(edge < 3){ tx = -200; ty = Math.random() * H; }
        else { tx = W + 200; ty = Math.random() * H; }
        this.flyOutTarget = { x: tx, y: ty };
        this.flyOutStarted = true;
      }
      // If a fly-out target is set, steer toward it and remove the crow once it's sufficiently off-screen
      if(this.flyOutTarget){
        const dx = this.flyOutTarget.x - this.x; const dy = this.flyOutTarget.y - this.y;
        const d = Math.hypot(dx, dy) || 1;
        this.vx += (dx / d) * 0.2;
        this.vy += (dy / d) * 0.2;
        // remove when well outside the view
        if(this.x < -150 || this.x > W + 150 || this.y < -150 || this.y > H + 150){
          this.alive = false;
          crowSpawned = false;
          return;
        }
      }
    }
    
    if(this.isPlayer){
      // player movement via keys
      let ax = 0, ay = 0;
      if(keys.ArrowLeft || keys.a) ax -= 1;
      if(keys.ArrowRight || keys.d) ax += 1;
      if(keys.ArrowUp || keys.w) ay -= 1;
      if(keys.ArrowDown || keys.s) ay += 1;
      const len = Math.hypot(ax,ay);
      if(len>0){ ax/=len; ay/=len; this.vx += ax*0.6; this.vy += ay*0.6; }
      // limit speed
      let vlen = Math.hypot(this.vx,this.vy);
      if(vlen>this.speed*3) { this.vx *= 0.9; this.vy *= 0.9; }
      this.x += this.vx*dt; this.y += this.vy*dt;
      this.wrap();
      return;
    }

    // simple AI behaviors
    const others = birds.filter(b => b !== this && b.alive);
    const feederX = W/2;
    const feederY = H/2;
    const distToFeeder = Math.hypot(this.x - feederX, this.y - feederY);
    
    // Check if bird is at the feeder (within 80 pixels)
    this.atFeeder = distToFeeder < 80;
    
    // If bird has eaten enough seeds and is at feeder, leave
    const maxSeeds = getMaxSeedsForType(this.type);
    if(maxSeeds > 0 && this.seedsEaten >= maxSeeds && this.atFeeder){
      this.hasLeftFeeder = true;
    }
    
    // If bird has left feeder with seeds, fly away
    if(this.hasLeftFeeder){
      // Fly away from feeder
      const away = {x: this.x - feederX, y: this.y - feederY};
      const awayDist = Math.hypot(away.x, away.y);
      if(awayDist > 0){
        this.vx += (away.x / awayDist) * 0.1;
        this.vy += (away.y / awayDist) * 0.1;
      }
      this.wander(dt);
    }
    // If bird hasn't eaten enough, seek feeder or hunt
    else if(maxSeeds > 0 && this.seedsEaten < maxSeeds){
      // Fly toward feeder
      const toward = {x: feederX - this.x, y: feederY - this.y};
      const towardDist = Math.hypot(toward.x, toward.y);
      if(towardDist > 0){
        this.vx += (toward.x / towardDist) * 0.08;
        this.vy += (toward.y / towardDist) * 0.08;
      }
    }
    // Otherwise, normal hunting/fleeing behavior
    else if(others.length > 0){
      if(this.type === 'hawk'){
        // chase nearest non-hawk (hunt all other species except crows)
        let target = nearest(this, others.filter(o=>o.type !== 'hawk' && o.type !== 'crow'));
        if(target) this.seek(target, dt);
        else this.wander(dt);
      } else if(this.type === 'crow'){
        // crow hunts all hawks (with increased aggression)
        let target = nearest(this, others.filter(o=>o.type === 'hawk'));
        if(target) {
          let dx = target.x - this.x; let dy = target.y - this.y;
          let d = Math.hypot(dx,dy);
          if(d > 0){
            dx /= d; dy /= d;
            this.vx += dx * 0.25 * this.aggression; // Increased from 0.2 to 0.25
            this.vy += dy * 0.25 * this.aggression;
            this.vx *= 0.992; this.vy *= 0.992; // Slightly less damping for more aggressive pursuit
          }
        }
        else this.wander(dt);
      } else if(this.type === 'sparrow'){
        // chase chickadees preferentially
        let target = nearest(this, others.filter(o=>o.type === 'chickadee')) || nearest(this, others);
        if(target) this.seek(target, dt); else this.wander(dt);
      } else if(this.type === 'chickadee'){
        // chase other chickadees to drive them away
        let target = nearest(this, others.filter(o=>o.type === 'chickadee'));
        if(target) this.seek(target, dt); else this.wander(dt);
      } else if(this.type === 'dove'){
        // flee from hawks and cats (predators)
        let threat = nearest(this, others.filter(o=>o.type === 'hawk' || o.type === 'cat'));
        if(threat && dist(this, threat) < 300) this.flee(threat, dt); else this.wander(dt);
      } else if(this.type === 'sparrow'){
        // flee from hawks and cats (predators)
        let threat = nearest(this, others.filter(o=>o.type === 'hawk' || o.type === 'cat'));
        if(threat && dist(this, threat) < 300) this.flee(threat, dt);
        else {
          // also chase chickadees
          let target = nearest(this, others.filter(o=>o.type === 'chickadee'));
          if(target) this.seek(target, dt); else this.wander(dt);
        }
      } else if(this.type === 'squirrel'){
        // squirrels seek feeder to eat seeds
        const toward = {x: feederX - this.x, y: feederY - this.y};
        const towardDist = Math.hypot(toward.x, toward.y);
        if(towardDist > 10){
          this.vx += (toward.x / towardDist) * 0.12;
          this.vy += (toward.y / towardDist) * 0.12;
        }
      } else if(this.type === 'cat'){
        // cat hunts all birds
        let target = nearest(this, others.filter(o=>o.type !== 'cat' && o.type !== 'squirrel'));
        if(target) this.seek(target, dt);
        else this.wander(dt);
      }
    } else {
      this.wander(dt);
    }

    this.move(dt);
  }

  seek(target, dt){
    let dx = target.x - this.x; let dy = target.y - this.y;
    let d = Math.hypot(dx,dy);
    if(d === 0) return;
    dx /= d; dy /= d;
    this.vx += dx * 0.2 * this.aggression;
    this.vy += dy * 0.2 * this.aggression;
    this.vx *= 0.995; this.vy *= 0.995;
  }

  flee(threat, dt){
    let dx = this.x - threat.x; let dy = this.y - threat.y;
    let d = Math.hypot(dx,dy);
    if(d === 0) { this.vx += (Math.random()-0.5)*2; this.vy += (Math.random()-0.5)*2; return; }
    dx /= d; dy /= d;
    this.vx += dx * 0.4;
    this.vy += dy * 0.4;
  }

  wander(dt){
    this.wanderTimer -= dt;
    if(this.wanderTimer <= 0){
      // random impulse
      this.vx += (Math.random()-0.5)*0.6;
      this.vy += (Math.random()-0.5)*0.6;
      this.wanderTimer = 1 + Math.random()*2;
    }
  }

  move(dt){
    // clamp speed by species base speed
    const max = this.speed * 3;
    const vlen = Math.hypot(this.vx, this.vy);
    if(vlen > max){ this.vx = this.vx / vlen * max; this.vy = this.vy / vlen * max; }
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.wrap();
    // Ensure cats and squirrels remain on the ground (no flying)
    if(this.type === 'cat' || this.type === 'squirrel'){
      if(this._groundOffset === undefined) this._groundOffset = Math.random() * 40;
      this.y = H * 0.65 + this._groundOffset;
      this.vy = 0;
    }
  }

  wrap(){
    // Cats and squirrels don't wrap around screen edges (they stay in the backyard)
    if(this.type === 'cat' || this.type === 'squirrel'){
      // Remove them if they go off-screen
      if(this.x < -100 || this.x > W + 100 || this.y < -100 || this.y > H + 100){
        this.alive = false;
      }
      return;
    }
    
    // Birds wrap around
    if(this.x < -50) this.x = W + 50;
    if(this.x > W + 50) this.x = -50;
    if(this.y < -50) this.y = H + 50;
    if(this.y > H + 50) this.y = -50;
  }

  draw(ctx){
    if(!this.alive) return;
    
    // Update animation frame based on speed (or perching)
    const speed = Math.hypot(this.vx, this.vy);
    const frameCount = SPRITE_FRAMES[this.type] || 4;
    const frameDuration = speed > 0.5 ? 100 : 150;
    
    this._frameTime += (performance.now() - (this._lastFrameTime || performance.now()));
    this._lastFrameTime = performance.now();
    
    if(this._frameTime > frameDuration){
      this._currentFrame = (this._currentFrame + 1) % frameCount;
      this._frameTime = 0;
    }
    
    // Display size
    const displaySize = this.radius * 3;
    
    // Add subtle bobbing (only when flying and not for ground animals)
    let bob = 0;
    if(!this.isPerched && this.type !== 'cat' && this.type !== 'squirrel'){
      bob = Math.sin((performance.now()/300) + this._bobPhase) * 2;
    }
    
    // Draw bird using procedural canvas drawing
    const drawer = birdDrawers[this.type];
    if(drawer){
      drawer(ctx, this.x, this.y + bob, this._currentFrame, displaySize);
    } else {
      // fallback circle
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
      ctx.fill();
    }
    
    // Draw perch indicator if bird is on ground
    if(this.isPerched){
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.beginPath();
      ctx.ellipse(this.x, this.y + displaySize/2 + 5, displaySize/2.5, 3, 0, 0, Math.PI*2);
      ctx.fill();
    }
    
    if(this.isPlayer){
      // Player highlight
      ctx.beginPath(); ctx.strokeStyle = 'rgba(255,200,0,0.9)'; ctx.lineWidth = 4;
      ctx.ellipse(this.x, this.y, this.radius+8, this.radius+8, 0, 0, Math.PI*2); ctx.stroke();
    }
  }
}

function dist(a,b){ return Math.hypot(a.x-b.x, a.y-b.y); }
function nearest(bird, list){
  if(!list || list.length===0) return null;
  let best = null; let bd = 1e9;
  for(const o of list){ const d = dist(bird,o); if(d < bd){ bd=d; best=o; } }
  return best;
}

// Get max seeds this bird/animal type can eat
function getMaxSeedsForType(type){
  if(type === 'chickadee') return 1;
  if(type === 'dove') return 10;
  if(type === 'sparrow') return 2;
  if(type === 'squirrel') return 1; // squirrels eat 1 seed at a time
  return 0; // hawks, crows, cats don't eat seeds
}

// game logic
function spawnBird(type, x, y, isPlayer=false){
  const b = new Bird(x, y, type, isPlayer);
  if(type === 'crow'){
    b.crowSpawnTime = performance.now(); // Record when crow was spawned
  }
  birds.push(b);
  return b;
}

function spawnInitial(){
  birds = [];
  seeds = []; // Reset seeds
  totalSeeds = configuredSeeds; // Reset seed count
  const centerX = W/2; const centerY = H/2;
  
  // Spawn birds at edges of screen, not at feeder
  for(let i=0;i<8;i++){
    // Random edge spawn
    let x, y;
    const edge = Math.random() * 4;
    if(edge < 1){
      x = Math.random() * W; y = -50; // top edge
    } else if(edge < 2){
      x = Math.random() * W; y = H + 50; // bottom edge
    } else if(edge < 3){
      x = -50; y = Math.random() * H; // left edge
    } else {
      x = W + 50; y = Math.random() * H; // right edge
    }
    spawnBird(randomType(), x, y);
  }
  
  // Spawn 2-3 initial crows to hunt hawks
  for(let i = 0; i < 2 + Math.floor(Math.random() * 2); i++){
    let x, y;
    const edge = Math.random() * 4;
    if(edge < 1){
      x = Math.random() * W; y = -50;
    } else if(edge < 2){
      x = Math.random() * W; y = H + 50;
    } else if(edge < 3){
      x = -50; y = Math.random() * H;
    } else {
      x = W + 50; y = Math.random() * H;
    }
    spawnBird('crow', x, y);
  }
  
  // Spawn 2-3 squirrels at the backyard
  for(let i = 0; i < 2 + Math.floor(Math.random() * 2); i++){
    const x = Math.random() * W;
    const y = H * 0.65 + Math.random() * 40;
    spawnBird('squirrel', x, y);
  }
  
  // Spawn 1-2 cats at the backyard
  for(let i = 0; i < 1 + Math.floor(Math.random() * 2); i++){
    let x, y;
    const edge = Math.random() * 4;
    if(edge < 1){
      x = Math.random() * W; y = -50;
    } else if(edge < 2){
      x = Math.random() * W; y = H + 50;
    } else if(edge < 3){
      x = -50; y = Math.random() * H;
    } else {
      x = W + 50; y = Math.random() * H;
    }
    spawnBird('cat', x, y);
  }
  
  // Create seeds at the feeder
  for(let i = 0; i < totalSeeds; i++){
    seeds.push({
      x: centerX + (Math.random()-0.5)*80,
      y: centerY + (Math.random()-0.5)*80,
      eaten: false
    });
  }
}

function randomType(){
  const list = ['hawk','dove','sparrow','chickadee'];
  // weighted common small birds
  const r = Math.random();
  if(r < 0.05) return 'hawk';
  if(r < 0.35) return 'dove';
  if(r < 0.7) return 'sparrow';
  return 'chickadee';
}

// collisions: predators catch prey
function handleCollisions(){
  for(let i=0;i<birds.length;i++){
    const a = birds[i]; if(!a.alive) continue;
    for(let j=i+1;j<birds.length;j++){
      const b = birds[j]; if(!b.alive) continue;
      const d = dist(a,b);
      if(d < a.radius + b.radius){
        // decide who eats whom
        let eater = null, eaten = null;
        
        // Seed-eating birds (chickadee, dove, sparrow, squirrel) can't eat each other
        const seedEaters = ['chickadee', 'dove', 'sparrow', 'squirrel'];
        if(seedEaters.includes(a.type) && seedEaters.includes(b.type)){
          continue;
        }
        
        // Hawks hunt all birds except hawks (non-player), crows, and cats
        if(a.type === 'hawk' && b.type !== 'hawk' && b.type !== 'crow' && b.type !== 'cat') { eater=a; eaten=b; }
        else if(b.type === 'hawk' && a.type !== 'hawk' && a.type !== 'crow' && a.type !== 'cat') { eater=b; eaten=a; }
        // Crows hunt hawks (all hawks, not just player)
        else if(a.type === 'crow' && b.type === 'hawk') { eater=a; eaten=b; }
        else if(b.type === 'crow' && a.type === 'hawk') { eater=b; eaten=a; }
        // Cats hunt all birds except other cats and squirrels
        else if(a.type === 'cat' && b.type !== 'cat' && b.type !== 'squirrel') { eater=a; eaten=b; }
        else if(b.type === 'cat' && a.type !== 'cat' && a.type !== 'squirrel') { eater=b; eaten=a; }
        // Same-species interactions: chase away (no eating)
        else if((a.type === 'chickadee' && b.type === 'chickadee') || 
                (a.type === 'dove' && b.type === 'dove') ||
                (a.type === 'sparrow' && b.type === 'sparrow') ||
                (a.type === 'squirrel' && b.type === 'squirrel') ||
                (a.type === 'cat' && b.type === 'cat')){
          // Same-species non-predatory interaction: they chase away from each other
          if(Math.random() < 0.5) {
            b.vx += (b.x - a.x) * 0.05;
            b.vy += (b.y - a.y) * 0.05;
          } else {
            a.vx += (a.x - b.x) * 0.05;
            a.vy += (a.y - b.y) * 0.05;
          }
          continue;
        }
        // Default: larger bird wins by size or chance
        else if(a.radius > b.radius + 2) { eater=a; eaten=b; }
        else if(b.radius > a.radius + 2) { eater=b; eaten=a; }
        else {
          if(Math.random() < 0.5) { eater=a; eaten=b; } else { eater=b; eaten=a; }
        }

        if(eaten && eater){
          // if eaten is player -> game over for player
          if(eaten.isPlayer){
            eaten.alive = false; running = false;
            document.getElementById('startBtn').innerText = 'Start Game';
            alert('You were caught! Score: ' + score);
          } else {
            eaten.alive = false;
            score += 1;
            document.getElementById('score').innerText = 'Score: ' + score;
            
            // If eater is a hawk, increment kill count
            if(eater.type === 'hawk'){
              eater.killCount++;
              // Spawn a crow when hawk reaches 10 kills
              if(eater.killCount >= 10 && !crowSpawned){
                crowSpawned = true;
                // Spawn crow off-screen so it flies in naturally
                let sx, sy;
                const edge = Math.floor(Math.random() * 4);
                if(edge === 0){ sx = Math.random() * W; sy = -120; }
                else if(edge === 1){ sx = Math.random() * W; sy = H + 120; }
                else if(edge === 2){ sx = -120; sy = Math.random() * H; }
                else { sx = W + 120; sy = Math.random() * H; }
                const crow = spawnBird('crow', sx, sy, false);
                // Give the crow an initial velocity toward the hawk so it appears to fly in
                const dx = eater.x - crow.x; const dy = eater.y - crow.y; const dist = Math.hypot(dx,dy) || 1;
                crow.vx = (dx / dist) * crow.speed * 1.2;
                crow.vy = (dy / dist) * crow.speed * 1.2;
                crow.crowSpawnTime = performance.now();
                console.log('Crow spawned to hunt the hawk (flying in)!');
              }
            }
          }
        }
      }
    }
  }
  // remove dead occasionally
  birds = birds.filter(b => b.alive || b.isPlayer);
}

// resize handling
window.addEventListener('resize', ()=>{ W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; });

let lastTime = performance.now();
let lastSquirrelSpawn = 0;
let lastCatSpawn = 0;

function loop(now){
  const dt = Math.min( (now - lastTime) * 0.06, 60 ); // scale dt for stable motion
  lastTime = now;
  if(running){
    // spawn regular birds occasionally at screen edges (not at feeder)
    if(performance.now() - lastSpawn > 2000){
      let x, y;
      const edge = Math.random() * 4;
      if(edge < 1){
        x = Math.random() * W; y = -50; // top edge
      } else if(edge < 2){
        x = Math.random() * W; y = H + 50; // bottom edge
      } else if(edge < 3){
        x = -50; y = Math.random() * H; // left edge
      } else {
        x = W + 50; y = Math.random() * H; // right edge
      }
      spawnBird(randomType(), x, y);
      lastSpawn = performance.now();
    }
    
    // Spawn squirrels occasionally (every 15-20 seconds)
    if(performance.now() - lastSquirrelSpawn > 15000 + Math.random() * 5000){
      const x = Math.random() * W;
      const y = H * 0.65 + Math.random() * 40;
      spawnBird('squirrel', x, y);
      lastSquirrelSpawn = performance.now();
    }
    
    // Spawn cats occasionally (every 20-30 seconds)
    if(performance.now() - lastCatSpawn > 20000 + Math.random() * 10000){
      let x, y;
      const edge = Math.random() * 4;
      if(edge < 1){
        x = Math.random() * W; y = -50;
      } else if(edge < 2){
        x = Math.random() * W; y = H + 50;
      } else if(edge < 3){
        x = -50; y = Math.random() * H;
      } else {
        x = W + 50; y = Math.random() * H;
      }
      spawnBird('cat', x, y);
      lastCatSpawn = performance.now();
    }

    for(const b of birds) b.update(dt);
    
    // Handle seed eating
    for(const bird of birds.filter(b => b.alive)){
      const maxSeeds = getMaxSeedsForType(bird.type);
      if(maxSeeds > 0 && bird.seedsEaten < maxSeeds){
        // Find nearest uneaten seed
        let closestSeed = null;
        let closestDist = 50; // Must be within 50 pixels
        for(const seed of seeds){
          if(!seed.eaten){
            const d = dist(bird, seed);
            if(d < closestDist){
              closestDist = d;
              closestSeed = seed;
            }
          }
        }
        // Eat the closest seed if within range
        if(closestSeed){
          closestSeed.eaten = true;
          bird.seedsEaten++;
        }
      }
    }
    
    handleCollisions();
    
    // Check if all seeds are eaten - game ends
    const uneatenSeeds = seeds.filter(s => !s.eaten).length;
    if(uneatenSeeds === 0 && seeds.length > 0){
      running = false;
      document.getElementById('startBtn').innerText = 'Start Game';
      alert('All seeds are eaten! Game Over! Final Score: ' + score);
    }
  }

  draw();
  requestAnimationFrame(loop);
}

function draw(){
  // Draw backyard background
  ctx.clearRect(0,0,W,H);
  
  // Test: Draw a simple rectangle to verify canvas is working
  ctx.fillStyle = '#ff0000';
  ctx.fillRect(0, 0, 50, 50);
  
  // Sky gradient (light blue at top, lighter at bottom)
  const skyGrad = ctx.createLinearGradient(0, 0, 0, H*0.6);
  skyGrad.addColorStop(0, '#87CEEB');
  skyGrad.addColorStop(1, '#E0F6FF');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, W, H*0.6);
  
  // Grass (green ground)
  ctx.fillStyle = '#2d8659';
  ctx.fillRect(0, H*0.6, W, H*0.4);
  
  // Grass texture lines
  ctx.strokeStyle = 'rgba(0,0,0,0.1)';
  ctx.lineWidth = 1;
  for(let i = 0; i < W; i += 40){
    ctx.beginPath();
    ctx.moveTo(i, H*0.6);
    ctx.lineTo(i+20, H*0.75);
    ctx.stroke();
  }
  
  // Clouds
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.beginPath();
  ctx.ellipse(W*0.2, H*0.15, 50, 25, 0, 0, Math.PI*2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(W*0.8, H*0.25, 40, 20, 0, 0, Math.PI*2);
  ctx.fill();
  
  // feeder area background (subtle dirt area)
  ctx.fillStyle = 'rgba(139, 90, 43, 0.2)';
  ctx.fillRect(W/2 - 100, H/2 - 40, 200, 120);

  // draw feeder image if loaded
  const feederImg = assets['feeder'];
  let feederX, feederY, feederW, feederH;
  if(assetsLoaded && feederImg){
    const fW = feederImg.width || feederImg.naturalWidth || 100;
    const fH = feederImg.height || feederImg.naturalHeight || 80;
    const maxFDim = Math.max(fW, fH);
    const feederScale = 120 / maxFDim;
    feederW = fW * feederScale;
    feederH = fH * feederScale;
    feederX = W/2 - feederW/2;
    feederY = H/2 - feederH/2 - 20;
    ctx.drawImage(feederImg, feederX, feederY, feederW, feederH);
  } else {
    // fallback text if feeder image not loaded
    feederX = W/2 - 60;
    feederY = H/2 - 60;
    feederW = 120;
    feederH = 120;
    ctx.fillStyle = '#333'; ctx.font = '14px Segoe UI';
    ctx.fillText('Feeder', W/2 - 24, H/2 - 90);
  }

  // Draw seeds INSIDE the feeder compartment
  const uneatenSeeds = seeds.filter(s => !s.eaten);
  const seedCompartmentX = feederX + feederW * 0.25;
  const seedCompartmentY = feederY + feederH * 0.15;
  const seedCompartmentW = feederW * 0.5;
  const seedCompartmentH = feederH * 0.45;
  
  // Draw seed background inside feeder
  ctx.fillStyle = 'rgba(245, 222, 179, 0.4)';
  ctx.fillRect(seedCompartmentX, seedCompartmentY, seedCompartmentW, seedCompartmentH);
  
  // Draw individual seeds inside feeder compartment
  ctx.fillStyle = '#FFD700';
  const seedsPerRow = 6;
  const seedSize = Math.min(feederW / 8, 4);
  
  for(let i = 0; i < Math.min(uneatenSeeds.length, seedsPerRow * 4); i++){
    const row = Math.floor(i / seedsPerRow);
    const col = i % seedsPerRow;
    const x = seedCompartmentX + (seedCompartmentW / (seedsPerRow + 1)) * (col + 1);
    const y = seedCompartmentY + (seedCompartmentH / 5) * (row + 0.5);
    ctx.beginPath();
    ctx.arc(x, y, seedSize, 0, Math.PI*2);
    ctx.fill();
  }
  
  // Draw seed count text on feeder
  ctx.fillStyle = '#333';
  ctx.font = 'bold 12px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(uneatenSeeds.length, W/2, feederY + feederH + 20);

  for(const b of birds) b.draw(ctx);

  // HUD updates (game HUD at top center)
  const uiPanel = document.getElementById('ui');
  const gameHUD = document.getElementById('gameHUD');
  if(running){
    // Hide main UI, show game HUD
    uiPanel.classList.add('hidden');
    gameHUD.style.display = 'flex';
    document.getElementById('birds').innerText = 'Birds: ' + birds.filter(b=>b.alive).length;
    const seedsRemaining = seeds.filter(s => !s.eaten).length;
    document.getElementById('seedsRemaining').innerText = 'Seeds: ' + seedsRemaining;
  } else {
    // Show main UI, hide game HUD
    uiPanel.classList.remove('hidden');
    gameHUD.style.display = 'none';
  }
}

// UI wiring
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const seedSelect = document.getElementById('seeds');
seedSelect.addEventListener('change', ()=>{
  if(!running) {
    configuredSeeds = parseInt(seedSelect.value);
    totalSeeds = configuredSeeds;
  }
});
startBtn.addEventListener('click', ()=>{
  if(!running) startGame(); else { running = false; startBtn.innerText = 'Start Game'; }
});
restartBtn.addEventListener('click', ()=>{ resetGame(); });

function startGame(){
  // create initial birds and player
  resetGame(false);
  // ensure assets are loading; start after preloading begins or completes
  if(!assetsLoaded){
    // show a quick loading indicator in the start button while assets load
    const btn = document.getElementById('startBtn');
    const prev = btn.innerText;
    btn.innerText = 'Loading assets...';
    preloadAssets(()=>{ btn.innerText = prev; proceed(); });
    return;
  }
  function proceed(){
    // when assets ready, spawn player below
    const chosen = document.getElementById('species').value;
    const p = spawnBird(chosen, W/2 + 40, H/2, true);
    player = p;
    running = true; startBtn.innerText = 'Pause';
  }

  proceed();
}

function resetGame(pause=true){
  score = 0; document.getElementById('score').innerText = 'Score: 0';
  crowSpawned = false; // Reset crow spawn flag
  configuredSeeds = parseInt(document.getElementById('seeds').value);
  seeds = []; // Reset seeds
  totalSeeds = configuredSeeds; // Reset seed count
  spawnInitial();
  // remove any existing player flag
  player = null;
  // ensure UI
  if(pause) { running = false; document.getElementById('startBtn').innerText = 'Start Game'; }
}

// keyboard
window.addEventListener('keydown', (e)=>{ keys[e.key] = true; });
window.addEventListener('keyup', (e)=>{ keys[e.key] = false; });

// Mobile touch controls
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
if(isMobile){
  document.getElementById('hint').innerText = 'Use on-screen buttons or tap and drag to move.';
  document.getElementById('mobileControls').style.display = 'block';
  
  const upBtn = document.getElementById('upBtn');
  const downBtn = document.getElementById('downBtn');
  const leftBtn = document.getElementById('leftBtn');
  const rightBtn = document.getElementById('rightBtn');
  
  upBtn.addEventListener('touchstart', ()=>{ keys.w = true; });
  upBtn.addEventListener('touchend', ()=>{ keys.w = false; });
  upBtn.addEventListener('mousedown', ()=>{ keys.w = true; });
  upBtn.addEventListener('mouseup', ()=>{ keys.w = false; });
  
  downBtn.addEventListener('touchstart', ()=>{ keys.s = true; });
  downBtn.addEventListener('touchend', ()=>{ keys.s = false; });
  downBtn.addEventListener('mousedown', ()=>{ keys.s = true; });
  downBtn.addEventListener('mouseup', ()=>{ keys.s = false; });
  
  leftBtn.addEventListener('touchstart', ()=>{ keys.a = true; });
  leftBtn.addEventListener('touchend', ()=>{ keys.a = false; });
  leftBtn.addEventListener('mousedown', ()=>{ keys.a = true; });
  leftBtn.addEventListener('mouseup', ()=>{ keys.a = false; });
  
  rightBtn.addEventListener('touchstart', ()=>{ keys.d = true; });
  rightBtn.addEventListener('touchend', ()=>{ keys.d = false; });
  rightBtn.addEventListener('mousedown', ()=>{ keys.d = true; });
  rightBtn.addEventListener('mouseup', ()=>{ keys.d = false; });
  
  // Touch drag to move - more responsive
  let touchStartX = 0, touchStartY = 0;
  let isDragging = false;
  
  canvas.addEventListener('touchstart', (e)=>{
    if(running && player){
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      isDragging = true;
    }
  }, {passive:true});
  
  canvas.addEventListener('touchmove', (e)=>{
    if(running && player && isDragging){
      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;
      const dx = touchX - touchStartX;
      const dy = touchY - touchStartY;
      const dist = Math.hypot(dx, dy);
      
      if(dist > 5){ // smaller deadzone for better responsiveness on touch
        // Apply drag direction to velocity continuously with smoothing
        const angle = Math.atan2(dy, dx);
        const speed = Math.min(dist * 0.04, player.speed * 4); // more sensitive scaling
        const targetVx = Math.cos(angle) * speed;
        const targetVy = Math.sin(angle) * speed;
        // Smoothly move current velocity toward the target for better finger control
        player.vx += (targetVx - player.vx) * 0.6;
        player.vy += (targetVy - player.vy) * 0.6;

        // Update drag start position for continuous movement
        touchStartX = touchX;
        touchStartY = touchY;
      }
    }
  }, {passive:true});
  
  canvas.addEventListener('touchend', ()=>{
    isDragging = false;
  }, {passive:true});

  // Pointer event fallback for devices/webviews that expose pointer events instead of touch
  if(window.PointerEvent){
    canvas.addEventListener('pointerdown', (e)=>{
      if(running && player){
        touchStartX = e.clientX;
        touchStartY = e.clientY;
        isDragging = true;
      }
    });

    canvas.addEventListener('pointermove', (e)=>{
      if(running && player && isDragging){
        const touchX = e.clientX;
        const touchY = e.clientY;
        const dx = touchX - touchStartX;
        const dy = touchY - touchStartY;
        const dist = Math.hypot(dx, dy);
        if(dist > 5){
          const angle = Math.atan2(dy, dx);
          const speed = Math.min(dist * 0.04, player.speed * 4);
          const targetVx = Math.cos(angle) * speed;
          const targetVy = Math.sin(angle) * speed;
          player.vx += (targetVx - player.vx) * 0.6;
          player.vy += (targetVy - player.vy) * 0.6;
          touchStartX = touchX;
          touchStartY = touchY;
        }
      }
    });

    canvas.addEventListener('pointerup', ()=>{ isDragging = false; });
    canvas.addEventListener('pointercancel', ()=>{ isDragging = false; });
  }
}

// start the animation loop
resetGame(false);
requestAnimationFrame(loop);
// start preloading assets in background so images are ready when player starts
preloadAssets();
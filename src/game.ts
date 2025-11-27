import { Bird } from './bird.js';
import { Renderer } from './renderer.js';
import { CollisionSystem } from './collision.js';
import { SPECIES_INFO, SPRITE_FRAMES, GLOBAL_SPEED_SCALE, getMaxSeedsForType, getDifficultyConfig } from './config.js';
import { GameState, Seed, SpeciesType, DifficultyLevel, EnvironmentalCreature } from './types.js';
import { getLevelConfig, getNextLevelThreshold } from './levels.js';

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private W: number;
  private H: number;
  private lastTime: number = performance.now();
  private lastSpawn: number = 0;
  private lastSquirrelSpawn: number = 0;
  private lastCatSpawn: number = 0;
  private lastSnakeSpawn: number = 0;
  private lastRatSpawn: number = 0;
  private feederImg: HTMLImageElement | null = null;
  private assetsLoaded: boolean = false;
  private gameState: GameState;
  private feederX: number;
  private feederY: number;
  private configuredSeeds: number = 100;
  private keys: { [key: string]: boolean } = {};
  private selectedBird: Bird | null = null;
  private touchStartX: number = 0;
  private touchStartY: number = 0;
  private mouseDownX: number = 0;
  private mouseDownY: number = 0;
  private configuredDifficulty: DifficultyLevel = 'normal';

  constructor(canvasId: string) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) throw new Error('Canvas not found');

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.W = this.canvas.width = window.innerWidth;
    this.H = this.canvas.height = window.innerHeight;
    
    this.feederX = this.W / 2;
    this.feederY = this.H / 2;

    this.gameState = {
      birds: [],
      seeds: [],
      score: 0,
      running: false,
      totalSeeds: this.configuredSeeds,
      crowSpawned: false,
      currentLevel: 1,
      levelStartScore: 0,
      environmentalEnemies: []
    };

    // Preload feeder image
    this.feederImg = new Image();
    this.feederImg.src = 'assets/feeder_cartoon.svg';
    this.feederImg.onload = () => { this.assetsLoaded = true; };
    this.feederImg.onerror = () => { this.assetsLoaded = false; };

    this.setupEventListeners();
  }

  private setupEventListeners() {
    window.addEventListener('keydown', (e) => {
      // store both the raw key and the lowercased key so checks are robust
      try {
        this.keys[e.key] = true;
        this.keys[e.key.toLowerCase()] = true;
      } catch (err) {
        // ignore
      }
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
      }
    });

    window.addEventListener('keyup', (e) => {
      try {
        this.keys[e.key] = false;
        this.keys[e.key.toLowerCase()] = false;
      } catch (err) {
        // ignore
      }
    });

    this.canvas.addEventListener('mousedown', (e) => {
      if (!this.gameState.running) return;
      this.mouseDownX = e.clientX;
      this.mouseDownY = e.clientY;

      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      this.selectedBird = null;
      for (const bird of this.gameState.birds) {
        if (bird.alive && Math.hypot(bird.x - x, bird.y - y) < bird.radius + 20) {
          this.selectedBird = bird;
          break;
        }
      }
    });

    this.canvas.addEventListener('mousemove', (e) => {
      if (!this.gameState.running || !this.selectedBird) return;

      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const dx = x - this.selectedBird.x;
      const dy = y - this.selectedBird.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 5) {
        const targetVx = (dx / dist) * Math.min(dist * 0.04, this.selectedBird.speed * 4);
        const targetVy = (dy / dist) * Math.min(dist * 0.04, this.selectedBird.speed * 4);
        this.selectedBird.vx += (targetVx - this.selectedBird.vx) * 0.6;
        this.selectedBird.vy += (targetVy - this.selectedBird.vy) * 0.6;
      }
    });

    this.canvas.addEventListener('mouseup', () => {
      this.selectedBird = null;
    });

    // Touch events
    this.canvas.addEventListener('touchstart', (e) => {
      if (!this.gameState.running) return;
      const touch = e.touches[0];
      this.touchStartX = touch.clientX;
      this.touchStartY = touch.clientY;

      const rect = this.canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      this.selectedBird = null;
      for (const bird of this.gameState.birds) {
        if (bird.alive && Math.hypot(bird.x - x, bird.y - y) < bird.radius + 20) {
          this.selectedBird = bird;
          break;
        }
      }
    });

    this.canvas.addEventListener('touchmove', (e) => {
      if (!this.gameState.running || !this.selectedBird) return;
      e.preventDefault();

      const touch = e.touches[0];
      const rect = this.canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      // On mobile, move the selected bird (player) directly to the touch point for seamless dragging
      if (this.selectedBird.isPlayer) {
        this.selectedBird.x = x;
        this.selectedBird.y = y;
        this.selectedBird.vx = 0;
        this.selectedBird.vy = 0;
      } else {
        // For non-player birds, keep the old behavior
        const dx = x - this.selectedBird.x;
        const dy = y - this.selectedBird.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 5) {
          const targetVx = (dx / dist) * Math.min(dist * 0.04, this.selectedBird.speed * 4);
          const targetVy = (dy / dist) * Math.min(dist * 0.04, this.selectedBird.speed * 4);
          this.selectedBird.vx += (targetVx - this.selectedBird.vx) * 0.6;
          this.selectedBird.vy += (targetVy - this.selectedBird.vy) * 0.6;
        }
      }
    });

    this.canvas.addEventListener('touchend', () => {
      this.selectedBird = null;
    });

    // Pointer events fallback
    this.canvas.addEventListener('pointerdown', (e) => {
      if (!this.gameState.running || e.pointerType === 'mouse') return;
      this.touchStartX = e.clientX;
      this.touchStartY = e.clientY;

      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      this.selectedBird = null;
      for (const bird of this.gameState.birds) {
        if (bird.alive && Math.hypot(bird.x - x, bird.y - y) < bird.radius + 20) {
          this.selectedBird = bird;
          break;
        }
      }
    });

    this.canvas.addEventListener('pointermove', (e) => {
      if (!this.gameState.running || !this.selectedBird || e.pointerType === 'mouse') return;

      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const dx = x - this.selectedBird.x;
      const dy = y - this.selectedBird.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 5) {
        const targetVx = (dx / dist) * Math.min(dist * 0.04, this.selectedBird.speed * 4);
        const targetVy = (dy / dist) * Math.min(dist * 0.04, this.selectedBird.speed * 4);
        this.selectedBird.vx += (targetVx - this.selectedBird.vx) * 0.6;
        this.selectedBird.vy += (targetVy - this.selectedBird.vy) * 0.6;
      }
    });

    this.canvas.addEventListener('pointerup', () => {
      this.selectedBird = null;
    });

    // Handle window resize and orientation changes
    window.addEventListener('resize', () => {
      this.handleResize();
    });

    window.addEventListener('orientationchange', () => {
      // On mobile, orientationchange fires before resize, so delay the resize slightly
      setTimeout(() => this.handleResize(), 100);
    });
  }

  private handleResize() {
    const newW = window.innerWidth;
    const newH = window.innerHeight;

    // Only update if size actually changed
    if (newW !== this.W || newH !== this.H) {
      this.W = newW;
      this.H = newH;
      this.canvas.width = this.W;
      this.canvas.height = this.H;

      // Recenter the feeder on the new screen dimensions
      this.feederX = this.W / 2;
      this.feederY = this.H / 2;
    }
  }

  startGame() {
    this.gameState.running = true;
    this.spawnInitial();
    // Ensure player velocity is zero at start
    const player = this.gameState.birds.find(b => b.isPlayer);
    if (player) {
      player.vx = 0;
      player.vy = 0;
    }
    // Always hide the config screen on game start (mobile/tablet/desktop)
    const uiPanel = document.getElementById('ui');
    if (uiPanel) uiPanel.classList.add('hidden');
    this.gameLoop();
  }

  stopGame() {
    this.gameState.running = false;
  }

  private spawnInitial() {
    this.gameState.birds = [];
    this.gameState.seeds = [];
    this.gameState.totalSeeds = this.configuredSeeds;

    const diffConfig = getDifficultyConfig(this.configuredDifficulty);

    // Spawn regular birds
    for (let i = 0; i < 8; i++) {
      let x, y;
      const edge = Math.random() * 4;
      if (edge < 1) {
        x = Math.random() * this.W;
        y = -50;
      } else if (edge < 2) {
        x = Math.random() * this.W;
        y = this.H + 50;
      } else if (edge < 3) {
        x = -50;
        y = Math.random() * this.H;
      } else {
        x = this.W + 50;
        y = Math.random() * this.H;
      }
      this.spawnBird(this.randomType(), x, y);
    }

    // Spawn initial crows (scaled by difficulty)
    const crowCount = Math.floor((2 + Math.floor(Math.random() * 2)) * diffConfig.predatorSpawnMultiplier);
    for (let i = 0; i < crowCount; i++) {
      let x, y;
      const edge = Math.random() * 4;
      if (edge < 1) {
        x = Math.random() * this.W;
        y = -50;
      } else if (edge < 2) {
        x = Math.random() * this.W;
        y = this.H + 50;
      } else if (edge < 3) {
        x = -50;
        y = Math.random() * this.H;
      } else {
        x = this.W + 50;
        y = Math.random() * this.H;
      }
      this.spawnBird('crow', x, y);
    }

    // Spawn squirrels
    for (let i = 0; i < 2 + Math.floor(Math.random() * 2); i++) {
      const x = Math.random() * this.W;
      const y = this.H * 0.65 + Math.random() * 40;
      this.spawnBird('squirrel', x, y);
    }

    // Spawn cats (scaled by difficulty)
    const catCount = Math.floor((1 + Math.floor(Math.random() * 2)) * diffConfig.predatorSpawnMultiplier);
    for (let i = 0; i < catCount; i++) {
      let x, y;
      const edge = Math.random() * 4;
      if (edge < 1) {
        x = Math.random() * this.W;
        y = -50;
      } else if (edge < 2) {
        x = Math.random() * this.W;
        y = this.H + 50;
      } else if (edge < 3) {
        x = -50;
        y = Math.random() * this.H;
      } else {
        x = this.W + 50;
        y = Math.random() * this.H;
      }
      this.spawnBird('cat', x, y);
    }

    // Spawn player based on user selection (match main.js behavior)
    const speciesSelect = document.getElementById('species') as HTMLSelectElement | null;
    const chosen = speciesSelect ? (speciesSelect.value as SpeciesType) : 'hawk';
    const playerBird = this.spawnBird(chosen, this.feederX + 40, this.feederY, true);
    playerBird.atFeeder = true;

    // Spawn seeds - constrain tightly to feeder area
    for (let i = 0; i < this.gameState.totalSeeds; i++) {
      this.gameState.seeds.push({
        x: this.feederX + (Math.random() - 0.5) * 25,
        y: this.feederY + (Math.random() - 0.5) * 25,
        eaten: false
      });
    }
  }

  private spawnBird(type: SpeciesType, x: number, y: number, isPlayer: boolean = false): Bird {
    const bird = new Bird(x, y, type, isPlayer);
    if (type === 'crow') {
      bird.crowSpawnTime = performance.now();
    }
    this.gameState.birds.push(bird);
    return bird;
  }

  private spawnSnake(x: number, y: number): EnvironmentalCreature {
    const vx = (Math.random() - 0.5) * 2;
    const vy = 0; // Snakes stay on ground, no vertical movement
    const speed = 0.5 + Math.random() * 0.5;
    const snake: EnvironmentalCreature = {
      type: 'snake',
      x,
      y,
      vx,
      vy,
      alive: true,
      radius: 20,
      speed
    };
    this.gameState.environmentalEnemies.push(snake);
    return snake;
  }

  private spawnRat(x: number, y: number): EnvironmentalCreature {
    const vx = (Math.random() - 0.5) * 3;
    const vy = 0; // Rats stay on ground, no vertical movement
    const speed = 1 + Math.random() * 0.8;
    const rat: EnvironmentalCreature = {
      type: 'rat',
      x,
      y,
      vx,
      vy,
      alive: true,
      radius: 18,
      speed,
      health: 3
    };
    this.gameState.environmentalEnemies.push(rat);
    return rat;
  }

  private updateEnvironmentalEnemies(scaledDt: number) {
    const levelConfig = getLevelConfig(this.gameState.score, this.configuredSeeds);

    // Update existing creatures
    for (const creature of this.gameState.environmentalEnemies) {
      if (!creature.alive) continue;

      creature.x += creature.vx * creature.speed * scaledDt;
      creature.y += creature.vy * creature.speed * scaledDt;

      // Wrap around edges with some margin
      const margin = 100;
      if (creature.x < -margin) creature.x = this.W + margin;
      if (creature.x > this.W + margin) creature.x = -margin;
      if (creature.y < -margin) creature.y = this.H + margin;
      if (creature.y > this.H + margin) creature.y = -margin;

      // Check collisions with birds - environmental creatures can damage birds
      for (const bird of this.gameState.birds) {
        if (!bird.alive) continue;
        const d = Math.hypot(bird.x - creature.x, bird.y - creature.y);
        if (d < bird.radius + creature.radius) {
          if (creature.type === 'rat') {
            // Hawks and crows can eat rats
            if (bird.type === 'hawk' || bird.type === 'crow') {
              creature.alive = false;
              this.gameState.score++;
              this.updateScore();
              if (bird.type === 'hawk') {
                bird.killCount++;
              }
            }
            // Rats damage the player if they're not a predator
            else if (bird.isPlayer) {
              this.gameState.running = false;
              const btn = document.getElementById('startBtn');
              if (btn) btn.innerText = 'Start Game';
              alert('You were caught by a rat! Score: ' + this.gameState.score);
            }
          } else if (creature.type === 'snake') {
            // Snakes damage the player
            if (bird.isPlayer) {
              this.gameState.running = false;
              const btn = document.getElementById('startBtn');
              if (btn) btn.innerText = 'Start Game';
              alert('You were caught by a snake! Score: ' + this.gameState.score);
            }
          }
        }
      }
    }

    // Spawn snakes based on level config
    const snakeCount = this.gameState.environmentalEnemies.filter(c => c.type === 'snake' && c.alive).length;
    if (snakeCount < levelConfig.maxSnakes) {
      if (performance.now() - this.lastSnakeSpawn > 1000 / levelConfig.snakeSpawnRate) {
        const x = Math.random() * this.W;
        const y = this.H * 0.70 + Math.random() * (this.H * 0.25); // Lower grass area
        this.spawnSnake(x, y);
        this.lastSnakeSpawn = performance.now();
      }
    }

    // Spawn rats based on level config
    const ratCount = this.gameState.environmentalEnemies.filter(c => c.type === 'rat' && c.alive).length;
    if (ratCount < levelConfig.maxRats) {
      if (performance.now() - this.lastRatSpawn > 1000 / levelConfig.ratSpawnRate) {
        const x = -50 + Math.random() * (this.W + 100);
        const y = this.H * 0.65 + Math.random() * (this.H * 0.35 - 50); // Grass area only
        this.spawnRat(x, y);
        this.lastRatSpawn = performance.now();
      }
    }

    // Remove dead creatures
    this.gameState.environmentalEnemies = this.gameState.environmentalEnemies.filter(c => c.alive);
  }

  private randomType(): SpeciesType {
    const list: SpeciesType[] = ['hawk', 'dove', 'sparrow', 'chickadee'];
    const r = Math.random();
    if (r < 0.05) return 'hawk';
    if (r < 0.35) return 'dove';
    if (r < 0.7) return 'sparrow';
    return 'chickadee';
  }

  // Reset game state similar to main.js resetGame(pause=true)
  resetGame(pause: boolean = true) {
    this.gameState.score = 0;
    this.updateScore();
    this.gameState.crowSpawned = false;
    // Clear all stored keys to prevent phantom inputs from previous game session
    this.keys = {};
    // Clear selected bird so no dragging persists
    this.selectedBird = null;
    const seedsSelect = document.getElementById('seeds') as HTMLSelectElement | null;
    if (seedsSelect && !pause) {
      this.configuredSeeds = parseInt(seedsSelect.value);
    } else if (seedsSelect) {
      this.configuredSeeds = parseInt(seedsSelect.value);
    }
    // Read difficulty from UI
    const difficultySelect = document.getElementById('difficulty') as HTMLSelectElement | null;
    if (difficultySelect) {
      this.configuredDifficulty = (difficultySelect.value as DifficultyLevel) || 'normal';
    }
    this.gameState.seeds = [];
    this.gameState.totalSeeds = this.configuredSeeds;
    this.spawnInitial();
    // remove any existing player flag handled by spawnInitial
    if (pause) {
      this.gameState.running = false;
      const btn = document.getElementById('startBtn');
      if (btn) btn.innerText = 'Start Game';
    }
  }

  private gameLoop() {
    const now = performance.now();
    // Match previous timing scale used in the original code so AI and velocities behave the same
    const dt = Math.min((now - this.lastTime) * 0.06, 60);
    this.lastTime = now;

    // Spawn logic (match original main.js): regular birds every ~2s, squirrels/cats occasionally
    if (this.gameState.running) {
      if (now - this.lastSpawn > 2000) {
        let x: number, y: number;
        const edge = Math.random() * 4;
        if (edge < 1) { x = Math.random() * this.W; y = -50; }
        else if (edge < 2) { x = Math.random() * this.W; y = this.H + 50; }
        else if (edge < 3) { x = -50; y = Math.random() * this.H; }
        else { x = this.W + 50; y = Math.random() * this.H; }
        this.spawnBird(this.randomType(), x, y);
        this.lastSpawn = now;
      }

      if (now - this.lastSquirrelSpawn > 15000 + Math.random() * 5000) {
        const x = Math.random() * this.W;
        const y = this.H * 0.65 + Math.random() * 40;
        this.spawnBird('squirrel', x, y);
        this.lastSquirrelSpawn = now;
      }

      if (now - this.lastCatSpawn > 20000 + Math.random() * 10000) {
        let x: number, y: number;
        const edge = Math.random() * 4;
        if (edge < 1) { x = Math.random() * this.W; y = -50; }
        else if (edge < 2) { x = Math.random() * this.W; y = this.H + 50; }
        else if (edge < 3) { x = -50; y = Math.random() * this.H; }
        else { x = this.W + 50; y = Math.random() * this.H; }
        this.spawnBird('cat', x, y);
        this.lastCatSpawn = now;
      }
    }

    // Apply global speed scale + difficulty speed multiplier to dt so we can tune overall pace
    const diffConfig = getDifficultyConfig(this.configuredDifficulty);
    const scaledDt = dt * (GLOBAL_SPEED_SCALE ?? 1) * diffConfig.speedMultiplier;

    // Check for level progression
    const currentLevelConfig = getLevelConfig(this.gameState.score, this.configuredSeeds);
    if (currentLevelConfig.level !== this.gameState.currentLevel) {
      this.gameState.currentLevel = currentLevelConfig.level;
      this.gameState.levelStartScore = this.gameState.score;
    }

    // Update environmental enemies (snakes, rats)
    if (this.gameState.running) {
      this.updateEnvironmentalEnemies(scaledDt);
    }

    // Update all birds
    for (const bird of this.gameState.birds) {
      bird.update(scaledDt, this.W, this.H, this.feederX, this.feederY, this.gameState.birds);
    }

    // Handle player keyboard input (match original main.js: normalized input * 0.6 impulse)
    const player = this.gameState.birds.find(b => b.isPlayer);
    if (player && this.gameState.running) {
      let ax = 0, ay = 0;
      if (this.keys['arrowleft'] || this.keys['a']) ax -= 1;
      if (this.keys['arrowright'] || this.keys['d']) ax += 1;
      if (this.keys['arrowup'] || this.keys['w']) ay -= 1;
      if (this.keys['arrowdown'] || this.keys['s']) ay += 1;
      const len = Math.hypot(ax, ay);
      if (len > 0) {
        ax /= len; ay /= len;
        player.vx += ax * 0.6;
        player.vy += ay * 0.6;
      }
      // limit player speed similar to original
      const vlen = Math.hypot(player.vx, player.vy);
      if (vlen > player.speed * 3) { player.vx *= 0.9; player.vy *= 0.9; }
      // If no input, gently damp velocity so player stops instead of drifting
      if (len === 0 && this.selectedBird !== player) {
        // Immediate stop like original main.js: no keyboard input => zero velocity
        player.vx = 0;
        player.vy = 0;
      }

      // use scaled dt for position update to match bird updates
      player.x += player.vx * (scaledDt);
      player.y += player.vy * (scaledDt);
      // wrap like original
      const margin = 50;
      if (player.x < -margin) player.x = this.W + margin;
      if (player.x > this.W + margin) player.x = -margin;
      if (player.y < -margin) player.y = this.H + margin;
      if (player.y > this.H + margin) player.y = -margin;
    }

    // Seed eating - only species that eat seeds can actually eat them
    for (const seed of this.gameState.seeds) {
      if (seed.eaten) continue;
      for (const bird of this.gameState.birds) {
        if (!bird.alive) continue;
        // Only allow species that eat seeds to actually eat them
        const maxSeeds = getMaxSeedsForType(bird.type);
        if (maxSeeds <= 0) continue;
        // Stop eating if bird has reached its max seed limit for this type
        if (bird.seedsEaten >= maxSeeds) continue;
        
        const d = Math.hypot(bird.x - seed.x, bird.y - seed.y);
        if (d < bird.radius + 5) {
          seed.eaten = true;
          bird.seedsEaten++;
          if (bird.atFeeder) {
            // Bird is eating at feeder
          }
          break;
        }
      }
    }

    // Collisions
    CollisionSystem.handleCollisions(
      this.gameState.birds,
      (eaten, eater) => {
        this.gameState.score++;
        this.updateScore();
        // If eater is a hawk, propagate kill count and possibly spawn a crow when threshold reached
        if (eater.type === 'hawk') {
          eater.killCount++;
          if (eater.killCount >= 10 && !this.gameState.crowSpawned) {
            // spawn a crow off-screen and give it an initial velocity toward the hawk
            let sx: number, sy: number;
            const edge = Math.floor(Math.random() * 4);
            if (edge === 0) { sx = Math.random() * this.W; sy = -120; }
            else if (edge === 1) { sx = Math.random() * this.W; sy = this.H + 120; }
            else if (edge === 2) { sx = -120; sy = Math.random() * this.H; }
            else { sx = this.W + 120; sy = Math.random() * this.H; }
            const crow = this.spawnBird('crow', sx, sy, false);
            const dx = eater.x - crow.x;
            const dy = eater.y - crow.y;
            const dist = Math.hypot(dx, dy) || 1;
            crow.vx = (dx / dist) * crow.speed * 1.2;
            crow.vy = (dy / dist) * crow.speed * 1.2;
            crow.crowSpawnTime = performance.now();
            this.gameState.crowSpawned = true;
          }
        }
      },
      () => {
        this.gameState.running = false;
        const btn = document.getElementById('startBtn');
        if (btn) btn.innerText = 'Start Game';
        alert('You were caught! Score: ' + this.gameState.score);
      }
    );

    // Check if all seeds are eaten - end game like original main.js
    const uneatenSeeds = this.gameState.seeds.filter(s => !s.eaten).length;
    if (uneatenSeeds === 0 && this.gameState.seeds.length > 0) {
      this.gameState.running = false;
      const btn = document.getElementById('startBtn');
      if (btn) btn.innerText = 'Start Game';
      alert('All seeds are eaten! Game Over! Final Score: ' + this.gameState.score);
    }

    // Keep crowSpawned flag in sync with whether any live crow exists
    this.gameState.crowSpawned = this.gameState.birds.some(b => b.type === 'crow' && b.alive);

    // Rendering
    this.render();

    if (this.gameState.running) {
      requestAnimationFrame(() => this.gameLoop());
    }
  }

  private render() {
    // Get current level config for background
    const levelConfig = getLevelConfig(this.gameState.score, this.configuredSeeds);

    // Draw environment using level config colors
    Renderer.drawEnvironment(this.ctx, this.W, this.H, levelConfig.backgroundColor, levelConfig.grassColor);

    // Draw trees and bushes using deterministic positions based on level
    const treePositions: [number, number][] = [];
    const bushPositions: [number, number][] = [];
    
    // Generate stable tree/bush positions using level number as seed offset
    const seed = levelConfig.level * 12345;
    for (let i = 0; i < levelConfig.treeCount; i++) {
      const idx = (seed + i * 111) % 1000;
      const x = (idx % this.W) * 0.9 + this.W * 0.05;
      const y = this.H * 0.5 + (((idx / 1000) * this.H * 0.15)); // Ground area only
      treePositions.push([x, y]);
    }
    
    for (let i = 0; i < levelConfig.bushCount; i++) {
      const idx = (seed + i * 222 + 5000) % 1000;
      const x = (idx % this.W) * 0.85 + this.W * 0.075;
      const y = this.H * 0.65 + (((idx / 1000) * this.H * 0.15)); // Ground area only
      bushPositions.push([x, y]);
    }

    // Draw trees and bushes in background
    for (const [x, y] of treePositions) {
      Renderer.drawTree(this.ctx, x, y, 80);
    }
    for (const [x, y] of bushPositions) {
      Renderer.drawBush(this.ctx, x, y, 50);
    }

    // feeder area background (subtle dirt area)
    this.ctx.fillStyle = 'rgba(139, 90, 43, 0.2)';
    const feederWDefault = 200;
    const feederHDefault = 150;
    const feederMaxDim = Math.max(feederWDefault, feederHDefault);

    let feederW = feederWDefault;
    let feederH = feederHDefault;
    let feederX = this.feederX - feederW / 2;
    let feederY = this.feederY - feederH / 2 - 20;

    // draw feeder image if loaded
    if (this.assetsLoaded && this.feederImg) {
      const fW = (this.feederImg.width || (this.feederImg.naturalWidth as number) || feederWDefault) as number;
      const fH = (this.feederImg.height || (this.feederImg.naturalHeight as number) || feederHDefault) as number;
      const maxF = Math.max(fW, fH);
      const feederScale = 180 / maxF;
      feederW = fW * feederScale;
      feederH = fH * feederScale;
      feederX = this.feederX - feederW / 2;
      feederY = this.feederY - feederH / 2 - 20;
      this.ctx.drawImage(this.feederImg, feederX, feederY, feederW, feederH);
    } else {
      // fallback feeder rectangle
      this.ctx.fillStyle = '#8B5A2B';
      this.ctx.fillRect(this.feederX - feederW / 2, this.feederY - feederH / 2 - 20, feederW, feederH);
      this.ctx.fillStyle = '#333';
      this.ctx.font = '14px Segoe UI';
      this.ctx.fillText('Feeder', this.feederX - 24, this.feederY - feederH / 2 - 90);
    }

    // Draw seed compartment background and seeds
    const seedCompartmentX = feederX + feederW * 0.25;
    const seedCompartmentY = feederY + feederH * 0.15;
    const seedCompartmentW = feederW * 0.5;
    const seedCompartmentH = feederH * 0.45;
    this.ctx.fillStyle = 'rgba(245, 222, 179, 0.4)';
    this.ctx.fillRect(seedCompartmentX, seedCompartmentY, seedCompartmentW, seedCompartmentH);

    // Draw seeds
    this.ctx.fillStyle = '#FFD700';
    for (const seed of this.gameState.seeds) {
      if (!seed.eaten) this.ctx.fillRect(seed.x - 2, seed.y - 2, 4, 4);
    }

    // Draw environmental enemies (snakes and rats)
    let frameNum = Math.floor(performance.now() / 50) % 4;
    for (const creature of this.gameState.environmentalEnemies) {
      if (creature.type === 'snake') {
        Renderer.drawSnake(this.ctx, creature.x, creature.y, frameNum, 40);
      } else if (creature.type === 'rat') {
        Renderer.drawRat(this.ctx, creature.x, creature.y, frameNum, 30);
      }
    }

    // Draw birds (scale to original ~3x radius for display size)
    for (const bird of this.gameState.birds) {
      if (bird.alive) {
        const displaySize = bird.radius * 3;
        // Player highlight
        if (bird.isPlayer) {
          this.ctx.beginPath();
          this.ctx.strokeStyle = 'rgba(255,200,0,0.9)';
          this.ctx.lineWidth = 4;
          this.ctx.ellipse(bird.x, bird.y, bird.radius + 8, bird.radius + 8, 0, 0, Math.PI * 2);
          this.ctx.stroke();
        }
        Renderer.drawBird(this.ctx, bird.x, bird.y, (bird as any)._currentFrame, bird.type, displaySize);
      }
    }

    // Draw HUD
    // Update DOM HUD like original main.js
    const uiPanel = document.getElementById('ui');
    const gameHUD = document.getElementById('gameHUD');
    if (this.gameState.running) {
      if (uiPanel) uiPanel.classList.add('hidden');
      if (gameHUD) gameHUD.style.display = 'flex';
      const birdsEl = document.getElementById('birds');
      const seedsEl = document.getElementById('seedsRemaining');
      const levelEl = document.getElementById('level');
      if (birdsEl) birdsEl.innerText = 'Birds: ' + this.gameState.birds.filter(b => b.alive).length;
      if (seedsEl) seedsEl.innerText = 'Seeds: ' + this.gameState.seeds.filter(s => !s.eaten).length;
      if (levelEl) {
        const levelConfig = getLevelConfig(this.gameState.score, this.configuredSeeds);
        const nextThreshold = getNextLevelThreshold(this.gameState.score, this.configuredSeeds);
        if (nextThreshold !== null) {
          levelEl.innerText = `Level ${levelConfig.level}: ${levelConfig.description} | Next: ${nextThreshold}`;
        } else {
          levelEl.innerText = `Level ${levelConfig.level}: ${levelConfig.description} (Max)`;
        }
      }
      this.updateScore();
    } else {
      if (uiPanel) uiPanel.classList.remove('hidden');
      if (gameHUD) gameHUD.style.display = 'none';
    }
  }

  private updateScore() {
    const scoreEl = document.getElementById('score');
    if (scoreEl) {
      scoreEl.innerText = 'Score: ' + this.gameState.score;
    }
  }
}

class LinearGradient {
  constructor(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number) {
    return ctx.createLinearGradient(x0, y0, x1, y1);
  }
}

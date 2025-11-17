import { SpeciesType } from './types.js';
import { SPECIES_INFO, SPRITE_FRAMES, getMaxSeedsForType } from './config.js';

const dist = (a: { x: number, y: number }, b: { x: number, y: number }) => 
  Math.hypot(a.x - b.x, a.y - b.y);

export class Bird {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: SpeciesType;
  isPlayer: boolean;
  color: string;
  radius: number;
  speed: number;
  aggression: number;
  id: string;
  alive: boolean;
  wanderTimer: number;
  _bobPhase: number;
  _frameTime: number;
  _lastAnimTime: number;
  _currentFrame: number;
  killCount: number;
  crowSpawnTime: number;
  seedsEaten: number;
  atFeeder: boolean;
  hasLeftFeeder: boolean;
  flyOutTarget: {x: number, y: number} | null;
  flyOutStarted: boolean;
  _groundOffset?: number;
  isPerched: boolean;
  perchTime: number;
  lastFlightTime: number;
  perchPosition: {x: number, y: number} | null;

  constructor(x: number, y: number, type: SpeciesType, isPlayer: boolean = false) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.type = type;
    this.isPlayer = isPlayer;
    
    const info = SPECIES_INFO[type];
    this.color = info.color;
    this.radius = info.radius;
    this.speed = info.speed;
    this.aggression = info.aggression;
    
    this.id = Math.random().toString(36).slice(2, 9);
    this.alive = true;
    this.wanderTimer = Math.random() * 3;
    this._bobPhase = Math.random() * Math.PI * 2;
    this._frameTime = 0;
    this._lastAnimTime = performance.now();
    this._currentFrame = 0;
    this.killCount = 0;
    this.crowSpawnTime = 0;
    this.seedsEaten = 0;
    this.atFeeder = false;
    this.hasLeftFeeder = false;
    this.flyOutTarget = null;
    this.flyOutStarted = false;
    
    if (this.type === 'cat' || this.type === 'squirrel') {
      this._groundOffset = Math.random() * 40;
    }
    
    this.isPerched = false;
    this.perchTime = 0;
    this.lastFlightTime = performance.now();
    this.perchPosition = null;
  }

  update(dt: number, W: number, H: number, feederX: number, feederY: number, allBirds: Bird[]) {
    if (!this.alive) return;

    // Ground-only animals (cats/squirrels) must stay on the ground level
    if (this.type === 'cat' || this.type === 'squirrel') {
      if (this._groundOffset === undefined) this._groundOffset = Math.random() * 40;
      const groundY = H * 0.65 + this._groundOffset;
      this.y = groundY;
      this.vy = 0;
    }

    const canPerch = this.type !== 'cat' && this.type !== 'squirrel' && !this.isPlayer;

    // Update animation frame using real time (ms) like original code
    const maxFrames = SPRITE_FRAMES[this.type];
    const now = performance.now();
    const deltaMs = now - (this._lastAnimTime || now);
    this._lastAnimTime = now;
    this._frameTime += deltaMs;
    // original used a shorter frame duration for faster species
    const frameDuration = this.speed > 0.5 ? 100 : 150; // ms
    if (this._frameTime > frameDuration) {
      this._frameTime = 0;
      this._currentFrame = (this._currentFrame + 1) % maxFrames;
    }

    // Crow behavior: if crow hasn't caught a hawk within 60 seconds, begin flying out
    if (this.type === 'crow' && this.crowSpawnTime > 0) {
      const timeSinceCrowSpawn = (performance.now() - this.crowSpawnTime) / 1000;
      if (timeSinceCrowSpawn > 60 && !this.flyOutStarted) {
        this.flyOutStarted = true;
        const edge = Math.floor(Math.random() * 4);
        if (edge === 0) this.flyOutTarget = { x: Math.random() * W, y: -200 };
        else if (edge === 1) this.flyOutTarget = { x: Math.random() * W, y: H + 200 };
        else if (edge === 2) this.flyOutTarget = { x: -200, y: Math.random() * H };
        else this.flyOutTarget = { x: W + 200, y: Math.random() * H };
      }

      if (this.flyOutTarget && !this.flyOutStarted) {
        this.vx += (this.flyOutTarget.x - this.x) * 0.015;
        this.vy += (this.flyOutTarget.y - this.y) * 0.015;
      }
      if (this.flyOutTarget && this.x < -300 || this.x > W + 300 || this.y < -300 || this.y > H + 300) {
        this.alive = false;
      }
    }

    // Perching behavior for birds
    if (canPerch) {
      const timeSinceLastFlight = (performance.now() - this.lastFlightTime) / 1000;
      
      if (!this.isPerched && timeSinceLastFlight > 120 + Math.random() * 60) {
        this.isPerched = true;
        this.perchTime = 0;
        this.perchPosition = { x: this.x, y: this.y };
        this.vx = 0;
        this.vy = 0;
      }

      if (this.isPerched) {
        this.perchTime += dt;
        this.x = this.perchPosition!.x;
        this.y = this.perchPosition!.y;
        this.vx *= 0.9;
        this.vy *= 0.9;

        if (this.perchTime > 30 + Math.random() * 15) {
          this.isPerched = false;
          this.lastFlightTime = performance.now();
        }
      }
    }
    // Regular movement and AI
    const others = allBirds.filter(b => b.id !== this.id && b.alive);

    // determine if bird is at feeder (within 80 px) when feeder coords provided
    if (typeof feederX === 'number' && typeof feederY === 'number') {
      const toFeederDist = Math.hypot(this.x - feederX, this.y - feederY);
      this.atFeeder = toFeederDist < 80;
    }

    const maxSeeds = getMaxSeedsForType(this.type);
    if (this.atFeeder) {
      if (this.seedsEaten >= maxSeeds && maxSeeds > 0) {
        this.atFeeder = false;
        this.hasLeftFeeder = true;
      }
    }

    if (maxSeeds > 0 && !this.hasLeftFeeder) {
      // species that eat seeds will head to the feeder
      const toward = { x: feederX - this.x, y: feederY - this.y };
      const towardDist = Math.hypot(toward.x, toward.y);
      if (towardDist > 0) {
        this.vx += (toward.x / towardDist) * 0.08;
        this.vy += (toward.y / towardDist) * 0.08;
      }
    } else if (others.length > 0) {
      this.aiUpdate(others, dt);
    } else {
      this.wander(dt);
    }

    this.move(dt, W, H);
  }

  private aiUpdate(others: Bird[], dt: number) {
    if (this.type === 'hawk') {
      const target = this.nearest(others.filter(o => o.type !== 'hawk' && o.type !== 'crow'));
      if (target) this.seek(target, dt);
      else this.wander(dt);
    } else if (this.type === 'crow') {
      const target = this.nearest(others.filter(o => o.type === 'hawk'));
      if (target) {
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const d = Math.hypot(dx, dy);
        if (d > 0) {
          const ndx = dx / d;
          const ndy = dy / d;
          this.vx += ndx * 0.25 * this.aggression;
          this.vy += ndy * 0.25 * this.aggression;
          this.vx *= 0.992;
          this.vy *= 0.992;
        }
      } else this.wander(dt);
    } else if (this.type === 'cat') {
      const target = this.nearest(others.filter(o => o.type !== 'cat' && o.type !== 'squirrel'));
      if (target) this.seek(target, dt);
      else this.wander(dt);
    } else if (this.type === 'dove') {
      const threat = this.nearest(others.filter(o => o.type === 'hawk' || o.type === 'cat'));
      if (threat && dist(this, threat) < 300) this.flee(threat, dt);
      else this.wander(dt);
    } else if (this.type === 'sparrow') {
      const threat = this.nearest(others.filter(o => o.type === 'hawk' || o.type === 'cat'));
      if (threat && dist(this, threat) < 300) this.flee(threat, dt);
      else {
        const target = this.nearest(others.filter(o => o.type === 'chickadee'));
        if (target) this.seek(target, dt);
        else this.wander(dt);
      }
    } else if (this.type === 'squirrel') {
      // Squirrels handled separately in main loop
      this.wander(dt);
    } else {
      this.wander(dt);
    }
  }

  private nearest(list: Bird[]): Bird | null {
    let best: Bird | null = null;
    let bd = 1e9;
    for (const o of list) {
      const d = dist(this, o);
      if (d < bd) {
        bd = d;
        best = o;
      }
    }
    return best;
  }

  seek(target: Bird, dt: number) {
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const d = Math.hypot(dx, dy);
    if (d === 0) return;
    const ndx = dx / d;
    const ndy = dy / d;
    this.vx += ndx * 0.2 * this.aggression;
    this.vy += ndy * 0.2 * this.aggression;
    this.vx *= 0.995;
    this.vy *= 0.995;
  }

  flee(threat: Bird, dt: number) {
    const dx = this.x - threat.x;
    const dy = this.y - threat.y;
    const d = Math.hypot(dx, dy);
    if (d === 0) {
      this.vx += (Math.random() - 0.5) * 2;
      this.vy += (Math.random() - 0.5) * 2;
      return;
    }
    const ndx = dx / d;
    const ndy = dy / d;
    this.vx += ndx * 0.4;
    this.vy += ndy * 0.4;
  }

  wander(dt: number) {
    this.wanderTimer -= dt;
    if (this.wanderTimer <= 0) {
      const angle = Math.random() * Math.PI * 2;
      this.vx += Math.cos(angle) * 0.3;
      this.vy += Math.sin(angle) * 0.3;
      this.wanderTimer = 1 + Math.random() * 2;
    }
    this.vx *= 0.99;
    this.vy *= 0.99;
  }

  move(dt: number, W: number, H: number) {
    // Ground animals stay on ground
    if (this.type === 'cat' || this.type === 'squirrel') {
      const groundY = H * 0.65 + (this._groundOffset || 0);
      this.y = groundY;
      this.vy = 0;
    }

    // clamp speed by species base speed (match original behavior)
    const max = this.speed * 3;
    const vlen = Math.hypot(this.vx, this.vy);
    if (vlen > max) {
      this.vx = (this.vx / vlen) * max;
      this.vy = (this.vy / vlen) * max;
    }

    this.x += this.vx * dt;
    this.y += this.vy * dt;

    const margin = 50;
    if (this.type === 'cat' || this.type === 'squirrel') {
      // ground animals: remove if well outside (keep similar to original)
      if (this.x < -100 || this.x > W + 100 || this.y < -100 || this.y > H + 100) {
        this.alive = false;
      }
      // ensure they stay locked to ground
      this.y = H * 0.65 + (this._groundOffset || 0);
      this.vy = 0;
      return;
    }

    if (this.x < -margin) this.x = W + margin;
    if (this.x > W + margin) this.x = -margin;
    if (this.y < -margin) this.y = H + margin;
    if (this.y > H + margin) this.y = -margin;
  }
}

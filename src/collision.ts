import { Bird } from './bird.js';

const dist = (a: { x: number, y: number }, b: { x: number, y: number }) => 
  Math.hypot(a.x - b.x, a.y - b.y);

export class CollisionSystem {
  static handleCollisions(birds: Bird[], onEaten: (eaten: Bird, eater: Bird) => void, onPlayerDeath: () => void) {
    for (let i = 0; i < birds.length; i++) {
      const a = birds[i];
      if (!a.alive) continue;

      for (let j = i + 1; j < birds.length; j++) {
        const b = birds[j];
        if (!b.alive) continue;

        const d = dist(a, b);
        if (d < a.radius + b.radius) {
          let eater: Bird | null = null;
          let eaten: Bird | null = null;

          // Same species can never capture each other
          if (a.type === b.type) {
            // Just push apart, no eating
            if (Math.random() < 0.5) {
              b.vx += (b.x - a.x) * 0.05;
              b.vy += (b.y - a.y) * 0.05;
            } else {
              a.vx += (a.x - b.x) * 0.05;
              a.vy += (a.y - b.y) * 0.05;
            }
            continue;
          }

          // Seed-eating birds can't eat each other
          const seedEaters = ['chickadee', 'dove', 'sparrow', 'squirrel'];
          if (seedEaters.includes(a.type) && seedEaters.includes(b.type)) {
            continue;
          }

          // Hawks hunt all birds except hawks, crows, and cats
          if (a.type === 'hawk' && b.type !== 'hawk' && b.type !== 'crow' && b.type !== 'cat') {
            eater = a;
            eaten = b;
          } else if (b.type === 'hawk' && a.type !== 'hawk' && a.type !== 'crow' && a.type !== 'cat') {
            eater = b;
            eaten = a;
          }
          // Crows hunt hawks
          else if (a.type === 'crow' && b.type === 'hawk') {
            eater = a;
            eaten = b;
          } else if (b.type === 'crow' && a.type === 'hawk') {
            eater = b;
            eaten = a;
          }
          // Cats hunt all birds except other cats and squirrels
          else if (a.type === 'cat' && b.type !== 'cat' && b.type !== 'squirrel') {
            eater = a;
            eaten = b;
          } else if (b.type === 'cat' && a.type !== 'cat' && a.type !== 'squirrel') {
            eater = b;
            eaten = a;
          }
          // Default: larger bird wins by size or chance
          else if (a.radius > b.radius + 2) {
            eater = a;
            eaten = b;
          } else if (b.radius > a.radius + 2) {
            eater = b;
            eaten = a;
          } else {
            if (Math.random() < 0.5) {
              eater = a;
              eaten = b;
            } else {
              eater = b;
              eaten = a;
            }
          }

          if (eaten && eater) {
            if (eaten.isPlayer) {
              eaten.alive = false;
              onPlayerDeath();
            } else {
              eaten.alive = false;
              onEaten(eaten, eater);

              if (eater.type === 'hawk') {
                eater.killCount++;
              }
            }
          }
        }
      }
    }
  }
}

import { Bird } from './bird.js';
export declare class CollisionSystem {
    static handleCollisions(birds: Bird[], onEaten: (eaten: Bird, eater: Bird) => void, onPlayerDeath: () => void): void;
}

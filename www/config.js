export const SPECIES_INFO = {
    hawk: { color: '#8B0000', radius: 14, speed: 1.6, aggression: 1.0 },
    dove: { color: '#B0C4DE', radius: 10, speed: 1.2, aggression: 0.2 },
    sparrow: { color: '#A0522D', radius: 9, speed: 1.4, aggression: 0.6 },
    chickadee: { color: '#222222', radius: 7, speed: 1.5, aggression: 0.5 },
    crow: { color: '#1a1a1a', radius: 16, speed: 2.0, aggression: 1.0 },
    squirrel: { color: '#8B4513', radius: 12, speed: 1.3, aggression: 0.3 },
    cat: { color: '#D2691E', radius: 15, speed: 1.7, aggression: 1.2 }
};
export const SPRITE_FRAMES = {
    hawk: 4,
    dove: 4,
    sparrow: 4,
    chickadee: 4,
    crow: 4,
    squirrel: 2,
    cat: 3
};
export function getMaxSeedsForType(type) {
    switch (type) {
        case 'chickadee': return 1;
        case 'dove': return 10;
        case 'sparrow': return 2;
        case 'squirrel': return 1;
        default: return 0;
    }
}
// Global multiplier to scale all movement/acceleration so we can tune overall pace
export const GLOBAL_SPEED_SCALE = 0.6;
// Difficulty configurations
export const DIFFICULTY_CONFIG = {
    easy: {
        predatorSpawnMultiplier: 0.5,
        speedMultiplier: 0.8,
        initialPredators: 2,
        description: 'Fewer and slower predators'
    },
    normal: {
        predatorSpawnMultiplier: 1.0,
        speedMultiplier: 1.0,
        initialPredators: 4,
        description: 'Balanced difficulty'
    },
    hard: {
        predatorSpawnMultiplier: 1.5,
        speedMultiplier: 1.2,
        initialPredators: 6,
        description: 'More predators, faster speeds'
    },
    nightmare: {
        predatorSpawnMultiplier: 2.0,
        speedMultiplier: 1.5,
        initialPredators: 8,
        description: 'Swarms of fast predators!'
    }
};
export function getDifficultyConfig(difficulty) {
    return DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.normal;
}

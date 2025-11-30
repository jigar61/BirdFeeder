// Level progression system with environment themes
export const LEVELS = [
    {
        level: 1,
        minScore: 0,
        backgroundColor: '#87CEEB', // Light blue sky - Sunny day
        grassColor: '#90EE90', // Light green grass
        treeCount: 2,
        bushCount: 4,
        snakeSpawnRate: 0.3,
        ratSpawnRate: 0.2,
        maxSnakes: 1,
        maxRats: 1,
        description: 'Garden Meadow'
    },
    {
        level: 2,
        minScore: 250,
        backgroundColor: '#E8F4F8', // Lighter blue - Cloudy morning
        grassColor: '#7BC67B', // Darker green
        treeCount: 4,
        bushCount: 6,
        snakeSpawnRate: 0.4,
        ratSpawnRate: 0.3,
        maxSnakes: 2,
        maxRats: 2,
        description: 'Wild Field'
    },
    {
        level: 3,
        minScore: 600,
        backgroundColor: '#FF8C42', // Orange sunset
        grassColor: '#5A8C4C', // Olive green
        treeCount: 6,
        bushCount: 8,
        snakeSpawnRate: 0.5,
        ratSpawnRate: 0.4,
        maxSnakes: 3,
        maxRats: 2,
        description: 'Twilight Forest'
    },
    {
        level: 4,
        minScore: 1200,
        backgroundColor: '#1a1a3e', // Deep dark blue - Night time
        grassColor: '#2D4A2B', // Dark forest green
        treeCount: 8,
        bushCount: 10,
        snakeSpawnRate: 0.6,
        ratSpawnRate: 0.5,
        maxSnakes: 4,
        maxRats: 3,
        description: 'Midnight Wilderness'
    },
    {
        level: 5,
        minScore: 2000,
        backgroundColor: '#0a0a1f', // Almost black - Shadow realm
        grassColor: '#1a2a1a', // Very dark green
        treeCount: 10,
        bushCount: 12,
        snakeSpawnRate: 0.8,
        ratSpawnRate: 0.6,
        maxSnakes: 5,
        maxRats: 4,
        description: 'Shadow Realm'
    }
];
// Calculate score multiplier based on seed count
// Normalized to 100 seeds = 1.0x multiplier
export function getSeedMultiplier(seedCount) {
    return seedCount / 100;
}
// Get bird-specific difficulty multiplier
// Different birds have different progression speeds
export function getBirdMultiplier(birdType) {
    switch (birdType) {
        case 'hawk': return 1.2; // Hawk: harder (need more points)
        case 'crow': return 1.2; // Crow: harder (need more points)
        case 'dove': return 0.9; // Dove: easier (need fewer points)
        case 'sparrow': return 1.0; // Sparrow: normal
        case 'chickadee': return 0.8; // Chickadee: easiest (need fewer points)
        default: return 1.0;
    }
}
// Get adjusted level thresholds based on seed count and bird type
export function getAdjustedLevelThreshold(baseThreshold, seedCount, birdType = 'sparrow') {
    return Math.floor(baseThreshold * getSeedMultiplier(seedCount) * getBirdMultiplier(birdType));
}
export function getLevelConfig(score, seedCount = 100, birdType = 'sparrow') {
    // Find the highest level whose adjusted minScore is <= current score
    let currentLevel = LEVELS[0];
    const multiplier = getSeedMultiplier(seedCount);
    const birdMult = getBirdMultiplier(birdType);
    for (const level of LEVELS) {
        const adjustedThreshold = Math.floor(level.minScore * multiplier * birdMult);
        if (score >= adjustedThreshold) {
            currentLevel = level;
        }
        else {
            break;
        }
    }
    return currentLevel;
}
// Get level config by level number (1-5)
export function getLevelConfigByNumber(levelNumber) {
    return LEVELS[Math.max(0, Math.min(levelNumber - 1, LEVELS.length - 1))];
}
export function getNextLevelThreshold(currentScore, seedCount = 100, birdType = 'sparrow') {
    const multiplier = getSeedMultiplier(seedCount);
    const birdMult = getBirdMultiplier(birdType);
    for (const level of LEVELS) {
        const adjustedThreshold = Math.floor(level.minScore * multiplier * birdMult);
        if (adjustedThreshold > currentScore) {
            return adjustedThreshold;
        }
    }
    return null;
}

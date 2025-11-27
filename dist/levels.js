// Level progression system with environment themes
export const LEVELS = [
    {
        level: 1,
        minScore: 0,
        backgroundColor: '#87CEEB', // Light blue sky
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
        backgroundColor: '#87CEEB',
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
        backgroundColor: '#FFB6C1', // Pink sunset
        grassColor: '#6AA86A', // Even darker green
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
        backgroundColor: '#191970', // Midnight blue
        grassColor: '#2D5016', // Deep forest green
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
        backgroundColor: '#4B0082', // Indigo
        grassColor: '#1a3a1a', // Almost black green
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
// Get adjusted level thresholds based on seed count
export function getAdjustedLevelThreshold(baseThreshold, seedCount) {
    return Math.floor(baseThreshold * getSeedMultiplier(seedCount));
}
export function getLevelConfig(score, seedCount = 100) {
    // Find the highest level whose adjusted minScore is <= current score
    let currentLevel = LEVELS[0];
    const multiplier = getSeedMultiplier(seedCount);
    for (const level of LEVELS) {
        const adjustedThreshold = Math.floor(level.minScore * multiplier);
        if (score >= adjustedThreshold) {
            currentLevel = level;
        }
        else {
            break;
        }
    }
    return currentLevel;
}
export function getNextLevelThreshold(currentScore, seedCount = 100) {
    const multiplier = getSeedMultiplier(seedCount);
    for (const level of LEVELS) {
        const adjustedThreshold = Math.floor(level.minScore * multiplier);
        if (adjustedThreshold > currentScore) {
            return adjustedThreshold;
        }
    }
    return null;
}

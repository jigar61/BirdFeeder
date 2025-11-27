export interface LevelConfig {
    level: number;
    minScore: number;
    backgroundColor: string;
    grassColor: string;
    treeCount: number;
    bushCount: number;
    snakeSpawnRate: number;
    ratSpawnRate: number;
    maxSnakes: number;
    maxRats: number;
    description: string;
}
export declare const LEVELS: LevelConfig[];
export declare function getSeedMultiplier(seedCount: number): number;
export declare function getAdjustedLevelThreshold(baseThreshold: number, seedCount: number): number;
export declare function getLevelConfig(score: number, seedCount?: number): LevelConfig;
export declare function getNextLevelThreshold(currentScore: number, seedCount?: number): number | null;

export interface SpeciesInfo {
    color: string;
    radius: number;
    speed: number;
    aggression: number;
}
export type SpeciesType = 'hawk' | 'dove' | 'sparrow' | 'chickadee' | 'crow' | 'squirrel' | 'cat';
export type DifficultyLevel = 'easy' | 'normal' | 'hard' | 'nightmare';
export interface DifficultyConfig {
    predatorSpawnMultiplier: number;
    speedMultiplier: number;
    initialPredators: number;
    description: string;
}
export interface Seed {
    x: number;
    y: number;
    eaten: boolean;
}
export interface EnvironmentalCreature {
    type: 'snake' | 'rat';
    x: number;
    y: number;
    vx: number;
    vy: number;
    alive: boolean;
    radius: number;
    speed: number;
    health?: number;
}
export interface GameState {
    birds: any[];
    seeds: Seed[];
    score: number;
    running: boolean;
    totalSeeds: number;
    crowSpawned: boolean;
    currentLevel: number;
    levelStartScore: number;
    environmentalEnemies: any[];
}

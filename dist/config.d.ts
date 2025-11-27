import { SpeciesInfo, SpeciesType, DifficultyLevel, DifficultyConfig } from './types';
export declare const SPECIES_INFO: Record<SpeciesType, SpeciesInfo>;
export declare const SPRITE_FRAMES: Record<SpeciesType, number>;
export declare function getMaxSeedsForType(type: SpeciesType): number;
export declare const GLOBAL_SPEED_SCALE = 0.6;
export declare const DIFFICULTY_CONFIG: Record<DifficultyLevel, DifficultyConfig>;
export declare function getDifficultyConfig(difficulty: DifficultyLevel): DifficultyConfig;

import { SpeciesInfo, SpeciesType } from './types';
export declare const SPECIES_INFO: Record<SpeciesType, SpeciesInfo>;
export declare const SPRITE_FRAMES: Record<SpeciesType, number>;
export declare function getMaxSeedsForType(type: SpeciesType): number;
export declare const GLOBAL_SPEED_SCALE = 0.6;

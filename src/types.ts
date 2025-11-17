// Game configuration and constants
export interface SpeciesInfo {
  color: string;
  radius: number;
  speed: number;
  aggression: number;
}

export type SpeciesType = 'hawk' | 'dove' | 'sparrow' | 'chickadee' | 'crow' | 'squirrel' | 'cat';

export interface Seed {
  x: number;
  y: number;
  eaten: boolean;
}

export interface GameState {
  birds: any[]; // Will be Bird instances from bird.ts
  seeds: Seed[];
  score: number;
  running: boolean;
  totalSeeds: number;
  crowSpawned: boolean;
}

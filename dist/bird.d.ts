import { SpeciesType } from './types.js';
export declare class Bird {
    x: number;
    y: number;
    vx: number;
    vy: number;
    type: SpeciesType;
    isPlayer: boolean;
    color: string;
    radius: number;
    speed: number;
    aggression: number;
    id: string;
    alive: boolean;
    wanderTimer: number;
    _bobPhase: number;
    _frameTime: number;
    _lastAnimTime: number;
    _currentFrame: number;
    killCount: number;
    crowSpawnTime: number;
    seedsEaten: number;
    atFeeder: boolean;
    hasLeftFeeder: boolean;
    flyOutTarget: {
        x: number;
        y: number;
    } | null;
    flyOutStarted: boolean;
    _groundOffset?: number;
    isPerched: boolean;
    perchTime: number;
    lastFlightTime: number;
    perchPosition: {
        x: number;
        y: number;
    } | null;
    constructor(x: number, y: number, type: SpeciesType, isPlayer?: boolean);
    update(dt: number, W: number, H: number, feederX: number, feederY: number, allBirds: Bird[]): void;
    private aiUpdate;
    private nearest;
    seek(target: Bird, dt: number): void;
    flee(threat: Bird, dt: number): void;
    wander(dt: number): void;
    move(dt: number, W: number, H: number): void;
}

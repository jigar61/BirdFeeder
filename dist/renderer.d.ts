import { SpeciesType } from './types.js';
export declare class Renderer {
    static drawHawk(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, size: number): void;
    static drawDove(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, size: number): void;
    static drawSparrow(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, size: number): void;
    static drawChickadee(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, size: number): void;
    static drawCrow(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, size: number): void;
    static drawSquirrel(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, size: number): void;
    static drawCat(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, size: number): void;
    static drawBird(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, type: SpeciesType, size: number): void;
}

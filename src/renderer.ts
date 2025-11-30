import { SPECIES_INFO } from './config.js';
import { SpeciesType } from './types.js';

export class Renderer {
  static drawHawk(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, size: number) {
    ctx.save();
    ctx.translate(x, y);
    
    const wingAngle = (frame / 3) * Math.PI * 2;
    const wingUp = Math.sin(wingAngle);
    
    // Body
    ctx.fillStyle = '#8B0000';
    ctx.beginPath();
    ctx.ellipse(0, 0, size*0.5, size*0.65, 0, 0, Math.PI*2);
    ctx.fill();
    
    // Body shading
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(size*0.15, size*0.2, size*0.3, size*0.4, 0, 0, Math.PI*2);
    ctx.fill();
    
    // Head
    ctx.fillStyle = '#7a1f1f';
    ctx.beginPath();
    ctx.arc(0, -size*0.4, size*0.35, 0, Math.PI*2);
    ctx.fill();
    
    // Eye white (large)
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(size*0.15, -size*0.5, size*0.15, 0, Math.PI*2);
    ctx.fill();
    
    // Pupil (large and dark)
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(size*0.18, -size*0.48, size*0.08, 0, Math.PI*2);
    ctx.fill();
    
    // Eye shine
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(size*0.21, -size*0.51, size*0.04, 0, Math.PI*2);
    ctx.fill();
    
    // Angry eyebrow
    ctx.strokeStyle = '#000';
    ctx.lineWidth = size*0.08;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(size*0.02, -size*0.62);
    ctx.quadraticCurveTo(size*0.15, -size*0.68, size*0.28, -size*0.62);
    ctx.stroke();
    
    // Beak (thicker and more prominent)
    ctx.fillStyle = '#d4a55f';
    ctx.beginPath();
    ctx.moveTo(size*0.2, -size*0.42);
    ctx.lineTo(size*0.5, -size*0.58);
    ctx.lineTo(size*0.2, -size*0.32);
    ctx.fill();
    
    // Beak shading
    ctx.fillStyle = '#b8860b';
    ctx.beginPath();
    ctx.moveTo(size*0.2, -size*0.42);
    ctx.lineTo(size*0.5, -size*0.58);
    ctx.lineTo(size*0.35, -size*0.45);
    ctx.fill();
    
    // Left wing - flapping motion
    ctx.strokeStyle = '#6a1010';
    ctx.lineWidth = size*0.12;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-size*0.25, -size*0.1);
    ctx.quadraticCurveTo(-size*0.5, -size*0.4 + wingUp*size*0.3, -size*0.6, -size*0.2 + wingUp*size*0.2);
    ctx.stroke();
    
    // Right wing - flapping motion
    ctx.beginPath();
    ctx.moveTo(size*0.25, -size*0.1);
    ctx.quadraticCurveTo(size*0.5, -size*0.4 + wingUp*size*0.3, size*0.6, -size*0.2 + wingUp*size*0.2);
    ctx.stroke();
    
    ctx.restore();
  }

  static drawDove(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, size: number) {
    ctx.save();
    ctx.translate(x, y);
    
    const wingAngle = (frame / 3) * Math.PI * 2;
    const wingUp = Math.sin(wingAngle);
    
    // Body
    ctx.fillStyle = '#B0C4DE';
    ctx.beginPath();
    ctx.ellipse(0, 0, size*0.5, size*0.6, 0, 0, Math.PI*2);
    ctx.fill();
    
    // Head
    ctx.fillStyle = '#c8d8f0';
    ctx.beginPath();
    ctx.arc(0, -size*0.35, size*0.32, 0, Math.PI*2);
    ctx.fill();
    
    // Head shading
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.beginPath();
    ctx.arc(size*0.12, -size*0.2, size*0.25, 0, Math.PI*2);
    ctx.fill();
    
    // Eye white (large)
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(size*0.12, -size*0.45, size*0.13, 0, Math.PI*2);
    ctx.fill();
    
    // Pupil
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(size*0.14, -size*0.43, size*0.07, 0, Math.PI*2);
    ctx.fill();
    
    // Eye shine
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(size*0.17, -size*0.46, size*0.03, 0, Math.PI*2);
    ctx.fill();
    
    // Beak (more pronounced)
    ctx.fillStyle = '#d4a574';
    ctx.beginPath();
    ctx.moveTo(size*0.18, -size*0.4);
    ctx.lineTo(size*0.38, -size*0.5);
    ctx.lineTo(size*0.18, -size*0.3);
    ctx.fill();
    
    // Beak shading
    ctx.fillStyle = '#9d7d5a';
    ctx.beginPath();
    ctx.moveTo(size*0.18, -size*0.4);
    ctx.lineTo(size*0.38, -size*0.5);
    ctx.lineTo(size*0.28, -size*0.4);
    ctx.fill();
    
    // Wings - flapping
    ctx.strokeStyle = '#7b99b8';
    ctx.lineWidth = size*0.1;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-size*0.2, -size*0.05);
    ctx.quadraticCurveTo(-size*0.42, -size*0.35 + wingUp*size*0.25, -size*0.55, -size*0.15 + wingUp*size*0.15);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(size*0.2, -size*0.05);
    ctx.quadraticCurveTo(size*0.42, -size*0.35 + wingUp*size*0.25, size*0.55, -size*0.15 + wingUp*size*0.15);
    ctx.stroke();
    
    ctx.restore();
  }

  static drawSparrow(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, size: number) {
    ctx.save();
    ctx.translate(x, y);
    
    const wingAngle = (frame / 3) * Math.PI * 2;
    const wingUp = Math.sin(wingAngle);
    
    // Body
    ctx.fillStyle = '#A0522D';
    ctx.beginPath();
    ctx.ellipse(0, 0, size*0.48, size*0.55, 0, 0, Math.PI*2);
    ctx.fill();
    
    // Head
    ctx.fillStyle = '#8b6f47';
    ctx.beginPath();
    ctx.arc(0, -size*0.32, size*0.3, 0, Math.PI*2);
    ctx.fill();
    
    // Head shading
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.arc(size*0.1, -size*0.15, size*0.22, 0, Math.PI*2);
    ctx.fill();
    
    // Eye white (large)
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(size*0.1, -size*0.42, size*0.12, 0, Math.PI*2);
    ctx.fill();
    
    // Pupil
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(size*0.12, -size*0.4, size*0.07, 0, Math.PI*2);
    ctx.fill();
    
    // Eye shine
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(size*0.14, -size*0.43, size*0.03, 0, Math.PI*2);
    ctx.fill();
    
    // Beak (more pronounced)
    ctx.fillStyle = '#e6b27a';
    ctx.beginPath();
    ctx.moveTo(size*0.15, -size*0.37);
    ctx.lineTo(size*0.35, -size*0.47);
    ctx.lineTo(size*0.15, -size*0.27);
    ctx.fill();
    
    // Beak shading
    ctx.fillStyle = '#c89060';
    ctx.beginPath();
    ctx.moveTo(size*0.15, -size*0.37);
    ctx.lineTo(size*0.35, -size*0.47);
    ctx.lineTo(size*0.25, -size*0.37);
    ctx.fill();
    
    // Wings - flapping
    ctx.strokeStyle = '#8b5a39';
    ctx.lineWidth = size*0.11;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-size*0.22, -size*0.08);
    ctx.quadraticCurveTo(-size*0.44, -size*0.38 + wingUp*size*0.28, -size*0.57, -size*0.18 + wingUp*size*0.18);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(size*0.22, -size*0.08);
    ctx.quadraticCurveTo(size*0.44, -size*0.38 + wingUp*size*0.28, size*0.57, -size*0.18 + wingUp*size*0.18);
    ctx.stroke();
    
    ctx.restore();
  }

  static drawChickadee(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, size: number) {
    ctx.save();
    ctx.translate(x, y);
    
    const wingAngle = (frame / 3) * Math.PI * 2;
    const wingUp = Math.sin(wingAngle);
    
    // Back (black)
    ctx.fillStyle = '#222222';
    ctx.beginPath();
    ctx.ellipse(0, size*0.08, size*0.48, size*0.58, 0, 0, Math.PI*2);
    ctx.fill();
    
    // Belly (white)
    ctx.fillStyle = '#f5f5f5';
    ctx.beginPath();
    ctx.ellipse(0, size*0.15, size*0.3, size*0.35, 0, 0, Math.PI*2);
    ctx.fill();
    
    // Head (black)
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(0, -size*0.3, size*0.32, 0, Math.PI*2);
    ctx.fill();
    
    // Cheek patches (white)
    ctx.fillStyle = '#f5f5f5';
    ctx.beginPath();
    ctx.arc(-size*0.15, -size*0.25, size*0.15, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(size*0.15, -size*0.25, size*0.15, 0, Math.PI*2);
    ctx.fill();
    
    // Eye white (large and prominent)
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(size*0.1, -size*0.4, size*0.12, 0, Math.PI*2);
    ctx.fill();
    
    // Pupil
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(size*0.12, -size*0.38, size*0.07, 0, Math.PI*2);
    ctx.fill();
    
    // Eye shine
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(size*0.14, -size*0.41, size*0.03, 0, Math.PI*2);
    ctx.fill();
    
    // Beak (stronger)
    ctx.fillStyle = '#d4a574';
    ctx.beginPath();
    ctx.moveTo(size*0.18, -size*0.33);
    ctx.lineTo(size*0.4, -size*0.42);
    ctx.lineTo(size*0.18, -size*0.24);
    ctx.fill();
    
    // Beak shading
    ctx.fillStyle = '#a68557';
    ctx.beginPath();
    ctx.moveTo(size*0.18, -size*0.33);
    ctx.lineTo(size*0.4, -size*0.42);
    ctx.lineTo(size*0.29, -size*0.33);
    ctx.fill();
    
    // Wings
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = size*0.11;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-size*0.2, 0);
    ctx.quadraticCurveTo(-size*0.45, -size*0.35 + wingUp*size*0.3, -size*0.6, -size*0.1 + wingUp*size*0.2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(size*0.2, 0);
    ctx.quadraticCurveTo(size*0.45, -size*0.35 + wingUp*size*0.3, size*0.6, -size*0.1 + wingUp*size*0.2);
    ctx.stroke();
    
    ctx.restore();
  }

  static drawCrow(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, size: number) {
    ctx.save();
    ctx.translate(x, y);
    
    const wingAngle = (frame / 3) * Math.PI * 2;
    const wingUp = Math.sin(wingAngle);
    
    // Body (dark gray/black)
    ctx.fillStyle = '#2a2a2a';
    ctx.beginPath();
    ctx.ellipse(0, 0, size*0.52, size*0.68, 0, 0, Math.PI*2);
    ctx.fill();
    
    // Head (very dark)
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.arc(0, -size*0.35, size*0.36, 0, Math.PI*2);
    ctx.fill();
    
    // Eye white (large and menacing)
    ctx.fillStyle = '#ffaa00';
    ctx.beginPath();
    ctx.arc(size*0.14, -size*0.42, size*0.13, 0, Math.PI*2);
    ctx.fill();
    
    // Pupil (large and dark)
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.arc(size*0.16, -size*0.4, size*0.08, 0, Math.PI*2);
    ctx.fill();
    
    // Eye shine
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(size*0.19, -size*0.43, size*0.04, 0, Math.PI*2);
    ctx.fill();
    
    // Menacing eyebrow
    ctx.strokeStyle = '#ff8800';
    ctx.lineWidth = size*0.08;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(size*0.01, -size*0.58);
    ctx.quadraticCurveTo(size*0.14, -size*0.65, size*0.27, -size*0.58);
    ctx.stroke();
    
    // Beak (larger and more prominent)
    ctx.fillStyle = '#ff8800';
    ctx.beginPath();
    ctx.moveTo(size*0.22, -size*0.36);
    ctx.lineTo(size*0.48, -size*0.5);
    ctx.lineTo(size*0.22, -size*0.26);
    ctx.fill();
    
    // Beak shading
    ctx.fillStyle = '#cc6600';
    ctx.beginPath();
    ctx.moveTo(size*0.22, -size*0.36);
    ctx.lineTo(size*0.48, -size*0.5);
    ctx.lineTo(size*0.35, -size*0.36);
    ctx.fill();
    
    // Wings - flapping
    ctx.strokeStyle = '#0f0f0f';
    ctx.lineWidth = size*0.13;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-size*0.25, -size*0.05);
    ctx.quadraticCurveTo(-size*0.52, -size*0.42 + wingUp*size*0.32, -size*0.68, -size*0.15 + wingUp*size*0.22);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(size*0.25, -size*0.05);
    ctx.quadraticCurveTo(size*0.52, -size*0.42 + wingUp*size*0.32, size*0.68, -size*0.15 + wingUp*size*0.22);
    ctx.stroke();
    
    ctx.restore();
  }

  static drawSquirrel(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, size: number) {
    ctx.save();
    ctx.translate(x, y);
    
    const legOffset = Math.sin(frame * Math.PI / 2) * size * 0.15;
    const legCompression = 0.8 + Math.abs(Math.sin(frame * Math.PI / 2)) * 0.2;
    
    // Body
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.ellipse(0, size*0.1 * legCompression, size*0.5, size*0.6, 0, 0, Math.PI*2);
    ctx.fill();
    
    // Front left leg
    ctx.fillStyle = '#654321';
    ctx.fillRect(-size*0.2, size*0.4, size*0.08, size*0.35 + legOffset);
    
    // Front right leg
    ctx.fillRect(size*0.12, size*0.4, size*0.08, size*0.35 - legOffset);
    
    // Back left leg
    ctx.fillRect(-size*0.25, size*0.4, size*0.08, size*0.35 - legOffset);
    
    // Back right leg
    ctx.fillRect(size*0.17, size*0.4, size*0.08, size*0.35 + legOffset);
    
    // Head
    ctx.fillStyle = '#A0522D';
    ctx.beginPath();
    ctx.arc(0, -size*0.3, size*0.35, 0, Math.PI*2);
    ctx.fill();
    
    // Ears (tufted)
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.arc(-size*0.25, -size*0.55, size*0.15, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(size*0.25, -size*0.55, size*0.15, 0, Math.PI*2);
    ctx.fill();
    
    // Eyes
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(-size*0.12, -size*0.35, size*0.12, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(size*0.12, -size*0.35, size*0.12, 0, Math.PI*2);
    ctx.fill();
    
    // Pupils (large and expressive)
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(-size*0.12, -size*0.33, size*0.08, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(size*0.12, -size*0.33, size*0.08, 0, Math.PI*2);
    ctx.fill();
    
    // Eye shines
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(-size*0.09, -size*0.36, size*0.04, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(size*0.15, -size*0.36, size*0.04, 0, Math.PI*2);
    ctx.fill();
    
    // Bushy tail (curved, slightly animated)
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = size*0.2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(size*0.25, size*0.2);
    const tailWag = Math.sin(frame * Math.PI / 3) * size * 0.1;
    ctx.quadraticCurveTo(size*0.6 + tailWag, size*0.5, size*0.55 + tailWag, size*0.95);
    ctx.stroke();
    
    ctx.restore();
  }

  static drawCat(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, size: number) {
    ctx.save();
    ctx.translate(x, y);
    
    const legOffset = Math.sin(frame * Math.PI / 2) * size * 0.15;
    const legCompression = 0.85 + Math.abs(Math.sin(frame * Math.PI / 2)) * 0.15;
    
    // Body
    ctx.fillStyle = '#D2691E';
    ctx.beginPath();
    ctx.ellipse(0, size*0.05 * legCompression, size*0.5, size*0.65, 0, 0, Math.PI*2);
    ctx.fill();
    
    // Front left leg
    ctx.fillStyle = '#A0481A';
    ctx.fillRect(-size*0.15, size*0.35, size*0.08, size*0.3 + legOffset);
    
    // Front right leg
    ctx.fillRect(size*0.07, size*0.35, size*0.08, size*0.3 - legOffset);
    
    // Back left leg
    ctx.fillRect(-size*0.2, size*0.35, size*0.08, size*0.3 - legOffset);
    
    // Back right leg
    ctx.fillRect(size*0.12, size*0.35, size*0.08, size*0.3 + legOffset);
    
    // Head
    ctx.fillStyle = '#CD853F';
    ctx.beginPath();
    ctx.arc(0, -size*0.32, size*0.38, 0, Math.PI*2);
    ctx.fill();
    
    // Ears (pointed triangles)
    ctx.fillStyle = '#D2691E';
    ctx.beginPath();
    ctx.moveTo(-size*0.2, -size*0.62);
    ctx.lineTo(-size*0.35, -size*0.85);
    ctx.lineTo(-size*0.05, -size*0.58);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(size*0.2, -size*0.62);
    ctx.lineTo(size*0.35, -size*0.85);
    ctx.lineTo(size*0.05, -size*0.58);
    ctx.fill();
    
    // Eyes (bright yellow/green - large)
    ctx.fillStyle = '#ffdd00';
    ctx.beginPath();
    ctx.arc(-size*0.15, -size*0.38, size*0.13, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(size*0.15, -size*0.38, size*0.13, 0, Math.PI*2);
    ctx.fill();
    
    // Pupils (vertical slit - more expressive)
    ctx.fillStyle = '#000';
    ctx.fillRect(-size*0.17, -size*0.43, size*0.04, size*0.1);
    ctx.fillRect(size*0.13, -size*0.43, size*0.04, size*0.1);
    
    // Whiskers
    ctx.strokeStyle = '#999';
    ctx.lineWidth = size*0.05;
    ctx.lineCap = 'round';
    for(let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.moveTo(size*0.15, -size*0.28 + i*size*0.1);
      ctx.lineTo(size*0.45, -size*0.28 + i*size*0.1);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-size*0.15, -size*0.28 + i*size*0.1);
      ctx.lineTo(-size*0.45, -size*0.28 + i*size*0.1);
      ctx.stroke();
    }
    
    // Tail (curved, slightly animated)
    ctx.strokeStyle = '#A0522D';
    ctx.lineWidth = size*0.15;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(size*0.35, size*0.15);
    const tailWag = Math.sin(frame * Math.PI / 3) * size * 0.1;
    ctx.quadraticCurveTo(size*0.65 + tailWag, size*0.3, size*0.6 + tailWag, size*0.8);
    ctx.stroke();
    
    ctx.restore();
  }

  static drawBird(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, type: SpeciesType, size: number) {
    switch(type) {
      case 'hawk': this.drawHawk(ctx, x, y, frame, size); break;
      case 'dove': this.drawDove(ctx, x, y, frame, size); break;
      case 'sparrow': this.drawSparrow(ctx, x, y, frame, size); break;
      case 'chickadee': this.drawChickadee(ctx, x, y, frame, size); break;
      case 'crow': this.drawCrow(ctx, x, y, frame, size); break;
      case 'squirrel': this.drawSquirrel(ctx, x, y, frame, size); break;
      case 'cat': this.drawCat(ctx, x, y, frame, size); break;
    }
  }

  static drawTree(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
    // Trunk
    ctx.fillStyle = '#654321';
    ctx.fillRect(x - size*0.15, y, size*0.3, size*0.8);
    
    // Tree foliage (multiple circles for natural look)
    ctx.fillStyle = '#228B22';
    // Main canopy
    ctx.beginPath();
    ctx.arc(x, y - size*0.3, size*0.6, 0, Math.PI*2);
    ctx.fill();
    
    // Sides
    ctx.beginPath();
    ctx.arc(x - size*0.35, y - size*0.15, size*0.4, 0, Math.PI*2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x + size*0.35, y - size*0.15, size*0.4, 0, Math.PI*2);
    ctx.fill();
    
    // Darker shading
    ctx.fillStyle = 'rgba(0, 100, 0, 0.3)';
    ctx.beginPath();
    ctx.arc(x + size*0.2, y - size*0.25, size*0.35, 0, Math.PI*2);
    ctx.fill();
  }

  static drawBush(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
    // Multiple overlapping circles for bushy appearance
    ctx.fillStyle = '#32CD32';
    
    ctx.beginPath();
    ctx.arc(x, y, size*0.5, 0, Math.PI*2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x - size*0.35, y - size*0.2, size*0.35, 0, Math.PI*2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x + size*0.35, y - size*0.2, size*0.35, 0, Math.PI*2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x - size*0.25, y + size*0.3, size*0.3, 0, Math.PI*2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x + size*0.25, y + size*0.3, size*0.3, 0, Math.PI*2);
    ctx.fill();
    
    // Shadow
    ctx.fillStyle = 'rgba(0, 100, 0, 0.2)';
    ctx.beginPath();
    ctx.arc(x, y + size*0.15, size*0.4, 0, Math.PI*2);
    ctx.fill();
  }

  static drawSnake(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, size: number) {
    ctx.save();
    ctx.translate(x, y);
    
    // Undulating snake body - centered
    const wiggle = Math.sin((frame + x) * 0.1) * size * 0.25;
    
    // Body segments (S-curve, centered)
    ctx.strokeStyle = '#228B22';
    ctx.lineWidth = size * 0.35;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    ctx.moveTo(-size * 0.6, wiggle * 0.5 - size * 0.1);
    ctx.quadraticCurveTo(-size * 0.2, wiggle, 0, -size * 0.1);
    ctx.quadraticCurveTo(size * 0.2, -wiggle, size * 0.6, wiggle * 0.5 - size * 0.1);
    ctx.stroke();
    
    // Highlight (lighter green stripe)
    ctx.strokeStyle = 'rgba(144, 238, 144, 0.6)';
    ctx.lineWidth = size * 0.12;
    ctx.beginPath();
    ctx.moveTo(-size * 0.6, wiggle * 0.5 - size * 0.2);
    ctx.quadraticCurveTo(-size * 0.2, wiggle - size * 0.1, 0, -size * 0.2);
    ctx.quadraticCurveTo(size * 0.2, -wiggle - size * 0.1, size * 0.6, wiggle * 0.5 - size * 0.2);
    ctx.stroke();
    
    // Head (front-facing)
    ctx.fillStyle = '#1a6b1a';
    ctx.beginPath();
    ctx.ellipse(size * 0.65, wiggle * 0.5 - size * 0.1, size * 0.3, size * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Mouth (small opening)
    ctx.strokeStyle = '#000';
    ctx.lineWidth = size * 0.08;
    ctx.beginPath();
    ctx.arc(size * 0.75, wiggle * 0.5 - size * 0.1, size * 0.1, 0, Math.PI);
    ctx.stroke();
    
    // Eyes (forward looking)
    ctx.fillStyle = '#ffff00';
    ctx.beginPath();
    ctx.arc(size * 0.7, wiggle * 0.5 - size * 0.25, size * 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(size * 0.7, wiggle * 0.5 + size * 0.05, size * 0.1, 0, Math.PI * 2);
    ctx.fill();
    
    // Pupils
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(size * 0.73, wiggle * 0.5 - size * 0.25, size * 0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(size * 0.73, wiggle * 0.5 + size * 0.05, size * 0.05, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }

  static drawRat(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, size: number) {
    ctx.save();
    ctx.translate(x, y);
    
    // Body (oval, centered)
    ctx.fillStyle = '#8B8B8B';
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.5, size * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Back/rear (darker)
    ctx.fillStyle = '#696969';
    ctx.beginPath();
    ctx.ellipse(size * 0.35, 0, size * 0.25, size * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Head (facing forward)
    ctx.fillStyle = '#A9A9A9';
    ctx.beginPath();
    ctx.ellipse(-size * 0.4, 0, size * 0.35, size * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Ears (sides, pointing up/down)
    ctx.fillStyle = '#8B8B8B';
    ctx.beginPath();
    ctx.arc(-size * 0.5, -size * 0.35, size * 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-size * 0.5, size * 0.35, size * 0.15, 0, Math.PI * 2);
    ctx.fill();
    
    // Inner ears
    ctx.fillStyle = '#FFB6C1';
    ctx.beginPath();
    ctx.arc(-size * 0.5, -size * 0.35, size * 0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-size * 0.5, size * 0.35, size * 0.08, 0, Math.PI * 2);
    ctx.fill();
    
    // Eyes (forward facing)
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(-size * 0.45, -size * 0.15, size * 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-size * 0.45, size * 0.15, size * 0.1, 0, Math.PI * 2);
    ctx.fill();
    
    // Eye shine
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(-size * 0.42, -size * 0.18, size * 0.04, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-size * 0.42, size * 0.12, size * 0.04, 0, Math.PI * 2);
    ctx.fill();
    
    // Nose (center front)
    ctx.fillStyle = '#FFB6C1';
    ctx.beginPath();
    ctx.arc(-size * 0.55, 0, size * 0.08, 0, Math.PI * 2);
    ctx.fill();
    
    // Mouth
    ctx.strokeStyle = '#696969';
    ctx.lineWidth = size * 0.05;
    ctx.beginPath();
    ctx.arc(-size * 0.55, 0, size * 0.08, -Math.PI * 0.3, Math.PI * 0.3);
    ctx.stroke();
    
    // Tail (animated, wagging left/right)
    ctx.strokeStyle = '#696969';
    ctx.lineWidth = size * 0.08;
    ctx.lineCap = 'round';
    const tailWag = Math.sin(frame * 0.15) * size * 0.25;
    ctx.beginPath();
    ctx.moveTo(size * 0.4, 0);
    ctx.quadraticCurveTo(size * 0.5 + tailWag, size * 0.2, size * 0.55 + tailWag * 0.8, size * 0.35);
    ctx.stroke();
    
    // Front paws (simple circles)
    ctx.fillStyle = '#696969';
    ctx.beginPath();
    ctx.arc(-size * 0.15, size * 0.35, size * 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(size * 0.1, size * 0.35, size * 0.12, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }

  static drawEnvironment(ctx: CanvasRenderingContext2D, w: number, h: number, backgroundColor: string, grassColor: string) {
    // Sky/background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, w, h);
    
    // Grass
    ctx.fillStyle = grassColor;
    ctx.fillRect(0, h*0.6, w, h*0.4);
  }
}

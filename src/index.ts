import { Game } from './game.js';

let game: Game;

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game') as HTMLCanvasElement;
  if (!canvas) {
    console.error('Canvas element not found!');
    return;
  }

  game = new Game('game');

  const startBtn = document.getElementById('startBtn') as HTMLButtonElement;
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      const btn = startBtn;
      if (!game) return;
      if (!game['gameState'].running) {
        // Reset game state first to clear any lingering state from previous session
        game.resetGame(false);
        // If assets not loaded, show loading text (feeder image only)
        const prev = btn.innerText;
        if (!(game as any).assetsLoaded) {
          btn.innerText = 'Loading assets...';
          // small delay to allow image load handler to set assetsLoaded
          setTimeout(() => { btn.innerText = 'Pause'; game.startGame(); }, 200);
        } else {
          btn.innerText = 'Pause';
          game.startGame();
        }
      } else {
        btn.innerText = 'Start Game';
        game.stopGame();
      }
    });
  }

  const restartBtn = document.getElementById('restartBtn') as HTMLButtonElement | null;
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      game.resetGame(true);
    });
  }

  console.log('Game initialized');
});

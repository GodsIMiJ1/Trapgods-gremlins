
import { clearCanvas, drawGameOver } from './game/renderer';
import { drawPlayer } from './game/player';
import { drawObstacles } from './game/obstacles';

export function startGame(
  canvas: HTMLCanvasElement,
  onGameOver: (won: boolean, score: number) => void,
  onScoreUpdate: (score: number, timeLeft: number) => void
) {
  if (!canvas) {
    console.error("Canvas element not provided to startGame");
    return null;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error("Could not get 2D context from canvas");
    return null;
  }

  let animationFrameId: number | null = null;

  function gameLoop() {
    // Clear and prepare canvas
    clearCanvas(ctx, canvas.width, canvas.height);

    // Get current game state and draw
    const gameState = getGameState();
    drawPlayer(ctx, gameState.player);
    drawObstacles(ctx, gameState.obstacles);

    // Update game state and continue loop if game is not over
    if (updateGameState()) {
      animationFrameId = requestAnimationFrame(gameLoop);
    } else {
      drawGameOver(ctx, canvas.width, canvas.height, gameState.gameWon, gameState.score);
    }
  }

  function cleanup() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  }

  // Start the game loop
  console.log("Starting Trap Streets game...");
  animationFrameId = requestAnimationFrame(gameLoop);

  return cleanup;
}

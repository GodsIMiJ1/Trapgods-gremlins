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
  
  // Simple game state for this module
  let gameState = {
    player: { x: canvas.width / 2 - 15, y: canvas.height - 40, width: 30, height: 30, dx: 0 },
    obstacles: [] as { x: number, y: number, width: number, height: number, speed: number }[],
    score: 0,
    gameOver: false,
    gameWon: false
  };
  
  // Internal update function for this module
  function updateInternalGameState() {
    // Very simple update logic just to keep the game running
    // The actual game state is maintained by useGameLoop hook
    
    // Return true if game is still running, false if game over
    return !gameState.gameOver;
  }

  function gameLoop() {
    // Clear and prepare canvas
    clearCanvas(ctx, canvas.width, canvas.height);

    // Draw the current game state
    drawPlayer(ctx, gameState.player);
    drawObstacles(ctx, gameState.obstacles);

    // Update game state and continue loop if game is not over
    if (updateInternalGameState()) {
      animationFrameId = requestAnimationFrame(gameLoop);
    } else {
      drawGameOver(ctx, canvas.width, canvas.height, gameState.gameWon, gameState.score);
      onGameOver(gameState.gameWon, gameState.score);
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

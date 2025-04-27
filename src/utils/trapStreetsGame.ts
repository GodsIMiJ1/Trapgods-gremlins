
import { clearCanvas, drawGameOver } from './game/renderer';
import { drawPlayer } from './game/player';
import { drawObstacles } from './game/obstacles';
import { createPlayer, updatePlayer } from './game/player';
import { spawnObstacle, updateObstacles, checkCollisions } from './game/obstacles';
import { GAME, OBSTACLE } from './game/constants';

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
  const keysPressed: Record<string, boolean> = {};
  const startTime = Date.now();
  let lastObstacleSpawnTime = Date.now();
  
  // Game state for this module
  const gameState = {
    player: createPlayer(canvas.width, canvas.height),
    obstacles: [] as ReturnType<typeof spawnObstacle>[],
    score: 0,
    gameOver: false,
    gameWon: false
  };
  
  // Track keyboard input
  const handleKeyDown = (event: KeyboardEvent) => {
    keysPressed[event.key] = true;
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    keysPressed[event.key] = false;
  };

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
  
  // Internal update function for this module
  function updateInternalGameState() {
    if (gameState.gameOver) {
      return false;
    }

    // Update player
    updatePlayer(gameState.player, keysPressed, canvas.width);

    // Handle obstacles
    const currentTime = Date.now();
    if (currentTime - lastObstacleSpawnTime > OBSTACLE.SPAWN_RATE) {
      gameState.obstacles.push(spawnObstacle(canvas.width));
      lastObstacleSpawnTime = currentTime;
    }
    
    gameState.obstacles = updateObstacles(gameState.obstacles, canvas.height);

    // Check collisions
    if (checkCollisions(gameState.player, gameState.obstacles)) {
      gameState.gameOver = true;
      gameState.gameWon = false;
    }

    // Update score and check win condition
    const elapsedTimeSeconds = Math.floor((currentTime - startTime) / 1000);
    gameState.score = elapsedTimeSeconds;
    onScoreUpdate(gameState.score, GAME.WIN_TIME_SECONDS - elapsedTimeSeconds);

    if (!gameState.gameOver && elapsedTimeSeconds >= GAME.WIN_TIME_SECONDS) {
      gameState.gameWon = true;
      gameState.gameOver = true;
    }
    
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
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
  }

  // Start the game loop
  console.log("Starting Trap Streets game...");
  animationFrameId = requestAnimationFrame(gameLoop);

  return cleanup;
}

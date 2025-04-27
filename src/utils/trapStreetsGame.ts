
import { GAME, OBSTACLE } from './game/constants';
import { createPlayer, updatePlayer, drawPlayer, type Player } from './game/player';
import { spawnObstacle, updateObstacles, checkCollisions, drawObstacles, type Obstacle } from './game/obstacles';
import { clearCanvas, drawGameOver } from './game/renderer';

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

  let player = createPlayer(canvas.width, canvas.height);
  let obstacles: Obstacle[] = [];
  let score = 0;
  let startTime = Date.now();
  let lastObstacleSpawnTime = startTime;
  let gameOver = false;
  let gameWon = false;
  let animationFrameId: number | null = null;
  let keysPressed: Record<string, boolean> = {};

  const handleKeyDown = (event: KeyboardEvent) => {
    keysPressed[event.key] = true;
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    keysPressed[event.key] = false;
  };

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);

  function gameLoop() {
    if (gameOver) {
      drawGameOver(ctx, canvas.width, canvas.height, gameWon, score);
      onGameOver(gameWon, score);
      cleanup();
      return;
    }

    // Clear and prepare canvas
    clearCanvas(ctx, canvas.width, canvas.height);

    // Update game state
    updatePlayer(player, keysPressed, canvas.width);

    // Handle obstacles
    const currentTime = Date.now();
    if (currentTime - lastObstacleSpawnTime > OBSTACLE.SPAWN_RATE) {
      obstacles.push(spawnObstacle(canvas.width));
      lastObstacleSpawnTime = currentTime;
    }
    obstacles = updateObstacles(obstacles, canvas.height);

    // Check win/lose conditions
    if (checkCollisions(player, obstacles)) {
      gameOver = true;
      gameWon = false;
    }

    const elapsedTimeSeconds = Math.floor((currentTime - startTime) / 1000);
    score = elapsedTimeSeconds;
    onScoreUpdate(score, GAME.WIN_TIME_SECONDS - elapsedTimeSeconds);

    if (!gameOver && elapsedTimeSeconds >= GAME.WIN_TIME_SECONDS) {
      gameWon = true;
      gameOver = true;
    }

    // Draw game elements
    drawPlayer(ctx, player);
    drawObstacles(ctx, obstacles);

    // Continue game loop
    animationFrameId = requestAnimationFrame(gameLoop);
  }

  function cleanup() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
    console.log("Game cleanup complete.");
  }

  // Start the game
  console.log("Starting Trap Streets game...");
  animationFrameId = requestAnimationFrame(gameLoop);

  return cleanup;
}


import { useCallback, useEffect, useRef } from 'react';
import { GAME, OBSTACLE } from '../utils/game/constants';
import { createPlayer, updatePlayer, type Player } from '../utils/game/player';
import { spawnObstacle, updateObstacles, checkCollisions, type Obstacle } from '../utils/game/obstacles';

interface GameState {
  player: Player;
  obstacles: Obstacle[];
  score: number;
  gameOver: boolean;
  gameWon: boolean;
}

interface UseGameLoopProps {
  canvasWidth: number;
  canvasHeight: number;
  onGameOver: (won: boolean, score: number) => void;
  onScoreUpdate: (score: number, timeLeft: number) => void;
}

export const useGameLoop = ({
  canvasWidth,
  canvasHeight,
  onGameOver,
  onScoreUpdate,
}: UseGameLoopProps) => {
  const gameState = useRef<GameState>({
    player: createPlayer(canvasWidth, canvasHeight),
    obstacles: [],
    score: 0,
    gameOver: false,
    gameWon: false,
  });

  const startTimeRef = useRef<number>(Date.now());
  const lastObstacleSpawnTimeRef = useRef<number>(Date.now());
  const keysPressed = useRef<Record<string, boolean>>({});

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    keysPressed.current[event.key] = true;
  }, []);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    keysPressed.current[event.key] = false;
  }, []);

  const updateGameState = useCallback(() => {
    const state = gameState.current;
    
    if (state.gameOver) {
      onGameOver(state.gameWon, state.score);
      return false;
    }

    // Update player
    updatePlayer(state.player, keysPressed.current, canvasWidth);

    // Handle obstacles
    const currentTime = Date.now();
    if (currentTime - lastObstacleSpawnTimeRef.current > OBSTACLE.SPAWN_RATE) {
      state.obstacles.push(spawnObstacle(canvasWidth));
      lastObstacleSpawnTimeRef.current = currentTime;
    }
    
    state.obstacles = updateObstacles(state.obstacles, canvasHeight);

    // Check collisions
    if (checkCollisions(state.player, state.obstacles)) {
      state.gameOver = true;
      state.gameWon = false;
    }

    // Update score and check win condition
    const elapsedTimeSeconds = Math.floor((currentTime - startTimeRef.current) / 1000);
    state.score = elapsedTimeSeconds;
    onScoreUpdate(state.score, GAME.WIN_TIME_SECONDS - elapsedTimeSeconds);

    if (!state.gameOver && elapsedTimeSeconds >= GAME.WIN_TIME_SECONDS) {
      state.gameWon = true;
      state.gameOver = true;
    }

    return !state.gameOver;
  }, [canvasWidth, canvasHeight, onGameOver, onScoreUpdate]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const getGameState = useCallback(() => gameState.current, []);

  const resetGame = useCallback(() => {
    gameState.current = {
      player: createPlayer(canvasWidth, canvasHeight),
      obstacles: [],
      score: 0,
      gameOver: false,
      gameWon: false,
    };
    startTimeRef.current = Date.now();
    lastObstacleSpawnTimeRef.current = Date.now();
    keysPressed.current = {};
  }, [canvasWidth, canvasHeight]);

  return {
    updateGameState,
    getGameState,
    resetGame,
  };
};

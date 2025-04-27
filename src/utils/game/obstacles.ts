
import { OBSTACLE } from './constants';
import type { Player } from './player';

export interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
}

export const spawnObstacle = (canvasWidth: number): Obstacle => ({
  x: Math.random() * (canvasWidth - OBSTACLE.WIDTH),
  y: -OBSTACLE.HEIGHT,
  width: OBSTACLE.WIDTH,
  height: OBSTACLE.HEIGHT,
  speed: OBSTACLE.SPEED + Math.random() * 2,
});

export const updateObstacles = (obstacles: Obstacle[], canvasHeight: number): Obstacle[] => {
  return obstacles.filter(obstacle => {
    obstacle.y += obstacle.speed;
    return obstacle.y < canvasHeight;
  });
};

export const checkCollisions = (player: Player, obstacles: Obstacle[]): boolean => {
  return obstacles.some(obstacle => (
    player.x < obstacle.x + obstacle.width &&
    player.x + player.width > obstacle.x &&
    player.y < obstacle.y + obstacle.height &&
    player.y + player.height > obstacle.y
  ));
};

export const drawObstacles = (ctx: CanvasRenderingContext2D, obstacles: Obstacle[]) => {
  obstacles.forEach(obstacle => {
    ctx.fillStyle = OBSTACLE.COLOR;
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    
    ctx.strokeStyle = OBSTACLE.BORDER;
    ctx.lineWidth = 2;
    ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });
};

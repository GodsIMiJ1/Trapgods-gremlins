
import { PLAYER } from './constants';

export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  dx: number;
}

export const createPlayer = (canvasWidth: number, canvasHeight: number): Player => ({
  x: canvasWidth / 2 - PLAYER.WIDTH / 2,
  y: canvasHeight - PLAYER.HEIGHT - 10,
  width: PLAYER.WIDTH,
  height: PLAYER.HEIGHT,
  dx: 0,
});

export const updatePlayer = (player: Player, keysPressed: Record<string, boolean>, canvasWidth: number) => {
  const moveLeft = keysPressed['ArrowLeft'] || keysPressed['a'];
  const moveRight = keysPressed['ArrowRight'] || keysPressed['d'];

  if (moveLeft && !moveRight) {
    player.dx = -PLAYER.SPEED;
  } else if (moveRight && !moveLeft) {
    player.dx = PLAYER.SPEED;
  } else {
    player.dx = 0;
  }

  player.x += player.dx;

  if (player.x < 0) {
    player.x = 0;
  }
  if (player.x + player.width > canvasWidth) {
    player.x = canvasWidth - player.width;
  }
};

export const drawPlayer = (ctx: CanvasRenderingContext2D, player: Player) => {
  ctx.fillStyle = PLAYER.COLOR;
  ctx.fillRect(player.x, player.y, player.width, player.height);
  
  ctx.strokeStyle = PLAYER.BORDER;
  ctx.lineWidth = 2;
  ctx.strokeRect(player.x, player.y, player.width, player.height);
};
